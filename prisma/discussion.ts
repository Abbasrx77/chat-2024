import {Discussion, PrismaClient, User} from "@prisma/client"
import discussion from "../src/routes/discussion";

const prisma = new PrismaClient()

export class DiscussionPrismaService{

    static async getDiscussionById(id: string): Promise<Discussion | null> {
        return prisma.discussion.findUnique({
            where: {
                id: id
            },
            include: {
                members: {
                    include: {
                        user: true,
                        discussion: false
                    }
                }
            }
        })
    }

    static async getDiscussionsByUserId(userId: string): Promise<Discussion[] | null> {
        // Retrieve all discussions where the user is a member
        return prisma.discussion.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        discussion: false
                    },
                },
            },
        });
    }

    static async getArchivedDiscussionsByUserId(userId: string): Promise<Discussion[] | null> {
        let discussions = await prisma.discussion.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                        isArchived: true
                    }
                }
            },
            include: {
                members: {
                    include: {
                        discussion: false,
                    }
                }
            }
        });

        for (let i =  0; i < discussions.length; i++) {
            const createdByUser = await prisma.user.findUnique({
                where: { id: discussions[i].createdBy }
            });

            discussions[i].createdByUser = createdByUser;
        }

        return discussions;
    }

    static async getPinnedDiscussionsByUserId(userId: string): Promise<Discussion[] | null> {
        const discussions = await prisma.discussion.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                        isPinned: true
                    }
                }
            },
            include: {
                members: {
                    include: {
                        discussion: false,
                    }
                }
            }
        });

        for (let i =  0; i < discussions.length; i++) {
            const createdByUser = await prisma.user.findUnique({
                where: { id: discussions[i].createdBy }
            });

            discussions[i].createdByUser = createdByUser;
        }

        return discussions;
    }


    static async addUsersToGroup(groupId: string, users: String[]): Promise<Discussion> {
        return prisma.discussion.update({
            where: {
                id: groupId
            },
            include: {
                members: {
                    include: {
                        discussion: false,
                        user: true
                    }
                }
            },
            data: {
                members: {
                    create: users.map(userId => ({
                        userId: userId.valueOf(),
                        isAdmin: false,
                        addedAt: Date.now(),
                        isPinned: false,
                        isMuted: false,
                        isArchived: false
                    }))
                }
            }
        });
    }


    static async removeUsersFromGroup(groupId: string, userId: String[]): Promise<Discussion> {
        await prisma.member.deleteMany({
            where: {
                discussionId: groupId,
                userId: {
                    in: userId
                }
            }
        });
        return prisma.discussion.findUnique({
            where: {
                id: groupId
            },
            include: {
                members: {
                    include: {
                        user: true,
                        discussion: false
                    }
                }
            }
        })
    }


    static async createDiscussion(discussion: Discussion): Promise<Discussion> {
        return prisma.discussion.create({
            data: discussion
        })
    }

    static async archiveDiscussion(id: string,memberId: string,isArchived: boolean): Promise<Discussion> {
        return prisma.discussion.update({
            where: {
                id: id
            },
            include: {
                members: {
                    include: {
                        discussion: false,
                        user: true
                    }
                }
            },
            data:{
                members:{
                    update: {
                        where:{
                            id: memberId
                        },
                        data:{
                            isArchived: isArchived
                        }
                    }
                }
            }
        })
    }

    static async openDiscussion(id: string,memberId: string): Promise<Discussion> {
        return prisma.discussion.update({
            where: {
                id: id
            },
            include: {
                members: {
                    include: {
                        discussion: false,
                        user: true
                    }
                }
            },
            data:{
                members:{
                    update: {
                        where:{
                            id: memberId
                        },
                        data:{
                            hasNewNotif: false
                        }
                    }
                }
            }
        })
    }

    static async pinDiscussion(id: string,memberId: string,isPined: boolean): Promise<Discussion> {
        return prisma.discussion.update({
            where: {
                id: id
            },
            include: {
                members: {
                    include: {
                        discussion: false,
                        user: true
                    }
                }
            },
            data:{
                members:{
                    update: {
                        where:{
                            id: memberId
                        },
                        data:{
                            isPinned: isPined
                        }
                    }
                }
            }
        })
    }

    static async muteDiscussion(id: string,memberId: string,isMuted: boolean): Promise<Discussion> {
        return prisma.discussion.update({
            where: {
                id: id
            },
            include: {
                members: {
                    include: {
                        discussion: false,
                        user: true
                    }
                }
            },
            data:{
                members:{
                    update: {
                        where:{
                            id: memberId
                        },
                        data:{
                            isMuted: isMuted
                        }
                    }
                }
            }
        })
    }

    static async updateDiscussion(id: string, discussion: Partial<Discussion>): Promise<Discussion | null> {
        return prisma.discussion.update({
            where: {id},
            include: {
                members: {
                    include: {
                        discussion: false,
                        user: true
                    }
                }
            },
            data: discussion
        })
    }

    static async deleteDiscussion(id: string): Promise<void> {
        await prisma.member.deleteMany({
            where: {
                discussionId: id
            }
        });
        
        await prisma.discussion.delete({
            where: {
                id: id
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