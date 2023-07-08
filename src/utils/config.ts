import dotenv from 'dotenv'

// Set NODE_ENV=Prod when on production to use system variables.
let path;
  path = `${__dirname}/../../.env.development`;

dotenv.config({ path: path });
export const publicKey: string = process.env.publicKey ? process.env.publicKey: " "
export const privateKey: string = process.env.privateKey ? process.env.privateKey: " "
export const dbURI: string = process.env.dbURI ? process.env.dbURI: " "