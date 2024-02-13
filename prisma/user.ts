import {PrismaClient, User} from "@prisma/client";
const prisma = new PrismaClient()

export class UserPrismaService {
    static async getAllUsers(): Promise<User[]> {
        return prisma.user.findMany();
    }

    static async getUser(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {email}
        });
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