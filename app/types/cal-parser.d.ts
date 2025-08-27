declare module 'cal-parser' {
  export function parseString(str: string): {
    calendarData: any
    events: Array<{
      uid: { value: string }
      dtstamp: Date
      dtstart: { value: Date }
      dtend: { value: Date }
      summary: { value: string }
      description: { value: string }
      location: { value: string }
      url?: { value: string }
      geo?: { value: string }
      organizer?: { value: string }
    }>
  }
}