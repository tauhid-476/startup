"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video" | "pdf";
}

export default function FileUpload({
    onSuccess, onProgress, fileType = "image" 
}: FileUploadProps) {
    
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message);
        setUploading(false);
    };
    
    const handleSuccess = (res: IKUploadResponse) => {
        console.log("Success", res);
        setError(null);
        setUploading(false);
        setUploadProgress(0);
        onSuccess(res);
    };
    
    const handleProgress = (evt: ProgressEvent) => {
        if (evt.lengthComputable) {
            const percentComplete = Math.round((evt.loaded / evt.total) * 100);
            setUploadProgress(percentComplete);
            
            if (onProgress) {
                onProgress(percentComplete);
            }
        }
    };
    
    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
        setUploadProgress(0);
    };
    
    const validateFile = (file: File) => {
        let validTypes: string[] = [];
        let maxSize = 5 * 1024 * 1024; // 5MB default
        
        if (fileType === "image") {
            validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!file.type.startsWith("image/")) {
                setError("Only image files are allowed");
                return false;
            }
        } else if (fileType === "video") {
            validTypes = ["video/mp4", "video/webm", "video/quicktime"];
            if (!file.type.startsWith("video/")) {
                setError("Only video files are allowed");
                return false;
            }
            maxSize = 50 * 1024 * 1024; // 50MB for videos
        } else if (fileType === "pdf") {
            validTypes = ["application/pdf"];
            if (file.type !== "application/pdf") {
                setError("Only PDF files are allowed");
                return false;
            }
            maxSize = 10 * 1024 * 1024; // 10MB for PDFs
        }
        
        if (validTypes.length && !validTypes.includes(file.type)) {
            setError(`Only ${validTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} files are allowed`);
            return false;
        }
        
        if (file.size > maxSize) {
            const sizeMB = maxSize / (1024 * 1024);
            setError(`File size should be less than ${sizeMB}MB`);
            return false;
        }
        
        return true;
    };
    
    // Determine accepted file types for input
    const getAcceptValue = () => {
        switch(fileType) {
            case "image": return "image/*";
            case "video": return "video/*";
            case "pdf": return "application/pdf";
            default: return "image/*";
        }
    };

    return (
        <div className="space-y-2">
            <IKUpload
                fileName={fileType}
                onError={onError}
                onSuccess={handleSuccess}
                onUploadStart={handleStartUpload}
                onUploadProgress={handleProgress}
                accept={getAcceptValue()}
                className="file-input file-input-bordered text-white file-input-secondary w-full"
                validateFile={validateFile}
                useUniqueFileName={true}
                disabled={uploading}
                folder={"/college-projects"}
            />
            
            {uploading && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading... {uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}
            {error && <div className="text-error text-sm">{error}</div>}
        </div>
    );
}