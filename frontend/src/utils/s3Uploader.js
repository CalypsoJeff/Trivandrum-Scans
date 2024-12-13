import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const REGION = import.meta.env.VITE_REGION;
const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME;
const ACCESS_KEY_ID = import.meta.env.VITE_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_SECRET_ACCESS_KEY;
console.log("Region:", REGION);
console.log("Bucket Name:", BUCKET_NAME);
console.log("Access Key:", ACCESS_KEY_ID ? "Loaded" : "Not loaded");
console.log("Secret Key:", SECRET_ACCESS_KEY ? "Loaded" : "Not loaded");

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export const uploadFileToS3 = async (file) => {
  const uniqueFileName = `${uuidv4()}-${file.name.replace(
    /[^a-zA-Z0-9.]/g,
    "_"
  )}`;
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: uniqueFileName,
    Body: file,
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${uniqueFileName}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};
