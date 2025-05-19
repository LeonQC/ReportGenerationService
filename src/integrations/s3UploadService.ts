import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AppError } from "../utils/appError";
import dotenv from "dotenv";

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadReportToS3 = async (
  pdfReport: Buffer,
  reportId?: string
): Promise<string> => {
  if (!reportId) {
    throw new AppError("reportId is required for S3 upload", 400);
  }
  const s3Key = `reports/${reportId}.pdf`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: s3Key,
        Body: pdfReport,
        ContentType: "application/pdf",
      })
    );

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
  } catch (error) {
    console.error("❌ Failed to upload report to S3:", error);
    throw new AppError("Failed to upload report to storage", 500);
  }
};
