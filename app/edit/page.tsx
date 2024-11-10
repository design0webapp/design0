"use client";

import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { editImage } from "@/lib/backend";
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
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
  const showEditedCard: boolean = isEditing || editedImage != null;
  const editedCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showEditedCard && editedCardRef.current) {
      editedCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showEditedCard]);

  const reset = () => {
    setPolygons([]);
    setPrompt("");
  };

  return (
    <>
      <EditNavbar />
      <div
        className={cn(
          "p-2 lg:p-10 grid grid-cols-1 gap-4",
          showEditedCard ? "lg:grid-cols-2" : "lg:grid-cols-1",
        )}
      >
        <Card
          className={cn(
            "flex flex-col w-full",
            showEditedCard ? "" : "lg:w-1/2 mx-auto",
          )}
        >
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

        {showEditedCard && (
          <Card className="flex flex-col" ref={editedCardRef}>
            <CardHeader>
              <CardTitle>Edited Image</CardTitle>
              <CardDescription>
                The edited image will be displayed here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {editedImage ? (
                <img
                  src={editedImage}
                  className="w-full max-w-full"
                  alt="edited image"
                />
              ) : (
                <Skeleton className="h-full min-h-48" />
              )}
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        )}
      </div>
    </>
  );
}
