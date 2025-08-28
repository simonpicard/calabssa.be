'use client'

import { useEffect, useRef, useState } from 'react'

interface DayEvent {
  title: string
  time: string
  type: 'work' | 'personal' | 'sport'
  isHighlight?: boolean
}

const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const sampleEvents: Record<string, DayEvent[]> = {
  'Lundi': [
    { title: 'Réunion équipe', time: '09:00', type: 'work' },
    { title: 'Déposer les enfants', time: '16:30', type: 'personal' }
  ],
  'Mardi': [
    { title: 'Call client', time: '10:30', type: 'work' },
    { title: 'Gym', time: '18:00', type: 'personal' }
  ],
  'Mercredi': [
    { title: 'Présentation projet', time: '14:00', type: 'work' }
  ],
  'Jeudi': [
    { title: 'Stand-up meeting', time: '09:30', type: 'work' },
    { title: 'Dîner avec Marie', time: '19:30', type: 'personal' }
  ],
  'Vendredi': [
    { title: 'Review hebdo', time: '15:00', type: 'work' },
    { title: 'Courses', time: '17:00', type: 'personal' }
  ],
  'Samedi': [
    { title: 'FC SCHAERBEEK vs RCS WOLUWE', time: '14:30', type: 'sport', isHighlight: true },
    { title: 'Anniversaire Lucas', time: '19:00', type: 'personal' }
  ],
  'Dimanche': [
    { title: 'Brunch famille', time: '11:00', type: 'personal' }
  ]
}

export default function CalendarIntegration() {
  const [highlightedDay, setHighlightedDay] = useState<string | null>(null)
  const calendarContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to weekend on small screens
    if (window.innerWidth < 768) {
      setTimeout(() => {
        if (calendarContainerRef.current) {
          const containerWidth = calendarContainerRef.current.scrollWidth
          const dayWidth = containerWidth / 7
          const saturdayIndex = 5 // Saturday is at index 5
          const scrollPosition = saturdayIndex * dayWidth - 50
          calendarContainerRef.current.scrollLeft = scrollPosition
        }
      }, 100)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedDay('Samedi')
      setTimeout(() => setHighlightedDay(null), 1000)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getEventStyles = (event: DayEvent) => {
    if (event.isHighlight) {
      return 'bg-green-100 text-green-800 font-semibold'
    }

    switch (event.type) {
      case 'work':
        return 'bg-blue-100 text-blue-800'
      case 'personal':
        return 'bg-purple-100 text-purple-800'
      case 'sport':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          📅 Intégrez vos matchs dans <span className="text-green-600">votre calendrier</span>
        </h2>
        <p className="text-lg text-gray-600">
          Synchronisez automatiquement les matchs de votre équipe avec votre calendrier préféré
          (Google Calendar, Apple Calendar, Outlook...). Recevez des <span className="font-semibold">rappels automatiques</span> pour ne jamais manquer un match,
          <span className="font-semibold"> évitez les conflits d&apos;agenda</span> en voyant immédiatement les chevauchements avec vos autres engagements,
          et <span className="font-semibold">anticipez vos absences</span> pour prévenir votre équipe suffisamment à l&apos;avance.
          Le match devient ainsi parfaitement intégré à votre planning hebdomadaire!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative">
        <div className="overflow-x-auto pb-2 pt-2" ref={calendarContainerRef}>
          <div className="flex sm:grid sm:grid-cols-7 gap-3 min-w-[1400px] sm:min-w-[800px] px-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className={`${highlightedDay === day ? 'ring-2 ring-green-500 ring-offset-2' : ''} rounded-lg transition-all duration-300 min-w-[200px] sm:min-w-0`}
              >
                <div className={`text-center font-semibold py-2 ${day === 'Samedi' ? 'text-green-600' : 'text-gray-700'}`}>
                  {day}
                </div>
                <div className="space-y-1 p-2 min-h-[180px] sm:min-h-[200px]">
                  {sampleEvents[day]?.map((event, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded text-xs ${getEventStyles(event)} transition-all duration-200 ${event.isHighlight ? 'transform scale-105' : ''}`}
                    >
                      <div className="font-medium">{event.time}</div>
                      <div className={`${event.isHighlight ? 'text-sm' : ''} break-words`}>
                        {event.title}
                      </div>
                      {event.isHighlight && (
                        <div className="text-xs mt-1">⚽ Match!</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-start space-x-4 sm:space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="text-gray-600">Travail</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-100 rounded"></div>
            <span className="text-gray-600">Personnel</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 rounded border border-green-600"></div>
            <span className="text-gray-600">⚽ Match ABSSA</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-500">
          Utilisez la barre de recherche pour trouver votre équipe et ajouter le calendrier à votre agenda préféré
        </p>
      </div>
    </div>
  )
}
