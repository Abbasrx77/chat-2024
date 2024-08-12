import {Contact} from "../models/contact";
import {ContactPrismaService} from "../../prisma/contact";

export class ContactService {

    static async getContactById(id: string): Promise<Contact | null> {
        return await ContactPrismaService.getContactById(id)
    }

    static async getContactAlreadySent(user1Id?: string, user2Id?: string,status?: string): Promise<Contact | null> {
        return await ContactPrismaService.getContactAlreadySent(user1Id, user2Id,status)
    }

    static async getContactByIdAndStatus(user1Id: string, status: string): Promise<Contact[] | []> {
        return await ContactPrismaService.getContactByIdAndStatus(user1Id, status)
    }

    static async createContact(contact: Contact): Promise<Contact> {
        return await ContactPrismaService.createContact(contact)
    }

    static async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
        return await ContactPrismaService.updateContact(id, contact)
    }

    static async deleteContact(id: string): Promise<void> {
        return await ContactPrismaService.deleteContact(id)
    }

}