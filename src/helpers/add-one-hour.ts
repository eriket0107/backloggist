export const addOneHour = (date: Date): Date => {
  return new Date(date.getTime() + 60 * 60 * 1000)
}