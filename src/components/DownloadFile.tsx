import React from "react";
import { getS3Url } from "@/lib/s3";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

interface FileDownloadButtonProps {
  fileKey: string;
  fileName: string;
}

export const FileDownloadButton: React.FC<FileDownloadButtonProps> = ({
  fileKey,
  fileName,
}) => {
  const s3Bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  const s3ObjectKey = `uploads/${fileKey}`;

  const s3ObjectUrl = `https://${s3Bucket}.s3.amazonaws.com/${s3ObjectKey}`;

  return (
    <a href={s3ObjectUrl} download={fileName}>
      <Button>
        <Download />
      </Button>
    </a>
  );
};
