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