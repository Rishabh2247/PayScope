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
  width = 40,
  height = 40,
  squares = [60, 60],
  className,
  squaresClassName,
  ...props
}) => {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const [horizontal, vertical] = squares;
  const totalSquares = horizontal * vertical;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const col = Math.floor(x / width);
        const row = Math.floor(y / height);

        if (col >= 0 && col < horizontal && row >= 0 && row < vertical) {
          const index = row * horizontal + col;
          setHoveredSquare(index);
          return;
        }
      }
      setHoveredSquare(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [width, height, horizontal, vertical]);

  const getX = (index: number) => (index % horizontal) * width;
  const getY = (index: number) => Math.floor(index / horizontal) * height;

  return (
    <svg
      ref={containerRef}
      width={width * horizontal}
      height={height * vertical}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full border-none select-none',
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
              'stroke-gray-300/50 stroke-[0.75px] transition-all duration-700 ease-out',
              isHovered
                ? 'fill-[#1F8F68]/25 stroke-[#1F8F68]/70 stroke-1 duration-75'
                : 'fill-transparent',
              squaresClassName
            )}
          />
        );
      })}
    </svg>
  );
};

export default InteractiveGridPattern;
