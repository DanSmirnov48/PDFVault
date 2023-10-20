import { deleteS3File } from "@/lib/s3";
import { Trash2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

type Props = { fileKey: string };

export const DeleteFile = ({ fileKey }: Props) => {
  return (
    <Button
      onClick={async () => {
        try {
          await deleteS3File(fileKey);
          toast.success("File Deleted");
        //   await loadFiles();
        } catch (error) {
          console.error("Error deleting file:", error);
          toast.error("Something went wrong");
        }
      }}
    >
      <Trash2 />
    </Button>
  );
};