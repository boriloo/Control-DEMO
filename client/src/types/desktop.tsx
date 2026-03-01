
export type CreateDesktopData = {
    name: string,
    backgroundImage: File,
}

export type DesktopData = {
    id: string,
    name: string,
    backgroundImage: string,
    createdAt: Date
}

// import { Timestamp } from "firebase/firestore";

// export type DesktopType = "personal" | "team"

// export type MemberType = {
//     userId: string,
//     userName: string,
//     userImage: string,
//     role: "owner" | "admin" | "member"
// }

// export interface DesktopData {
//     name: string;
//     type: DesktopType;
//     ownerId: string;
//     members: MemberType[];
//     membersId: string[];
//     background?: string;
//     createdAt?: Date;
// }

// export type FullDesktopData = DesktopData & { id: string };