import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { FileListProvider } from "@/components/Provider";

import "simplebar-react/dist/simplebar.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDFVault",
  description:
    "Your secure PDF document hub. Manage, access, and collaborate on PDFs effortlessly, ensuring seamless workflow and enhanced productivity in the cloud.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <FileListProvider>
        <body className={inter.className}>{children}</body>
        <Toaster />
      </FileListProvider>
    </html>
  );
}
