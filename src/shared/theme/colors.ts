import type { SkyKind } from '@shared/lib/weatherCode';

export const colors = {
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.76)',
  textTertiary: 'rgba(255,255,255,0.56)',
  hairline: 'rgba(255,255,255,0.2)',
  // Darkens the lower part of the sky so small text stays readable on every theme.
  sheet: 'rgba(6,10,28,0.28)',
  control: 'rgba(255,255,255,0.14)',
  controlPressed: 'rgba(255,255,255,0.24)',
  buttonText: '#121A33',
  sun: '#FFC94A',
  rain: '#9AD8FF',
  danger: '#FFB4A8',
};

type Gradient = readonly [top: string, bottom: string];

// The background is the sky: its colour follows the condition and time of day.
export const skies: Record<SkyKind, { day: Gradient; night: Gradient }> = {
  clear: { day: ['#2A5FC4', '#3E80DA'], night: ['#121738', '#262B63'] },
  partly: { day: ['#355E9E', '#5079B4'], night: ['#171C3A', '#2B3159'] },
  cloudy: { day: ['#4A586F', '#627189'], night: ['#1C2030', '#31374D'] },
  fog: { day: ['#535A66', '#6B727E'], night: ['#202329', '#373B45'] },
  rain: { day: ['#2F3C54', '#4A5D7B'], night: ['#131926', '#263046'] },
  snow: { day: ['#455A7C', '#62799E'], night: ['#1A2135', '#303C57'] },
  storm: { day: ['#2A2240', '#463966'], night: ['#151128', '#2A2244'] },
};

export const neutralSky: Gradient = skies.cloudy.night;

export const skyFor = (sky: SkyKind, isDay: boolean): Gradient =>
  isDay ? skies[sky].day : skies[sky].night;
