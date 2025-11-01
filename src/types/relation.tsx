type FriendUser = {
    id: string,
    name: string,
    imageUrl: string
}

export interface RelationData {
    user: { sender: FriendUser, receiver: FriendUser }
    status: 'accepted' | 'pending' | 'blocked'
}
