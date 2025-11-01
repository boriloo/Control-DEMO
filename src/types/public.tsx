import { UserProfile } from "firebase/auth";

export type BasicFilter = 'off' | 'low' | 'high'
export type ColorFilter = 'color' | 'gray'

export interface PublicUserData {
    uid: string;
    name: string;
    email: string;
}

