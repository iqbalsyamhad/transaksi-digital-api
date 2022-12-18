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
        city?: string;
        province?: string;
        subdistrict?: string;
        address: string;
        latitude?: number;
        longitude?: number;
        geometry?: any;
        membertype?: string | null;
        role?: 'operation' | 'superadmin';
        status: 'pending' | 'active' | 'suspend' | 'inactive';
        walletPassword?: string;
        walletAddress?: string;
        walletStringify?: string;
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