import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
      <p className="text-lg text-gray-600 mb-6">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
