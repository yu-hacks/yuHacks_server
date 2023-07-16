import dotenv from 'dotenv'

let path;
  path = `${__dirname}/../../.env.development`;

dotenv.config({ path: path });
export const publicKey: string = process.env.publicKey ? process.env.publicKey: " "
export const privateKey: string = process.env.privateKey ? process.env.privateKey: " "
export const dbURI: string = process.env.dbURI ? process.env.dbURI: " "

export const googleClientID: string = process.env.googleClientID ? process.env.googleClientID: " "
export const googleClientSecret: string = process.env.googleSecret ? process.env.googleSecret: " "
export const callbackURLGoogle: string = process.env.callbackURLGoogle ? process.env.callbackURLGoogle: " "

export const githubClientID: string = process.env.githubClientID ? process.env.githubClientID: " "
export const githubClientSecret: string = process.env.githubClientSecret ? process.env.githubClientSecret: " "
export const callbackURLGithub: string = process.env.callbackURLGithub ? process.env.callbackURLGithub: " "

export const verificationEmailUser: string = process.env.verificationEmailUser ? process.env.verificationEmailUser: " "
export const verificationEmailAppPass: string = process.env.verificationEmailAppPass ? process.env.verificationEmailAppPass: " "