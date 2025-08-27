import { getDefaultCalendarData } from '../lib/calendar-utils'
import CalendarClient from './CalendarClient'

export default async function CalendarServer() {
  const { calendarData } = await getDefaultCalendarData()
  
  return <CalendarClient initialData={calendarData} />
}