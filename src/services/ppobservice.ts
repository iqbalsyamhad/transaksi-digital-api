import axios from "axios";
const crypto = require('crypto');
import dotenv from 'dotenv';
import PPOBPostpaidProduct from "../models/ppobpostpaidproduct";
import { ErrorHandler } from "../helper/ErrorHandler";
import Util from "../models/util";
import constant from "../config/constant";
dotenv.config();

export const postpaidInquiry = async (code: string, customer_id: string, nik: string, month: number) => {
    const { v1: uuidv1 } = require('uuid');
    const refId = uuidv1();

    const request = await axios.post(`${process.env.IAK_POSTPAID_URL}/api/v1/bill/check`, {
        commands: 'inq-pasca',
        username: `${process.env.IAK_PHONENUMBER}`,
        code: code,
        hp: customer_id,
        ref_id: refId,
        sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}${refId}`).digest('hex')}`,
        nomor_identitas: nik,
        month: month
    });

    const gasFee: number | undefined = await Util.findOne({
        where: { key: constant.gasFeeTokenValue }
    }).then(res => res?.value);
    if (!gasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

    if (request.data) {
        const { data } = request.data;
        const { admin, price, selling_price, ...inqresponse } = data;

        const localtype = await PPOBPostpaidProduct.findOne({
            where: { code: code }
        });
        let finaladmin = admin;
        let finalkomisi = price - selling_price;
        await PPOBPostpaidProduct.upsert({
            code: code,
            fee: admin,
            komisi: finalkomisi,
        });
        if (localtype) {
            finaladmin = admin + localtype.margin;
            finalkomisi = finalkomisi + localtype.margin;
        }
        return {
            gasfee: gasFee,
            admin: finaladmin,
            price: finaladmin + inqresponse.nominal + gasFee,
            komisi: finalkomisi,
            ...inqresponse,
        };
    } else {
        throw new ErrorHandler(400, 'Tidak ada hasil');
    }
}