export interface IUser {
    refreshToken: string;
    accessToken: string;
    user: {
        fullNamame: string;
        email: string;
        password: string;
        role: 'admin' | 'teacher' | 'student';
        class: string;
        createdAt: Date;
    }
}
