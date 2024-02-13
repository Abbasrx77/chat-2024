import {Request} from "express";
import jsonwebtoken from "jsonwebtoken";

export interface RequestWithJwt extends Request{
    jwt: jsonwebtoken
}