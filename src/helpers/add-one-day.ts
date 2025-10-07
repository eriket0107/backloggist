import { DATE_CONFIG } from "@/constants/date"

export const addOneDay = (date: Date): Date => {
  return new Date(date.getTime() + DATE_CONFIG.ONE_DAY)
}