import {RequestWithFile} from "./RequestWithFile";
import {RequestWithJwt} from "./RequestWithJwt";
import jsonwebtoken from "jsonwebtoken";

export interface RequestFull extends RequestWithFile, RequestWithJwt {
    file?: {
        filename: string
    },
    jwt: jsonwebtoken
}