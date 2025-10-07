import { Timestamp } from "firebase/firestore";

export type DesktopType = "personal" | "team"

export type MemberType = {
    userId: string,
    userName: string,
    userImage: string,
    role: "owner" | "admin" | "member"
}

export interface DesktopData {
    name: string;
    type: DesktopType;
    ownerId: string;
    members: MemberType[];
    membersId: string[];
    background?: string;
    createdAt?: Timestamp;
}
