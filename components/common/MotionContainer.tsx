'use client';

import React from 'react';
import { motion } from 'motion/react';

interface MotionContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  type?: 'fadeIn' | 'scaleUp' | 'slideUp';
}

export const MotionContainer: React.FC<MotionContainerProps> = ({
  children,
  className = '',
  delay = 0,
  type = 'fadeIn',
}) => {
  const variants = {
    fadeIn: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.96 },
    },
    slideUp: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 16 },
    },
  };

  const selected = variants[type] || variants.fadeIn;

  return (
    <motion.div
      initial={selected.initial}
      animate={selected.animate}
      exit={selected.exit}
      transition={{ duration: 0.25, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
