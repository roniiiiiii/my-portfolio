"use client";

import { useEffect, useRef, useState } from "react";
import opentype from "opentype.js";
import type { Font } from "opentype.js";


interface InteractiveSpikedTextProps {
  text?: string;
}

export default function InteractiveSpikedText({ text = "Hello World" }: InteractiveSpikedTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    // Load the font
    fetch("/fonts/Parrot-Beta-V9-Regular.otf")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        try {
          const parsedFont: Font = opentype.parse(buffer);
          setFont(parsedFont);
          processText(parsedFont);
        } catch (error) {
          console.error("Error parsing font:", error);
        }
      })
      .catch((err) => {
        console.error("Failed to load font:", err);
      });
  }, []);

  const processText = (loadedFont: Font) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Example drawing logic
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "48px Parrot, sans-serif";
    ctx.fillText(text, 50, 100);

    // If you need to do path operations with opentype
    const path = loadedFont.getPath(text, 50, 150, 48);
    path.draw(ctx);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ display: "block" }}
    />
  );
}
