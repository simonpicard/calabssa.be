'use client'

import { CalendarData } from '../lib/calendar-utils'
import HomepageEvent from './HomepageEvent'

interface HomepageCalendarProps {
  initialData: CalendarData
  divisionInfo: {
    day: number
    division: string
    date: string
    name: string
  }
}

export default function HomepageCalendar({ initialData, divisionInfo }: HomepageCalendarProps) {
  // Events are already filtered on the server
  const events = initialData.icalEvents

  // Format the date - use suppressHydrationWarning for client-only formatting
  const matchDate = new Date(divisionInfo.date)
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }
  const formattedDate = matchDate.toLocaleDateString('fr-BE', dateOptions)

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          🌟 Consultez les matchs directement sur <span className="text-sky-600">l&apos;application web</span>
        </h2>
        <p className="text-lg text-gray-600">
          Tous les détails en un seul endroit : horaires, adresses, type de terrain, cartes, contacts, couleurs de maillots... Par exemple, voici les matchs du <span className="font-semibold text-gray-900" suppressHydrationWarning>{formattedDate}</span> de la division <span className="font-semibold text-gray-900">{divisionInfo.division}</span>:
        </p>
      </div>

      <div>
        <div className="divide-solid divide-y divide-slate-900/10">
          {events.length > 0 ? (
            events.map((e, index) => {
              const { key, ...eventProps } = e
              return <HomepageEvent key={key} {...eventProps} defaultOpen={index === 0} />
            })
          ) : (
            <p className="text-gray-500 py-12 text-center text-lg">
              Aucun match à venir pour cette division
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
