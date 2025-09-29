'use client'

import { useState } from 'react'

interface AddCalendarPopUpProps {
  baseUri: string
  calName: string
  closeEvent: () => void
}

export default function AddCalendarPopUp({ baseUri, calName, closeEvent }: AddCalendarPopUpProps) {
  const webcalUri = `webcal://${baseUri}`
  const httpUri = `https://${baseUri}`
  const [showGoogleSteps, setShowGoogleSteps] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(httpUri)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const subscribeLinks = [
    {
      name: 'Apple Calendar',
      url: webcalUri,
      icon: '/img/calendar/apple-calendar.png',
    },
    // Old Google Calendar method (kept for future re-enabling)
    // {
    //   name: 'Google Calendar',
    //   url: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUri)}`,
    //   icon: '/img/calendar/google-calendar.svg',
    // },
    {
      name: 'Outlook.com',
      url: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(httpUri)}&name=${encodeURIComponent(calName)}`,
      icon: '/img/calendar/outlook-calendar.svg',
    },
    {
      name: 'Windows Calendar',
      url: webcalUri,
      icon: '/img/calendar/windows-calendar.svg',
    },
  ]

  const downloadLink = {
    name: 'Télécharger le fichier .ics',
    url: httpUri,
    icon: '/img/calendar/file.svg',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={closeEvent}>
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ajouter à votre agenda</h2>
          <button
            onClick={closeEvent}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Choisissez votre application calendrier pour vous abonner automatiquement aux matchs
          </p>

          {/* Google Calendar with steps */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setShowGoogleSteps(!showGoogleSteps)}
              className="flex items-center p-3 w-full hover:bg-gray-50 transition-colors"
            >
              <img src="/img/calendar/google-calendar.svg" alt="Google Calendar" className="w-8 h-8 mr-3" />
              <span className="font-medium flex-1 text-left">Google Calendar</span>
              <svg
                className={`w-5 h-5 transition-transform ${showGoogleSteps ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showGoogleSteps && (
              <div className="px-3 pb-3 border-t bg-gray-50">
                <div className="mt-3 space-y-3">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">Copier l'URL du calendrier</p>
                      <button
                        onClick={handleCopyUrl}
                        className="mt-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        {copiedUrl ? 'URL copiée !' : 'Copier l\'URL'}
                      </button>
                      <p className="text-xs text-gray-600 mt-2">Ou copier manuellement :</p>
                      <div className="mt-1 p-2 bg-white border rounded text-xs font-mono break-all select-all">
                        {httpUri}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">Ouvrir Google Calendar</p>
                      <a
                        href="https://calendar.google.com/calendar/u/0/r/settings/addbyurl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1 text-sm text-blue-600 hover:underline"
                      >
                        Aller à la page d'ajout →
                      </a>
                      <p className="text-xs text-orange-600 mt-1 font-medium">
                        ⚠️ Sur mobile : ouvrez ce lien dans votre navigateur web, pas dans l'app Google Calendar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">Coller l'URL et cliquer sur "Ajouter un agenda"</p>
                      <p className="text-xs text-gray-600 mt-1">L'URL a été copiée à l'étape 1</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {subscribeLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img src={link.icon} alt={link.name} className="w-8 h-8 mr-3" />
              <span className="font-medium">{link.name}</span>
            </a>
          ))}

          <div className="pt-3 mt-3 border-t">
            <a
              href={downloadLink.url}
              download
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img src={downloadLink.icon} alt={downloadLink.name} className="w-8 h-8 mr-3" />
              <span className="font-medium">{downloadLink.name}</span>
            </a>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Astuce:</strong> L&apos;abonnement met automatiquement à jour votre calendrier de saison en saison, à condition que votre équipe garde le même nom.
          </p>
        </div>
      </div>
    </div>
  )
}
