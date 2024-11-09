"use client";

import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { editImage } from "@/lib/backend";

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

  const [isDrawing, setIsDrawing] = useState(false);
  const [polygons, setPolygons] = useState<number[][][]>([]);
  const [prompt, setPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imageRef.current == null) {
      const image = new Image();
      image.src = searchParams.image;
      image.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        // set canvas size same as image
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(image, 0, 0);
      };
      imageRef.current = image;
    }
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // draw image on canvas
    if (!imageRef.current) return;
    const image = imageRef.current;
    ctx.drawImage(image, 0, 0);
    // draw polygons on canvas
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    for (const polygon of polygons) {
      const path = new Path2D();
      path.moveTo(polygon[0][0], polygon[0][1]);
      for (let i = 1; i < polygon.length; i++) {
        path.lineTo(polygon[i][0], polygon[i][1]);
      }
      path.closePath();
      ctx.fill(path);
    }
  }, [searchParams.image, polygons]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x, y;
    if ("touches" in e) {
      x = (e.touches[0].clientX - rect.x) * scaleX;
      y = (e.touches[0].clientY - rect.y) * scaleY;
    } else {
      x = (e.clientX - rect.x) * scaleX;
      y = (e.clientY - rect.y) * scaleY;
    }

    return [x, y];
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    if (!coords) return;
    const newPolygon = [coords];
    setPolygons([...polygons, newPolygon]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    if (!coords) return;
    const lastPolygon = polygons[polygons.length - 1];
    lastPolygon.push(coords);
    setPolygons([...polygons.slice(0, polygons.length - 1), lastPolygon]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const reset = () => {
    setPolygons([]);
    setPrompt("");
  };

  return (
    <div className="px-2 py-10 mx-auto w-[64rem] max-w-full flex flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-black">Edit Image</h1>
      <p className="my-2 text-sm font-semibold line-clamp-1">
        Drag-and-drop to select area you want to edit.
      </p>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="max-w-full max-h-[calc(100vh-20rem)] cursor-crosshair"
      />
      <p className="mt-4 mb-2 text-sm font-semibold line-clamp-1">
        Describe what you want to draw.
      </p>
      <Textarea
        value={prompt}
        onChange={(event) => {
          event.preventDefault();
          setPrompt(event.currentTarget.value);
        }}
        className="w-[30rem] max-w-full"
      />
      <div className="mt-6 flex space-x-2">
        <Button
          onClick={async () => {
            try {
              setIsEditing(true);
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
            polygons.length === 0 ||
            prompt.trim() === "" ||
            isEditing ||
            editedImage !== null
          }
        >
          {isEditing ? "Editing..." : "Edit Image"}
        </Button>
        <Button variant={"outline"} onClick={reset}>
          Reset
        </Button>
      </div>
      {editedImage && (
        <div className="mt-6">
          <div className="mt-6 mb-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="mx-4 text-gray-500 text-sm">Edited Image</div>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <img
            src={editedImage}
            className="w-full max-w-full"
            alt="edited image"
          />
        </div>
      )}
    </div>
  );
}
