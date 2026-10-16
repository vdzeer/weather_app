import {
  formatClock,
  formatTime,
  localDayKey,
  weekdayOf,
} from '../src/shared/lib/time';
import { DAY_START, OFFSET } from './fixtures';

describe('location-local time', () => {
  it("formats in the location's time zone, not the phone's", () => {
    // 21:00 UTC is midnight in Kyiv.
    expect(formatTime(DAY_START, OFFSET, false)).toBe('00:00');
    expect(formatTime(DAY_START + 15 * 3600 + 30 * 60, OFFSET, false)).toBe(
      '15:30',
    );
  });

  it('gets the weekday right around midnight', () => {
    // Thursday 15 October 2026 in Kyiv, still Wednesday in UTC.
    expect(weekdayOf(DAY_START, OFFSET)).toBe(4);
    expect(localDayKey(DAY_START, OFFSET)).toBe('2026-10-15');
  });
});

describe('formatClock', () => {
  it('supports 12-hour clocks', () => {
    expect(formatClock(0, 0, true)).toBe('12 AM');
    expect(formatClock(15, 30, true)).toBe('3:30 PM');
    expect(formatClock(7, 5, false)).toBe('07:05');
  });
});
