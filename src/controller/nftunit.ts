import { NextFunction, Request, Response } from 'express';
import { Op, Transaction, UUIDV1 } from 'sequelize';
import Nft, { NftInterface } from '../models/nft';
import { ErrorHandler } from '../helper/ErrorHandler';
import { sequelize } from '../instance/sequelize';
import NftUnit, { NftUnitInterface } from '../models/nftUnit';
import { deleteFile } from '../services/multer';
import constant from '../config/constant';
import pagination from '../helper/pagination';
import { binanceCointoIdr, convertToCoin } from '../services/cryptoservice';
import Util from '../models/util';

export const getoneunit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const gasfee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeCoinValue }
        }).then(res => res?.value);
        if (!gasfee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

        const admFeeValue: number | undefined = await Util.findOne({
            where: { key: constant.nftAdmPrcntValue }
        }).then(res => res?.value);
        if (!admFeeValue) throw new ErrorHandler(400, 'Tidak dapat mendapatkan nft admin fee!');

        const nftunit = await NftUnit.findOne({
            where: {
                nftSerialId: id
            },
            include: [
                {
                    model: Nft,
                    as: 'nft',
                    required: true,
                }
            ],
        });

        const rate = await binanceCointoIdr();

        return res.formatter.ok(
            {
                ...JSON.parse(JSON.stringify(nftunit)),
                gasfee,
                admfee: (admFeeValue > 1 ? admFeeValue : (admFeeValue * convertToCoin((nftunit?.priceToken || 0), rate))),
                priceCoin: convertToCoin(nftunit?.priceToken || 0, rate),
            },
            req.query
        );
    } catch (error) {
        return next(error)
    }
}