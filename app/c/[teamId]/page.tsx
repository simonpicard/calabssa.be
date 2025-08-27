import { getCalendarDataForTeam } from '../../lib/calendar-utils'
import CalendarClient from '../../components/CalendarClient'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import TeamData from '../../data/teams.json'

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
  
  const title = `${teamInfo.search_name} - Calendrier ABSSA ${new Date().getFullYear()}`
  const description = `Calendrier complet de ${teamInfo.search_name} (${teamInfo.club_name}). Tous les matchs ABSSA: dates, horaires, adresses, terrains. Synchronisez avec votre agenda.`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://calabssa.be/c/${params.teamId}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://calabssa.be/c/${params.teamId}`,
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
  
  return <CalendarClient initialData={calendarData} />
}