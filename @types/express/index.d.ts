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
        geometry?: LocationGeometry;
        role: number;
        status: MemberStatus;
    }

    interface Request {
        user?: User;
        polyglot?: any;
    }
}