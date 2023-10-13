import { NextFunction, Request, Response } from 'express';
import Logger from '../helper/winston';
import Payment from '../models/payment';
import { ErrorHandler } from '../helper/ErrorHandler';
import { Op, Transaction } from 'sequelize';
import axios from 'axios';
import dayjs from 'dayjs';
import { approveMemberType, generateHmac, topupExecution } from '../services/payments/paymentservice';
import VANumber from '../models/vanumber';
import { sequelize } from '../instance/sequelize';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import User from '../models/user';
dayjs.extend(utc);
dayjs.extend(timezone);
const parseString = require('xml2js').parseString;

export const vaCallback = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        // PROVIDED RESPONSE:
        // ResponseCode
        // ResponseDescription
        // TransactionId
        // MerchantId
        // CustomerNo
        // CustomerName
        // Amount
        // AdditionalData
        // FlagAmountCheck
        // ChannelId
        // TransactionDate
        const { ResponseCode, CustomerNo, Amount, ...otherIncPayload } = req.body;
        if (ResponseCode !== '00') throw new Error('Transaksi tidak sukses!');

        // VA INQUIRY HERE TO VALIDATE SENT STATUS
        // skipped


        // FOLLOW UP PAID VA
        const savedva = await VANumber.findOne({
            where: {
                vanumber: CustomerNo
            },
            transaction
        });
        if (!savedva) throw new Error('Nomor VA tidak terdaftar!');
        if (savedva.expireAt !== null && dayjs(savedva.expireAt).format('YYYY-MM-DD HH:mm:ss') < dayjs.utc().format('YYYY-MM-DD HH:mm:ss'))
            throw new Error('VA kadaluwarsa!');

        if (savedva.isOpenAmount === true || (savedva.amount !== null && Amount < savedva.amount)) {
            await topupExecution(transaction, savedva.userId, Amount, '');
        } else if (savedva.membertypeTransactionId !== null) {
            await approveMemberType(transaction, savedva.membertypeTransactionId);
        }

        // DELETE LISTED VA IF ONETIME USE
        if (savedva.isOpenAmount === false) {
            await VANumber.destroy({
                where: {
                    id: savedva.id
                },
                transaction
            });

            if (savedva.amount !== null && Amount > savedva.amount) {
                await topupExecution(transaction, savedva.userId, (Amount - savedva.amount), `Overage VA transaction from ${CustomerNo}`);
            }
        }

        // SAVE INVOMING PAYMENT
        await Payment.create({
            ResponseCode,
            CustomerNo,
            Amount,
            ...otherIncPayload,
        }, {
            transaction
        });

        await transaction.commit();
        return res.send();
    } catch (error: any) {
        await transaction.rollback();
        Logger.error('WEBHOOK RECEIVED WITH ERROR!!!');
        return res.status(400).json({
            error: error?.message || 'UNKNOWN ERROR!!!'
        });
    }
}

export const balanceInq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const https = require('https');
        const httpsAgent = new https.Agent({
            // ca: fs.readFileSync('utils/digitogo.pem'),
            rejectUnauthorized: false,
        });
        const timestamp = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const payload = req.body;

        const hmac = await generateHmac('POST', '/api/v1/account/balance', payload, timestamp);

        const request = await axios.post(
            'https://115.85.74.55:7065/api/v1/account/balance',
            payload,
            {
                headers: {
                    'Api-Key': process.env.AGI_API_KEY || '',
                    'Content-Type': 'application/json',
                    'Timestamp': timestamp,
                    'Signature': hmac.signature
                },
                validateStatus: function () {
                    return true;
                },
                httpsAgent
            }
        );
        console.log(request);
        if (request.data) {
            return res.status(request.status).json({ ...request.data });
        }
        else {
            throw new Error('request error');
        }
    } catch (error: any) {
        console.log(error);
        return res.formatter.badRequest(error?.message);
    }
}

