import DayDiv from '../data/dayDiv.json'
import TeamData from '../data/teams.json'

import * as ical from 'cal-parser'

export interface CalendarEvent {
  key: string
  dtstamp: Date
  dtstart: Date
  dtend: Date
  summary: string
  description: string
  location: string
  url: string
  latitude?: number
  longitude?: number
}

export interface CalendarInfo {
  'x-wr-calname': string
  displayNameFull: string
  displayNameShort: string
  [key: string]: any
}

export interface CalendarSettings {
  displayPast: boolean
  setPageTitle: boolean
  enableOptions: boolean
}

export interface CalendarData {
  icalEvents: CalendarEvent[]
  icalInfo: CalendarInfo
  icalParam: {
    baseUri: string
    httpUri: string
    webcalUri: string
    fileName: string
  }
  calSettings: CalendarSettings
}

export async function loadAndParseCal(fileName: string): Promise<CalendarData> {
  const hostname = process.env.NEXT_PUBLIC_VERCEL_URL || (process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'calabssa.be')
  const httpProtocol = hostname.includes('localhost') ? 'http' : 'https'

  const baseUri = `${hostname}/ics/${fileName}.ics`
  const icalPath = `${httpProtocol}://${baseUri}`
  const icalWebcal = `webcal://${baseUri}`

  const icalCall = await fetch(icalPath)
  const icalText = await icalCall.text()
  const icalTextNewline = icalText
    .replace(/\\\r\n n/g, '<br />')
    .replace(/\\n/g, '<br />')

  const icalDict = ical.parseString(icalTextNewline)

  const icalInfo = icalDict.calendarData
  const icalEvents: CalendarEvent[] = []

  icalDict.events.forEach((elem: any) => {
    let desc = elem.description.value
    desc = desc.replace(/<br \/>/g, '\n')
    
    // Extract coordinates if available
    let latitude: number | undefined
    let longitude: number | undefined
    if (elem.geo?.value) {
      // Handle both semicolon and colon separators
      const [lat, lng] = elem.geo.value.split(/[;:]/)
      latitude = parseFloat(lat)
      longitude = parseFloat(lng)
    }
    
    icalEvents.push({
      key: elem.uid.value,
      dtstamp: elem.dtstamp,
      dtstart: elem.dtstart.value,
      dtend: elem.dtend.value,
      summary: elem.summary.value,
      description: desc,
      location: elem.location.value,
      url: elem.url?.value || '',
      latitude,
      longitude,
    })
  })

  return {
    icalEvents,
    icalInfo,
    icalParam: { baseUri, httpUri: icalPath, webcalUri: icalWebcal, fileName },
    calSettings: {
      displayPast: false,
      setPageTitle: true,
      enableOptions: true,
    },
  }
}

export async function getCalendarDataForTeam(teamId: string): Promise<CalendarData | null> {
  const currentTeamData = (TeamData as any)[teamId]
  
  if (!currentTeamData) {
    return null
  }

  // The filename is the same as the teamId
  const fileName = teamId
  const loaderData = await loadAndParseCal(fileName)

  loaderData.icalInfo.displayNameFull = currentTeamData.search_name
  loaderData.icalInfo.displayNameShort = currentTeamData.club_name

  return loaderData
}

interface DayDivEntry {
  date: string
  day: number
  name: string
  division: string
  [key: string]: any
}

export async function getDefaultCalendarData(): Promise<{ calendarData: CalendarData; divisionInfo: DayDivEntry }> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dayDivTyped = DayDiv as Record<string, DayDivEntry>
  const dayDivFlt = Object.entries(dayDivTyped).filter(
    (e) => new Date(Date.parse(e[1].date.replace(' ', 'T'))) >= today
  )

  let dayDivCandidates: [string, DayDivEntry][]

  if (dayDivFlt.length === 0) {
    dayDivCandidates = Object.entries(dayDivTyped)
  } else {
    const nextDay = dayDivFlt.reduce((prev, curr) => {
      return new Date(Date.parse(prev[1].date.replace(' ', 'T'))) <
        new Date(Date.parse(curr[1].date.replace(' ', 'T')))
        ? prev
        : curr
    })[1].day

    dayDivCandidates = dayDivFlt.filter((e) => e[1].day === nextDay)
  }

  const [calendarId, calendarInfo] =
    dayDivCandidates[Math.floor(Math.random() * dayDivCandidates.length)]

  const loaderData = await loadAndParseCal(calendarId)
  
  loaderData.icalInfo.displayNameFull = calendarInfo.name
  loaderData.icalInfo.displayNameShort = calendarInfo.name
  loaderData.calSettings.enableOptions = false

  return { 
    calendarData: loaderData,
    divisionInfo: calendarInfo
  }
}