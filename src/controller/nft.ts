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
import Store, { StoreInterface } from '../models/store';
import User from '../models/user';
import Province from '../models/province';
import City from '../models/city';
import SubDistrict from '../models/subdistrict';
import NftCategory from '../models/nftCategory';

export const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, name, price, avlUnit, soldUnit, status, ...otherQuery } = req.query;

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let where: any = {};
        if (name) where.name = { [Op.like]: `%${name.toString().replace(' ', '%')}%` };
        if (avlUnit) {
            if (avlUnit == '!0') where.avlUnit = { [Op.gt]: 0 };
            else where.avlUnit = avlUnit;
        }
        if (status) {
            if (status == 'umum') where.storeId = null;
            else where.storeId = { [Op.not]: null };
        }
        for (const [key, value] of Object.entries(otherQuery)) {
            where[key] = value;
        }

        const gasfee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeCoinValue }
        }).then(res => res?.value);
        if (!gasfee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

        const admFeeValue: number | undefined = await Util.findOne({
            where: { key: constant.nftAdmPrcntValue }
        }).then(res => res?.value);
        if (!admFeeValue) throw new ErrorHandler(400, 'Tidak dapat mendapatkan nft admin fee!');

        const nfts = await Nft.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'produsen',
                    required: false
                },
                {
                    model: Store,
                    as: 'store',
                    required: false
                },
                {
                    model: NftUnit,
                    as: 'nftUnit',
                    separate: true,
                    include: [
                        {
                            model: User,
                            as: 'owner',
                            required: false,
                            attributes: ['name', 'image', 'imagePath', 'email', 'phoneNumber']
                        }
                    ]
                },
                {
                    model: NftCategory,
                    as: 'category',
                    required: false
                }
            ],
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            ...pagination(req),
        });

        const rate = await binanceCointoIdr();

        const parsenft = nfts.map((nft: NftInterface) => {
            const { nftUnit, ...nftProps } = JSON.parse(JSON.stringify(nft));
            const parsenftunit = nftUnit.map((unit: NftUnitInterface) => {
                return {
                    ...unit,
                    gasfee,
                    admfee: (admFeeValue > 1 ? admFeeValue : (admFeeValue * convertToCoin(unit.priceToken, rate))),
                    priceCoin: convertToCoin(unit.priceToken, rate)
                }
            });
            return {
                ...nftProps,
                gasfee,
                admfee: (admFeeValue > 1 ? admFeeValue : (admFeeValue * convertToCoin(nft.priceToken, rate))),
                priceCoin: convertToCoin(nft.priceToken, rate),
                nftUnit: parsenftunit
            }
        });

        return res.formatter.ok(
            parsenft,
            req.query);
    } catch (error) {
        return next(error)
    }
}

export const readOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nftId } = req.params;

        const gasfee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeCoinValue }
        }).then(res => res?.value);
        if (!gasfee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

        const admFeeValue: number | undefined = await Util.findOne({
            where: { key: constant.nftAdmPrcntValue }
        }).then(res => res?.value);
        if (!admFeeValue) throw new ErrorHandler(400, 'Tidak dapat mendapatkan nft admin fee!');

        const nft = await Nft.findOne({
            where: { nftId },
            include: [
                {
                    model: User,
                    as: 'produsen',
                    required: false
                },
                {
                    model: Store,
                    as: 'store',
                    required: false,
                    include: [
                        {
                            model: Province,
                            as: 'province',
                        },
                        {
                            model: City,
                            as: 'city'
                        },
                        {
                            model: SubDistrict,
                            as: 'subdistrict'
                        }
                    ]
                },
                {
                    model: NftUnit,
                    as: 'nftUnit',
                    separate: true,
                    include: [
                        {
                            model: User,
                            as: 'owner',
                            required: false,
                            attributes: ['name', 'image', 'imagePath', 'email', 'phoneNumber']
                        }
                    ]
                },
                {
                    model: NftCategory,
                    as: 'category',
                    required: false
                }
            ],
        });
        if (!nft) throw new ErrorHandler(404, 'dataNotFound');

        const rate = await binanceCointoIdr();

        return res.formatter.ok(
            {
                ...JSON.parse(JSON.stringify(nft)),
                gasfee,
                admfee: (admFeeValue > 1 ? admFeeValue : (admFeeValue * convertToCoin(nft.priceToken, rate))),
                priceCoin: convertToCoin(nft.priceToken, rate)
            }
        );
    } catch (error) {
        return next(error)
    }
}