export const vaInquiryToJSON = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const soapenv = req.body['soapenv:envelope'];
        const request = soapenv['soapenv:body']['ns6:inquiry']['ns6:request'];
        const response = {
            proCode: request['ns3:procode']['_'],
            transactionId: request['ns3:transactionid']['_'],
            merchantId: request['ns3:merchantid']['_'],
            customerNo: request['ns3:customerno']['_'],
            customerName: 'AWESOME USER',
            amount: request['ns3:amount']['_'],
            additionaldata: request['ns3:additionaldata']['_'],
            flagAmountCheck: request['ns3:flagamountcheck']['_'],
            TransactionDate: dayjs().format('YYYYMMDDHHmmss')
        }
        return res.status(200).json(response);
    } catch (error: any) {
        return res.formatter.badRequest(error?.message)
    }
}

export const vaInquiryToXML = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { CustomerNo, Amount, ...data } = req.body;

        const va = await VANumber.findOne({
            where: {
                vanumber: CustomerNo,
                [Op.or]: [
                    { expireAt: null },
                    { expireAt: { [Op.gt]: dayjs.utc().format('YYYY-MM-DD HH:mm:ss') } }
                ]
            },
            include: [{
                model: User,
                as: 'user',
                required: true
            }]
        });
        if (!va) {
            const response = {
                ...data,
                ResponseCode: '15',
                ResponseDescription: 'account not found',
                CustomerNo,
                CustomerName: '',
                Amount,
                TransactionDate: dayjs().format('YYYYMMDDHHmmss')
            }
            return res.status(200).json(response);
        }
        if (va.amount != null && va.amount != Amount) {
            const response = {
                ...data,
                ResponseCode: '13',
                ResponseDescription: 'invalid amount',
                CustomerNo,
                CustomerName: va.user.name,
                Amount,
                TransactionDate: dayjs().format('YYYYMMDDHHmmss')
            }
            return res.status(200).json(response);
        }
        const response = {
            ...data,
            ResponseCode: '00',
            ResponseDescription: 'success',
            CustomerNo,
            CustomerName: va.user.name,
            Amount,
            TransactionDate: dayjs().format('YYYYMMDDHHmmss')
        }
        return res.status(200).json(response);

        // let xmlstring = '<?xml version="1.0" encoding="UTF-8"?>';
        // xmlstring += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
        // xmlstring += '<soapenv:Body>';
        // xmlstring += '<ns6:inquiry xmlns:ns6="http://service.api.mlpt.com">';
        // xmlstring += '<ns6:request>';
        // xmlstring += '<ns3:additionalData xmlns:ns3="http://request.api.mlpt.com">' + data.AdditionalData + '</ns3:additionalData>';
        // xmlstring += '<ns3:amount xmlns:ns3="http://request.api.mlpt.com">' + data.Amount + '</ns3:amount>';
        // xmlstring += '<ns3:customerNo xmlns:ns3="http://request.api.mlpt.com">' + data.CustomerNo + '</ns3:customerNo>';
        // xmlstring += '<ns3:customerName xmlns:ns3="http://request.api.mlpt.com">AWESOME USER</ns3:customerNo>';
        // xmlstring += '<ns3:flagAmountCheck xmlns:ns3="http://request.api.mlpt.com">' + data.FlagAmountCheck + '</ns3:flagAmountCheck>';
        // xmlstring += '<ns3:merchantId xmlns:ns3="http://request.api.mlpt.com">' + data.MerchantId + '</ns3:merchantId>';
        // xmlstring += '<ns3:proCode xmlns:ns3="http://request.api.mlpt.com">' + data.ProCode + '</ns3:proCode>';
        // xmlstring += '<ns3:transactionId xmlns:ns3="http://request.api.mlpt.com">' + data.TransactionId + '</ns3:transactionId>';
        // xmlstring += '</ns6:request>';
        // xmlstring += '</ns6:inquiry>';
        // xmlstring += '</soapenv:Body>';
        // xmlstring += '</soapenv:Envelope>';
        // res.type('application/xml');
        // res.send(xmlstring);
    } catch (error: any) {
        return res.formatter.badRequest(error?.message)
    }
}

