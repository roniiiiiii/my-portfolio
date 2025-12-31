"use client";

import { useEffect, useRef, useState } from "react";

export default function DraggableP5Sketch() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 450, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        setDimensions({
          width: containerWidth,
          height: containerHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (typeof window === "undefined") return;

    (async () => {
      try {
        const p5Module = await import("p5");
        const P5 = p5Module.default || p5Module;

        if (!isMounted || !sketchRef.current) return;

        if (p5Instance.current) {
          p5Instance.current.remove();
          p5Instance.current = null;
        }

        const sketch = (s: any) => {
          let pg: any = null;
          const origWidth = 1350;
          const origHeight = 1800;
          
          // Create canvas at HIGHER resolution (2x for retina displays)
          const pixelRatio = window.devicePixelRatio || 1;
          const renderWidth = dimensions.width * pixelRatio;
          const renderHeight = dimensions.height * pixelRatio;

          s.setup = () => {
            // Create high-res canvas
            const canvas = s.createCanvas(renderWidth, renderHeight);
            canvas.parent(sketchRef.current);
            
            // Scale canvas down with CSS for crisp rendering
            canvas.elt.style.width = `${dimensions.width}px`;
            canvas.elt.style.height = `${dimensions.height}px`;
            
            // Create graphics buffer
            pg = s.createGraphics(origWidth, origHeight);
            pg.pixelDensity(1);
            pg.background(255);
            pg.fill(0);
            pg.textAlign(s.CENTER, s.CENTER);
            pg.textSize(450);
            pg.textFont('Arial Narrow');
            
            pg.text('ARRAY', origWidth / 2, 300);
            pg.text('LOOPS', origWidth / 2, 710);
            pg.text('ARRAY', origWidth / 2, 1130);
            pg.text('LOOPS', origWidth / 2, 1550);
            
            pg.loadPixels();
          };

          s.draw = () => {
            if (!pg || !pg.pixels) return;

            s.background(40, 250, 140);
            const t = s.frameCount * 0.02;
            let x = 0;

            // Scale factor for high-res canvas
            const scaleX = s.width / origWidth;
            const scaleY = s.height / origHeight;

            while (x < origWidth) {
              const colWidth = 22;
              const drift = 12 * s.sin(t + x * 0.01);
              let y = 0;

              while (y < origHeight) {
                const segment = getVerticalSegment(x, y, colWidth);
                const h = segment.h;

                // Scale to high-res canvas
                const displayX = x * scaleX;
                const displayY = y * scaleY;
                const displayWidth = colWidth * scaleX;
                const displayHeight = h * scaleY;
                const displayDrift = drift * scaleX;

                // Draw rectangle
                s.fill(40, 250, 140);
                s.noStroke();
                s.rect(displayX + displayDrift, displayY, displayWidth, displayHeight);

                // Draw ellipse
                drawVerticalPulseEllipse(
                  displayX + displayDrift, 
                  displayY, 
                  displayWidth, 
                  displayHeight, 
                  t, 
                  x
                );

                y += h;
              }

              x += colWidth;
            }

            function drawVerticalPulseEllipse(x: number, y: number, w: number, h: number, t: number, originalX: number) {
              const cx = x + w / 2;
              const cy = y + h / 2;
              const pulse = 0.7 + 0.6 * s.sin(t + originalX * 0.015);
              
              let ew = w * 0.85;
              let eh = h * (0.4 + 0.7 * pulse);
              eh = s.min(eh, h * 0.95);

              s.noStroke();
              
              const g1 = s.min(eh * 1.8, h * 0.95);
              const g2 = s.min(eh * 1.4, h * 0.95);
              const g3 = s.min(eh * 1.0, h * 0.95);
              const g4 = s.min(eh * 0.6, h * 0.95);

              s.fill(115, 200, 100);
              s.ellipse(cx, cy, ew, g1);

              s.fill(205, 150, 510);
              s.ellipse(cx, cy, ew, g2);

              s.fill(255, 110, 50);
              s.ellipse(cx, cy, ew, g3);

              s.fill(205, 130, 50);
              s.ellipse(cx, cy, ew * 0.6, g4);
            }

            function getVerticalSegment(x: number, y: number, colWidth: number) {
              let inside = isText(x + colWidth / 2, y);
              let h = 1;
              
              if (inside) {
                while (y + h < origHeight && isText(x + colWidth / 2, y + h)) {
                  h++;
                }
              } else {
                while (y + h < origHeight && !isText(x + colWidth / 2, y + h)) {
                  h++;
                }
              }
              return { h };
            }

            function isText(px: number, py: number) {
              if (px < 0 || px >= origWidth || py < 0 || py >= origHeight) {
                return false;
              }
              
              const idx = (s.floor(py) * origWidth + s.floor(px)) * 4;
              return pg.pixels[idx] < 128;
            }
          };
          
          s.windowResized = () => {
            if (s.canvas) {
              const pixelRatio = window.devicePixelRatio || 1;
              const newRenderWidth = dimensions.width * pixelRatio;
              const newRenderHeight = dimensions.height * pixelRatio;
              
              s.resizeCanvas(newRenderWidth, newRenderHeight);
              s.canvas.elt.style.width = `${dimensions.width}px`;
              s.canvas.elt.style.height = `${dimensions.height}px`;
            }
          };
        };

        p5Instance.current = new P5(sketch);
        
      } catch (err) {
        console.error("Error:", err);
      }
    })();

    return () => {
      isMounted = false;
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [dimensions]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: "100%", 
        height: "100%",
        position: "relative" 
      }}
    >
      <div 
        ref={sketchRef} 
        style={{ 
          width: "100%", 
          height: "100%",
          // Optional: Add subtle smoothing
          imageRendering: "crisp-edges"
        }} 
      />
    </div>
  );
}