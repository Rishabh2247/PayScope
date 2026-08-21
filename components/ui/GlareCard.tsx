'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface GlareCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlareCard: React.FC<GlareCardProps> = ({
  children,
  className = '',
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
      className={cn('relative overflow-hidden group', className)}
      {...props}
    >
      {/* Dark Mode Interactive White Glare Overlay Following Mouse Cursor */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0 dark:opacity-100 z-10',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: isHovered
            ? `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.09), transparent 75%)`
            : 'none',
        }}
      />
      {children}
    </div>
  );
};

export default GlareCard;
