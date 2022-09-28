declare global {
    namespace Express {

        interface User {
            id?: number;
            name: string;
            email: string;
            phoneNumber: string;
            password: string;
        }

        export interface Request {
            user?: User;
        }
    }
}