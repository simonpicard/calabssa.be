'use client'

import HeaderBar from './components/HeaderBar'
import TeamData from './data/teams.json'

interface TemplateProps {
  children: React.ReactNode
}

export default function Template({ children }: TemplateProps) {
  return (
    <div>
      <div className="absolute z-0 top-0 inset-x-0 overflow-hidden pointer-events-none flex justify-end">
        <div className="w-[71.75rem] max-w-none flex-none">
          <img
            src="/img/bg-green.avif"
            alt="background"
            width="2296"
            height="668"
          />
        </div>
      </div>
      <div className="relative z-10">
        <HeaderBar data={TeamData} />

        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 mt-32 sm:mt-16 max-w-[1280px] mx-auto z-10">
          {children}
        </div>

        <footer className="text-sm px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 mt-16 max-w-[1280px] mx-auto text-[#334155]">
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-between">
            <p>
              Créé par{" "}
              <a
                href="https://www.simonmyway.com/"
                className="underline"
              >
                Simon
              </a>
            </p>
            <p className="text-gray-500">
              © {new Date().getFullYear()} CalABSSA - Site non officiel des calendriers de l&apos;ABSSA
            </p>
            <p>
              <a
                href="/about"
                className="underline mr-3"
              >
                CGU & Confidentialité
              </a>
              Code sur{" "}
              <a
                href="https://github.com/simonpicard/calabssa.be"
                className="underline"
              >
                GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
