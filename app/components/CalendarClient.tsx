'use client'

import AddCalendarPopUp from './AddCalendarPopUp'
import { CalendarData } from '../lib/calendar-utils'
import Event from './Event'
import Toggle from './Toggle'
import { useState } from 'react'

interface CalendarClientProps {
  initialData: CalendarData
}

export default function CalendarClient({ initialData }: CalendarClientProps) {
  const [saveCal, setSaveCal] = useState(false)
  const [showPast, setShowPast] = useState(initialData.calSettings.displayPast)

  const handleClickAddAgenda = () => {
    setSaveCal(true)
  }

  const events = showPast
    ? initialData.icalEvents
    : initialData.icalEvents.filter((e) => new Date(e.dtstart) >= new Date())

  return (
    <div>
      {saveCal && (
        <AddCalendarPopUp
          baseUri={initialData.icalParam.baseUri}
          calName={initialData.icalInfo['x-wr-calname']}
          closeEvent={() => setSaveCal(false)}
        />
      )}
      <div className="block">
        <div className="block lg:flex w-full items-center space-y-4 lg:space-y-0 lg:mb-6">
          <h1 className="text-center lg:text-left font-extrabold text-2xl sm:text-3xl w-full lg:min-h-[52px]">
            {initialData.icalInfo.displayNameFull}
          </h1>
          {initialData.calSettings.enableOptions && (
            <p
              className="min-w-max max-w-max mx-auto rounded-3xl p-3 text-white font-semibold bg-sky-600 text-lg select-none cursor-pointer"
              onClick={handleClickAddAgenda}
            >
              Ajouter à l&apos;agenda
            </p>
          )}
        </div>
        {initialData.calSettings.enableOptions && (
          <Toggle state={showPast} setState={setShowPast}>
            Afficher les matches passés
          </Toggle>
        )}
      </div>
      <div className="divide-solid divide-y divide-slate-900/10">
        {events.map((e) => {
          const { key, ...eventProps } = e
          return <Event key={key} {...eventProps} />
        })}
      </div>
    </div>
  )
}
