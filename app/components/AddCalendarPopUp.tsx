'use client'

interface AddCalendarPopUpProps {
  baseUri: string
  calName: string
  closeEvent: () => void
}

export default function AddCalendarPopUp({ baseUri, calName, closeEvent }: AddCalendarPopUpProps) {
  const webcalUri = `webcal://${baseUri}`
  const httpUri = `https://${baseUri}`

  const subscribeLinks = [
    {
      name: 'Apple Calendar',
      url: webcalUri,
      icon: '/img/calendar/apple-calendar.png',
    },
    {
      name: 'Google Calendar',
      url: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUri)}`,
      icon: '/img/calendar/google-calendar.svg',
    },
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
            <strong>Astuce:</strong> L&apos;abonnement met automatiquement à jour votre calendrier avec les derniers matchs, à condition que votre équipe garde le même nom.
          </p>
        </div>
      </div>
    </div>
  )
}
