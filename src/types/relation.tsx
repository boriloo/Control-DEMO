type FriendUser = {
    id: string,
    name: string,
    imageUrl: string
}

export interface RelationData {
    user: { senderId: FriendUser, receiverId: FriendUser }
    status: 'accepted' | 'pending' | 'blocked'
}
