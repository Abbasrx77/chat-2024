import {PrismaClient, User} from "@prisma/client";
const prisma = new PrismaClient()

export class UserPrismaService {
    static async getAllUsers(): Promise<User[]> {
        try {
            const users = await prisma.user.findMany(); // Assurez-vous que cette ligne fonctionne correctement
            return users;
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            throw error; // Renvoie l'erreur pour être gérée plus haut dans la chaîne
        }
    }

    static async getUser(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {email}
        });
    }

    static async createUser(user: User): Promise<User> {
        return prisma.user.create({
            data: user
        });
    }

    static async updateUser(email: string, user: Partial<User>): Promise<User> {
        return prisma.user.update({
            where: {email},
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