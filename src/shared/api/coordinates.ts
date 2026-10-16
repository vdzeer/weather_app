// Coordinates leave the device with 2 decimal places, a grid of about 1 km.
// That is enough for a forecast or a place name, and it counts as coarse
// location in Apple's terms (fewer than 3 decimal places). The forecast cache
// key uses the same value, so one cache entry matches one request.
export const COORDINATE_DECIMALS = 2;

export const coarseCoordinate = (value: number) =>
  value.toFixed(COORDINATE_DECIMALS);
