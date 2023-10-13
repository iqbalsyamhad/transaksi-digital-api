import axios from "axios";
import dotenv from 'dotenv';
import { Transaction } from "sequelize";
import { ErrorHandler } from "../helper/ErrorHandler";
import Shipping from "../models/shipping";
import ShippingAddress from "../models/shippingaddress";
import Store from "../models/store";
import UserAddress from "../models/useraddress";
dotenv.config();

export const cekongkir = async (subdistrictIdOrigin: number, subdistrictIdDestination: number, courier: string, weight: number) => {
    try {
        const request = await axios.post(
            'https://pro.rajaongkir.com/api/cost',
            {
                origin: subdistrictIdOrigin,
                originType: 'subdistrict',
                destination: subdistrictIdDestination,
                destinationType: 'subdistrict',
                weight,
                courier
            },
            {
                headers: {
                    key: process.env.RAJAONGKIR_KEY || ''
                },
                validateStatus: function (status) {
                    return true
                }
            },
        );
        if (request.status != 200) throw new Error(request.data.rajaongkir.status.description);
        return request.data.rajaongkir.results;
    } catch (error) {
        throw error;
    }
}

export const saveShippingAddress = async (productOrderDetailId: string | undefined, shipping: any, store: Store, transaction: Transaction) => {
    try {
        if (!productOrderDetailId) throw new ErrorHandler(400, 'Product order detail belum tersedia!');

        const destinationdata = await UserAddress.findOne({ where: { id: shipping.addressBookId } });
        if (!destinationdata) throw new ErrorHandler(404, 'Address book tidak ditemukan!');

        const originaddress = await ShippingAddress.create({
            contactName: store.owner.name,
            phoneNumber: store.owner.phoneNumber,
            detailAddress: store.address,
            provinceId: store.provinceId,
            cityId: store.cityId,
            subdistrictId: store.subdistrictId,
            postalCode: store.postalCode,
            latitude: store.latitude,
            longitude: store.longitude,
            geometry: {
                type: 'Point',
                coordinates: [store.longitude, store.latitude]
            },
        }, { transaction });

        const destinationaddress = await ShippingAddress.create({
            contactName: destinationdata.name,
            phoneNumber: destinationdata.phoneNumber,
            detailAddress: destinationdata.detailAddress,
            provinceId: destinationdata.provinceId,
            cityId: destinationdata.cityId,
            subdistrictId: destinationdata.subdistrictId,
            postalCode: destinationdata.postalCode,
            latitude: destinationdata.latitude,
            longitude: destinationdata.longitude,
            geometry: {
                type: 'Point',
                coordinates: [destinationdata.longitude, destinationdata.latitude]
            }
        }, { transaction });

        await Shipping.create({
            productOrderDetailId,
            code: shipping.code,
            service: shipping.costs.service,
            description: shipping.costs.description,
            price: shipping.costs.cost.value,
            etd: shipping.costs.cost.etd,
            originAddressId: originaddress.id,
            destinationAddressId: destinationaddress.id,
            note: shipping.costs.cost.note,
        }, { transaction });

        return true;
    } catch (error) {
        throw error;
    }
}