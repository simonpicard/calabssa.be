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
  // Read the ICS file directly from the filesystem during build time
  // This is more reliable for static generation
  const fs = require('fs')
  const path = require('path')
  
  let icalText: string
  
  if (typeof window === 'undefined') {
    // Server-side: read directly from filesystem
    const icsPath = path.join(process.cwd(), 'public', 'ics', `${fileName}.ics`)
    console.log('[Calendar] Reading ICS from filesystem:', icsPath)
    
    try {
      icalText = fs.readFileSync(icsPath, 'utf8')
      console.log('[Calendar] ICS file read successfully, length:', icalText.length)
    } catch (error) {
      console.error('[Calendar] Failed to read ICS file:', error)
      throw new Error(`Failed to read calendar file: ${fileName}`)
    }
  } else {
    // Client-side: fetch from public URL (shouldn't happen with SSG)
    const icalPath = `/ics/${fileName}.ics`
    console.log('[Calendar] Fetching ICS from:', icalPath)
    
    const icalCall = await fetch(icalPath)
    
    if (!icalCall.ok) {
      console.error('[Calendar] Fetch failed:', icalCall.status, icalCall.statusText)
      throw new Error(`Failed to fetch calendar: ${icalCall.status}`)
    }
    
    icalText = await icalCall.text()
    console.log('[Calendar] ICS content length:', icalText.length)
  }
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

  // For calendar subscription links, use the actual deployment domain
  let domain: string
  let fullUrl: string
  
  if (process.env.NODE_ENV === 'development') {
    domain = 'localhost:3000'
    fullUrl = `http://localhost:3000/ics/${fileName}.ics`
  } else {
    // In production, prefer custom domain if available
    domain = 'www.calabssa.be'
    fullUrl = `https://www.calabssa.be/ics/${fileName}.ics`
  }
  
  return {
    icalEvents,
    icalInfo,
    icalParam: { 
      baseUri: `${domain}/ics/${fileName}.ics`,
      httpUri: fullUrl,
      webcalUri: `webcal://${domain}/ics/${fileName}.ics`,
      fileName 
    },
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