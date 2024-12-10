"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME, } = process.env;
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_BUCKET_NAME) {
    throw new Error('Missing AWS configuration in .env file');
}
const s3Client = new client_s3_1.S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});
// export const uploadToS3 = async (file: { buffer: Buffer; originalname: string; mimetype: string }): Promise<{ Location: string }> => {
//   // Debug log to check file object
//   console.log('File object:', file);
//   const sanitizedFileName = file.originalname?.replace(/[^a-zA-Z0-9.]/g, '_') || 'default_filename';
//   const uniqueFileName = `${uuidv4()}-${sanitizedFileName}`;;
//   const uploadParams = {
//     Bucket: AWS_BUCKET_NAME,
//     Key: uniqueFileName,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };
//   try {
//     const command = new PutObjectCommand(uploadParams);
//     const data = await s3Client.send(command);
//     console.log('File uploaded successfully:', { ...data, Location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uploadParams.Key}` });
//     return { Location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uploadParams.Key}` };
//   } catch (error) {
//     console.error('Error uploading file to S3:', error);
//     throw error;
//   }
// };
const uploadToS3 = (file_1, ...args_1) => __awaiter(void 0, [file_1, ...args_1], void 0, function* (file, generateSignedUrl = false // Optional parameter for signed URL
) {
    var _a;
    console.log('File object:', file);
    const sanitizedFileName = ((_a = file.originalname) === null || _a === void 0 ? void 0 : _a.replace(/[^a-zA-Z0-9.]/g, '_')) || 'default_filename';
    const uniqueFileName = `${(0, uuid_1.v4)()}-${sanitizedFileName}`;
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: uniqueFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        // Upload the file to S3
        const command = new client_s3_1.PutObjectCommand(uploadParams);
        yield s3Client.send(command);
        console.log('File uploaded successfully');
        // Return Signed URL if required
        if (generateSignedUrl) {
            const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 }); // 1-hour expiry
            return { Location: signedUrl };
        }
        // Return standard S3 object URL
        const fileUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uniqueFileName}`;
        return { Location: fileUrl };
    }
    catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
    }
});
exports.uploadToS3 = uploadToS3;
