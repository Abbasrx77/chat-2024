import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import path from "path";
import util from "util";
import {Member} from "../models/discussion";
import exp from "constants";
const scrypt = util.promisify(crypto.scrypt) as (password: string | Buffer, salt: string | Buffer, keylen: number) => Promise<Buffer>

const pathToKey = path.join(__dirname, '..','..', 'id_rsa_priv.pem');
const pathToPubKey = path.join(__dirname, '..','..', 'id_rsa_pub.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');



export async function validPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const derivedKey: Buffer = await scrypt(password, salt, 64);
    return hash === derivedKey.toString('hex');
}


export async function genPassword(password: string): Promise<{ salt: string, hash: string }> {
    const salt: string = crypto.randomBytes(32).toString('hex')
    const derivedKey: Buffer = await scrypt(password, salt, 64);
    return {
        salt: salt,
        hash: derivedKey.toString('hex')
    }
}


export function issueJWT(user) {
    const _id = user.id;

    const expiresIn = "1d";


    const payload = {
        sub: _id,
        iat: Date.now(),
        user: user,
        jti: undefined,
        aud: undefined,
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

    payload.jti = jsonwebtoken.decode(signedToken).jti
    payload.aud = jsonwebtoken.decode(signedToken).aud
    return {
        strategy: signedToken.strategy,
        token: "Bearer " + signedToken,
        expires: expiresIn,
        payload: payload
    }
}

function isTokenExpired(token:jsonwebtoken):boolean {
    const now:number = Date.now()
    const date = new Date(token.exp)
    console.log(`${date.getHours()} Heures, ${date.getMinutes()} Minutes, ${date.getSeconds()} secondes`)
    console.log(date.toString())
    console.log(now)
    return token.exp < now
}
export function authMiddleware(req, res, next) {
    if(!req.headers.authorization){
        next();
    }else{
        const tokenParts = req.headers.authorization.split(' ');

        if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {

            try {
                const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });

                    console.log("Token not expired")
                    req.jwt = verification;
                    next();
            } catch(err) {
                res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
            }

        } else {
            res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
        }
    }


}

export const pick = (obj, ...keys) => {
    return keys.reduce((result, key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

export const getPagination = (page:number, size:number) => {
    const limit = size ? +size :  5;
    const offset = page ? (page -  1) * limit :  0;
    return { limit, offset };
};

export const removeDuplicates = (data: Member[]): Member[] => {
    return [...new Set<Member>(data)]
}

export const removeDuplicatesString = (data: String[]): String[] => {
    return [...new Set<String>(data)]
}

export function bytesToSize(bytes, decimals =  2) {
    if (bytes ==  0) return '0 Bytes';

    const k =  1024;
    const dm = decimals <  0 ?  0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) / 1024 /*+ ' ' + sizes[i]*/;
}

export function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size
    } catch (err) {
        console.error(err.message);
    }
}