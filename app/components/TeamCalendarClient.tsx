'use client'

import { useMemo, useState } from 'react'

import AddCalendarPopUp from './AddCalendarPopUp'
import { CalendarData } from '../lib/calendar-utils'
import Event from './Event'
import ExternalLinkIcon from './icons/ExternalLinkIcon'
import NewsletterSignup from './NewsletterSignup'
import TeamData from '../data/teams.json'
import Toggle from './Toggle'

interface TeamCalendarClientProps {
  initialData: CalendarData
  teamId: string
}

interface TeamInfo {
  club_name: string
  division: string
  field_id: string
  game_time: string
  color: string
  secretary: string
  phone_number: string
  email: string
  artificial_grass: boolean
  place: string
  municipality_short: string
  [key: string]: any
}

export default function TeamCalendarClient({ initialData, teamId }: TeamCalendarClientProps) {
  const [saveCal, setSaveCal] = useState(false)
  const [showPast, setShowPast] = useState(initialData.calSettings.displayPast)
  const [showContact, setShowContact] = useState(false)

  const teamInfo = (TeamData as any)[teamId] as TeamInfo

  // Find other teams from the same club
  const otherTeamsFromClub = useMemo(() => {
    if (!teamInfo?.club_id) return []

    return Object.entries(TeamData)
      .filter(([id, team]: [string, any]) =>
        team.club_id === teamInfo.club_id && id !== teamId
      )
      .map(([id, team]: [string, any]) => ({
        id,
        name: team.search_name,
        division: team.division
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [teamInfo, teamId])

  const handleClickAddAgenda = () => {
    setSaveCal(true)
  }

  // Use useMemo to ensure consistent filtering and stats calculation
  const { events, stats } = useMemo(() => {
    // Use Brussels timezone for consistency
    const brusselsTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Brussels" })
    const now = new Date(brusselsTime)
    const allEvents = initialData.icalEvents
    const futureEvents = allEvents.filter((e) => new Date(e.dtend) >= now)
    const pastEvents = allEvents.filter((e) => new Date(e.dtend) < now)

    // Calculate statistics
    const nextMatch = futureEvents[0]
    // Simple heuristic: if the team name appears first in summary, it's likely home
    const normalizedClubName = (teamInfo?.club_name || '').toLowerCase().replace(/\s+/g, ' ')
    const homeMatchesAll = allEvents.filter((e) => {
      const summary = e.summary?.toLowerCase() || ''
      const firstTeam = summary.split(' vs ')[0] || summary.split(' - ')[0]
      return firstTeam.includes(normalizedClubName)
    })
    const homeMatchesPlayed = homeMatchesAll.filter((e) => new Date(e.dtend) < now).length
    const awayMatchesAll = allEvents.filter((e) => {
      const summary = e.summary?.toLowerCase() || ''
      const firstTeam = summary.split(' vs ')[0] || summary.split(' - ')[0]
      return !firstTeam.includes(normalizedClubName)
    })
    const awayMatchesPlayed = awayMatchesAll.filter((e) => new Date(e.dtend) < now).length

    // Calculate days until next match
    const daysUntilNext = nextMatch
      ? Math.floor((new Date(nextMatch.dtend).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null

    const isNextMatchHome = nextMatch?.summary?.toLowerCase().split(' vs ')[0].includes(normalizedClubName) || false
    const nextMatchOpponent = nextMatch?.summary?.split(': ')[1]?.split(' vs ')[isNextMatchHome ? 1 : 0] || 'Adversaire'

    return {
      events: showPast ? allEvents : futureEvents,
      stats: {
        totalMatches: allEvents.length,
        playedMatches: pastEvents.length,
        upcomingMatches: futureEvents.length,
        nextMatch,
        daysUntilNext,
        homeMatchesTotal: homeMatchesAll.length,
        homeMatchesPlayed,
        awayMatchesTotal: awayMatchesAll.length,
        awayMatchesPlayed,
        completion: Math.round((pastEvents.length / allEvents.length) * 100),
        nextMatchOpponent,
        isNextMatchHome
      }
    }
  }, [showPast, initialData.icalEvents, teamInfo])

  return (
    <div>
      {saveCal && (
        <AddCalendarPopUp
          baseUri={initialData.icalParam.baseUri}
          calName={initialData.icalInfo['x-wr-calname']}
          closeEvent={() => setSaveCal(false)}
        />
      )}

      {/* Hero Section with Team Info */}
      <div className="bg-white backdrop-blur-sm border border-gray-200 text-gray-900 rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {initialData.icalInfo.displayNameFull}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 text-lg">
              {teamInfo?.division && (
                <span>Division {teamInfo.division}</span>
              )}
              {teamInfo?.game_time && (
                <span>• {teamInfo.game_time}</span>
              )}
              {teamInfo?.field_id && (
                <span>• Terrain {teamInfo.field_id}</span>
              )}
            </div>
          </div>
          <button
            className="bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
            onClick={handleClickAddAgenda}
          >
            📅 Ajouter à l&apos;agenda
          </button>
        </div>

        {/* Quick Stats */}
        {stats.nextMatch && (
          <div className="mt-6 p-4 bg-white/70 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Prochain match</p>
            <p className="text-xl font-semibold text-gray-900">
              {new Date(stats.nextMatch.dtend).toLocaleDateString('fr-BE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              }) + " contre " + stats.nextMatchOpponent + " à " + (stats.isNextMatchHome ? " domicile" : "l'extérieur")}
              {stats.isNextMatchHome ? " 🏠" : " 🚌"}
            </p>
            <p className="text-gray-600 mt-1">
              {stats.daysUntilNext === 0 ? "Aujourd'hui à " + new Date(stats.nextMatch.dtstart).toLocaleTimeString('fr-BE', {
                hour: '2-digit',
                minute: '2-digit',
              }) + " !" :
                stats.daysUntilNext === 1 ? "Demain à " + new Date(stats.nextMatch.dtstart).toLocaleTimeString('fr-BE', {
                  hour: '2-digit',
                  minute: '2-digit',
                }) + " !" :
                  `Dans ${stats.daysUntilNext} jours`}
            </p>
          </div>
        )}
      </div>

      {/* Team Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Matches */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total de la saison</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalMatches}</p>
          <p className="text-sm text-gray-600">matchs</p>
        </div>

        {teamInfo && (
          <>
            {/* Field Info */}
            {(teamInfo.place || teamInfo.municipality_short || teamInfo.field_id) && (
              teamInfo.address ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(teamInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer relative"
                >
                  {teamInfo.artificial_grass && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      🌱 Synthétique
                    </span>
                  )}
                  <p className="text-sm text-gray-600 mb-1">Terrain habituel</p>
                  <p className="font-semibold text-gray-900">
                    {teamInfo.place || <span className="text-gray-500 italic">Nom du terrain indisponible</span>}
                  </p>
                  {teamInfo.municipality_short && (
                    <p className="text-sm text-gray-600">{teamInfo.municipality_short}</p>
                  )}
                  <p className="mt-2 text-sm text-sky-600 flex items-center gap-1.5">
                    <img src="/images/google-maps-icon.png" alt="Google Maps" className="h-4 w-4" />
                    Ouvrir dans Google Maps
                    <ExternalLinkIcon className="h-3 w-3" />
                  </p>
                </a>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Terrain habituel</p>
                  <p className="font-semibold text-gray-900">
                    {teamInfo.place || <span className="text-gray-500 italic">Nom du terrain indisponible</span>}
                  </p>
                  {teamInfo.municipality_short && (
                    <p className="text-sm text-gray-600">{teamInfo.municipality_short}</p>
                  )}
                  {teamInfo.artificial_grass && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      🌱 Synthétique
                    </span>
                  )}
                </div>
              )
            )}

            {/* Colors */}
            {teamInfo.color && (
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Couleurs</p>
                <p className="font-semibold text-gray-900">👕 {teamInfo.color}</p>
              </div>
            )}

            {/* Secretary */}
            {teamInfo.secretary && (
              !showContact ? (
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setShowContact(true)}
                >
                  <p className="text-sm text-gray-600 mb-1">Secrétaire</p>
                  <p className="font-semibold text-gray-900">{teamInfo.secretary}</p>
                  <button className="mt-2 text-sm text-sky-600">
                    Cliquer pour afficher les contacts
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Secrétaire</p>
                  <p className="font-semibold text-gray-900">{teamInfo.secretary}</p>
                  <div className="space-y-1 mt-2">
                    {teamInfo.phone_number && (
                      <a href={`tel:${teamInfo.phone_number}`} className="block text-sm text-sky-600 hover:underline">
                        📞 {teamInfo.phone_number}
                      </a>
                    )}
                    {teamInfo.email && (
                      <a href={`mailto:${teamInfo.email}`} className="block text-sm text-sky-600 hover:underline">
                        ✉️ {teamInfo.email.replace('@', ' [at] ')}
                      </a>
                    )}
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-3xl font-bold text-green-600">{stats.upcomingMatches}</p>
          <p className="text-sm text-gray-600 mt-1">Matchs à venir</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-3xl font-bold text-gray-400">{stats.playedMatches}</p>
          <p className="text-sm text-gray-600 mt-1">Matchs joués</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">{stats.homeMatchesPlayed}/{stats.homeMatchesTotal}</p>
          <p className="text-sm text-gray-600 mt-1">🏠 Matchs à domicile</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">{stats.awayMatchesPlayed}/{stats.awayMatchesTotal}</p>
          <p className="text-sm text-gray-600 mt-1">🚌 Matchs à l'extérieur</p>
        </div>
      </div>

      {/* Other teams from the same club */}
      {otherTeamsFromClub.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Autres équipes de {teamInfo?.club_name}:
          </p>
          <div className="flex flex-wrap gap-2">
            {otherTeamsFromClub.map((team) => (
              <a
                key={team.id}
                href={`/c/${team.id}`}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition-colors"
              >
                <span className="font-medium">{team.name.split(' - ').slice(1).join(' - ') || team.name}</span>
                {team.division && (
                  <span className="ml-2 text-xs text-gray-500">(Div. {team.division})</span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Début de saison</span>
          <span>{stats.playedMatches} / {stats.totalMatches} matchs joués</span>
          <span>Fin de saison</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-sky-500 rounded-full transition-all duration-500"
            style={{ width: `${stats.completion}%` }}
          />
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Calendrier des matchs</h2>
        <Toggle state={showPast} setState={setShowPast}>
          Afficher les matches passés
        </Toggle>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {!showPast && stats.playedMatches > 0 ? (
            <>
              <p className="text-gray-900 text-xl font-semibold mb-4">
                La saison est terminée !
              </p>
              <div className="mx-auto max-w-md mb-6 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-left">
                <p>
                  Ce calendrier ne tient pas compte des journées reportées.
                  Il se peut que certains matchs soient encore à venir.
                </p>
              </div>
              <button
                onClick={() => setShowPast(true)}
                className="text-sky-600 underline"
              >
                Voir les {stats.playedMatches} matchs passés
              </button>
              <p className="mt-6 text-gray-500 text-sm">
                Inscrivez-vous à la newsletter ci-dessous pour être
                informé dès que les matchs de la prochaine saison
                seront disponibles&nbsp;↓
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-lg">
              {showPast ? 'Aucun match trouvé' : 'Aucun match à venir'}
            </p>
          )}
        </div>
      ) : (
        <div className="divide-solid divide-y divide-slate-900/10">
          {events.map((e) => {
            const { key, ...eventProps } = e
            return <Event key={key} {...eventProps} />
          })}
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-16">
        <NewsletterSignup />
      </div>
    </div>
  )
}
