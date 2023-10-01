"use client";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Inbox, Loader2 } from "lucide-react";
import { countS3Files, uploadToS3 } from "@/lib/s3";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useFileList } from "@/components/Provider";

const FileUpload = () => {
  const { fileList, addFile } = useFileList();
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFile) => {
      const file = acceptedFile[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too Large");
        return;
      }

      const data = await uploadToS3(file);
      if (!data?.file_key || !data?.file_name) {
        toast.error("Something went wrong");
        return;
      }
      addFile({ key: data.file_key, name: data.file_name });
      toast.success("File Uploaded Successfully");
    },
  });

  return (
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
  );
};

export default FileUpload;
