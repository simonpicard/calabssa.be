import { Metadata } from 'next'
import TeamCalendarClient from '../../components/TeamCalendarClient'
import TeamData from '../../data/teams.json'
import { getCalendarDataForTeam } from '../../lib/calendar-utils'
import { notFound } from 'next/navigation'

// Revalidate every 4 hours to keep match data current
export const revalidate = 14400

interface TeamPageProps {
  params: Promise<{
    teamId: string
  }>
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { teamId } = await params
  const teamInfo = (TeamData as any)[teamId]

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
  const saisonStartYearShort = saisonStartYear % 100

  const title = `${teamInfo.club_name} (eq. ${teamInfo.team_id}) en D${teamInfo.division} - Calendrier ABSSA ${saisonStartYear}/${(saisonStartYearShort + 1)}`
  const description = `Calendrier complet de ${teamInfo.club_name} (équipe ${teamInfo.team_id}) en division ${teamInfo.division}. Tous les matchs ABSSA: dates, horaires, adresses, terrains. Synchronisez avec votre agenda.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.calabssa.be/c/${teamId}/`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.calabssa.be/c/${teamId}/`,
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
  const { teamId } = await params
  const calendarData = await getCalendarDataForTeam(teamId)

  if (!calendarData) {
    notFound()
  }

  const teamInfo = (TeamData as any)[teamId]

  let saisonStartYear = new Date().getFullYear()
  if (new Date().getMonth() < 8) {
    saisonStartYear = saisonStartYear - 1
  }
  const saisonStartYearShort = saisonStartYear % 100

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: `${teamInfo.club_name} équipe ${teamInfo.team_id}`,
    sport: 'Soccer',
    gender: 'Male',
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'ABSSA',
      url: 'https://www.abssa.be/',
    },
    url: `https://www.calabssa.be/c/${teamId}/`,
    description: `Calendrier complet de ${teamInfo.club_name} (équipe ${teamInfo.team_id}) en division ${teamInfo.division}. Tous les matchs ABSSA saison ${saisonStartYear}/${(saisonStartYearShort + 1)}.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: teamInfo.street,
      addressLocality: teamInfo.municipality_short,
      postalCode: teamInfo.postal_code,
      addressCountry: 'BE',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TeamCalendarClient initialData={calendarData} teamId={teamId} />
    </>
  )
}
