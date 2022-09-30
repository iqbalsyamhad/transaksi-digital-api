declare global {
    
}

export type MemberStatus = 'pending' | 'active' | 'suspend' | 'inactive';
export type StoreStatus = 'active' | 'suspend';

export interface LocationGeometry {
  type: string;
  coordinates: [number, number];
}

export interface MapCoordinates {
  latitude: number | null;
  longitude: number | null;
}