'use client'

interface TeamInfo {
  search_name: string
  club_name: string
  club_id: string | number
  team_id: string | number
  [key: string]: any
}

interface HeroSectionProps {
  teamData: Record<string, TeamInfo>
  divisionData: Record<string, any>
}

export default function HeroSection({ teamData, divisionData }: HeroSectionProps) {
  // Calculate real statistics
  const totalTeams = Object.keys(teamData).length

  // Count unique clubs
  const uniqueClubs = new Set(
    Object.values(teamData).map(team => team.club_id)
  ).size

  // Count unique divisions (like 1, 2A, 2B, 3A, etc.)
  const uniqueDivisions = new Set(
    Object.values(divisionData).map((div: any) => div.division)
  ).size

  // Count unique journées (match days)
  const uniqueJournees = new Set(
    Object.values(divisionData).map((div: any) => div.day)
  ).size

  return (
    <div className="mb-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Bienvenue sur CalABSSA
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Calendriers de l&apos;Association Belge des Sports du Samedi.
          Trouvez votre équipe et synchronisez vos matchs de foot du samedi avec votre agenda.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-sky-600">{totalTeams}</span>
            <span className="text-gray-600">Équipes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-green-600">{uniqueClubs}</span>
            <span className="text-gray-600">Clubs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-purple-600">{uniqueDivisions}</span>
            <span className="text-gray-600">Divisions</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-orange-600">{uniqueJournees}</span>
            <span className="text-gray-600">Journées</span>
          </div>
        </div>
      </div>
    </div>
  )
}
