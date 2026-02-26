export type BasicFilter = 'off' | 'low' | 'high'
export type ColorFilter = 'color' | 'gray'

export interface UserData {
    id: string;
    name: string;
    email: string;
    password: string;
    filterDark: BasicFilter,
    filterBlur: BasicFilter,
    filterColor: ColorFilter,
}
