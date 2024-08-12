import {Message, PrismaClient, Reactions} from "@prisma/client";

const prisma = new PrismaClient()

export class MessagePrismaService {

    static async getMessageById(id: string): Promise<Message | null> {
        return prisma.message.findUnique({
            where: {
                id: id
            }
        });
    }

    static async reactToMessage(messageId: string, reaction: Reactions): Promise<Message | null> {
        return prisma.reactions.create({
            data: {
                ...reaction,
                Message: {
                    connect: {
                        id: messageId
                    }
                },
            },
            include:{
                Message: {
                    include: {
                        sender: true,
                        reactions: true
                    }
                }
            }
        })
    }


    static async getMessagesOfDiscussion(discussionId: string, sort: string): Promise<Message | null> {
        const limit = 20
        const skip = 0
        const total = await prisma.message.count();
        const messages = await prisma.message.findMany({
            where: {
                discussionId: discussionId
            },
            orderBy: {
                createdAt: sort === 'asc' ? 'asc' : sort === 'desc' ? 'desc' : undefined
            },
            include: {
                sender: true,
                reactions: true
            }
        })

        return {
            total: total,
            limit: limit,
            skip: skip,
            data: {messages}
        }
    }



    static async createMessage(discussionId: string, userId: string, message: Message): Promise<Message> {
        const filesToCreate = {
            name: message.file.name,
            pathUrl: message.file.pathUrl,
            size: message.file.size,
            type: message.file.type
        };
        return prisma.message.create({
            data: {
                ...message,
                file: {
                    create: filesToCreate
                },
                    Discussion:{
                    connect:{
                        id: discussionId
                    }
                    },
                    sender: {
                        connect: {
                            id: userId
                        }
                    }
            },
            include: {
                file: true,
                reactions: true,
                sender: true
            }
        });
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