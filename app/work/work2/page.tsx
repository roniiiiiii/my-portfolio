"use client";

import { useRef } from "react";
import Link from "next/link";
import DraggableP5Sketch from "./components/DraggableP5Sketch";

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
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* Logo - top left */}
      <div className="logoContainer">
        <Link href="/">
          <img
            src="/logo.png"
            alt="Your Portfolio Logo"
            className="logo"
          />
        </Link>
      </div>

      {/* Text - top right (like in your screenshot) */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "1rem" : "1rem",
          right: isMobile ? "1rem" : "2rem",
          zIndex: 50,
          textAlign: "right",
          fontFamily: "'Parrot-Beta-V9-Regular', Arial, sans-serif",
          fontSize: isMobile ? "0.9rem" : "1rem",
          lineHeight: "1.4",
          color: "#000000",
          maxWidth: isMobile ? "200px" : "300px",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
          Graphic Designer based in Berlin and Vienna
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          Interested in the precision of algorithmic execution—and the distortion of it
        </div>
        <div>
          Available via{" "}
          <a 
            href="mailto:veronikaheckl.work@gmail.com"
            style={{
              color: "#000000",
              textDecoration: "none",
              borderBottom: "1px solid #000000",
            }}
          >
            veronikaheckl.work@gmail.com
          </a>
        </div>
      </div>

      {/* Sketch - centered right */}
      <div
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
      </div>
    </main>
  );
}