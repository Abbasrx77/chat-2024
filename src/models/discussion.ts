import {MessageType} from "./message";

enum Tag {
    "GROUP",
    "PRIVATE"
}

export type Member  = {
    id?: string
    userId: string
    isPinned: boolean
    hasNewNotif?: boolean
    isMuted: boolean
    isAdmin: boolean
    isArchived: boolean
    addedAt: number
    discussionId?: string
}

type DiscussionType = {
    id?: string,
    name: string
    description: string
    tag: Tag
    createdBy: string
    photoUrl: string
    createdAt: number
    updatedAt: number
    members: Member[]
    lastMessage: MessageType
}

export class Discussion implements DiscussionType {
    id?: string
    name: string
    description: string
    tag: Tag
    createdBy: string
    photoUrl: string
    createdAt: number
    updatedAt: number
    members: Member[]
    lastMessage: MessageType

    constructor(name: string, description: string, tag: Tag, createdBy: string, photoUrl: string, createdAt: number, updatedAt: number, members: Member[], lastmessage: MessageType) {
        this.name = name
        this.description = description
        this.tag = tag
        this.createdBy = createdBy
        this.photoUrl = photoUrl
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.members = members
        this.lastMessage = lastmessage
    }
}