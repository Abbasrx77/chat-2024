export type Reactions = {
    id?: string
    userId: string
    emoji: string
    messageId: string
}

export type File = {
    id?: string
    name: string
    pathUrl: string
    size: number
    type: string
    messageId?: string
}

export type MessageType = {
    id?: string
    text: string
    senderId: string
    surveyId?: string
    discusssionId: string
    responseToMsgId?: string
    file?: File
    reactions?: Reactions
    createdAt: number
}

export class Message implements MessageType {
    id?: string
    text: string
    senderId: string
    surveyId: string
    discusssionId: string
    responseToMsgId: string
    file: File
    reactions: Reactions
    createdAt: number

    constructor(text: string, senderId: string, surveyId: string, discusssionId: string, responseToMsgId: string, file: File, reactions: Reactions, createdAt: number) {
        this.text = text
        this.senderId = senderId
        this.surveyId = surveyId
        this.discusssionId = discusssionId
        this.responseToMsgId = responseToMsgId
        this.file = file
        this.reactions = reactions
        this.createdAt = createdAt
    }
}