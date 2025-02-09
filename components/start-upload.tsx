"use client";

import { Card } from "@/components/ui/card";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { uploadImage } from "@/lib/supabase/images";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StartFromUpload() {
  const { toast } = useToast();
  const router = useRouter();

  const handleUploadImage = async (image: string) => {
    const { url, error } = await uploadImage(image);
    if (error) {
      if (error === "USER_NOT_FOUND") {
        toast({
          title: "You need to sign in first!",
          description: "Please sign in to continue.",
          variant: "destructive",
          action: (
            <ToastAction altText="Goto Sign In">
              <Link href={"/signin"} target="_blank">
                Sign In
              </Link>
            </ToastAction>
          ),
        });
        return;
      } else {
        console.log(error);
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
        return;
      }
    }
    router.push(`/edit?image=${encodeURIComponent(url!)}`);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        await handleUploadImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
  });

  // Handle paste events
  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) onDrop([file]);
          break;
        }
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4" onPaste={handlePaste}>
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"}`}
        >
          <input {...getInputProps()} />

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">
                Drag & drop image here, or click to select
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You can also paste an image from clipboard
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
