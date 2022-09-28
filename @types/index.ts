declare global {
    
}

export type MemberStatus = 'pending' | 'active' | 'suspend' | 'inactive';

export interface LocationGeometry {
  type: string;
  coordinates: [number, number];
}