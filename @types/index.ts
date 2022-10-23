import { Transaction } from "sequelize";

declare global {

}

export type MemberStatus = 'pending' | 'active' | 'suspend' | 'inactive';
export type StoreStatus = 'active' | 'suspend';
export type ProductOrderStatus = 'paid' | 'processing' | 'canceled' | 'done';
export type ProductOrderDetailStatus = 'paid' | 'processing' | 'canceled' | 'done';

export interface LocationGeometry {
	type: string;
	coordinates: [number, number];
}

export interface MapCoordinates {
	latitude: number | null;
	longitude: number | null;
}

export interface walletData {
	walletPassword: string;
	walletAddress: string;
	walletStringify: string;
}

export interface ShippingAddressInterface {
	id?: number;
	userId?: number | null;
	user?: Express.User | null;
	name?: string | null;
	contactName: string;
	phoneNumber: string;
	detailAddress: string;
	provinceId: number;
	province: {
		id: string;
		name: string;
	} | null;
	cityId: number;
	city: {
		id: string;
		name: string;
	} | null;
	subdistrictId: number;
	subdistrict: {
		id: string;
		name: string;
	} | null;
	postalCode: string;
	coordinates?: MapCoordinates;
	latitude?: number;
	longitude?: number;
	geometry?: LocationGeometry;
}

export interface iSendblockchainparam {
	firsttrx: number;
	secondtrx: number | null;
	transaction?: Transaction | null;
	returnError?: boolean;
}