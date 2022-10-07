declare namespace Express {
    interface User {
        id?: number;
        nik: string;
        name: string;
        image?: string;
        imagePath?: string;
        email: string;
        phoneNumber: string;
        birthdate: Date;
        password: string;
        pin?: string;
        cityId: number;
        city?: {
            id: number,
            name: string,
        },
        provinceId: number;
        province?: {
            id: number,
            name: string,
        },
        subdistrictId: number;
        subdistrict?: {
            id: number,
            name: string,
        },
        address: string;
        latitude?: number;
        longitude?: number;
        geometry?: any;
        membertype?: string | null;
        status: 'pending' | 'active' | 'suspend' | 'inactive';
        loginattemp?: any;
        tokenWallet?: {
            userId: number;
            token: number;
        }
    }

    interface Request {
        user?: User;
        userpos?: any;
        polyglot?: any;
    }
}