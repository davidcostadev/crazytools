import { useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { DefaultLayout } from '../../layout/DefaultLayout';

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

function hexToRgb(hex: string): RGB | null {
  const match = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function parseColor(input: string): RGB | null {
  const trimmed = input.trim();

  // HEX
  const hexMatch = trimmed.match(/^#?([a-f\d]{6})$/i);
  if (hexMatch) return hexToRgb(hexMatch[1]);

  // RGB
  const rgbMatch = trimmed.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]), g = parseInt(rgbMatch[2]), b = parseInt(rgbMatch[3]);
    if (r <= 255 && g <= 255 && b <= 255) return { r, g, b };
  }

  // Plain numbers: r, g, b
  const numMatch = trimmed.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
  if (numMatch) {
    const r = parseInt(numMatch[1]), g = parseInt(numMatch[2]), b = parseInt(numMatch[3]);
    if (r <= 255 && g <= 255 && b <= 255) return { r, g, b };
  }

  return null;
}

export const ColorConverterPage = () => {
  const [input, setInput] = useState('');

  const rgb = parseColor(input);
  const hex = rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : '';
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <DefaultLayout title="Color Converter">
      <div className="space-y-5">
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#ff5733, rgb(255, 87, 51), or 255, 87, 51"
            className="border rounded px-4 py-2 w-full font-mono text-sm"
          />
        </div>
        {input && !rgb && <p className="text-red-500 text-sm font-mono">Invalid color format</p>}
        {rgb && (
          <>
            <div
              className="w-full h-24 rounded border"
              style={{ backgroundColor: hex }}
            />
            <div className="flex gap-2 flex-row flex-wrap">
              <OutputPlan title="HEX" text={hex} className="w-full max-w-[20rem] min-h-[5rem]" />
              <OutputPlan
                title="RGB"
                text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                className="w-full max-w-[20rem] min-h-[5rem]"
              />
              {hsl && (
                <OutputPlan
                  title="HSL"
                  text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                  className="w-full max-w-[20rem] min-h-[5rem]"
                />
              )}
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};
