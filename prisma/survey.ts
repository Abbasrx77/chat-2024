import {Survey, PrismaClient, Options} from "@prisma/client";

const prisma = new PrismaClient()

export class SurveyPrismaService {

    static async addSurvey(survey: Survey, options: Options): Promise<Survey | null> {
        return prisma.survey.create({
            data: {
                ...survey,
                Options:{
                    create: options.map(option => ({
                        response: option.response,
                        voters: option.voters
                    }))
                },
            },
            include: {
                Options: true
            }
        })
    }

    static async responseOkToSurvey(optionId: string, userId: string): Promise<Survey | null> {
        return prisma.options.update({
            where:{
                id: optionId
            },
            data:{
                voters: {
                    push: userId
                }
            },
            include:{
                Survey: {
                    include: {
                        Options: true
                    }
                }
            }
        })
    }


    static async responseNoToSurvey(optionId: string, userId: string): Promise<Survey | null> {
        const { voters } = await prisma.options.findUnique({
            where: { id: optionId },
            select: { voters: true }
        });

        const updatedVoters = voters.filter((voterId) => voterId !== userId);

        return prisma.options.update({
            where: {id: optionId},
            data: {voters: {set: updatedVoters}},
            include:{
                Survey: {
                    include: {
                        Options: true
                    }
                }
            }
        });
    }

    // static async reactToMessage(messageId: string, reaction: Reactions): Promise<Message | null> {
    //     return prisma.reactions.create({
    //         data: {
    //             ...reaction,
    //             Message: {
    //                 connect: {
    //                     id: messageId
    //                 }
    //             },
    //         },
    //         include:{
    //             Message: {
    //                 include: {
    //                     sender: true,
    //                     reactions: true
    //                 }
    //             }
    //         }
    //     })
    // }
    //
    //
    // static async getMessagesOfDiscussion(discussionId: string, sort: string): Promise<Message | null> {
    //     return prisma.message.findMany({
    //         where: {
    //             discussionId: discussionId
    //         },
    //         orderBy: {
    //             createdAt: sort === 'asc' ? 'asc' : sort === 'desc' ? 'desc' : undefined
    //         },
    //         include: {
    //             sender: true,
    //             reactions: true
    //         }
    //     })
    // }
    //
    //
    //
    // static async createMessage(discussionId: string, userId: string, message: Message): Promise<Message> {
    //     const filesToCreate = {
    //         name: message.file.name,
    //         pathUrl: message.file.pathUrl,
    //         size: message.file.size,
    //         type: message.file.type
    //     };
    //     return prisma.message.create({
    //         data: {
    //             ...message,
    //             file: {
    //                 create: filesToCreate
    //             },
    //             Discussion:{
    //                 connect:{
    //                     id: discussionId
    //                 }
    //             },
    //             sender: {
    //                 connect: {
    //                     id: userId
    //                 }
    //             }
    //         },
    //         include: {
    //             file: true,
    //             reactions: true,
    //             sender: true
    //         }
    //     });
    // }


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