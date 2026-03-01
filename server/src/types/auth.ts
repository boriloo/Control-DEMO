export type BasicFilter = 'off' | 'low' | 'high'
export type ColorFilter = 'color' | 'gray'

export type RegisterData = {
    name: string;
    email: string;
    password: string;
}

export type LoginData = {
    email: string;
    password: string;
    rememberMe: boolean;
}