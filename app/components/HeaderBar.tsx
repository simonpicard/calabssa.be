'use client'

import Link from 'next/link'
import SearchBar from './SearchBar'

interface TeamInfo {
  search_name: string
  club_name: string
  club_id: string | number
  team_id: string | number
  [key: string]: any
}

interface HeaderBarProps {
  data: Record<string, TeamInfo>
}

export default function HeaderBar({ data }: HeaderBarProps) {
  return (
    <div className="fixed block top-0 border-b border-slate-900/10 w-full backdrop-blur bg-white/75 z-20 sm:space-y-0 divide-y">
      <div className="sm:hidden flex w-full p-2 items-center">
        <Link href="/" className="flex items-center">
          <img
            src="/icon/calabssa-logo.svg"
            className="h-9 w-9 min-w-[36px] min-h-[36px] mr-2"
            alt="CalABSSA icon"
          />
          <p className="font-semibold text-2xl">CalABSSA</p>
        </Link>
        <Link href="/about" className="font-semibold text-2xl w-max ml-auto">
          <p>À propos</p>
        </Link>
      </div>
      <div className="flex md:grid md:grid-cols-4 h-16 sm:space-x-4 items-center p-2">
        <Link href="/" className="hidden sm:flex items-center w-max">
          <img
            src="/icon/calabssa-logo.svg"
            className="h-9 w-9 min-w-[36px] min-h-[36px] md:mr-2"
            alt="CalABSSA icon"
          />
          <p className="font-semibold text-2xl hidden md:block">CalABSSA</p>
        </Link>
        <SearchBar data={data} placeholder="Chercher une équipe" />
        <div className="hidden sm:grid">
          <Link href="/about" className="place-self-end">
            <p className="font-semibold text-lg sm:text-2xl w-max">À propos</p>
          </Link>
        </div>
      </div>
    </div>
  )
}