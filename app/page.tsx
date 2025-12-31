"use client";

import { useRef } from "react";
import Link from "next/link";
import DraggableP5Sketch from "./components/DraggableP5Sketch";



import InteractiveSpikedText from "./components/InteractiveSpikedText";
import "./globals.css";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <main
      ref={containerRef}
      className="workPage"
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#E8E8E8",
      }}
    >
      {/* Logo - Top Left */}
      <div style={{
        position: "absolute",
        top: "1rem",
        left: "1rem",
        zIndex: 50,
      }}>
        <Link href="/">
          <img
            src="/logo.png"
            alt="Veronika Heckl Logo"
            style={{
              width: "200px",
              height: "auto",
              display: "block",
            }}
          />
        </Link>
      </div>

      {/* Contact Info - Top Right (starting at 68% of page width) */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "68%",
          right: "1rem",
          zIndex: 50,
          textAlign: "left",
          fontFamily: "'Parrot', Arial, sans-serif",
          fontSize: "13px",
          lineHeight: "1.3",
          color: "#0000FF",
        }}
      >
        <div>
          Graphic Designer based in Berlin and Vienna
        </div>
        <div>
          interested in the precision of algorithmic execution
        </div>
        <div>
          and the distortion of it
        </div>
        <div>
          available via{" "}
          <a 
            href="mailto:veronikaheckl.work@gmail.com"
            style={{
              color: "#0000FF",
              textDecoration: "underline",
              wordBreak: "break-all",
            }}
          >
            veronikaheckl.work@gmail.com
          </a>
        </div>
      </div>

      {/* Interactive Spiked Text Sketch - LEFT SIDE */}
      {/* <div
        style={{
          position: "absolute",
          top: "50%",
          left: isMobile ? "5%" : "5%",
          transform: "translateY(-50%)",
          width: "707px",
          height: "1000px",
          zIndex: 40,
        }}
      >
        <InteractiveSpikedText />
      </div> */}

      {/* Array Loops Sketch - RIGHT SIDE */}
      {/* <div
        style={{
          position: "absolute",
          top: "50%",
          right: isMobile ? "5%" : "10%",
          transform: "translateY(-50%)",
          width: isMobile ? "300px" : "450px",
          height: isMobile ? "400px" : "600px",
          zIndex: 40,
        }}
      >
        <DraggableP5Sketch />
      </div> */}
    </main>
  );
}