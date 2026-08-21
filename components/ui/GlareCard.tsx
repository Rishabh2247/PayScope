'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface GlareCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  glareSize?: number;
}

export const GlareCard: React.FC<GlareCardProps> = ({
  children,
  className = '',
  glareColor = 'rgba(255, 255, 255, 0.085)',
  glareSize = 400,
  style,
  ...props
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn('relative overflow-hidden rounded-3xl group border border-[#BFE5D3] dark:border-[#26302A]', className)}
      style={{
        transform: 'translateZ(0)',
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        ...style,
      }}
      {...props}
    >
      {/* Dark Mode Interactive Light White Glare Overlay - Strictly Clipped to Card Radius */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-0',
          isHovered ? 'opacity-0 dark:opacity-100' : 'opacity-0'
        )}
        style={{
          background: isHovered
            ? `radial-gradient(${glareSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${glareColor}, transparent 70%)`
            : 'none',
        }}
      />
      {children}
    </div>
  );
};

export default GlareCard;
