import {asyncWrapper} from "../utils/async-wrapper";
import {RequestWithJwt} from "../interfaces/RequestWithJwt";
import {NextFunction, Response} from "express";
import {Contact} from "../models/contact";
import {ContactService} from "../services/contact";
import {User} from "../models/user";
import {UserService} from "../services/user";


export const sendContactRequest = asyncWrapper(async (req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    const user1Id: string = req.jwt.user.id
    const addedAt: number = Date.now()
    const user1Blocked: boolean = false
    const user2Blocked: boolean = false
    const status: string = "PENDING"
    const user2Id: string = req.body.user2Id

    if(user1Id == user2Id){
        return res.status(400).json({
            msg: "You cannot send a contact request to yourself."
        })
    }else{
        const contact = {
            user1Id: user1Id,
            addedAt: addedAt,
            user1Blocked: user1Blocked,
            user2Blocked: user2Blocked,
            status: status,
            user2Id: user2Id
        }

        const existingRequestSent = await ContactService.getContactAlreadySent(user1Id,user2Id)

        if(!existingRequestSent){
            const contactRequest: Contact = await ContactService.createContact(contact)
            return res.status(201).json(contactRequest)
        }else{
            return res.status(400).json({
                msg: "Contact request already sent to that user"
            })
        }
    }

})

export const listContactRequest = asyncWrapper(async (req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    let {status, user2Id } = req.query
    const statusAccepted: string[] = ["DECLINED","VALIDATED","PENDING"]
    status = `${status}`
    user2Id = `${user2Id}`
    const user1Id = req.jwt.user.id

    if (!statusAccepted.includes(status)){
        return res.status(400).json({
            msg: "Status accepted are only VALIDATED, DECLINED and PENDING"
        })
    }else{
        if(req.query.user2Id){
            const listContact: Contact = await ContactService.getContactAlreadySent(user1Id, user2Id,status)
            return res.status(200).json(listContact)
        }else{
            const listContactValidated: Contact[] = await ContactService.getContactByIdAndStatus(user1Id,status)
            return res.status(200).json(listContactValidated)
        }
    }
})

export const responseToRequest = asyncWrapper(async(req:RequestWithJwt, res:Response, next: NextFunction): Promise<Response> => {
    const {action, status} = req.body
    const actionAccepted: string[] = ["ANSWER_TO_REQUEST","BLOCKED_CONTACT"]
    const statusAccepted: string[] = ["DECLINED","VALIDATED"]

    if (!actionAccepted.includes(action) || !statusAccepted.includes(status)){
        return res.status(400).json({
            msg: "Status accepted are only VALIDATED AND DECLINED and/or action accepted is ANSWER_TO_REQUEST or BLOCKED_CONTACT"
        })
    }else{
        switch (action){
            case "ANSWER_TO_REQUEST":
                const contactId: string = req.params.contactId
                const contactUpdated = await ContactService.updateContact(contactId, {
                    status: status.toUpperCase()
                })
                return res.status(200).json(contactUpdated)
            case "BLOCKED_CONTACT":
                const contactIdB: string = req.params.contactId
                const {isBlocked} = req.body

                const contactBlocked = await ContactService.updateContact(contactIdB, {
                    user1Blocked: isBlocked
                })
                const user1: User = await UserService.getUserById(contactBlocked.user1Id)
                const user2: User = await UserService.getUserById(contactBlocked.user2Id)

                return res.status(200).json({
                    ...contactBlocked,
                    user1: user1,
                    user2: user2
                })
        }
    }

})

export const removeContact = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    const contactId: string = req.params.contactId
    const contactToDelete = await ContactService.getContactById(contactId)
    const user1: User = await UserService.getUserById(contactToDelete.user1Id)
    const user2: User = await UserService.getUserById(contactToDelete.user2Id)
    await ContactService.deleteContact(contactId)

    return res.status(200).json({
        ...contactToDelete,
        user1: user1,
        user2: user2
    })
})

