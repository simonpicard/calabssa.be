export default function PricingSection() {
  return (
    <section className="mt-20 bg-gradient-to-r from-green-50 to-sky-50 rounded-2xl p-8 md:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ⚽ 100% <span className="text-purple-600">Gratuit</span> - Un projet né sur le terrain
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          CalABSSA est <span className="font-semibold">100% gratuit</span>. Ce projet est né d&apos;un problème simple :
          en rejoignant mon équipe ABSSA, j&apos;en avais marre de noter manuellement les dates de match.
          J&apos;ai d&apos;abord créé un script Python pour mon équipe, puis j&apos;ai réalisé que toutes les équipes
          de la ligue pourraient en bénéficier. CalABSSA est devenu mon terrain d&apos;apprentissage
          pour le développement web moderne.
        </p>
        <a
          href="https://www.simonmyway.com/blog/i-learned-dynamic-web-development-by-playing-soccer"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium"
        >
          Lire l&apos;histoire complète du projet
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </section >
  )
}
