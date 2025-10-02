import { addOneHour } from "@/helpers/add-one-hour";

describe('addOneHour', () => {
  it('should add exactly one hour to a given date', () => {
    const inputDate = new Date('2023-10-15T10:00:00.000Z');
    const result = addOneHour(inputDate);
    const expected = new Date('2023-10-15T11:00:00.000Z');

    expect(result).toEqual(expected);
    expect(result.getTime() - inputDate.getTime()).toBe(60 * 60 * 1000);
  });

  it('should handle date at end of day correctly', () => {
    const inputDate = new Date('2023-10-15T23:30:00.000Z');
    const result = addOneHour(inputDate);
    const expected = new Date('2023-10-16T00:30:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should handle date at end of month correctly', () => {
    const inputDate = new Date('2023-10-31T23:30:00.000Z');
    const result = addOneHour(inputDate);
    const expected = new Date('2023-11-01T00:30:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should handle date at end of year correctly', () => {
    const inputDate = new Date('2023-12-31T23:30:00.000Z');
    const result = addOneHour(inputDate);
    const expected = new Date('2024-01-01T00:30:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should handle leap year February correctly', () => {
    const inputDate = new Date('2024-02-28T23:30:00.000Z');
    const result = addOneHour(inputDate);
    const expected = new Date('2024-02-29T00:30:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should not mutate the original date', () => {
    const inputDate = new Date('2023-10-15T10:00:00.000Z');
    const originalTime = inputDate.getTime();

    addOneHour(inputDate);

    expect(inputDate.getTime()).toBe(originalTime);
  });

  it('should handle dates with milliseconds', () => {
    const inputDate = new Date('2023-10-15T10:30:45.123Z');
    const result = addOneHour(inputDate);
    const expected = new Date('2023-10-15T11:30:45.123Z');

    expect(result).toEqual(expected);
  });

  it('should handle very old dates', () => {
    const inputDate = new Date('1900-01-01T10:00:00.000Z');
    const result = addOneHour(inputDate);
    const expected = new Date('1900-01-01T11:00:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should handle future dates', () => {
    const inputDate = new Date('2100-12-25T15:00:00.000Z');
    const result = addOneHour(inputDate);
    const expected = new Date('2100-12-25T16:00:00.000Z');

    expect(result).toEqual(expected);
  });

  it('should return a new Date instance', () => {
    const inputDate = new Date('2023-10-15T10:00:00.000Z');
    const result = addOneHour(inputDate);

    expect(result).not.toBe(inputDate);
    expect(result).toBeInstanceOf(Date);
  });
});
