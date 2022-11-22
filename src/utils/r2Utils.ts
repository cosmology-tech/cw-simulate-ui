import { S3Client } from "@aws-sdk/client-s3";

export function createS3Client() {
  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.REACT_APP_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.REACT_APP_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_R2_SECRET_ACCESS_KEY,
    },
  });
}
