import AboutData from '../data/about.json'
import Accordion from '../components/Accordion'
import type { Metadata } from 'next'

interface AboutItem {
  q: string
  a: string
}

export const metadata: Metadata = {
  title: 'À propos de CalABSSA - Les calendriers ABSSA',
  description: 'À propos de CalABSSA, un outil pour visualiser les matchs d\'ABSSA, une ligue de football amateur belge, en regroupant différentes informations dans un calendrier.
}

export default function AboutPage() {
  const aboutItems = AboutData as AboutItem[]

  return (
    <div
      id="about-page"
      className="block divide-solid divide-y divide-slate-900/10 text-[#334155] items-center"
    >
      {aboutItems.map((value, key) => {
        return (
          <Accordion className="py-2" key={key}>
            <div className="font-semibold">{value.q}</div>
            <div className="text-justify">
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: value.a }}
              />
            </div>
          </Accordion>
        )
      })}
    </div>
  )
}
