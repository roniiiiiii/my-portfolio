"use client";

import { motion } from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  src: string;
  hoverSrc?: string;
  alt?: string;
  link?: string;
  initialX?: number;
  initialY?: number;
  containerRef?: RefObject<HTMLDivElement>;
  width: number;
  height: number;
};

export default function DraggableImage({
  src,
  hoverSrc,
  alt = "",
  link,
  initialX = 0,
  initialY = 0,
  containerRef,
  width,
  height,
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const router = useRouter();
  const [constraints, setConstraints] = useState<any>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Calculate draggable area
  useEffect(() => {
    if (containerRef?.current && imgRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imgRef.current.getBoundingClientRect();

      setConstraints({
        top: 0,
        left: 0,
        right: containerRect.width - imgRect.width,
        bottom: containerRect.height - imgRect.height,
      });
    }
  }, [containerRef, width, height]);

  // Handle navigation and drag/click logic
  const handleClick = (e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault();
      return;
    }
    if (link) {
      e.preventDefault();
      router.push(link);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={constraints || undefined}
      initial={{ x: initialX, y: initialY }}
      style={{
        position: "absolute",
        cursor: "grab",
        width: `${width}px`,
        height: `${height}px`,
      }}
      whileTap={{ cursor: "grabbing" }}
      onClick={handleClick}
      onDragStart={(event, info) => {
        dragStartPos.current = { x: info.point.x, y: info.point.y };
        setHasDragged(false);
      }}
      onDrag={(event, info) => {
        const distance = Math.sqrt(
          Math.pow(info.point.x - dragStartPos.current.x, 2) +
            Math.pow(info.point.y - dragStartPos.current.y, 2)
        );
        if (distance > 5 && !hasDragged) {
          setHasDragged(true);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
  ref={imgRef}
  src={isHovered ? hoverSrc || src : src}
  alt={alt}
  draggable={false}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "contain", // ✅ keeps proportions!
    objectPosition: "center",
    userSelect: "none",
    pointerEvents: "none",
    transition: "transform 0.25s ease",
  }}
/>

    </motion.div>
  );
}
