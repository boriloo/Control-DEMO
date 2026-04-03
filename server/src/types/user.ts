export type BasicFilter = 'off' | 'low' | 'high'
export type ColorFilter = 'color' | 'gray'

export type UserData = {
    id: string;
    name: string;
    email: string;
    password: string;
    profileImage: Buffer | string;
    createdAt: Date;
}

export type updateUserData = {
    name?: string,
    profileImage?: Buffer,
}