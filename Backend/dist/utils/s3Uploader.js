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
exports.generateSignedUrl = exports.uploadToS3 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME, } = process.env;
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_BUCKET_NAME) {
    throw new Error('Missing AWS configuration in .env file');
}
// Initialize the S3 client
const s3Client = new client_s3_1.S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});
/**
 * Upload a file to S3
 * @param {object} file - The file to upload
 * @returns {Promise<object>} - The S3 location of the uploaded file
 */
const uploadToS3 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('File object:', file); // Debug log
    // Sanitize file name
    const sanitizedFileName = ((_a = file.originalname) === null || _a === void 0 ? void 0 : _a.replace(/[^a-zA-Z0-9.]/g, '_')) || 'default_filename';
    const uniqueFileName = `${(0, uuid_1.v4)()}-${sanitizedFileName}`;
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: uniqueFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        const command = new client_s3_1.PutObjectCommand(uploadParams);
        yield s3Client.send(command);
        console.log('File uploaded successfully:', uniqueFileName);
        return {
            Location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uniqueFileName}`,
            Key: uniqueFileName,
        };
    }
    catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
    }
});
exports.uploadToS3 = uploadToS3;
/**
 * Generate a signed URL for downloading a file from S3
 * @param {string} key - The key of the file in S3
 * @param {number} expiresIn - Expiry time in seconds (default is 3600 seconds / 1 hour)
 * @returns {Promise<string>} - The signed URL
 */
const generateSignedUrl = (key_1, ...args_1) => __awaiter(void 0, [key_1, ...args_1], void 0, function* (key, expiresIn = 3600) {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: key,
    });
    try {
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn });
        console.log('Generated signed URL:', signedUrl);
        return signedUrl;
    }
    catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
});
exports.generateSignedUrl = generateSignedUrl;
