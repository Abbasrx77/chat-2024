import {Contact, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export class ContactPrismaService {

    static async getContactById(id: string): Promise<Contact | null> {
        return prisma.contact.findUnique({
            where: {id}
        })
    }

    static async getContactAlreadySent(user1Id?: string, user2Id?: string,status?: string): Promise<Contact | null> {
        return prisma.contact.findFirst({
            where: {
                user1Id: user1Id,
                user2Id: user2Id,
                status: status
            }
        })
    }

    static async getContactByIdAndStatus(user1Id?: string, status?: string): Promise<Contact[]> {
        const contacts = await prisma.contact.findMany({
            where: {
                user1Id: user1Id,
                status: status
            }
        });

        const contactsWithUsers = await Promise.all(contacts.map(async (contact) => {
            const user1 = await prisma.user.findUnique({
                where: { id: contact.user1Id }
            });
            const user2 = await prisma.user.findUnique({
                where: { id: contact.user2Id }
            });

            return {
                ...contact,
                fullname: `${user1.firstname} ${user1.lastname}`,
                user1: user1,
                user2: user2
            };
        }));

        return contactsWithUsers;
    }


    static async createContact(contact: Contact): Promise<Contact> {
        return prisma.contact.create({
            data: contact
        });
    }

    static async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
        return prisma.contact.update({
            where: {id},
            data: contact
        });
    }

    static async deleteContact(id: string): Promise<void> {
        await prisma.contact.delete({
            where: {id}
        })
    }
}
async function main() {

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e);
        prisma.$disconnect()
    })