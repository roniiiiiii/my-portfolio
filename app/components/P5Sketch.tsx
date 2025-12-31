"use client";

import { useEffect, useRef } from "react";

export default function DraggableP5Sketch() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    if (typeof window === "undefined") return;

    (async () => {
      try {
        const p5Module = await import("p5");
        const P5 = p5Module.default || p5Module;

        if (!isMounted || !sketchRef.current) return;

        // Remove existing sketch
        if (p5Instance.current) {
          p5Instance.current.remove();
          p5Instance.current = null;
        }

        const sketchWidth = 450;
        const sketchHeight = 600;

        const sketch = (s: any) => {
          let pg: any = null;
          const origWidth = 1350;
          const origHeight = 1800;
          let font: any = null;
          let bufferCreated = false;

          s.preload = () => {
            try {
              // Load Arial Narrow from your public folder
              // Make sure the path is correct!
              font = s.loadFont("/fonts/ArialNarrow.ttf", 
                (success: any) => {
                  console.log("Arial Narrow loaded successfully:", !!success);
                },
                (error: any) => {
                  console.error("Failed to load Arial Narrow:", error);
                  font = null;
                }
              );
            } catch (err) {
              console.error("Error in font preload:", err);
              font = null;
            }
          };

          s.setup = () => {
            try {
              const canvas = s.createCanvas(sketchWidth, sketchHeight);
              canvas.parent(sketchRef.current);
              
              // Create text buffer
              createTextBuffer(s);
            } catch (err) {
              console.error("Error in setup:", err);
            }
          };

          function createTextBuffer(p: any) {