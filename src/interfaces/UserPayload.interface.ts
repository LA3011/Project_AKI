export interface UserPayload {
    id_user: number;
    email: string;
    role?: string;
    iat?: number;
    exp?: number;
}
