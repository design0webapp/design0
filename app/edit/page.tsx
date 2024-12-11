"use client";

import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EditNavbar } from "@/app/edit/navbar";
import { EditCanvas } from "@/app/edit/canvas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BadgeCent, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { editImage } from "@/lib/backend";
import { cn } from "@/lib/utils";

export const maxDuration = 60;

export default function EditPage({
  searchParams,
}: {
  searchParams: {
    image: string;
  };
}) {
  if (!searchParams.image) {
    redirect("/");
  }

  const [widthSize, setWidthSize] = useState<"full" | "mid" | "mini">("full");
  const getContainerWidth = (size: "full" | "mid" | "mini") => {
    switch (size) {
      case "full":
        return "max-w-full";
      case "mid":
        return "w-1/2";
      case "mini":
        return "w-1/3";
    }
  };

  const [polygons, setPolygons] = useState<number[][][]>([]);
  const [prompt, setPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const editedImageRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (editedImage && editedImageRef.current) {
      editedImageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [editedImage]);

  const reset = () => {
    setPolygons([]);
    setPrompt("");
    setEditedImage(null);
  };

  const edit = async () => {
    try {
      setIsEditing(true);
      const { url, error } = await editImage(
        searchParams.image,
        polygons,
        prompt,
      );
      if (error) {
        console.log(error);
        if (error === "user not found") {
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
        }
        if (error === "not enough credits") {
          toast({
            title: "Not enough credits",
            description: "Please recharge credits to continue.",
            variant: "destructive",
            action: (
              <ToastAction altText="Goto Pricing">
                <Link href={"/pricing"} target="_blank">
                  Recharge
                </Link>
              </ToastAction>
            ),
          });
          return;
        }
        toast({
          title: "Failed to edit image",
          description: error,
          variant: "destructive",
        });
        return;
      }
      setEditedImage(url!);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <EditNavbar widthSize={widthSize} setWidthSize={setWidthSize} />
      <div
        className={cn(
          "p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10",
          "flex-1 flex flex-col md:flex-row gap-2 md:gap-4 xl:gap-8",
          "items-center md:items-stretch justify-center",
        )}
      >
        <Card className={cn(getContainerWidth(widthSize), "h-full")}>
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
            <CardDescription>
              Drag and drop areas you want to edit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditCanvas
              sourceImage={searchParams.image}
              polygons={polygons}
              setPolygons={setPolygons}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="p-1 font-semibold line-clamp-1">Edit Prompt</p>
            <Textarea
              placeholder="Describe what you want to draw in the selected area..."
              value={prompt}
              onChange={(event) => {
                event.preventDefault();
                setPrompt(event.currentTarget.value);
              }}
            />
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                onClick={edit}
                disabled={
                  polygons.length === 0 || prompt.trim() === "" || isEditing
                }
                className="w-[10rem]"
              >
                {isEditing ? (
                  "Editing..."
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <span>Edit Image (</span>
                    <BadgeCent className="w-4 h-4" />
                    <span>2 )</span>
                  </div>
                )}
              </Button>
              <Button variant={"outline"} onClick={reset}>
                Reset
              </Button>
            </div>
          </CardFooter>
        </Card>

        {editedImage && (
          <Card className={cn(getContainerWidth(widthSize), "bg-muted h-full")}>
            <CardHeader>
              <CardTitle>Edited Image</CardTitle>
              <CardDescription>
                The edited image will be displayed here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1" ref={editedImageRef}>
              <img
                src={editedImage}
                className="w-full max-w-full"
                alt="edited image"
              />
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        )}
      </div>
      <Dialog open={isEditing}>
        <DialogContent className="sm:max-w-[425px]" hideClose>
          <DialogHeader>
            <DialogTitle>Image Editing</DialogTitle>
            <DialogDescription>Please waiting...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
