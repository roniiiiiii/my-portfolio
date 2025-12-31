"use client";

import { useEffect, useRef, useState } from "react";

export default function InteractiveSpikedText() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 707, height: 1000 });

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

    // Load opentype.js from CDN
    const loadOpenType = () => {
      return new Promise((resolve, reject) => {
        if ((window as any).opentype) {
          resolve((window as any).opentype);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js';
        script.onload = () => resolve((window as any).opentype);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    (async () => {
      try {
        const p5Module = await import("p5");
        const P5 = p5Module.default || p5Module;

        // Load opentype library from CDN
        const opentype = await loadOpenType();

        if (!isMounted || !sketchRef.current) return;

        if (p5Instance.current) {
          p5Instance.current.remove();
          p5Instance.current = null;
        }

        const sketch = (s: any) => {
          let font: any;
          let msg = "Re \n fusal \n is a \n Begin \n ning";
          let size = 230;
          let paths: any[] = [];
          let bgColor: any, fgColor: any;
          let baseZigzagAmount = 18;
          let outlineZigzagAmount = 8;
          let outlineOffset = 4;

          let outlineLayers = [
            { offset: 35, zigzag: 18, gapBefore: 15 },
            { offset: 70, zigzag: 18, gapBefore: 20 },
            { offset: 110, zigzag: 18, gapBefore: 25 },
            { offset: 155, zigzag: 18, gapBefore: 30 },
            { offset: 205, zigzag: 18, gapBefore: 35 },
            { offset: 260, zigzag: 18, gapBefore: 40 },
            { offset: 320, zigzag: 18, gapBefore: 45 },
            { offset: 385, zigzag: 18, gapBefore: 50 },
            { offset: 455, zigzag: 18, gapBefore: 55 },
            { offset: 530, zigzag: 18, gapBefore: 60 }
          ];

          let lineAlignments = ['left', 'right', 'left', 'right'];
          let mainTextMargin = 60;

          let manualPositions = [
            [70, 270],
            [120, 460],
            [20, 610],
            [110, 800],
            [210, 990]
          ];

          let minZigzag = 2;
          let maxZigzag = 25;
          let influenceRadius = 200;

          s.setup = () => {
            const canvas = s.createCanvas(707, 1000);
            canvas.parent(sketchRef.current);
            
            bgColor = s.color(180, 170, 160);
            fgColor = s.color(40, 30, 25);

            // Try to load custom font, fallback to system font
            fetch('/fonts/Parrot-Beta-V9-Regular.otf')
              .then(response => response.arrayBuffer())
              .then(buffer => {
                font = opentype.parse(buffer);
                processText();
              })
              .catch(() => {
                // Fallback: use system font
                console.log('Using fallback rendering');
                font = null;
              });
          };

          function processText() {
            if (!font) return;
            
            paths = [];
            let lines = msg.split('\n');
            let totalHeight = lines.length * size * 0.6;
            let startY = (1000 - totalHeight) / 2 + 90;

            for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
              let line = lines[lineIdx];
              let fontPath = font.getPath(line, 0, 0, size);
              let textBounds = fontPath.getBoundingBox();
              let textWidth = textBounds.x2 - textBounds.x1;

              let x, y;

              if (manualPositions[lineIdx] !== null) {
                x = manualPositions[lineIdx][0];
                y = manualPositions[lineIdx][1];
              } else {
                let alignment = lineAlignments[lineIdx % lineAlignments.length];
                if (alignment === 'left') x = mainTextMargin;
                else if (alignment === 'right') x = 707 - mainTextMargin - textWidth - 70;
                else x = 707 / 2 - textWidth / 2;

                y = startY + lineIdx * size * 0.7;
              }

              let pathData = {
                commands: fontPath.commands,
                offsetX: x,
                offsetY: y,
                originalPoints: commandsToPoints(fontPath.commands)
              };

              paths.push(pathData);
            }
          }

          function commandsToPoints(commands: any[]) {
            let allShapes: any[] = [];
            let currentShape: any[] = [];
            let shapeStartPoint: any = null;

            for (let cmd of commands) {
              if (cmd.type === 'M') {
                if (currentShape.length > 0) allShapes.push(subdivideShape(currentShape));
                currentShape = [];
                currentShape.push({ x: cmd.x, y: cmd.y });
                shapeStartPoint = { x: cmd.x, y: cmd.y };
              } else if (cmd.type === 'L') {
                let prev = currentShape[currentShape.length - 1];
                let distance = s.dist(prev.x, prev.y, cmd.x, cmd.y);
                let numPoints = s.max(s.floor(distance / 4), 2);
                for (let j = 1; j <= numPoints; j++) {
                  let t = j / numPoints;
                  currentShape.push({ x: s.lerp(prev.x, cmd.x, t), y: s.lerp(prev.y, cmd.y, t) });
                }
              } else if (cmd.type === 'C') {
                let prev = currentShape[currentShape.length - 1];
                let approxLen = s.dist(prev.x, prev.y, cmd.x1, cmd.y1) + 
                               s.dist(cmd.x1, cmd.y1, cmd.x2, cmd.y2) + 
                               s.dist(cmd.x2, cmd.y2, cmd.x, cmd.y);
                let numPoints = s.max(s.floor(approxLen / 4), 5);
                for (let j = 1; j <= numPoints; j++) {
                  let t = j / numPoints;
                  currentShape.push({
                    x: bezierPoint(prev.x, cmd.x1, cmd.x2, cmd.x, t),
                    y: bezierPoint(prev.y, cmd.y1, cmd.y2, cmd.y, t)
                  });
                }
              } else if (cmd.type === 'Q') {
                let prev = currentShape[currentShape.length - 1];
                let approxLen = s.dist(prev.x, prev.y, cmd.x1, cmd.y1) + 
                               s.dist(cmd.x1, cmd.y1, cmd.x, cmd.y);
                let numPoints = s.max(s.floor(approxLen / 4), 5);
                for (let j = 1; j <= numPoints; j++) {
                  let t = j / numPoints;
                  currentShape.push({
                    x: quadraticPoint(prev.x, cmd.x1, cmd.x, t),
                    y: quadraticPoint(prev.y, cmd.y1, cmd.y, t)
                  });
                }
              } else if (cmd.type === 'Z') {
                if (shapeStartPoint) currentShape.push({ ...shapeStartPoint });
              }
            }

            if (currentShape.length > 0) allShapes.push(subdivideShape(currentShape));
            return allShapes;
          }

          function subdivideShape(shape: any[]) {
            let subdivided: any[] = [];
            for (let i = 0; i < shape.length - 1; i++) {
              let p1 = shape[i], p2 = shape[i + 1];
              subdivided.push({ ...p1 });
              let distance = s.dist(p1.x, p1.y, p2.x, p2.y);
              if (distance > 6) {
                let numPoints = s.floor(distance / 4);
                for (let j = 1; j < numPoints; j++) {
                  let t = j / numPoints;
                  subdivided.push({ x: s.lerp(p1.x, p2.x, t), y: s.lerp(p1.y, p2.y, t) });
                }
              }
            }
            subdivided.push({ ...shape[shape.length - 1] });
            return subdivided;
          }

          function bezierPoint(a: number, b: number, c: number, d: number, t: number) {
            let t1 = 1 - t;
            return t1*t1*t1*a + 3*t1*t1*t*b + 3*t1*t*t*c + t*t*t*d;
          }

          function quadraticPoint(a: number, b: number, c: number, t: number) {
            let t1 = 1 - t;
            return t1*t1*a + 2*t1*t*b + t*t*c;
          }

          s.draw = () => {
            s.background(bgColor);
            
            if (paths.length > 0) {
              drawCutOutLetters();
            }
          };

          function drawCutOutLetters() {
            s.fill(bgColor);
            s.noStroke();
            s.rect(0, 0, 707, 1000);

            // Draw all outline layers from back to front
            for (let i = outlineLayers.length - 1; i >= 0; i--) {
              let layer = outlineLayers[i];
              
              s.fill(fgColor);
              s.noStroke();
              for (let path of paths) {
                drawOffsetShape(path, layer.offset, layer.zigzag);
              }
              
              if (layer.gapBefore > 0) {
                s.fill(bgColor);
                s.noStroke();
                for (let path of paths) {
                  drawOffsetShape(path, layer.offset - layer.gapBefore, 2);
                }
              }
            }

            // Outer outline
            s.fill(fgColor);
            s.noStroke();
            for (let path of paths) {
              drawOffsetShape(path, outlineOffset, baseZigzagAmount * 0.4);
            }

            // Inner text with zigzag
            s.fill(fgColor);
            s.noStroke();
            for (let path of paths) {
              drawOffsetShape(path, baseZigzagAmount, baseZigzagAmount, true);
            }
          }

          function drawOffsetShape(path: any, offsetDist: number, zigzagAmt: number, useOriginal = false) {
            if (!path.originalPoints || path.originalPoints.length === 0) return;

            s.beginShape();
            for (let shapeIdx = 0; shapeIdx < path.originalPoints.length; shapeIdx++) {
              let shape = path.originalPoints[shapeIdx];
              if (shape.length < 3) continue;
              if (shapeIdx > 0) s.beginContour();

              for (let i = 0; i < shape.length; i++) {
                let p = shape[i];
                let nextP = (i < shape.length - 1) ? shape[i + 1] : shape[0];

                let dx = nextP.x - p.x;
                let dy = nextP.y - p.y;
                let len = s.sqrt(dx * dx + dy * dy);
                let finalX = p.x + path.offsetX;
                let finalY = p.y + path.offsetY;

                if (!useOriginal && len > 0) {
                  let perpX = -dy / len;
                  let perpY = dx / len;
                  let zigzagDir = (i % 2 === 0) ? 1 : -1;
                  
                  // Calculate distance from this point to mouse
                  let pointDist = s.dist(s.mouseX, s.mouseY, finalX, finalY);
                  let localZigzag = zigzagAmt;
                  
                  // Apply localized spike effect based on distance to mouse
                  if (pointDist < influenceRadius) {
                    let influence = 1 - (pointDist / influenceRadius);
                    influence = s.pow(influence, 1.5);
                    localZigzag = s.lerp(zigzagAmt, zigzagAmt + maxZigzag, influence);
                  }
                  
                  finalX += perpX * (offsetDist + localZigzag * zigzagDir);
                  finalY += perpY * (offsetDist + localZigzag * zigzagDir);
                }

                s.vertex(finalX, finalY);
              }

              if (shapeIdx > 0) s.endContour();
            }
            s.endShape(s.CLOSE);
          }

          s.windowResized = () => {
            // Keep original dimensions, don't resize
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
        }} 
      />
    </div>
  );
}