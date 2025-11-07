type FriendUser = {
    id: string,
    name: string,
    imageUrl: string
}

export interface RelationData {
    sender: FriendUser,
    receiver: FriendUser,
    blockerId: string | null
    status: 'accepted' | 'pending' | 'blocked'
}
