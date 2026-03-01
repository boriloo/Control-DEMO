

// type DesktopMember = {
//     id: string,
//     name: string,
//     joinedAt: string,
// }

export type DesktopData = {
    id: string,
    name: string,
    ownerId: string,
    backgroundUrl: string,
    createdAt: Date
}

export type CreateDesktopData = {
    name: string,
    ownerId: string,
    backgroundImage: Buffer,
}