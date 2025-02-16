"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

export default function FileUpload({
    onSuccess, onProgress, fileType = "image"
}: FileUploadProps) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message);
        setUploading(false);
    };

    const handleSuccess = (res: IKUploadResponse) => {
        console.log("Success", res);
        setError(null);
        setUploading(false);
        onSuccess(res)
    };

    const handleProgress = (evt: ProgressEvent) => {
        if (evt.lengthComputable && onProgress) {
            const percentComplete = Math.round((evt.loaded / evt.total) * 100);
            onProgress(percentComplete);
        }
    };

    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
    };

    const validateFile = (file: File) => {

        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            setError("Only JPEG, PNG and WEBP files are allowed");
            return false;
        }
        if (!file.type.startsWith("image/")) {
            setError("Only image files are allowed");
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("File size should be less than 5MB");
            return false;
        }

        return true;
    }


    return (
        <div className="space-y-2">
            <IKUpload
                    fileName="image"
                    onError={onError}
                    onSuccess={handleSuccess}
                    onUploadStart={handleStartUpload}
                    onUploadProgress={handleProgress}
                    accept={fileType === "image" ? "image/*" : "video/*"}
                    className="file-input file-input-bordered text-white file-input-secondary w-full"
                    validateFile={validateFile}
                    useUniqueFileName={true}
                    folder={"/college-projects"}
                /> 
            {
                uploading &&
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                </div>
            }
            {error && <div className="text-error text-sm">{error}</div>}
        </div>
    )

}
