import {asyncWrapper} from "../utils/async-wrapper";
import {RequestFull} from "../interfaces/RequestFull";
import {Response, NextFunction} from "express";
import {Message, Reactions} from "@prisma/client";
import discussion from "../routes/discussion";
import {pseudoRandomBytes} from "crypto";
import {MessageService} from "../services/message";
import {bytesToSize, getFileSize} from "../utils/utils";
import path from "path";
import {RequestWithJwt} from "../interfaces/RequestWithJwt";
import {DiscussionService} from "../services/discussion";
import Messages from "../routes/messages";

export const createMessageInDiscussion = asyncWrapper(async(req: RequestFull, res: Response, next: NextFunction): Promise<Response> => {
    const senderId = req.jwt.user.id
    if (req.file){
        req.body.file = `files/${req.file.filename}`
    }

    let {text, discussionId, file, responseToMsgId} = req.body
    if(responseToMsgId == undefined) responseToMsgId = null
    const surveyId = null
    const createdAt:number = Date.now()

    const message: Message = {
        text: text,
        surveyId: surveyId,
        responseToMsgId: responseToMsgId,
        file: {
            name: req.file.filename,
            pathUrl: `files/${req.file.filename}`,
            size: bytesToSize(getFileSize(path.join(__dirname,'..','files',`${req.file.filename}`))),
            type: req.file.filename.substring(req.file.filename.lastIndexOf('.'))
        },
        createdAt: createdAt
    }

    const createdMessage = await MessageService.createMessage(discussionId, senderId, message)
    return res.status(201).json(createdMessage)
})


export const reactToMessage = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    const userId = req.jwt.user.id
    const {action, emoji} = req.body
    const messageToReactToId = req.params.messageId

    switch (action){
        case "EMOJI_REACTION":
            const findMessage: Message = await MessageService.getMessageById(messageToReactToId)
            if (!findMessage){
                return res.status(404).json({
                    msg: "Message not found."
                })
            }
            const reaction: Reactions = {
                userId: userId,
                emoji: emoji
            }
            const messageReactedTo = await MessageService.reactToMessage(messageToReactToId, reaction)
            return res.status(200).json(messageReactedTo)
    }
})


export const getMessagesOfDiscussion = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    let {discussionId} = req.query
    discussionId = `${discussionId}`
    let sort = req.query.$sort?.['createdAt']

    if(req.query.$sort?.['createdAt'] == undefined || req.query.discussionId == undefined){
        return res.status(400).json({
            msg: "Provide the necessary query params (discussionId, sort[createdAt])."
        })
    }else if (req.query.$sort?.['createdAt'] && req.query.discussionId){

        if(sort != '1' && sort != '-1'){
            console.log(sort)
            console.log(typeof sort)
            return res.status(400).json({
                msg: "Sort value must be -1 or 1"
            })
        }else if (sort == '1' || sort == '-1'){
            if (sort == '1') sort = 'asc'
            if (sort == '-1') sort = 'desc'
            const messagesOfDiscussion = await MessageService.getMessagesOfDiscussion(discussionId, sort)
            return res.status(200).json(messagesOfDiscussion)
        }
    }
})






