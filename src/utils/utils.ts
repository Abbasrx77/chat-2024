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


/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
export function issueJWT(user) {
    const _id = user._id;

    const expiresIn = '10m';

    const payload = {
        sub: _id,
        iat: Date.now(),
        jti: undefined,
        aud: undefined,
    };
    console.log(payload.sub)

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

    payload.jti = jsonwebtoken.decode(signedToken).jti
    payload.aud = jsonwebtoken.decode(signedToken).aud

    return {
        strategy: signedToken.strategy,
        token: "Bearer " + signedToken,
        expires: expiresIn,
        payload
    }
}

export function authMiddleware(req, res, next) {
    const tokenParts = req.headers.authorization.split(' ');

    if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {

        try {
            const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });
            req.jwt = verification;
            next();
        } catch(err) {
            res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
        }

    } else {
        res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
    }


}
