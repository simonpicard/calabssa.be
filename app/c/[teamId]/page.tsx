import { Metadata } from 'next'
import TeamCalendarClient from '../../components/TeamCalendarClient'
import TeamData from '../../data/teams.json'
import { getCalendarDataForTeam } from '../../lib/calendar-utils'
import { notFound } from 'next/navigation'

// Revalidate every 4 hours to keep match data current
export const revalidate = 14400

interface TeamPageProps {
  params: {
    teamId: string
  }
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const teamInfo = (TeamData as any)[params.teamId]

  if (!teamInfo) {
    return {
      title: 'Équipe non trouvée',
      description: 'Cette équipe ABSSA n\'existe pas dans notre base de données.',
    }
  }

  let saisonStartYear = new Date().getFullYear()
  if (new Date().getMonth() < 8) {
    saisonStartYear = saisonStartYear - 1
  }

  const title = `${teamInfo.search_name} - Calendrier ABSSA ${saisonStartYear}/${(saisonStartYear + 1) % 100}`
  const description = `Calendrier complet de ${teamInfo.club_name} (équipe ${teamInfo.team_id}). Tous les matchs ABSSA: dates, horaires, adresses, terrains. Synchronisez avec votre agenda.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.calabssa.be/c/${params.teamId}/`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.calabssa.be/c/${params.teamId}/`,
    },
  }
}

export async function generateStaticParams() {
  // Generate static params for all teams for better SEO
  return Object.keys(TeamData).map((teamId) => ({
    teamId,
  }))
}

export default async function TeamPage({ params }: TeamPageProps) {
  const calendarData = await getCalendarDataForTeam(params.teamId)

  if (!calendarData) {
    notFound()
  }

  const teamInfo = (TeamData as any)[params.teamId]

  let saisonStartYear = new Date().getFullYear()
  if (new Date().getMonth() < 8) {
    saisonStartYear = saisonStartYear - 1
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: teamInfo.search_name,
    sport: 'Soccer',
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'ABSSA',
      url: 'https://www.abssa.be/',
    },
    url: `https://www.calabssa.be/c/${params.teamId}/`,
    description: `Calendrier complet de ${teamInfo.club_name} (équipe ${teamInfo.team_id}). Tous les matchs ABSSA ${saisonStartYear}/${(saisonStartYear + 1) % 100}.`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TeamCalendarClient initialData={calendarData} teamId={params.teamId} />
    </>
  )
}
