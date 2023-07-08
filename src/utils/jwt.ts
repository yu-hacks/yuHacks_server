import  jwt  from "jsonwebtoken"
import { privateKey, publicKey } from "./config";

const publicKeyR = Buffer.from(publicKey, "base64").toString("ascii")
const privateKeyR = Buffer.from(privateKey, "base64").toString("ascii")

export function signJwt(object: Object, options?: jwt.SignOptions | undefined){
    return jwt.sign(object, privateKeyR, {
        ...(options && options),
        algorithm: "RS256",
    });
}

export function validateJwt<T>(token: string): T | null{
    try{
        const decodedToken = jwt.verify(token, publicKeyR) as T;
        return decodedToken;
    }catch(e) {
        console.log(e);
        return null
    }
}