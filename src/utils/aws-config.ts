import AWS from "aws-sdk";

const dotenv = require('dotenv');

export const s3 = new AWS.S3({
    accessKeyId: "AKIA4X3ETPYDJB7J34L4",
    secretAccessKey: "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",
    region: "us-east-1"
});

export const bucket = "yubucket1";