export const myNft = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, name, status, ...otherQuery } = req.query;

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let whereNft: any = {};
        if (name) whereNft.name = { [Op.like]: `%${name.toString().replace(' ', '%')}%` };
        if (status) {
            if (status == 'umum') whereNft.storeId = null;
            else whereNft.storeId = { [Op.not]: null };
        }
        for (const [key, value] of Object.entries(otherQuery)) {
            whereNft[key] = value;
        }

        const gasfee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeCoinValue }
        }).then(res => res?.value);
        if (!gasfee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

        const admFeeValue: number | undefined = await Util.findOne({
            where: { key: constant.nftAdmPrcntValue }
        }).then(res => res?.value);
        if (!admFeeValue) throw new ErrorHandler(400, 'Tidak dapat mendapatkan nft admin fee!');

        const nftunits = await NftUnit.findAll({
            where: {
                ownerId: req.user?.id,
            },
            include: [
                {
                    model: Nft,
                    as: 'nft',
                    required: true,
                    where: whereNft,
                    include: [
                        {
                            model: NftCategory,
                            as: 'category',
                            required: false
                        }
                    ]
                }
            ],
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            ...pagination(req),
        });

        const rate = await binanceCointoIdr();

        const parsenftunit = nftunits.map((unit: NftUnitInterface) => {
            const { nft, ...nftunitProps } = JSON.parse(JSON.stringify(unit));
            return {
                gasfee,
                admfee: (admFeeValue > 1 ? admFeeValue : (admFeeValue * convertToCoin(unit.priceToken, rate))),
                priceCoin: convertToCoin(unit.priceToken, rate),
                ...nftunitProps,
                nft: {
                    gasfee,
                    admfee: (admFeeValue > 1 ? admFeeValue : (admFeeValue * convertToCoin(nft.priceToken, rate))),
                    priceCoin: convertToCoin(nft.priceToken, rate),
                    ...nft
                }
            }
        });

        return res.formatter.ok(
            parsenftunit,
            req.query
        );
    } catch (error) {
        return next(error)
    }
}

