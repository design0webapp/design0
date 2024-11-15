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
import { Loader2 } from "lucide-react";
import { editImage } from "@/lib/backend";

export const maxDuration = 60;

export default function EditPage({
  searchParams,
}: {
  searchParams: {
    image: string;
  };
}) {
  if (searchParams.image == undefined) {
    redirect("/");
  }

  const [polygons, setPolygons] = useState<number[][][]>([]);
  const [prompt, setPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const editedImageRef = useRef<HTMLDivElement>(null);

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
  };

  return (
    <main className="min-h-screen flex flex-col">
      <EditNavbar />
      <div className="p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 flex-1 flex flex-col lg:flex-row gap-2 md:gap-4 xl:gap-8 items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
            <CardDescription>
              Drag and drop areas you want to edit.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
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
            <div className="mt-6 flex space-x-2">
              <Button
                onClick={async () => {
                  try {
                    setIsEditing(true);
                    setEditedImage(null);
                    const resp = await editImage(
                      searchParams.image,
                      polygons,
                      prompt,
                    );
                    setEditedImage(resp.url);
                    // await new Promise((resolve) => setTimeout(resolve, 6000));
                    // setEditedImage(searchParams.image);
                  } finally {
                    setIsEditing(false);
                  }
                }}
                disabled={
                  polygons.length === 0 || prompt.trim() === "" || isEditing
                }
              >
                {isEditing ? "Editing..." : "Edit Image"}
              </Button>
              <Button variant={"outline"} onClick={reset}>
                Reset
              </Button>
            </div>
          </CardFooter>
        </Card>

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

        {editedImage && (
          <Card className="bg-muted">
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
    </main>
  );
}
