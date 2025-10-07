import { addOneDay } from "@/helpers/add-one-day";

describe('addOneDay', () => {
  it('should add exactly one day to a given date', () => {
    const inputDate = new Date('2023-10-15T10:00:00.000Z');
    const result = addOneDay(inputDate);
    const expected = new Date('2023-10-16T10:00:00.000Z');

    expect(result).toEqual(expected);
    expect(result.getTime() - inputDate.getTime()).toBe(24 * 60 * 60 * 1000);
  });

  it('should handle date at end of month correctly', () => {
    const inputDate = new Date('2023-10-31T10:00:00.000Z');
    const result = addOneDay(inputDate);
    const expected = new Date('2023-11-01T10:00:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should handle date at end of year correctly', () => {
    const inputDate = new Date('2023-12-31T10:00:00.000Z');
    const result = addOneDay(inputDate);
    const expected = new Date('2024-01-01T10:00:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should handle leap year February correctly', () => {
    const inputDate = new Date('2024-02-28T10:00:00.000Z');
    const result = addOneDay(inputDate);
    const expected = new Date('2024-02-29T10:00:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should handle leap year February 29th correctly', () => {
    const inputDate = new Date('2024-02-29T10:00:00.000Z');
    const result = addOneDay(inputDate);
    const expected = new Date('2024-03-01T10:00:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should handle non-leap year February correctly', () => {
    const inputDate = new Date('2023-02-28T10:00:00.000Z');
    const result = addOneDay(inputDate);
    const expected = new Date('2023-03-01T10:00:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should not mutate the original date', () => {
    const inputDate = new Date('2023-10-15T10:00:00.000Z');
    const originalTime = inputDate.getTime();

    addOneDay(inputDate);

    expect(inputDate.getTime()).toBe(originalTime);
  });

  it('should handle dates with milliseconds', () => {
    const inputDate = new Date('2023-10-15T10:30:45.123Z');
    const result = addOneDay(inputDate);
    const expected = new Date('2023-10-16T10:30:45.123Z');

    expect(result).toEqual(expected);
  });

  it('should handle very old dates', () => {
    const inputDate = new Date('1900-01-01T10:00:00.000Z');
    const result = addOneDay(inputDate);
    const expected = new Date('1900-01-02T10:00:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should handle future dates', () => {
    const inputDate = new Date('2100-12-25T15:00:00.000Z');
    const result = addOneDay(inputDate);
    const expected = new Date('2100-12-26T15:00:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should return a new Date instance', () => {
    const inputDate = new Date('2023-10-15T10:00:00.000Z');
    const result = addOneDay(inputDate);

    expect(result).not.toBe(inputDate);
    expect(result).toBeInstanceOf(Date);
  });

  it('should handle month boundaries correctly', () => {
    const inputDate = new Date('2023-01-31T10:00:00.000Z');
    const result = addOneDay(inputDate);
    const expected = new Date('2023-02-01T10:00:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should handle different month lengths correctly', () => {
    const inputDate = new Date('2023-04-30T10:00:00.000Z');
    const result = addOneDay(inputDate);
    const expected = new Date('2023-05-01T10:00:00.000Z');

    expect(result).toEqual(expected);
  });
});
