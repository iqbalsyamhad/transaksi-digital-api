declare namespace Express {
    interface User {
        id?: number;
        name: string;
        email: string;
        phoneNumber: string;
        password: string;
    }

    interface Request {
        user?: User;
        polyglot?: any;
    }
}