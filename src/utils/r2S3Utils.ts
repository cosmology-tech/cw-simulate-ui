import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { useCallback } from "react";

export function useR2S3Client() {
  return useCallback(() => {
    return new S3Client({
      region: "auto",
      endpoint: `https://${process.env.REACT_APP_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.REACT_APP_R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.REACT_APP_R2_SECRET_ACCESS_KEY as string,
      },
    });
  }, []);
}

export function useR2S3ListObjects() {
  const getClient = useR2S3Client();

  return useCallback(async (bucket: string, prefix: string) => {
    const client = getClient();
    const command = new ListObjectsCommand({Bucket: bucket, Prefix: prefix});
    const {Contents} = await client.send(command);

    return Contents;
  }, [getClient]);
}
