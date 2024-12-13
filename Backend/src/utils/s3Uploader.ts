import dotenv from 'dotenv';
dotenv.config();
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_BUCKET_NAME) {
  throw new Error('Missing AWS configuration in .env file');
}

// Initialize the S3 client
const s3Client = new S3Client({
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
export const uploadToS3 = async (file: { buffer: Buffer; originalname: string; mimetype: string }): Promise<{ Location: string; Key: string }> => {
  console.log('File object:', file); // Debug log

  // Sanitize file name
  const sanitizedFileName = file.originalname?.replace(/[^a-zA-Z0-9.]/g, '_') || 'default_filename';
  const uniqueFileName = `${uuidv4()}-${sanitizedFileName}`;

  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: uniqueFileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    console.log('File uploaded successfully:', uniqueFileName);

    return {
      Location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uniqueFileName}`,
      Key: uniqueFileName,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

/**
 * Generate a signed URL for downloading a file from S3
 * @param {string} key - The key of the file in S3
 * @param {number} expiresIn - Expiry time in seconds (default is 3600 seconds / 1 hour)
 * @returns {Promise<string>} - The signed URL
 */
export const generateSignedUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    console.log('Generated signed URL:', signedUrl);
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
};