export const bymeNft = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.membertype != 'produsen') throw new ErrorHandler(200, 'Anda bukan produsen!');
        const { page, limit, order, name, status, ...otherQuery } = req.query;

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let whereNft: any = {};
        whereNft.produsenId = req.user.id;
        if (name) whereNft.name = { [Op.like]: `%${name.toString().replace(' ', '%')}%` };
        if (status) {
            if (status == 'umum') whereNft.storeId = null;
            else whereNft.storeId = { [Op.not]: null };
        }
        for (const [key, value] of Object.entries(otherQuery)) {
            whereNft[key] = value;
        }

        const gasfee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeCoinValue }
        }).then(res => res?.value);
        if (!gasfee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

        const admFeeValue: number | undefined = await Util.findOne({
            where: { key: constant.nftAdmPrcntValue }
        }).then(res => res?.value);
        if (!admFeeValue) throw new ErrorHandler(400, 'Tidak dapat mendapatkan nft admin fee!');

        const nfts = await Nft.findAll({
            where: whereNft,
            include: [
                {
                    model: NftUnit,
                    as: 'nftUnit',
                    separate: true,
                    include: [
                        {
                            model: User,
                            as: 'owner',
                            required: false,
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: NftCategory,
                    as: 'category',
                    required: false
                }
            ],
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            ...pagination(req),
        });

        const rate = await binanceCointoIdr();

        const parsenftdata = nfts
            .map((nftD) => {
                const nft = JSON.parse(JSON.stringify(nftD));
                const { nftUnit, ...nftProps } = nft;
                const parsenftunit = nftUnit.map((unit: NftUnitInterface) => {
                    return {
                        ...unit,
                        gasfee,
                        admfee: (admFeeValue > 1 ? admFeeValue : (admFeeValue * convertToCoin(unit.priceToken, rate))),
                        priceCoin: convertToCoin(unit.priceToken, rate)
                    }
                });
                return {
                    ...nftProps,
                    gasfee,
                    admfee: (admFeeValue > 1 ? admFeeValue : (admFeeValue * convertToCoin(nft.priceToken, rate))),
                    priceCoin: convertToCoin(nft.priceToken, rate),
                    nftUnit: parsenftunit
                }
            });

        return res.formatter.ok(
            parsenftdata,
            req.query
        );
    } catch (error) {
        return next(error)
    }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');
        if (!req.file?.filename) throw new ErrorHandler(400, 'Gambar NFT belum diunggah!');

        const nftData: NftInterface = {
            produsenId: req.body.produsenId,
            name: req.body.name,
            image: req.file.filename,
            description: req.body?.description || null,
            categoryId: req.body.categoryId,
            storeId: req.body.storeId,
            priceToken: req.body.price,
            sharePercentage: req.body.sharePercentage,
            monthlyPercentage: req.body.monthlyPercentage,
            physicAvl: req.body.physicAvailable,
            holdLimitinDay: req.body.buybackHoldLimit,
            expirationDate: req.body.expirationDate,
        }

        const newNft = await Nft.create(nftData, { transaction });
        if (!newNft) throw new ErrorHandler(400, 'saveFails');

        if (req.body.unitParsed) {
            let totalSharePercentageR = 0;
            let totalMonthlyPercentageR = 0;
            for (const nftUnit of req.body.unitParsed) {
                totalSharePercentageR += nftUnit.unitSharingPercentage || 0;
                totalMonthlyPercentageR += nftUnit.unitMonthlyPercentage || 0;

                const nftUnitData: NftUnitInterface = {
                    nftSerialId: '',
                    nftId: newNft.nftId,
                    priceToken: nftUnit.unitPrice,
                    sharePercentage: nftUnit.unitSharingPercentage,
                    monthlyPercentage: nftUnit.unitMonthlyPercentage,
                }

                const saveNftUnit = await NftUnit.create(nftUnitData, { hooks: true, transaction });
                if (!saveNftUnit) throw new ErrorHandler(400, 'saveFails');
            }

            // validate percentage child to parent
            if (nftData.sharePercentage && nftData.sharePercentage !== totalSharePercentageR) throw new ErrorHandler(400, 'Prosentase NFT sharing profit tidak valid!');
            if (nftData.monthlyPercentage && nftData.monthlyPercentage !== totalMonthlyPercentageR) throw new ErrorHandler(400, 'Prosentase NFT bulanan tidak valid!');
        } else {
            throw new ErrorHandler(400, 'NFT unit tidak tersedia!');
        }

        await transaction.commit();

        return res.formatter.ok(newNft);
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');
        if (!req.params.nftId) throw new ErrorHandler(401, 'NFT ID tidak ditemukan!');

        const nftPrev = await Nft.findOne({
            where: { nftId: req.params.nftId },
            transaction,
        });
        if (!nftPrev) throw new ErrorHandler(404, 'dataNotFound');

        let nftPayload: any = req.body;
        if (req.file) nftPayload.image = req.file.filename;

        const updatenft = await Nft.update(nftPayload, {
            where: { nftId: req.params.nftId },
            transaction
        });
        if (updatenft[0] != 1) throw new ErrorHandler(400, 'updateFails');

        if (req.body.unitParsed) {
            let totalSharePercentageR = 0;
            let totalMonthlyPercentageR = 0;

            for (const unitPayload of req.body.unitParsed) {
                totalSharePercentageR += unitPayload.unitSharingPercentage || 0;
                totalMonthlyPercentageR += unitPayload.unitMonthlyPercentage || 0;

                if (unitPayload.nftSerialId == null) {
                    // insert new UNIT
                    const unitSave = await NftUnit.create({
                        nftSerialId: '',
                        nftId: nftPrev.nftId,
                        priceToken: unitPayload.unitPrice,
                        sharePercentage: unitPayload.unitSharingPercentage,
                        monthlyPercentage: unitPayload.unitMonthlyPercentage,
                    }, { hooks: true, transaction });
                    if (!unitSave) throw new ErrorHandler(400, 'saveFails');
                } else {
                    if (unitPayload.delete == true) {
                        // delete UNIT
                        const prevNftUnit = await NftUnit.findOne({
                            where: { nftSerialId: unitPayload.nftSerialId },
                            transaction
                        });
                        if (!prevNftUnit) throw new ErrorHandler(404, 'NFT Unit dihapus tidak ditemukan!');
                        if (prevNftUnit.ownerId) throw new ErrorHandler(401, 'NFT Unit yang dimiliki member tidak dapat dihapus!');

                        await NftUnit.destroy({
                            where: { nftSerialId: unitPayload.nftSerialId },
                            transaction
                        });
                    } else {
                        // update UNIT
                        const unitUpdate = await NftUnit.update({
                            priceToken: unitPayload.unitPrice,
                            sharePercentage: unitPayload.unitSharingPercentage,
                            monthlyPercentage: unitPayload.unitMonthlyPercentage,
                        }, {
                            where: {
                                nftSerialId: unitPayload.nftSerialId
                            },
                            transaction
                        });
                        if (unitUpdate[0] != 1) throw new ErrorHandler(400, 'updateFails');
                    }
                }
            }

            // validate percentage child to parent
            if (nftPrev.sharePercentage && req.body.sharePercentage !== totalSharePercentageR) throw new ErrorHandler(400, 'Prosentase NFT sharing profit tidak valid!');
            if (nftPrev.monthlyPercentage && req.body.monthlyPercentage !== totalMonthlyPercentageR) throw new ErrorHandler(400, 'Prosentase NFT bulanan tidak valid!');
        } else {
            // no UNIT to update
        }

        await transaction.commit();

        if (req.file && nftPrev?.image && req.file.filename != nftPrev?.image) {
            deleteFile(nftPrev?.image, constant.productImagePath)
        }

        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const allCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, name } = req.query;

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let where: any = {};
        if (name) where.name = { [Op.like]: `%${name.toString().replace(' ', '%')}%` };

        const categories = await NftCategory.findAll({
            where,
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            ...pagination(req),
        });

        return res.formatter.ok(categories, req.query);
    } catch (error) {
        return next(error)
    }
}

export const upsertCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body;

        const [category, created] = await NftCategory.upsert({
            ...(id ? { id } : {}),
            ...{ name },
        });

        return res.formatter.ok(category);
    } catch (error) {
        return next(error)
    }
}