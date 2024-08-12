import {Request} from "express";

export interface RequestWithFile extends Request{
    file?: {
        filename: string
    }
}