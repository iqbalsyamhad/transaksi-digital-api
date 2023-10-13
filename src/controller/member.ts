import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helper/ErrorHandler';
import { Op, Transaction } from 'sequelize';
import { sequelize } from '../instance/sequelize';
import MemberType from '../models/membertype';
import User from '../models/user';
import { generateVA } from '../services/payments/paymentservice';
import VANumber from '../models/vanumber';
import dayjs from 'dayjs';
import MemberTypeTransaction from '../models/membertypetransaction';

export const selectType = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { membertypeId } = req.body;
        const userId = req.user?.id ? req.user.id : null;
        if (!userId) throw new ErrorHandler(401, 'notLoggedIn');

        const membertype = await MemberType.findOne({
            where: { id: membertypeId },
            transaction
        });
        if (!membertype) throw new ErrorHandler(404, 'dataNotFound');
        const priceBill = membertype.price;

        const ruser = await User.findOne({
            attributes: ['id', 'phoneNumber', 'name'],
            where: {
                id: userId
            },
            transaction
        });
        if (!ruser) throw new ErrorHandler(404, 'userNotFound');

        const [mttransaction, mttcreated] = await MemberTypeTransaction.findOrCreate({
            where: {
                userId: ruser.id,
                membertypeid: membertype.id,
            },
            defaults: {
                userId: ruser.id,
                membertypeid: membertype.id,
                price: priceBill,
                isPaid: false,
            },
            transaction
        });
        if (!mttransaction) throw new Error('saveFails');
        if (!mttcreated && mttransaction.isPaid) throw new Error('Transaksi pendaftaran member dengan tipe tersebut sudah selesai!');

        const prevVa = await VANumber.findOne({
            where: {
                membertypeTransactionId: mttransaction.id
            },
            transaction
        });
        if (prevVa && prevVa.expireAt != null) {
            await transaction.commit();
            return res.formatter.ok({
                ...JSON.parse(JSON.stringify(membertype)),
                va: {
                    ...JSON.parse(JSON.stringify(prevVa)),
                    name: ruser.name
                },
            });
        }

        // generate payment goes here
        const vanumber = await generateVA(ruser.phoneNumber, ruser.id, false);
        const [vasave, created] = await VANumber.upsert({
            vanumber,
            userId: ruser.id,
            isOpenAmount: false,
            amount: membertype.price,
            expireAt: dayjs().add(3, 'days').toDate(),
            membertypeTransactionId: mttransaction.id,
            deletedAt: null
        }, {
            transaction
        });

        // updating related user
        const userUpdate = await User.update({
            membertype: membertype.id,
            status: 'inactive',
        }, {
            where: { id: ruser.id },
            transaction
        });
        if (userUpdate[0] != 1) throw new Error('saveFails');

        await transaction.commit();

        return res.formatter.ok({
            ...JSON.parse(JSON.stringify(membertype)),
            va: {
                ...JSON.parse(JSON.stringify(vasave)),
                name: ruser.name
            },
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}