"use client";
import { viewS3Files, deleteS3File, countS3Files } from "@/lib/s3";
import React, { useEffect, useState } from "react";
import { Inbox, Loader2, File, Trash2, Download } from "lucide-react";
import { useFileList } from "@/components/Provider";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { FileDownloadButton } from "@/components/DownloadFile";

const ViewS3Files = () => {
  const { fileList, loadFiles } = useFileList();
  const [isLoading, setIsLoading] = useState(true);

  const extractFileName = (key: string) => {
    const parts = key.split(/\d+/);
    return parts.filter((part) => part.trim() !== "").pop() || key;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadFiles();
      } catch (error) {
        console.error("Error loading files:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [loadFiles]);

  return (
    <div className="flex flex-col items-center text-center">
      {isLoading ? (
        <>
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="mt-2 text-sm text-slate-400">Loading your files...</p>
        </>
      ) : fileList.length === 0 ? (
        <h1 className="mt-4 text-lg text-black">List is empty</h1>
      ) : (
        <div className="mt-7">
          {/* <h1 className="mt-4 text-lg text-black">My Files</h1> */}
          <ul className="flex flex-col">
            {fileList.map((file, index) => (
              <li
                className="flex items-center justify-between py-3 px-12 text-sm font-medium odd:bg-gray-100 bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:odd:bg-slate-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                key={index}
              >
                <span>{extractFileName(file.name)}</span>
                <div className="space-x-2 ml-6">
                  <Button
                    onClick={async () => {
                      try {
                        await deleteS3File(file.key);
                        toast.success("File Deleted");
                        await loadFiles();
                      } catch (error) {
                        console.error("Error deleting file:", error);
                        toast.error("Something went wrong");
                      }
                    }}
                  >
                    <Trash2 />
                  </Button>
                  <FileDownloadButton fileKey={file.key} fileName={file.name} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewS3Files;
