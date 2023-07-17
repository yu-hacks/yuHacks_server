import AWS from "aws-sdk";

const dotenv = require('dotenv');

export const s3 = new AWS.S3({
    accessKeyId: "<key>",
    secretAccessKey: "<key>",
    region: "us-east-1"
});

export const bucket = "yubucket1";

