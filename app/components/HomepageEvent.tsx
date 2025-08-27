'use client'

import { useEffect, useRef, useState } from 'react'

import Accordion from './Accordion'
import { CalendarEvent } from '../lib/calendar-utils'
import dynamic from 'next/dynamic'

// Dynamic import for Leaflet to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="min-h-[8rem] bg-gray-100 animate-pulse" />
})

interface HomepageEventProps extends Omit<CalendarEvent, 'key'> {
  defaultOpen?: boolean
}

function getWindowDimensions() {
  if (typeof window === 'undefined') return { width: 1024, height: 768 }
  const { innerWidth: width, innerHeight: height } = window
  return { width, height }
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export default function HomepageEvent({
  summary,
  description,
  dtstart,
  dtend,
  location,
  url,
  latitude,
  longitude,
  defaultOpen = false
}: HomepageEventProps) {
  const { width } = useWindowDimensions()
  const [mapKey, setMapKey] = useState(0)
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [maxHeight, setMaxHeight] = useState<string>(defaultOpen ? '1000px' : '0px')
  const detailRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const dateFmt: Intl.DateTimeFormatOptions = width >= 768
    ? { year: 'numeric', month: 'long', day: 'numeric' }
    : { year: '2-digit', month: '2-digit', day: '2-digit' }

  const dateStr = new Date(dtstart).toLocaleDateString('fr-BE', dateFmt)
  const timeStartStr = new Date(dtstart).toLocaleTimeString('fr-BE', {
    hour: 'numeric',
    minute: 'numeric',
  })
  const timeEndStr = new Date(dtend).toLocaleTimeString('fr-BE', {
    hour: 'numeric',
    minute: 'numeric',
  })

  // Use coordinates from data, fallback to Brussels center
  const hasCoordinates = latitude !== undefined && longitude !== undefined
  const mapLat = latitude || 50.8503
  const mapLng = longitude || 4.3517

  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Measure the actual content height when opened
      const contentHeight = contentRef.current.scrollHeight
      setMaxHeight(`${contentHeight}px`)
      if (defaultOpen) {
        // If initially open, trigger map update
        updateMap()
      }
    } else if (!isOpen) {
      setMaxHeight('0px')
    }
  }, [isOpen])

  const updateMap = () => {
    // Force map re-render after accordion opens
    setTimeout(() => setMapKey(prev => prev + 1), 300)
  }

  const toggleHandler = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      updateMap()
    }
  }

  const urlify = (txt: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = txt.split(urlRegex)

    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <a className="underline" key={`link${i}`} href={part}>
            {width < 640 ? 'lien' : part}
          </a>
        )
      }
      return part
    })
  }

  const formatDescription = (desc: string) => {
    return desc.split('\n\n').map((paragraph, i) => (
      <div className="my-1 py-1 block" key={`desc${i}`}>
        {paragraph.split('\n').map((line, i2) => (
          <p className="text-justify" key={`desc${i}_${i2}`}>
            {urlify(line)}
          </p>
        ))}
      </div>
    ))
  }

  return (
    <div className="pt-2 mt-2 text-left text-[#334155]">
      <div
        className="relative flex hover:text-sky-600 cursor-pointer"
        onClick={toggleHandler}
      >
        <div className="w-full min-h-full items-center flex">
          <div className="grid grid-cols-6 lg:grid-cols-6 xl:grid-cols-7 w-full">
            <div className="row-start-1 col-start-1 flex-none flex lg:block xl:grid xl:grid-cols-2 row-span-1 lg:row-span-2 xl:row-span-1 xl:col-span-2 space-x-1 lg:space-x-0">
              <div className="flex-none">{dateStr}</div>
              <div className="flex-none">
                {width >= 640 ? `${timeStartStr} à ${timeEndStr}` : timeStartStr}
              </div>
            </div>
            <div className="row-start-2 col-span-full lg:row-start-1 lg:col-start-2 xl:col-start-3 lg:col-span-5 font-semibold flex-none">
              {summary}
            </div>
            <div className="row-start-3 col-span-full lg:row-start-2 lg:col-start-2 xl:col-start-3 lg:col-span-5 flex">
              {location}
            </div>
          </div>
        </div>
        <div className="place-self-center h-min my-auto">
          <p
            className="text-2xl transition-[transform] ease-out duration-200 delay-[0ms] select-none"
            style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            ❯
          </p>
        </div>
      </div>

      <div
        className="overflow-hidden transition-[max-height] ease-out duration-200"
        style={{ maxHeight }}
        ref={detailRef}
      >
        <div className="flex" ref={contentRef}>
          <div className="w-full">
          <div className="flex flex-col-reverse h-full md:grid md:grid-rows-1 md:grid-cols-6 xl:grid-cols-7">
            {hasCoordinates && (
              <div className="block z-0 min-h-[8rem] md:min-h-[auto] md:row-start-1 md:col-start-5 xl:col-start-1 md:col-span-2 md:ml-2 xl:mr-2 xl:ml-0">
                <MapComponent
                  key={mapKey}
                  latitude={mapLat}
                  longitude={mapLng}
                  zoom={10}
                />
              </div>
            )}
            <div className={`block h-max md:row-start-1 md:col-start-1 xl:col-start-3 ${hasCoordinates ? 'md:col-span-4 xl:col-span-5' : 'md:col-span-6 xl:col-span-7'} text-justify`}>
              {formatDescription(description)}
            </div>
          </div>
          </div>
          {width > 1280 && <p className="text-2xl invisible">❯</p>}
        </div>
      </div>
    </div>
  )
}
