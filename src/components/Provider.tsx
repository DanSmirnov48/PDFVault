"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { viewS3Files } from "@/lib/s3";

interface File {
  key: string;
  name: string;
}

interface FileListContextType {
  fileList: File[];
  addFile: (file: File) => void;
  loadFiles: () => Promise<void>;
}

const FileListContext = createContext<FileListContextType | undefined>(
  undefined
);

export function useFileList(): FileListContextType {
  const context = useContext(FileListContext);
  if (context === undefined) {
    throw new Error("useFileList must be used within a FileListProvider");
  }
  return context;
}

interface FileListProviderProps {
  children: ReactNode;
}

export function FileListProvider({
  children,
}: FileListProviderProps): JSX.Element {
  const [fileList, setFileList] = useState<File[]>([]);

  const addFile = (file: File) => {
    setFileList((prevFileList) => [...prevFileList, file]);
  };

  const loadFiles = async () => {
    try {
      const files = await viewS3Files();
      setFileList(files.map((file) => ({ key: file, name: file })));
    } catch (error) {
      console.error("Error loading files from S3:", error);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <FileListContext.Provider value={{ fileList, addFile, loadFiles }}>
      {children}
    </FileListContext.Provider>
  );
}
