'use client';

import React, { useRef, useCallback } from 'react';
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
  glareColor = 'rgba(255, 255, 255, 0.09)',
  glareSize = 400,
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glareRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    glareRef.current.style.setProperty('--glare-x', `${x}px`);
    glareRef.current.style.setProperty('--glare-y', `${y}px`);
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    updatePosition(e);
    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
    }
  }, [updatePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    updatePosition(e);
    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
    }
  }, [updatePosition]);

  const handleMouseLeave = useCallback(() => {
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={cn('relative overflow-hidden rounded-3xl group border border-[#BFE5D3] dark:border-[#26302A]', className)}
      style={{
        transform: 'translateZ(0)',
        clipPath: 'inset(0px round 1.5rem)',
        WebkitClipPath: 'inset(0px round 1.5rem)',
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        isolation: 'isolate',
        ...style,
      }}
      {...props}
    >
      {/* Dark Mode Interactive Light White Glare Overlay - Hardware-Accelerated Instant Tracking */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 opacity-0 dark:opacity-100 z-0 select-none overflow-hidden"
        style={{
          transform: 'translateZ(0)',
          clipPath: 'inset(0px round 1.5rem)',
          WebkitClipPath: 'inset(0px round 1.5rem)',
          background: `radial-gradient(${glareSize}px circle at var(--glare-x, 50%) var(--glare-y, 50%), ${glareColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
};

export default GlareCard;
