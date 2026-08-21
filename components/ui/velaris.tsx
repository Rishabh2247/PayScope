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
uniform float u_mixIntensity;
uniform float u_glowIntensity;
uniform float u_vignetteIntensity;
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

  // Active continuous gradient flow speed
  float t = u_time * 0.35;

  // Multi-frequency noise fields moving independently
  float n1 = snoise(p * 0.55 + vec2(t * 0.45, -t * 0.50));
  float n2 = snoise(p * 0.70 + vec2(-t * 0.35, t * 0.40) + n1 * 0.30);
  float n3 = snoise(p * 0.85 + vec2(t * 0.25, -t * 0.35) + n2 * 0.25);

  vec3 col = u_bg;

  // Soft distributed color blending across entire viewport
  col = mix(col, u_colors[0], smoothstep(-0.3, 0.5, n1) * u_mixIntensity * 0.55);
  col = mix(col, u_colors[1], smoothstep(-0.2, 0.6, n2) * u_mixIntensity * 0.45);
  col = mix(col, u_colors[2], smoothstep(-0.4, 0.4, n3) * u_mixIntensity * 0.40);
  col = mix(col, u_colors[3], smoothstep(-0.1, 0.5, n1 * n2) * u_mixIntensity * 0.35);

  // Central glow (active in dark mode only)
  float dist = length(p) * 1.5;
  if (u_glowIntensity > 0.001) {
    float glow = smoothstep(0.8, 0.0, dist) * u_glowIntensity;
    col += u_colors[1] * glow;
  }

  // Vignette (active in dark mode only)
  if (u_vignetteIntensity > 0.001) {
    float vignette = 1.0 - smoothstep(0.3, 1.2, dist) * u_vignetteIntensity;
    col *= vignette;
  }

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

// Light Mode Configuration: Clean off-white base + visible, ambient soft green gradient motion
const LIGHT_BG = '#FAFBF8';
const LIGHT_COLORS = ['#BBF7D0', '#86EFAC', '#4ADE80', '#16A34A'];
const LIGHT_SPEED = 1.0;
const LIGHT_GRAIN = 0.015;
const LIGHT_MIX_INTENSITY = 0.40;
const LIGHT_GLOW_INTENSITY = 0.0;
const LIGHT_VIGNETTE_INTENSITY = 0.0;

// Dark Mode Configuration: Deep cinematic black + rich emerald gradients
const DARK_BG = '#080B09';
const DARK_COLORS = ['#052E16', '#064E3B', '#166534', '#22C55E'];
const DARK_SPEED = 1.0;
const DARK_GRAIN = 0.05;
const DARK_MIX_INTENSITY = 0.85;
const DARK_GLOW_INTENSITY = 0.25;
const DARK_VIGNETTE_INTENSITY = 0.70;

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
      mixIntensity: gl.getUniformLocation(program, 'u_mixIntensity'),
      glowIntensity: gl.getUniformLocation(program, 'u_glowIntensity'),
      vignetteIntensity: gl.getUniformLocation(program, 'u_vignetteIntensity'),
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

    // Initial State Based On Active Theme
    const initialIsDark = targetThemeRef.current === 'dark';
    let currentBgRgb = hexToRgb(initialIsDark ? DARK_BG : LIGHT_BG);
    let currentColorsRgb = (initialIsDark ? DARK_COLORS : LIGHT_COLORS).flatMap(hexToRgb);
    let currentSpeed = initialIsDark ? DARK_SPEED : LIGHT_SPEED;
    let currentGrain = initialIsDark ? DARK_GRAIN : LIGHT_GRAIN;
    let currentMix = initialIsDark ? DARK_MIX_INTENSITY : LIGHT_MIX_INTENSITY;
    let currentGlow = initialIsDark ? DARK_GLOW_INTENSITY : LIGHT_GLOW_INTENSITY;
    let currentVignette = initialIsDark ? DARK_VIGNETTE_INTENSITY : LIGHT_VIGNETTE_INTENSITY;

    let raf: number;
    let isPaused = false;
    let startTime = performance.now();

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
        const targetMix = isDark ? DARK_MIX_INTENSITY : LIGHT_MIX_INTENSITY;
        const targetGlow = isDark ? DARK_GLOW_INTENSITY : LIGHT_GLOW_INTENSITY;
        const targetVignette = isDark ? DARK_VIGNETTE_INTENSITY : LIGHT_VIGNETTE_INTENSITY;

        // Ultra-Fast & Snappy Theme Lerp Rate (0.55 factor = ~80ms-120ms completion time)
        const lerpRate = 0.55;
        currentBgRgb[0] = lerp(currentBgRgb[0], targetBg[0], lerpRate);
        currentBgRgb[1] = lerp(currentBgRgb[1], targetBg[1], lerpRate);
        currentBgRgb[2] = lerp(currentBgRgb[2], targetBg[2], lerpRate);

        for (let i = 0; i < currentColorsRgb.length; i++) {
          currentColorsRgb[i] = lerp(currentColorsRgb[i], targetColors[i], lerpRate);
        }

        currentSpeed = lerp(currentSpeed, targetSpeed, lerpRate);
        currentGrain = lerp(currentGrain, targetGrain, lerpRate);
        currentMix = lerp(currentMix, targetMix, lerpRate);
        currentGlow = lerp(currentGlow, targetGlow, lerpRate);
        currentVignette = lerp(currentVignette, targetVignette, lerpRate);

        const elapsedTime = (t - startTime) * 0.001 * currentSpeed;

        gl.uniform2f(locs.res, canvas.width, canvas.height);
        gl.uniform1f(locs.time, prefersReducedMotion ? 1.0 : elapsedTime);
        gl.uniform1f(locs.grain, currentGrain);
        gl.uniform1f(locs.mixIntensity, currentMix);
        gl.uniform1f(locs.glowIntensity, currentGlow);
        gl.uniform1f(locs.vignetteIntensity, currentVignette);
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
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      ) : (
        /* CSS WebGL Fallback */
        <div className="absolute inset-0 bg-[#FAFBF8] dark:bg-[#080B09] transition-colors duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(187,247,208,0.4),rgba(250,251,248,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(22,101,52,0.3),rgba(8,11,9,0))]" />
        </div>
      )}
      {children}
    </div>
  );
};

export default Velaris;
