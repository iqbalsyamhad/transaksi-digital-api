import { NextFunction, Request, Response } from 'express';
import UserService from '../services/authservice';
import User from '../models/user';
import { sequelize } from '../instance/sequelize';
import { Transaction } from 'sequelize';
import { ErrorHandler, translateMessages } from '../helper/ErrorHandler';
import { Op } from 'sequelize';
import WaOtp, { WaOtpInterface } from '../models/waotp';
import LoginAttemp from '../models/loginattemp';
import dayjs from 'dayjs';
import axios from 'axios';
import dotenv from 'dotenv';
import { activateWallet } from '../services/cryptoservice';
import Logger from '../helper/winston';
import MemberTypeTransaction from '../models/membertypetransaction';
import VANumber from '../models/vanumber';
import constant from '../config/constant';
dotenv.config();

const bcrypt = require('bcryptjs');

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const user: Express.User | null = await User.findOne({
            where: { email: req.body.email },
            include: [{
                model: LoginAttemp,
                as: 'loginattemp',
                required: false
            }],
            attributes: ['id', 'name', 'email', 'status', 'password']
        });
        if (!user) throw new ErrorHandler(404, 'emailNotFound');

        if (user.loginattemp?.nextTry && user.loginattemp.nextTry > dayjs()) {
            throw new ErrorHandler(400, 'accountStillLocked');
        }

        if (user.status == 'suspend') {
            await transaction.commit();
            return res.formatter.tooManyRequests(translateMessages('userSuspended', req), { nexttry: null, suspend: true });
        }
        if (user.status == 'inactive') {
            const expPayment = await MemberTypeTransaction.findOne({
                where: {
                    userId: user.id,
                    isPaid: false,
                },
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: VANumber,
                        as: 'vanumber',
                        where: {
                            expireAt: { [Op.lte]: dayjs.utc().format('YYYY-MM-DD HH:mm:ss') }
                        },
                        required: true
                    }
                ],
                transaction
            });
            if (expPayment) {
                await User.update({
                    status: 'suspend'
                }, {
                    where: {
                        id: user.id
                    },
                    transaction
                });

                await VANumber.update({
                    expireAt: null
                }, {
                    where: {
                        id: expPayment.vanumber.id
                    },
                    transaction
                });

                await transaction.commit();
                return res.formatter.tooManyRequests(translateMessages('userSuspended', req), { nexttry: null, suspend: true });
            }
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password || '');
        if (!validPassword) {
            if (!user.loginattemp) {
                await LoginAttemp.create({
                    userId: user.id,
                    count: 1,
                    nextTry: null
                }, { transaction });
            } else {
                const currentAttemp = user.loginattemp.count + 1;
                // suspend jika 5x
                if (currentAttemp >= 5) {
                    await User.update({
                        status: 'suspend'
                    }, {
                        where: {
                            id: user.id
                        },
                        transaction
                    });

                    await LoginAttemp.update({
                        count: 0,
                        nextTry: null
                    }, {
                        where: { userId: user.id },
                        transaction
                    });

                    await transaction.commit();
                    return res.formatter.tooManyRequests(translateMessages('accountSuspendJustNow', req), { nexttry: null, suspend: true });
                }

                let nexttrylogin = null;
                if (currentAttemp == 3) nexttrylogin = dayjs().add(3, 'minutes');

                await LoginAttemp.update({
                    count: currentAttemp,
                    nextTry: nexttrylogin
                }, {
                    where: { userId: user.id },
                    transaction
                });

                if (currentAttemp == 3) {
                    await transaction.commit();
                    return res.formatter.tooManyRequests(translateMessages('toomanyInvalidCredentials', req), { nexttry: nexttrylogin?.format('YYYY-MM-DD HH:mm:ss'), suspend: false });
                }
            }

            await transaction.commit();
            return res.formatter.unauthorized(translateMessages('invalidCredentials', req), { nexttry: null, suspend: false });
        }

        // login success
        await LoginAttemp.update({
            count: 0,
            nextTry: null
        }, {
            where: { userId: user.id },
            transaction
        });

        const userServiceInstance = new UserService();
        const token = userServiceInstance.generateToken(user);

        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', '*');
        res.cookie('Authorization', `Bearer ${token}`);

        await transaction.commit();
        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const backLogin = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const user: Express.User | null = await User.findOne({
            where: { email: req.body.email },
            attributes: ['id', 'name', 'email', 'status', 'password']
        });
        if (!user) throw new ErrorHandler(404, 'emailNotFound');

        if (user.status == 'suspend') {
            await transaction.commit();
            return res.formatter.tooManyRequests(translateMessages('userSuspended', req), { nexttry: null, suspend: true });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password || '');
        if (!validPassword) {
            throw new ErrorHandler(401, 'invalidCredentials');
        }

        const userServiceInstance = new UserService();
        const token = userServiceInstance.generateToken(user);

        await transaction.commit();
        return res.formatter.ok({
            token,
            user,
        });
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const sendwaotp = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const existuser = await User.findOne({
            where: { phoneNumber: req.body.phoneNumber },
            transaction
        });
        if (existuser) throw new ErrorHandler(400, 'userRegPhoneExist');

        const randomstring = require('randomstring');
        const waotpdata: WaOtpInterface = {
            phoneNumber: req.body.phoneNumber,
            otp: randomstring.generate({ length: 6, charset: 'numeric' }),
            // otp: '000000',
            validated: false
        }

        const savedotp = await WaOtp.findOne({
            where: { phoneNumber: req.body.phoneNumber },
            transaction
        });

        if (savedotp) {
            const resendlimit = 3;
            const sdiff = dayjs.utc().diff(dayjs.utc(savedotp.updatedAt), 's');
            if (sdiff < resendlimit) throw new ErrorHandler(400, `Coba lagi dalam ${resendlimit} detik!`);
        }

        const crypto = require('crypto');
        const [saving, createdWaOtp] = await WaOtp.upsert({
            id: crypto.randomBytes(16).toString('hex'),
            ...waotpdata
        }, { transaction });

        if (!saving) throw new Error('otpFails');

        // send otp to wa gateway goes here
        const message = `OTP untuk registrasi KMP TOGO anda adalah ${waotpdata.otp}%0aJangan berikan OTP anda kepada siapapun termasuk pihak yang mengatasnamakan KMP TOGO.`;
        await axios.get(
            `${process.env.WABLAS_BASEURL}/api/send-message?phone=${req.body.phoneNumber.replace(/\D/g, '')}&message=${message}&secret=true&prioprity=true&token=${process.env.WABLAS_APIKEY}`,
            {
                validateStatus: function () {
                    return true;
                }
            }
        );

        await transaction.commit();

        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const confirmwaotp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedotp = await WaOtp.findOne({
            where: {
                phoneNumber: req.body.phoneNumber
            }
        });

        if (!savedotp) throw new Error('phoneNumberNotFound');
        if (savedotp.otp != req.body.otp) throw new Error('otpDoesntMatch');
        if (savedotp.validated == true) throw new Error('otpUsed');

        const confirmseclimit = 86400;
        const sdiff = dayjs.utc().diff(dayjs.utc(savedotp.updatedAt), 's');
        if (sdiff > confirmseclimit) throw new ErrorHandler(400, `OTP kadaluwarsa!`);

        await WaOtp.update({
            validated: true
        }, {
            where: {
                id: savedotp.id
            }
        });


        return res.formatter.ok("success");
    } catch (error) {
        return next(error);
    }
}

