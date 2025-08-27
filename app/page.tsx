import CalendarIntegration from './components/CalendarIntegration'
import DayDiv from './data/dayDiv.json'
import HeroSection from './components/HeroSection'
import HomepageCalendar from './components/HomepageCalendar'
import NewsletterSignup from './components/NewsletterSignup'
import PricingSection from './components/PricingSection'
import TeamData from './data/teams.json'
import { getDefaultCalendarData } from './lib/calendar-utils'

export default async function HomePage() {
  const { calendarData, divisionInfo } = await getDefaultCalendarData()

  return (
    <div>
      <HeroSection teamData={TeamData} divisionData={DayDiv} />

      {/* Section 1: Web App */}
      <section className="mb-20">
        <HomepageCalendar initialData={calendarData} divisionInfo={divisionInfo} />
      </section>

      {/* Section 2: Calendar Integration */}
      <section className="mb-20">
        <CalendarIntegration />
      </section>

      {/* Section 3: Pricing */}
      <section className="mb-20">
        <PricingSection />
      </section>

      {/* Section 4: Newsletter */}
      <section>
        <NewsletterSignup />
      </section>
    </div>
  )
}
