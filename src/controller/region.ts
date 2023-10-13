import { NextFunction, Request, Response } from 'express';
import City from '../models/city';
import axios from 'axios';
import dotenv from 'dotenv';
import SubDistrict from '../models/subdistrict';
import { ErrorHandler } from '../helper/ErrorHandler';
dotenv.config();

export const crawlSubdistrict = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cities = await City.findAll();
        for (const city of cities) {
            const sdistricts = await axios.get(`https://pro.rajaongkir.com/api/subdistrict?city=${city.id}`, { headers: { key: process.env.RAJAONGKIR_KEY || '' } });
            if (sdistricts.data) {
                const { results } = sdistricts.data?.rajaongkir;
                for (const sdistrict of results) {
                    const [savedSdistrict, created] = await SubDistrict.findOrCreate({
                        where: { id: sdistrict.subdistrict_id },
                        defaults: {
                            id: sdistrict.subdistrict_id,
                            name: sdistrict.subdistrict_name,
                            type: sdistrict.type,
                            cityId: sdistrict.city_id,
                            city: sdistrict.city,
                            provinceId: sdistrict.province_id,
                            province: sdistrict.province,
                        }
                    });
                }
            }
        }
        return res.formatter.ok({});
    } catch (error) {
        return res.formatter.ok({});
    }
}

export const getProvince = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const provinces = await axios.get(`https://pro.rajaongkir.com/api/province`, { headers: { key: process.env.RAJAONGKIR_KEY || '' } });
        if (provinces.data) {
            const { results } = provinces.data?.rajaongkir;
            return res.formatter.ok(results);
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error) {
        return next(error);
    }
}

export const getCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { province } = req.query;
        const cities = await axios.get(`https://pro.rajaongkir.com/api/city?${(province ? `province=${province}` : ``)}`, { headers: { key: process.env.RAJAONGKIR_KEY || '' } });
        if (cities.data) {
            const { results } = cities.data?.rajaongkir;
            return res.formatter.ok(results);
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error) {
        return next(error);
    }
}

export const getSubDistrict = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { city } = req.query;
        const subdistricts = await axios.get(`https://pro.rajaongkir.com/api/subdistrict?${(city ? `city=${city}` : ``)}`, { headers: { key: process.env.RAJAONGKIR_KEY || '' } });
        if (subdistricts.data) {
            const { results } = subdistricts.data?.rajaongkir;
            return res.formatter.ok(results);
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error) {
        return next(error);
    }
}