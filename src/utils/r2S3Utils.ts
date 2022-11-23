import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { useCallback } from "react";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Create new S3 client
 */
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
    const command = new ListObjectsV2Command({Bucket: bucket, Prefix: prefix});
    const {Contents} = await client.send(command);

    return Contents;
  }, [getClient]);
}

/**
 * Generate presigned URL for a given S3 object
 */
export function useR2S3GeneratePresignedUrl() {
  const getClient = useR2S3Client();

  return useCallback(async (bucket: string, key: string, expiresIn: number = 3600) => {
    const client = getClient();
    const command = new GetObjectCommand({Bucket: bucket, Key: key});
    return await getSignedUrl(client, command, {expiresIn});
  }, [getClient]);
}
