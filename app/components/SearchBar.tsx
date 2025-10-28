'use client'

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface TeamInfo {
  search_name: string
  club_name: string
  club_id: string | number
  team_id: string | number
  [key: string]: any
}

interface SearchBarProps {
  placeholder: string
  data: Record<string, TeamInfo>
}

export default function SearchBar({ placeholder, data }: SearchBarProps) {
  const [filteredData, setFilteredData] = useState<[string, TeamInfo][]>([])
  const [wordEntered, setWordEntered] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const resultRef = useRef<HTMLDivElement>(null)
  const selectedResultRef = useRef<HTMLParagraphElement>(null)

  const router = useRouter()

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchWord = event.target.value
    setWordEntered(searchWord)

    if (searchWord === '') {
      setFilteredData([])
      return
    }

    const strictFilteredIn: [string, TeamInfo][] = []
    const strictFilteredOut: [string, TeamInfo][] = []

    for (const [key, value] of Object.entries(data)) {
      (value.search_name
        .toLowerCase()
        .split(' - ')[1]
        .substring(0, searchWord.length) === searchWord.toLowerCase()
        ? strictFilteredIn
        : strictFilteredOut
      ).push([key, value])
    }

    const generalFilteredIn = strictFilteredOut.filter(([_, value]) => {
      return value.search_name.toLowerCase().includes(searchWord.toLowerCase())
    })

    const newFilter = strictFilteredIn.concat(generalFilteredIn)
    setFilteredData(newFilter)
  }

  const clearInput = () => {
    setFilteredData([])
    setWordEntered('')
    setFocusedIndex(-1)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event
    let nextIndex = focusedIndex

    if (key === 'ArrowDown') {
      if (filteredData.length > 0) {
        nextIndex = (focusedIndex + 1) % Math.min(8, filteredData.length)
        setFocusedIndex(nextIndex)
      }
    } else if (key === 'ArrowUp') {
      if (filteredData.length > 0) {
        nextIndex =
          (focusedIndex - 1 + Math.min(8, filteredData.length)) %
          Math.min(8, filteredData.length)
        setFocusedIndex(nextIndex)
      }
    } else if (key === 'Escape') {
      clearInput()
    } else if (key === 'Enter') {
      if (nextIndex !== -1 && selectedResultRef.current) {
        const calId = selectedResultRef.current.id
        clearInput()
        router.push(`/c/${calId}`)
      } else if (wordEntered.trim() !== '') {
        // No suggestions but user pressed Enter - navigate to not-found page with fuzzy search
        clearInput()
        router.push(`/c/${encodeURIComponent(wordEntered.trim())}`)
      }
    } else {
      setFocusedIndex(-1)
    }
  }

  const handleMouseOver = (event: React.MouseEvent<HTMLParagraphElement>) => {
    const nextIndex = parseInt(event.currentTarget.getAttribute('data-value') || '-1')
    setFocusedIndex(nextIndex)
  }

  const handleMouseOut = () => {
    setFocusedIndex(-1)
  }

  const handleClick = (event: React.MouseEvent<HTMLParagraphElement>) => {
    const calId = event.currentTarget.id
    clearInput()
    router.push(`/c/${calId}`)
  }

  return (
    <div className="relative sm:text-lg font-semibold w-full h-full col-span-2">
      <div
        className="absolute border-2 rounded-3xl bg-white w-full transition-[filter] ease-out duration-200 delay-[0ms]"
        style={{
          filter:
            filteredData.length > 0
              ? 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))'
              : 'drop-shadow(0 0 #0000)',
        }}
        onKeyDown={handleKeyDown}
        onMouseOut={handleMouseOut}
      >
        <div className="flex p-1 h-11">
          <input
            type="text"
            placeholder={placeholder}
            value={wordEntered}
            onChange={handleFilter}
            className="h-auto w-full p-4 focus:outline-none rounded-3xl"
          />
          <div className="w-6 grid place-items-center mr-2 cursor-pointer">
            {wordEntered.length !== 0 && (
              <svg
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={clearInput}
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
            )}
          </div>
        </div>
        {filteredData.length > 0 && <div className="border-t-2 sm:mx-4" />}
        <div
          ref={resultRef}
          className="sm:text-lg overflow-hidden transition-[max-height] ease-out duration-200 delay-[0ms] rounded-b-3xl"
          style={{
            maxHeight:
              Math.max(0, Math.min(8, filteredData.length) * (48 + 1) - 1) +
              'px',
          }}
        >
          {filteredData.slice(0, 8).map((value, key) => {
            return (
              <p
                key={key}
                data-value={key}
                ref={key === focusedIndex ? selectedResultRef : null}
                id={value[0]}
                className="flex py-3 sm:py-1 items-center bg-white px-4 cursor-pointer border-b sm:border-b-0"
                onMouseOver={handleMouseOver}
                onClick={handleClick}
                style={{
                  background: key === focusedIndex ? 'rgb(56 189 248)' : '',
                  color: key === focusedIndex ? 'white' : '',
                }}
              >
                {value[1].search_name}
              </p>
            )
          })}
        </div>
      </div>
    </div>
  )
}