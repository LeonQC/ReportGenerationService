import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AppError } from "../utils/appError";
import dotenv from "dotenv";
import { MimeType } from "@prisma/client";

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface S3UploadResult {
  s3Key: string;
  s3Url: string;
}

const getFileExtension = (mimeType: MimeType): string => {
  switch (mimeType) {
    case MimeType.APPLICATION_PDF:
      return "pdf";
    case MimeType.TEXT_CSV:
      return "csv";
    case MimeType.APPLICATION_JSON:
      return "json";
    default:
      return "bin";
  }
};

const getContentType = (mimeType: MimeType): string => {
  switch (mimeType) {
    case MimeType.APPLICATION_PDF:
      return "application/pdf";
    case MimeType.TEXT_CSV:
      return "text/csv";
    case MimeType.APPLICATION_JSON:
      return "application/json";
    default:
      return "application/octet-stream";
  }
};

export const uploadReportToS3 = async (
  reportData: Buffer,
  reportId: string,
  mimeType: MimeType
): Promise<S3UploadResult> => {
  const fileExtension = getFileExtension(mimeType);
  const contentType = getContentType(mimeType);
  const s3Key = `reports/${reportId}.${fileExtension}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: s3Key,
        Body: reportData,
        ContentType: contentType,
      })
    );

    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    return {
      s3Key,
      s3Url,
    };
  } catch (error) {
    console.error("❌ Failed to upload report to S3:", error);
    throw new AppError("Failed to upload report to storage", 500);
  }
};
