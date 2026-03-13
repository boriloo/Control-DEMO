type FileType = 'folder' | 'link'

export type FileData = {
    id: string,
    name: string,
    ownerId: string,
    desktopId: string,
    parentId: string,
    fileType: FileType,
    xPos: number,
    yPos: number,
    url?: string,
}

export type CreateFileBodyData = {
    name: string,
    parentId: string,
    fileType: FileType,
    xPos: number,
    yPos: number,
    url?: string,
}

export type CreateFileData = {
    name: string,
    ownerId: string,
    desktopId: string,
    parentId: string,
    fileType: FileType,
    xPos: number,
    yPos: number,
    url?: string,
}

export type FilePositionsData = {
    id: string,
    xPos: number,
    yPos: number
}