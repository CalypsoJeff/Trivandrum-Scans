import dotenv from 'dotenv';
dotenv.config();
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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

const s3Client = new S3Client({
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


export const uploadToS3 = async (
  file: { buffer: Buffer; originalname: string; mimetype: string },
  generateSignedUrl = false // Optional parameter for signed URL
): Promise<{ Location: string }> => {
  console.log('File object:', file);

  const sanitizedFileName = file.originalname?.replace(/[^a-zA-Z0-9.]/g, '_') || 'default_filename';
  const uniqueFileName = `${uuidv4()}-${sanitizedFileName}`;

  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: uniqueFileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    // Upload the file to S3
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    console.log('File uploaded successfully');

    // Return Signed URL if required
    if (generateSignedUrl) {
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1-hour expiry
      return { Location: signedUrl };
    }

    // Return standard S3 object URL
    const fileUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uniqueFileName}`;
    return { Location: fileUrl };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};
