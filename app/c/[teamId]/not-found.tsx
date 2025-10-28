'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { findSimilarTeams } from '../../lib/search-utils'

export default function NotFound() {
  const params = useParams()
  const teamId = params?.teamId as string

  const maxLength = 100
  const isTruncated = teamId && teamId.length > maxLength
  const displayTeamId = isTruncated ? teamId.substring(0, maxLength) + '...' : teamId

  const suggestions = teamId ? findSimilarTeams(teamId, 5) : []

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Équipe non trouvée
          </h1>
          <p className="text-gray-600">
            L'équipe <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm break-all">{displayTeamId}</span> n'existe pas dans notre base de données.
          </p>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Peut-être recherchiez-vous :
            </h2>
            <div className="space-y-2">
              {suggestions.map((team) => (
                <Link
                  key={team.teamId}
                  href={`/c/${team.teamId}`}
                  className="block p-4 bg-gray-50 hover:bg-sky-50 rounded-lg transition-colors border border-gray-200 hover:border-sky-300"
                >
                  <div className="font-semibold text-gray-900">
                    {team.teamName}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {team.division && <span>Division {team.division}</span>}
                    {team.division && (team.place || team.municipalityShort) && <span> • </span>}
                    {team.place && <span>{team.place}</span>}
                    {team.place && team.municipalityShort && <span>, </span>}
                    {team.municipalityShort && <span>{team.municipalityShort}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <Link
            href="/"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