export const ktpocr = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) return res.formatter.badRequest("imageNotFound");

        const base64img = req.file.buffer.toString('base64');

        const request = await axios.post(process.env.EKYC_KTP_OCR_URL || '', {
            image: base64img,
        }, {
            validateStatus: function resstatus(status) {
                if (status >= 200 && status <= 500) return true;
                return false;
            },
        });
        if (request.status == 200) {
            if (request.data?.message?.id) {
                const nikexist = await User.findOne({
                    where: {
                        nik: request.data.message.id
                    }
                });
                if (nikexist) return res.formatter.badRequest('NIK sudah digunakan!', request.data);

                const fs = require('fs');
                if (!fs.existsSync(constant.ktpImagePath)) {
                    fs.mkdirSync(constant.ktpImagePath, { recursive: true });
                }
                await fs.writeFile(`${constant.ktpImagePath}/${request.data.message.id}.jpg`, base64img.split(';base64,').pop(), { encoding: 'base64' }, function (err: any) {
                    if (err) {
                        throw new ErrorHandler(400, err);
                    }
                });
                return res.formatter.ok(request.data);
            }
            return res.formatter.badRequest('Gagal memindai e-KTP!');
        } else {
            Logger.error(JSON.stringify(request.data));
            return res.formatter.noContent("ocrNotComplete");
        }
    } catch (error) {
        next(error);
    }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        // checking otp
        const savedotp = await WaOtp.findOne({
            where: {
                phoneNumber: req.body.phoneNumber
            }
        });

        if (!savedotp) throw new Error('phoneNumberNotFound');
        if (savedotp.otp != req.body.otp) throw new Error('otpDoesntMatch');
        if (savedotp.validated == false) throw new Error('otpUnverified');

        // do registration
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const hashedPIN = await bcrypt.hash(req.body.pin.toString(), 12);

        const [newUser, created] = await User.findOrCreate({
            where: {
                [Op.or]: [
                    {
                        nik: req.body.nik,
                    },
                    {
                        email: req.body.email,
                    },
                    {
                        phoneNumber: req.body.phoneNumber,
                    }
                ]
            },
            defaults: {
                nik: req.body.nik,
                name: req.body.name,
                city: req.body.city,
                province: req.body.province,
                subdistrict: req.body.subdistrict,
                address: req.body.address,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber || null,
                birthdate: req.body.birthdate,
                password: hashedPassword,
                pin: hashedPIN,
                membertype: req.body.membertypeId,
                status: 'inactive', // need to select and pay member type first
            },
            transaction
        });
        if (!created) {
            if (newUser.nik == req.body.nik) throw new ErrorHandler(400, 'userRegNIKExist');
            if (newUser.email == req.body.email) throw new ErrorHandler(400, 'userRegEmailExist');
            if (newUser.phoneNumber == req.body.phoneNumber) throw new ErrorHandler(400, 'userRegPhoneExist');
            throw new ErrorHandler(500, 'userCreationFails');
        }

        await activateWallet(newUser.id, transaction);

        const userServiceInstance = new UserService();
        const token = userServiceInstance.generateToken(newUser);

        await transaction.commit();

        res.cookie('Authorization', `Bearer ${token}`);
        return res.formatter.ok("success");
    } catch (e) {
        await transaction.rollback();
        return next(e);
    }
}