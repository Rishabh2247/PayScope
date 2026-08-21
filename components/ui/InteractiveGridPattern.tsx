'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

export interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number];
  className?: string;
  squaresClassName?: string;
}

export const InteractiveGridPattern: React.FC<InteractiveGridPatternProps> = ({
  width = 50,
  height = 50,
  squares = [40, 40],
  className,
  squaresClassName,
  ...props
}) => {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const [horizontal, vertical] = squares;
  const totalSquares = horizontal * vertical;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const currentHoverRef = useRef<number | null>(null);

  useEffect(() => {
    // Disable hover tracking on touch/mobile devices to save CPU/GPU overhead
    const isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isPointerFine) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          const col = Math.floor(x / width);
          const row = Math.floor(y / height);

          if (col >= 0 && col < horizontal && row >= 0 && row < vertical) {
            const index = row * horizontal + col;
            if (currentHoverRef.current !== index) {
              currentHoverRef.current = index;
              setHoveredSquare(index);
            }
            return;
          }
        }

        if (currentHoverRef.current !== null) {
          currentHoverRef.current = null;
          setHoveredSquare(null);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [width, height, horizontal, vertical]);

  const getX = (index: number) => (index % horizontal) * width;
  const getY = (index: number) => Math.floor(index / horizontal) * height;

  return (
    <svg
      ref={containerRef}
      width={width * horizontal}
      height={height * vertical}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full border-none select-none opacity-40',
        className
      )}
      {...props}
    >
      {Array.from({ length: totalSquares }).map((_, index) => {
        const isHovered = hoveredSquare === index;
        return (
          <rect
            key={index}
            x={getX(index)}
            y={getY(index)}
            width={width}
            height={height}
            className={cn(
              'transition-colors duration-500 ease-out',
              isHovered
                ? 'fill-[#1F8F68]/25 stroke-[#1F8F68]/70 stroke-1 duration-75'
                : 'fill-transparent stroke-[#12372A]/10 dark:stroke-[#22C55E]/10',
              squaresClassName
            )}
          />
        );
      })}
    </svg>
  );
};

export default InteractiveGridPattern;
