import {User} from "../models/user";
import {UserPrismaService} from "../../prisma/user";
import {getUser} from "../controllers/user";
import {DiscussionPrismaService} from "../../prisma/discussion";

export class UserService {
    static async getAllUsers(): Promise<User[] | null> {
        return await UserPrismaService.getAllUsers();
    }

    static async getUser(email: string): Promise<User | null> {
        return await UserPrismaService.getUser(email);
    }

    static async getUserById(id: string): Promise<User | null> {
        return await UserPrismaService.getUserById(id);
    }

    static async getMemberId(userId: string): Promise<string> {
        return await UserPrismaService.getMemberId(userId)
    }

    static async createUser(user: User): Promise<User> {
        return await UserPrismaService.createUser(user)
    }

    static async updateUser(id: string, user: Partial<User>): Promise<User> {
        return await UserPrismaService.updateUser(id, user)
    }

    static async deleteUser(id: string): Promise<void> {
        return await UserPrismaService.deleteUser(id)
    }

}