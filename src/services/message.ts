import {Message} from "../models/message";
import {MessagePrismaService} from "../../prisma/message";
import {Reactions} from "@prisma/client";

export class MessageService {

    static async getMessageById(id: string): Promise<Message | null> {
        return await MessagePrismaService.getMessageById(id)
    }


    static async createMessage(discussionId: string, userId: string, message: Message): Promise<Message> {
        return await MessagePrismaService.createMessage(discussionId, userId, message)
    }

    static async getMessagesOfDiscussion(discussionId: string, sort: string): Promise<Message> {
        return await MessagePrismaService.getMessagesOfDiscussion(discussionId, sort)
    }

    static async reactToMessage(messageId: string, reaction: Reactions): Promise<Message> {
        return await MessagePrismaService.reactToMessage(messageId, reaction)
    }

    // static async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
    //     return await ContactPrismaService.updateContact(id, contact)
    // }
    //
    // static async deleteContact(id: string): Promise<void> {
    //     return await ContactPrismaService.deleteContact(id)
    // }

}