import {Request, Response, NextFunction} from 'express';
import {User, UserDetails} from "../models/user";
import {asyncWrapper} from "../utils/async-wrapper";
import {UserService} from "../services/user";
import {genPassword, issueJWT, pick, validPassword} from "../utils/utils";
import {validationResult} from "express-validator";
import jsonwebtoken from "jsonwebtoken";
import {RequestWithJwt} from "../interfaces/RequestWithJwt";
import {RequestFull} from "../interfaces/RequestFull";
import {PaginatedUsers} from "../../prisma/user";



export const getAllUsers = asyncWrapper(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    let {$limit, $skip} = req.query
    let lim: string = `${$limit}`
    let sk: string = `${$skip}`
    const limit = parseInt(lim)
    const skip = parseInt(sk)

    const searchConditions = Array.isArray(req.query.$or) ? req.query.$or.map(condition => {
        const field = Object.keys(condition)[0]; // Assuming only one field per condition
        const regex = condition[field].$regex;
        const options = condition[field].$options;
        return {
            [field]: {
                contains: regex,
                mode: options === 'i' ? 'insensitive' : 'sensitive'
            }
        };
    }) : [];
    const users: PaginatedUsers | null = await UserService.getAllUsers(limit, skip, searchConditions)
    return res.status(200).json(users)
})


export const getUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const email: string = req.params.email
    const user: User | null = await UserService.getUser(email)
    return res.status(200).json(user)
})

export const createUser = asyncWrapper(async (req:Request,res:Response,next: NextFunction): Promise<Response> => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const user = req.body
    const existingUser = await UserService.getUser(user.email);
    if(!existingUser){
        const password = user.password
        const passwordDetails:{salt:string, hash:string} = (await genPassword(password))
        user.salt = passwordDetails.salt
        user.hash = passwordDetails.hash
        delete user.password
        const createdUser: User = await UserService.createUser(user)
        return res.status(201).json(createdUser)
    }else {
        return res.status(400).json({
            msg: "User already exists."
        })
    }
})

export const login = asyncWrapper(async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const email = req.body.email
    const user:User = await UserService.getUser(email)

    if (!user) {
        return res.status(400).json({
            success: false,
            msg: "Could not find user."
        })
    }else{
        const isValid = validPassword(req.body.password, user.hash, user.salt)
        if(isValid){

            const loggedInUser:User = await UserService.updateUser(
                user.id,
                {
                    status: "En ligne"
                }
            )

            const tokenObject = issueJWT(loggedInUser)
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
                user: loggedInUser
            })
        }else{
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }
    }
})

export const retrieveUserInfos = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> =>{
    const infos = req.jwt
    return res.status(200).json({
        accessToken: req.body.accessToken,
        authentication:{
            strategy: jsonwebtoken.strategy,
            accessToken: req.body.accessToken,
            payload: {
                iat: infos.iat,
                exp: infos.exp,
                aud: infos.aud,
                sub: infos.sub,
                jti: infos.jti
            }
        },
        user: infos.user
    });
})

// export const updateUser = asyncWrapper(async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
//     const id:string = req.params.id
//     const data = req.body
//     const updatedUser = await UserService.updateUser(id,data)
//     return res.status(200).json(updatedUser)
// })

export const deleteUser = asyncWrapper(async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const id:string = req.params.id
    const deletedUser = await UserService.deleteUser(id)
    return res.status(200).json({
        msg:"User deleted successfully."
    })
})

export const updateUser = asyncWrapper(async (req:RequestFull,res:Response, next: NextFunction): Promise<Response> => {
    const jwt: jsonwebtoken = req.jwt
    const data = req.body;
    const id = jwt.user.id

    if (req.file){
        data.photoUrl = `files/${req.file.filename}`
    }

    if (data.password){
        const passwordDetails:{salt:string, hash:string} = (await genPassword(data.password))
        data.salt = passwordDetails.salt
        data.hash = passwordDetails.hash
        delete data.password
    }

    const fieldsToUpdate = Object.entries(data)
        .filter(([key,value]) => ["firstname", "lastname", "photoUrl", "hash", "salt"]
            .includes(key) && value !== undefined)
        .reduce((acc,[key,value]) => ({ ...acc, [key]: value }), {})


    const updatedUser: User = await UserService.updateUser(id,fieldsToUpdate)
    return res.status(200).json(updatedUser)
})