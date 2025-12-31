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
              font = s.loadFont(
                "/fonts/ArialNarrow.ttf",
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
            if (bufferCreated) return;

            pg = p.createGraphics(origWidth, origHeight);
            pg.background(255);
            pg.fill(0);
            pg.textFont(font || p.createFont("Arial", 32));
            pg.textSize(32);
            pg.textAlign(p.CENTER, p.CENTER);
            pg.text("Hello P5!", origWidth / 2, origHeight / 2);

            bufferCreated = true;
          }

          s.draw = () => {
            if (pg) {
              s.image(pg, 0, 0, sketchWidth, sketchHeight);
            }
          };
        };

        p5Instance.current = new P5(sketch, sketchRef.current);
      } catch (err) {
        console.error("Error initializing P5:", err);
      }
    })();

    return () => {
      isMounted = false;
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, []);

  return <div ref={sketchRef} style={{ width: "100%", height: "100%" }} />;
}