export const cva = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const https = require('https');
        const httpsAgent = new https.Agent({
            // ca: fs.readFileSync('utils/digitogo.pem'),
            rejectUnauthorized: false,
        });
        const timestamp = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const payload = {
            ...req.body,
            TransactionDate: dayjs(timestamp).format('YYYYMMDDHHmmss')
        }
        // console.log(timestamp);
        // console.log(payload.TransactionDate);

        const hmac = await generateHmac('POST', '/api/v1/va/inquiry', payload, timestamp);

        const request = await axios.post(
            'https://115.85.74.55:7065/api/v1/va/inquiry',
            payload,
            {
                headers: {
                    'Api-Key': process.env.AGI_API_KEY || '',
                    'Content-Type': 'application/json',
                    'Timestamp': timestamp,
                    'Signature': hmac.signature
                },
                validateStatus: function () {
                    return true;
                },
                httpsAgent
            }
        );
        console.log(request);
        if (request.data) {
            let response = '';
            parseString(request.data, function (err: any, result: any) {
                response = result;
            });

            return res.status(request.status).json(response ? response : request.data);
        }
        else {
            throw new Error('request error');
        }
    } catch (error: any) {
        console.log(error);
        return res.formatter.serviceUnavailable(error?.message);
    }
}

export const bankInquiry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const https = require('https');
        const httpsAgent = new https.Agent({
            // ca: fs.readFileSync('utils/digitogo.pem'),
            rejectUnauthorized: false,
        });
        const timestamp = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const payload = req.body;

        const hmac = await generateHmac('POST', '/api/v1/ibft/inquiry', payload, timestamp);

        const request = await axios.post(
            'https://115.85.74.55:7065/api/v1/ibft/inquiry',
            payload,
            {
                headers: {
                    'Api-Key': process.env.AGI_API_KEY || '',
                    'Content-Type': 'application/json',
                    'Timestamp': timestamp,
                    'Signature': hmac.signature
                },
                validateStatus: function () {
                    return true;
                },
                httpsAgent
            }
        );
        console.log(request);
        if (request.data) {
            return res.status(200).json({ result: request.data });
        }
        else {
            throw new Error('request error');
        }
    } catch (error: any) {
        console.log(error);
        return res.formatter.badRequest(error?.message);
    }
}

export const forwardall = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const https = require('https');
        const httpsAgent = new https.Agent({
            // ca: fs.readFileSync('utils/digitogo.pem'),
            rejectUnauthorized: false,
        });
        const payload = req.body;
        const { agiurl, apikey, timestamp, signature } = req.headers;

        const timestampValue = timestamp ? timestamp?.toString() : dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const uriValue = new URL(agiurl?.toString() || '');
        const hmac = signature ? signature : (await generateHmac(`POST`, uriValue.pathname, payload, timestampValue)).signature || '';

        const request = await axios.post(
            uriValue.href,
            payload,
            {
                headers: {
                    'Api-Key': apikey?.toString() || '',
                    'Content-Type': 'application/json',
                    'Timestamp': timestampValue,
                    'Signature': hmac.toString()
                },
                validateStatus: function () {
                    return true;
                },
                httpsAgent,
                timeout: 1000 * 60,
            }
        );
        console.log(request);
        console.log('*** URL ***');
        console.log(uriValue.href);
        console.log('*** Header ***');
        console.log(request.headers);
        console.log('*** Body ***');
        console.log(payload);
        console.log('*** Response Status ***');
        console.log(request.status);
        console.log('*** Response Body ***');
        console.log(request.data);
        if (request.data) {
            return res.status(request.status).json(request.data);
        }
        else {
            throw new Error('request error');
        }
    } catch (error: any) {
        console.log(error);
        return res.formatter.badRequest(error?.message);
    }
}