import TeamData from '../data/teams.json'

// Calculate Levenshtein distance between two strings
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  return matrix[len1][len2]
}

export interface TeamMatch {
  teamId: string
  teamName: string
  division?: string
  place?: string
  municipalityShort?: string
  score: number
}

export function findSimilarTeams(searchTerm: string, limit: number = 5): TeamMatch[] {
  // Truncate search term to prevent DoS attacks with extremely long strings
  const maxLength = 100
  const truncatedTerm = searchTerm.length > maxLength ? searchTerm.substring(0, maxLength) : searchTerm

  const teams = TeamData as Record<string, {
    search_name: string
    club_name: string
    division?: string
    place?: string
    municipality_short?: string
  }>
  const searchLower = truncatedTerm.toLowerCase()

  const matches: TeamMatch[] = Object.entries(teams).map(([teamId, teamInfo]) => {
    const teamNameLower = teamInfo.search_name.toLowerCase()
    const clubNameLower = teamInfo.club_name.toLowerCase()
    const teamIdLower = teamId.toLowerCase()

    // Calculate distances for team name, club name, and teamId
    const nameDistance = levenshteinDistance(searchLower, teamNameLower)
    const clubDistance = levenshteinDistance(searchLower, clubNameLower)
    const idDistance = levenshteinDistance(searchLower, teamIdLower)

    // Use the smallest distance (best match)
    const distance = Math.min(nameDistance, clubDistance, idDistance)

    // Check if search term is contained in any field (substring match)
    const isSubstring =
      teamNameLower.includes(searchLower) ||
      clubNameLower.includes(searchLower) ||
      teamIdLower.includes(searchLower)

    // Calculate score (lower is better, heavily prioritize substring matches)
    const score = isSubstring ? distance - 1000 : distance

    return {
      teamId,
      teamName: teamInfo.search_name,
      division: teamInfo.division,
      place: teamInfo.place,
      municipalityShort: teamInfo.municipality_short,
      score,
    }
  })

  // Sort by score (ascending) and return top matches
  return matches
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
}
