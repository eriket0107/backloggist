import { DATE_CONFIG } from "@/constants/date"

export const addOneHour = (date: Date): Date => {
  return new Date(date.getTime() + DATE_CONFIG.ONE_HOUR)
}