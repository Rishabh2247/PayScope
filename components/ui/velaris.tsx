'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

const vertexShaderGLSL = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderGLSL = `
precision highp float;
varying vec2 vUv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_grain;
uniform float u_mixIntensity;
uniform vec3  u_colors[4];
uniform vec3  u_bg;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / u_resolution.y;
  vec2 p = uv - 0.5;
  p.x *= ratio;

  // Continuous light mode gradient flow speed
  float t = u_time * 0.35;

  // Multi-frequency noise fields moving independently
  float n1 = snoise(p * 0.55 + vec2(t * 0.45, -t * 0.50));
  float n2 = snoise(p * 0.70 + vec2(-t * 0.35, t * 0.40) + n1 * 0.30);
  float n3 = snoise(p * 0.85 + vec2(t * 0.25, -t * 0.35) + n2 * 0.25);

  vec3 col = u_bg;

  // Soft ambient green gradient blending across clean white background
  col = mix(col, u_colors[0], smoothstep(-0.3, 0.5, n1) * u_mixIntensity * 0.55);
  col = mix(col, u_colors[1], smoothstep(-0.2, 0.6, n2) * u_mixIntensity * 0.45);
  col = mix(col, u_colors[2], smoothstep(-0.4, 0.4, n3) * u_mixIntensity * 0.40);
  col = mix(col, u_colors[3], smoothstep(-0.1, 0.5, n1 * n2) * u_mixIntensity * 0.35);

  // Subtle film grain
  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.04;

  gl_FragColor = vec4(col, 1.0);
}
`;

export interface VelarisProps {
  className?: string;
  children?: React.ReactNode;
}

// Light Mode Configuration: Clean white base + soft moving emerald green gradients
const LIGHT_BG = '#FFFFFF';
const LIGHT_COLORS = ['#BBF7D0', '#86EFAC', '#4ADE80', '#16A34A'];
const LIGHT_GRAIN = 0.015;
const LIGHT_MIX_INTENSITY = 0.35;

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

const VelarisComponent: React.FC<VelarisProps> = ({ className, children }) => {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: 'low-power',
      });
    } catch (e) {
      gl = null;
    }

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    setWebglSupported(true);

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vert = createShader(gl.VERTEX_SHADER, vertexShaderGLSL);
    const frag = createShader(gl.FRAGMENT_SHADER, fragmentShaderGLSL);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      res: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      grain: gl.getUniformLocation(program, 'u_grain'),
      mixIntensity: gl.getUniformLocation(program, 'u_mixIntensity'),
      colors: gl.getUniformLocation(program, 'u_colors'),
      bg: gl.getUniformLocation(program, 'u_bg'),
    };

    // Device-aware DPR optimization: 1.5 max on mobile (< 768px), 2.0 max on desktop
    const resize = () => {
      if (!canvas || !container || !gl) return;
      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);
      const newWidth = Math.floor(container.clientWidth * dpr);
      const newHeight = Math.floor(container.clientHeight * dpr);

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        gl.viewport(0, 0, newWidth, newHeight);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Constant Light Mode Colors
    const bgRgb = hexToRgb(LIGHT_BG);
    const colorsRgb = LIGHT_COLORS.flatMap(hexToRgb);
    const colorsFloatBuffer = new Float32Array(colorsRgb);

    let raf: number;
    let isPaused = false;
    const startTime = performance.now();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleVisibilityChange = () => {
      isPaused = document.visibilityState === 'hidden';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Continuous requestAnimationFrame render loop for smooth moving light gradients
    const render = (t: number) => {
      if (!isPaused && gl) {
        const elapsedTime = (t - startTime) * 0.001;

        gl.uniform2f(locs.res, canvas.width, canvas.height);
        gl.uniform1f(locs.time, prefersReducedMotion ? 1.0 : elapsedTime);
        gl.uniform1f(locs.grain, LIGHT_GRAIN);
        gl.uniform1f(locs.mixIntensity, LIGHT_MIX_INTENSITY);
        gl.uniform3f(locs.bg, bgRgb[0], bgRgb[1], bgRgb[2]);
        gl.uniform3fv(locs.colors, colorsFloatBuffer);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(render);
      }
    };

    raf = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(raf);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vert);
        gl.deleteShader(frag);
        gl.deleteBuffer(buffer);
      }
    };
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      className={cn('fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden', className)}
    >
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      ) : (
        /* CSS WebGL Fallback */
        <div className="absolute inset-0 bg-[#FFFFFF]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(187,247,208,0.4),rgba(255,255,255,0))]" />
        </div>
      )}
      {children}
    </div>
  );
};

export const Velaris = React.memo(VelarisComponent);
export default Velaris;
