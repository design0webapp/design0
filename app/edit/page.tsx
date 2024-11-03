"use client";

import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [polygons, setPolygons] = useState<Path2D[]>([]);
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
      ctx.fill(polygon);
    }
  }, [searchParams.image, polygons]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.x) * scaleX;
    const y = (e.clientY - rect.y) * scaleY;

    const region = new Path2D();
    region.moveTo(x, y);
    setPolygons([...polygons, region]);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.x) * scaleX;
    const y = (e.clientY - rect.y) * scaleY;

    const region = polygons[polygons.length - 1];
    region.lineTo(x, y);
    setPolygons([...polygons.slice(0, polygons.length - 1), region]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (polygons.length > 0) {
      const region = polygons[polygons.length - 1];
      region.closePath();
    }
  };

  const exportMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // create a new mask canvas
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    // draw polygons on mask canvas
    maskCtx.fillStyle = "rgba(255, 255, 255, 1)";
    for (const polygon of polygons) {
      maskCtx.fill(polygon);
    }

    // export as PNG
    const link = document.createElement("a");
    link.download = "mask.png";
    link.href = maskCanvas.toDataURL();
    link.click();
  };

  const resetCanvas = () => {
    setPolygons([]);
  };

  return (
    <div className="px-2 py-10 mx-auto w-[64rem] max-w-full flex flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-black">Edit Image</h1>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="max-w-full max-h-[calc(100vh-10rem)] cursor-crosshair"
      />
      <p className="my-2 text-sm font-semibold line-clamp-1">
        Drag-and-drop to select area you want to edit.
      </p>
      <Button onClick={resetCanvas}>Reset</Button>
      <Button
        className="mt-2"
        onClick={exportMask}
        disabled={polygons.length === 0}
      >
        Export Mask
      </Button>
    </div>
  );
}
