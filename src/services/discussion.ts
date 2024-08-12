import {Discussion} from "../models/discussion";
import {DiscussionPrismaService} from "../../prisma/discussion";

export class DiscussionService {
    static async getDiscussionById(id: string): Promise<Discussion | null> {
        return await DiscussionPrismaService.getDiscussionById(id)
    }

    static async getDiscussionByUserId(id: string): Promise<Discussion[] | null>{
        return await DiscussionPrismaService.getDiscussionsByUserId(id)
    }

    static async getArchivedDiscussionsByUserId(userId: string): Promise<Discussion[] | null>{
        return await DiscussionPrismaService.getArchivedDiscussionsByUserId(userId)
    }

    static async archiveDiscussion(id: string, memberId: string, isArchived: boolean): Promise<Discussion[] | null>{
        return await DiscussionPrismaService.archiveDiscussion(id, memberId, isArchived)
    }

    static async removeUserFromGroup(groupId: string, userId: String[]): Promise<Discussion[] | null>{
        return await DiscussionPrismaService.removeUsersFromGroup(groupId, userId)
    }

    static async openDiscussion(id: string, memberId: string): Promise<Discussion[] | null>{
        return await DiscussionPrismaService.openDiscussion(id, memberId)
    }

    static async pinDiscussion(id: string, memberId: string, isPined: boolean): Promise<Discussion[] | null>{
        return await DiscussionPrismaService.pinDiscussion(id, memberId, isPined)
    }

    static async muteDiscussion(id: string, memberId: string, isMuted: boolean): Promise<Discussion[] | null>{
        return await DiscussionPrismaService.muteDiscussion(id, memberId, isMuted)
    }

    static async addUsersToGroup(groupId: string, users: String[]): Promise<Discussion[] | null>{
        return await DiscussionPrismaService.addUsersToGroup(groupId, users)
    }

    static async getPinnedDiscussionsByUserId(userId: string): Promise<Discussion[] | null>{
        return await DiscussionPrismaService.getPinnedDiscussionsByUserId(userId)
    }

    static async createDiscussion(discussion: Discussion): Promise<Discussion> {
        return await DiscussionPrismaService.createDiscussion(discussion)
    }

    static async updateDiscussion(id: string, discussion: Partial<Discussion>): Promise<Discussion> {
        return await DiscussionPrismaService.updateDiscussion(id, discussion)
    }

    static async deleteDiscussion(id: string): Promise<void> {
        return await DiscussionPrismaService.deleteDiscussion(id)
    }
}