import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import path from "path";
import util from "util";
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

    const expiresIn = '2d';

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
    return token && token.exp && token.exp < now
}
export function authMiddleware(req, res, next) {
    if(!req.headers.authorization){
        next();
    }else{
        const tokenParts = req.headers.authorization.split(' ');

        if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {

            try {
                const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });
                if(isTokenExpired(verification)){
                    res.status(401).json({
                        msg: "The token provided has expired"
                    })
                }else{
                    console.log("Token not expired")
                    req.jwt = verification;
                    next();
                }
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
