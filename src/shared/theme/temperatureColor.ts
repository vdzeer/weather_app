// Colour encodes the actual temperature (in °C), not its position in the week:
// a blue bar always means cold, an orange one always means hot.
const STOPS: ReadonlyArray<[celsius: number, rgb: [number, number, number]]> = [
  [-20, [168, 182, 255]],
  [-5, [122, 196, 255]],
  [5, [118, 222, 205]],
  [15, [214, 230, 110]],
  [25, [255, 186, 74]],
  [35, [255, 112, 72]],
];

const hex = (n: number) => Math.round(n).toString(16).padStart(2, '0');

export const temperatureColor = (celsius: number) => {
  if (celsius <= STOPS[0][0]) {
    const [r, g, b] = STOPS[0][1];
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }
  for (let i = 1; i < STOPS.length; i += 1) {
    const [t1, c1] = STOPS[i];
    if (celsius <= t1) {
      const [t0, c0] = STOPS[i - 1];
      const k = (celsius - t0) / (t1 - t0);
      const mix = (j: number) => c0[j] + (c1[j] - c0[j]) * k;
      return `#${hex(mix(0))}${hex(mix(1))}${hex(mix(2))}`;
    }
  }
  const [r, g, b] = STOPS[STOPS.length - 1][1];
  return `#${hex(r)}${hex(g)}${hex(b)}`;
};
