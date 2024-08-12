import {PrismaClient, User} from "@prisma/client";
const prisma = new PrismaClient()

export type PaginatedUsers = {
    total: number;
    limit: number;
    skip: number;
    data: User[];
}

export class UserPrismaService {
    static async getAllUsers($limit: number, $skip: number, query?: any): Promise<PaginatedUsers> {
        const limit = Number($limit) ??  20
        const skip = Number($skip) ??  0
        const total = await prisma.user.count();
        const users = await prisma.user.findMany({
            skip: skip,
            take: limit,
            where: {
                OR: query
            },
            select: {
                hash: false,
                salt: false,
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                photoUrl: true,
                status: true
            }
        });

        return {
            total: total,
            limit: limit,
            skip: skip,
            data: users
        };
    }

    static async getUser(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {email}
        });
    }

    static async getMemberId(userId: string): Promise<string>{
        const member =  await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                members: {
                    include:{
                        discussion: false
                    }
                }
            }
        })
        return member.members[0].id
    }

    static async getUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {id}
        });
    }

    static async createUser(user: User): Promise<User> {
        return prisma.user.create({
            data: user
        });
    }

    static async updateUser(id: string, user: Partial<User>): Promise<User> {
        return prisma.user.update({
            where: {id},
            data: user
        });
    }

    static async deleteUser(email: string): Promise<void> {
        await prisma.user.delete({
            where: {email}
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