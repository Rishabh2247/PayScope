'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
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

  float t = u_time * 0.1;

  float n1 = snoise(p * 0.4 + vec2(t * 0.2, -t * 0.3));
  float n2 = snoise(p * 0.55 + vec2(-t * 0.15, t * 0.25) + n1 * 0.25);
  float n3 = snoise(p * 0.75 + vec2(t * 0.1, -t * 0.2) + n2 * 0.2);

  vec3 col = u_bg;
  
  float dist = length(p) * 1.5;
  float vignette = 1.0 - smoothstep(0.3, 1.2, dist);
  
  col = mix(col, u_colors[0], smoothstep(-0.2, 0.5, n1) * 0.85);
  col = mix(col, u_colors[1], smoothstep(-0.1, 0.6, n2) * 0.7);
  col = mix(col, u_colors[2], smoothstep(-0.3, 0.4, n3) * 0.6);
  col = mix(col, u_colors[3], smoothstep(0.0, 0.7, n1 * n2) * 0.5);

  float glow = smoothstep(0.8, 0.0, dist) * 0.3;
  col += u_colors[1] * glow;

  col = mix(col * 0.2, col, vignette);

  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.1;

  gl_FragColor = vec4(col, 1.0);
}
`;

export interface VelarisProps {
  className?: string;
  children?: React.ReactNode;
}

const LIGHT_BG = '#F7F8F4';
const LIGHT_COLORS = ['#DCFCE7', '#BBF7D0', '#86EFAC', '#15803D'];
const LIGHT_SPEED = 0.6;
const LIGHT_GRAIN = 0.08;

const DARK_BG = '#080B09';
const DARK_COLORS = ['#052E16', '#064E3B', '#166534', '#22C55E'];
const DARK_SPEED = 0.5;
const DARK_GRAIN = 0.05;

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

export const Velaris: React.FC<VelarisProps> = ({ className, children }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Target values for smooth lerp
  const targetThemeRef = useRef<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    targetThemeRef.current = resolvedTheme === 'dark' ? 'dark' : 'light';
  }, [resolvedTheme]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
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
      colors: gl.getUniformLocation(program, 'u_colors'),
      bg: gl.getUniformLocation(program, 'u_bg'),
    };

    const resize = () => {
      if (!canvas || !container || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Color Interpolation State
    let currentBgRgb = hexToRgb(targetThemeRef.current === 'dark' ? DARK_BG : LIGHT_BG);
    let currentColorsRgb = (targetThemeRef.current === 'dark' ? DARK_COLORS : LIGHT_COLORS).flatMap(hexToRgb);
    let currentSpeed = targetThemeRef.current === 'dark' ? DARK_SPEED : LIGHT_SPEED;
    let currentGrain = targetThemeRef.current === 'dark' ? DARK_GRAIN : LIGHT_GRAIN;

    let raf: number;
    let isPaused = false;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleVisibilityChange = () => {
      isPaused = document.visibilityState === 'hidden';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const lerp = (a: number, b: number, factor: number) => a + (b - a) * factor;

    const render = (t: number) => {
      if (!isPaused && gl) {
        const isDark = targetThemeRef.current === 'dark';
        const targetBg = hexToRgb(isDark ? DARK_BG : LIGHT_BG);
        const targetColors = (isDark ? DARK_COLORS : LIGHT_COLORS).flatMap(hexToRgb);
        const targetSpeed = isDark ? DARK_SPEED : LIGHT_SPEED;
        const targetGrain = isDark ? DARK_GRAIN : LIGHT_GRAIN;

        // Smooth Lerp Transition (~700ms interpolation)
        const lerpRate = 0.05;
        currentBgRgb[0] = lerp(currentBgRgb[0], targetBg[0], lerpRate);
        currentBgRgb[1] = lerp(currentBgRgb[1], targetBg[1], lerpRate);
        currentBgRgb[2] = lerp(currentBgRgb[2], targetBg[2], lerpRate);

        for (let i = 0; i < currentColorsRgb.length; i++) {
          currentColorsRgb[i] = lerp(currentColorsRgb[i], targetColors[i], lerpRate);
        }

        currentSpeed = lerp(currentSpeed, targetSpeed, lerpRate);
        currentGrain = lerp(currentGrain, targetGrain, lerpRate);

        const timeVal = prefersReducedMotion ? 1000 : t * 0.001 * currentSpeed;

        gl.uniform2f(locs.res, canvas.width, canvas.height);
        gl.uniform1f(locs.time, timeVal);
        gl.uniform1f(locs.grain, currentGrain);
        gl.uniform3f(locs.bg, currentBgRgb[0], currentBgRgb[1], currentBgRgb[2]);
        gl.uniform3fv(locs.colors, new Float32Array(currentColorsRgb));

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
          className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700"
        />
      ) : (
        /* CSS WebGL Fallback */
        <div className="absolute inset-0 bg-[#F7F8F4] dark:bg-[#080B09] transition-colors duration-700">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(187,247,208,0.4),rgba(247,248,244,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(22,101,52,0.3),rgba(8,11,9,0))]" />
        </div>
      )}
      {children}
    </div>
  );
};

export default Velaris;
