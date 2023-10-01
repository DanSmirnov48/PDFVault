import FileUpload from "@/components/FileUpload";
import ViewS3Files from "@/components/ViewS3Files";
import { Button } from "@/components/ui/button";
import { viewS3Files } from "@/lib/s3";

export default function Home() {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            {/* <h1 className="text-5xl font-semibold">PDFVault</h1> */}
            <h1 className="animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black">
              PDFVault
            </h1>
          </div>

          <p className="max-w-2xl mt-1 text-lg text-slate-600">
            PDFVault - Your secure PDF document hub. Manage, access, and
            collaborate on PDFs effortlessly, ensuring seamless workflow and
            enhanced productivity in the cloud.
          </p>

          <div className="w-full mt-4 max-w-3xl">{<FileUpload />}</div>

          <div className="w-full mt-4">{<ViewS3Files />}</div>
        </div>
      </div>
    </div>
  );
}
