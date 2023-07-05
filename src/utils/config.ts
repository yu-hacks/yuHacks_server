import dotenv from 'dotenv'

// Set NODE_ENV=Prod when on production to use system variables.
let path;
switch (process.env.NODE_ENV) {
  case "dev":
    path = `${__dirname}/../../.env.development`;
    break;
}

dotenv.config({ path: path });
export const publicKey: string = process.env.publicKey ? process.env.publicKey: " "
export const privateKey: string = process.env.privateKey ? process.env.privateKey: " "