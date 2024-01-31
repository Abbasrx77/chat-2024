import {Request, Response, NextFunction} from 'express';
import {User} from "../models/user";
import {asyncWrapper} from "../middlewares/async-wrapper";
import {UserService} from "../services/user";
import {genPassword, issueJWT, validPassword} from "../utils/utils";
import {UserPrismaService} from "../../prisma";



export const getAllUsers = asyncWrapper(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const users: User[] | null = await UserService.getAllUsers()
    return res.status(200).json(users)
})

export const getUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const email = req.params.email
    const user: User | null = await UserService.getUser(email)
    return res.status(200).json(user)
})

export const createUser = asyncWrapper(async (req:Request,res:Response,next: NextFunction): Promise<Response> => {
    const user = req.body
    const password = user.password
    const email = user.email
    const passwordDetails = (await genPassword(password))
    user.salt = passwordDetails.salt
    user.hash = passwordDetails.hash
    delete user.password
    const createdUser = await UserService.createUser(user)
    return res.status(201).json(createdUser)
})

export const login = asyncWrapper(async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const email = req.body.email
    const user = UserService.getUser(email)

    if (!user) {
        return res.status(401).json({ success: false, msg: "Could not find user" })
    }else{
        const isValid = validPassword(req.body.password, (await user).hash, (await user).salt)
        if(isValid){

            const tokenObject = issueJWT(user)
            return res.status(200).json({
                success: true,
                accessToken: tokenObject.token,
                authentication: {
                    strategy: tokenObject.strategy,
                    payload: {
                        iat: tokenObject.payload.iat,
                        exp: tokenObject.expires,
                        aud: tokenObject.payload.aud,
                        sub: tokenObject.payload.sub,
                        jti: tokenObject.payload.jti
                    }
                },
                user: user
            })
        }else{
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }
    }
})

export const updateUser = asyncWrapper(async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const id = req.params.id
    const data = req.body
    const updatedUser = await UserService.updateUser(id,data)
    return res.status(200).json(updatedUser)
})

export const deleteUser = asyncWrapper(async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const id = req.params.id
    const deletedUser = await UserService.deleteUser(id)
    return res.status(200).json({
        "msg":"User deleted successfully"
    })
})