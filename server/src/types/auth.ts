export type BasicFilter = 'off' | 'low' | 'high'
export type ColorFilter = 'color' | 'gray'

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    filterDark: BasicFilter,
    filterBlur: BasicFilter,
    filterColor: ColorFilter,
}

export interface LoginData {
    email: string;
    password: string;
}