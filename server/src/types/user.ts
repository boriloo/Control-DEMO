export type BasicFilter = 'off' | 'low' | 'high'
export type ColorFilter = 'color' | 'gray'

export type UserData = {
    id: string;
    name: string;
    email: string;
    password: string;
    filterDark: BasicFilter,
    filterBlur: BasicFilter,
    filterColor: ColorFilter,
}

export type updateUserData = {
    name?: string,
    profileImage?: Buffer,
    filterDark?: BasicFilter,
    filterBlur?: BasicFilter,
    filterColor?: ColorFilter,
}