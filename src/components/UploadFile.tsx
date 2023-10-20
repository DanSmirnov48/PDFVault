"use client";
import React, { useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Inbox } from "lucide-react";
import { uploadToS3 } from "@/lib/s3";
import toast from "react-hot-toast";
import { useFileList } from "@/components/Provider";
import { Progress } from "@/components/ui/progress";

export const UploadFile = () => {
  const { addFile, fileList } = useFileList();
  const [progress, setProgress] = useState<number>(0);

  function handleProgress(percentage: number) {
    setProgress(percentage);
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        toast.error("Invalid file type");
        return;
      }

      if (fileList.length >= 3) {
        toast.error("You have reached the file limit of 3!");
        return;
      }

      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too Large");
        return;
      }

      await uploadToS3(file, handleProgress)
        .then((data) => {
          addFile({ key: data!.file_key, name: data!.file_name });
          toast.success("File Uploaded Successfully");
          setProgress(0);
        })
        .catch((error) => {
          console.error("Upload error:", error);
          toast.error("Something went wrong");
          setProgress(0);
        });
    },
  });

  return (
    <>
      <div className="p-2 bg-white rounded-xl">
        <div
          {...getRootProps({
            className:
              "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
          })}
        >
          <input {...getInputProps()} />
          <Inbox className="w-10 h-10 text-blue-500" />
          <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
        </div>
      </div>
      <div className="mt-2 text-sm text-slate-400">
        {progress > 0 && <Progress value={progress} />}
      </div>
    </>
  );
};
