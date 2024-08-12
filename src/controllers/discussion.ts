import {asyncWrapper} from "../utils/async-wrapper";
import {RequestWithJwt} from "../interfaces/RequestWithJwt";
import {Response, NextFunction} from "express";
import {DiscussionService} from "../services/discussion";
import {Member} from "../models/discussion";
import {PrismaClient, Discussion, User} from "@prisma/client"
import {removeDuplicates, removeDuplicatesString} from "../utils/utils";
import {DiscussionPrismaService} from "../../prisma/discussion";
import {UserService} from "../services/user";
import {strict} from "assert";

const prisma = new PrismaClient()

export const createGroupDiscussion = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    const {tag, name, description, members} = req.body

    const adminMember: Member = {
        userId: req.jwt.user.id,
        isAdmin: true,
        addedAt: Date.now(),
        isPinned: false,
        isMuted: false,
        isArchived: false
    }
    const allGroupMembers: Member[] = [adminMember,...members]
    const filteredMembers: Member[] = removeDuplicates(allGroupMembers)
    console.log(allGroupMembers)
    console.log(filteredMembers)
    const discussionCreated = await prisma.discussion.create(
        {
            data: {
                tag,
                name,
                description,
                createdBy: req.jwt.user.id,
                photoUrl: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                members: {
                    create: filteredMembers.map(member => ({
                        userId: member.userId,
                        isAdmin: member.isAdmin,
                        addedAt: Date.now(),
                        isPinned: false,
                        isMuted: false,
                        isArchived: false
                    }))
                }
            },
            include: {
                members: true
            }
        }
    )
    return res.status(201).json(discussionCreated)
})

export const listDiscussion = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    const userId = req.jwt.user.id
    const listDiscussion = await DiscussionService.getDiscussionByUserId(userId)

    const isArchived = req.query.members?.['$elemMatch']?.['isArchived']
    const isPined = req.query.members?.['$elemMatch']?.['isPined']


    if (!req.query.members?.['$elemMatch']){
        return res.status(200).json(listDiscussion)
    }else if(req.query.members?.['$elemMatch']){
        if (isArchived === true || isArchived == 'true'){
            const archivedDiscussions: Discussion[] = await DiscussionService.getArchivedDiscussionsByUserId(userId)
            return res.status(200).json(archivedDiscussions)
        }
        if(isPined === true || isPined == 'true' ){
            const pinnedDiscussions: Discussion[] = await DiscussionService.getPinnedDiscussionsByUserId(userId)
            return res.status(200).json(pinnedDiscussions)
        }
    }
})

export const superPatchDiscussion = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    const groupId = req.params.groupId
    const {action} = req.body
    const userId = req.jwt.user.id
    const existGroup = DiscussionService.getDiscussionById(groupId)

    if (!existGroup){
        return res.status(404).json({
            msg: "Invalid discussion id."
        })
    }

    switch (action){
        case "ADD_USERS_GROUP":
            const {addUsers} = req.body
            removeDuplicatesString(addUsers)
            const updatedDiscussion: Discussion = await DiscussionService.addUsersToGroup(groupId, addUsers)
            return res.status(200).json(updatedDiscussion)

        case "UPDATE_GROUP_INFO":
            const {name, description} = req.body
            const updatedGroup: Discussion = await DiscussionService.updateDiscussion(groupId, {
                name: name,
                description: description
            })
            return res.status(200).json(updatedGroup)

        case "ARCHIVED":
            const {isArchived} = req.body
            // const archived: boolean = isArchived == true || isArchived == 'true'
            const memberId: string = await UserService.getMemberId(userId)
            const archivedDiscussion: Discussion = await DiscussionService.archiveDiscussion(groupId, memberId, isArchived)
            return res.status(200).json(archivedDiscussion)

        case "PINED":
            const {isPined} = req.body
            // const pined: boolean = isPined == true || isPined == 'true'
            const memberIda: string = await UserService.getMemberId(userId)
            const pinedDiscussion: Discussion = await DiscussionService.pinDiscussion(groupId, memberIda, isPined)
            return res.status(200).json(pinedDiscussion)

        case "MUTED":
            const {isMuted} = req.body
            // const muted: boolean = isMuted == true || isMuted == 'true'
            const memberIdb: string = await UserService.getMemberId(userId)
            const mutedDiscussion: Discussion = await DiscussionService.muteDiscussion(groupId, memberIdb, isMuted)
            return res.status(200).json(mutedDiscussion)

        case "REMOVE_USERS_GROUP":
            const {removeUsers} = req.body
            removeDuplicatesString(removeUsers)
            const updatedDiscussiona: Discussion = await DiscussionService.removeUserFromGroup(groupId, removeUsers)
            return res.status(200).json(updatedDiscussiona)

        case "LEAVE_GROUP":
            const myId: String[] = [req.jwt.user.id]
            const updatedDiscussionb: Discussion = await DiscussionService.removeUserFromGroup(groupId, myId)
            return res.status(200).json(updatedDiscussionb)

        case "OPEN_DISCUSSION":
            const memberIdc: string = await UserService.getMemberId(userId)
            const openedDiscussion: Discussion = await DiscussionService.openDiscussion(groupId, memberIdc)
            return res.status(200).json(openedDiscussion)
    }
})

export const deleteDiscussionGroup = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    const groupId = req.params.groupId
    const group = await DiscussionService.getDiscussionById(groupId)
    await DiscussionService.deleteDiscussion(groupId)
    return res.status(200).json(group)
})

export const getDiscussionById = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    const groupId = req.params.groupId
    const discussion: Discussion = await DiscussionService.getDiscussionById(groupId)
    return res.status(200).json(discussion)
})