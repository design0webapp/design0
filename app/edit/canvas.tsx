"use client";

import React, { useEffect, useRef, useState } from "react";

export function EditCanvas({
  sourceImage,
  polygons,
  setPolygons,
}: {
  sourceImage: string;
  polygons: number[][][];
  setPolygons: (polygons: number[][][]) => void;
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imageRef.current == null) {
      const image = new Image();
      image.src = sourceImage;
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
  }, [sourceImage, polygons]);

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

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      style={{ touchAction: "none" }}
      className="w-full"
    />
  );
}
