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
        city: string;
        province: string;
        address: string;
        latitude?: number;
        longitude?: number;
        geometry?: any;
        role: number;
        status: 'pending' | 'active' | 'suspend' | 'inactive';
        loginattemp?: any;
    }

    interface Request {
        user?: User;
        polyglot?: any;
    }
}