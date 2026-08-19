'use client';

import React from 'react';

export const AnimatedGridBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 37px Grid Base Pattern */}
      <div className="absolute inset-0 bg-[#ffffff] [background-image:linear-gradient(to_right,_rgba(0,_0,_0,_0.05)_1px,_transparent_1px),_linear-gradient(to_bottom,_rgba(0,_0,_0,_0.05)_1px,_transparent_1px)] [background-size:37px_37px]" />

      {/* Animated Glowing Blue Light Pulses over Grid Lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Horizontal Glowing Blue Light Gradient */}
          <linearGradient id="horizontal-blue-beam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>

          {/* Vertical Glowing Blue Light Gradient */}
          <linearGradient id="vertical-blue-beam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="blue-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Animated Horizontal Light Beams (Sweeping horizontally across 37px grid lines) */}
        <line
          x1="-400"
          y1="74"
          x2="0"
          y2="74"
          stroke="url(#horizontal-blue-beam)"
          strokeWidth="2"
          filter="url(#blue-glow)"
        >
          <animate
            attributeName="x1"
            from="-400"
            to="2000"
            dur="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            from="0"
            to="2400"
            dur="6s"
            repeatCount="indefinite"
          />
        </line>

        <line
          x1="-400"
          y1="222"
          x2="0"
          y2="222"
          stroke="url(#horizontal-blue-beam)"
          strokeWidth="2"
          filter="url(#blue-glow)"
        >
          <animate
            attributeName="x1"
            from="-600"
            to="1800"
            dur="8s"
            begin="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            from="-200"
            to="2200"
            dur="8s"
            begin="2s"
            repeatCount="indefinite"
          />
        </line>

        <line
          x1="-400"
          y1="444"
          x2="0"
          y2="444"
          stroke="url(#horizontal-blue-beam)"
          strokeWidth="2"
          filter="url(#blue-glow)"
        >
          <animate
            attributeName="x1"
            from="-500"
            to="1900"
            dur="7s"
            begin="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            from="-100"
            to="2300"
            dur="7s"
            begin="1s"
            repeatCount="indefinite"
          />
        </line>

        {/* Animated Vertical Light Beams (Sweeping vertically down 37px grid lines) */}
        <line
          x1="185"
          y1="-400"
          x2="185"
          y2="0"
          stroke="url(#vertical-blue-beam)"
          strokeWidth="2"
          filter="url(#blue-glow)"
        >
          <animate
            attributeName="y1"
            from="-400"
            to="1600"
            dur="7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            from="0"
            to="2000"
            dur="7s"
            repeatCount="indefinite"
          />
        </line>

        <line
          x1="555"
          y1="-400"
          x2="555"
          y2="0"
          stroke="url(#vertical-blue-beam)"
          strokeWidth="2"
          filter="url(#blue-glow)"
        >
          <animate
            attributeName="y1"
            from="-500"
            to="1700"
            dur="9s"
            begin="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            from="-100"
            to="2100"
            dur="9s"
            begin="3s"
            repeatCount="indefinite"
          />
        </line>

        <line
          x1="925"
          y1="-400"
          x2="925"
          y2="0"
          stroke="url(#vertical-blue-beam)"
          strokeWidth="2"
          filter="url(#blue-glow)"
        >
          <animate
            attributeName="y1"
            from="-400"
            to="1800"
            dur="6.5s"
            begin="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            from="0"
            to="2200"
            dur="6.5s"
            begin="1.5s"
            repeatCount="indefinite"
          />
        </line>
      </svg>

      {/* Radial Soft White Edge Fade Mask */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_75%,transparent_100%)] bg-transparent" />
    </div>
  );
};
