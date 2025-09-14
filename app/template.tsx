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

        <footer className="text-sm px-4 sm:px-6 md:px-8 pb-4 mt-8 max-w-[1280px] mx-auto text-[#334155]">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-x-6 sm:gap-y-3 sm:justify-between items-center sm:items-start">
            <div className="text-center sm:text-left order-2 sm:order-1">
              <p className="text-gray-500 flex flex-col sm:flex-row sm:gap-2">
                <span>© {new Date().getFullYear()} CalABSSA</span>
                <span className="text-xs sm:text-sm text-gray-400">
                  - Site non officiel des calendriers de l&apos;ABSSA
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center order-1 sm:order-2">
              <a
                href="/about"
                className="underline hover:text-gray-700 transition-colors"
              >
                CGU & Confidentialité
              </a>
              <div className="flex gap-4 items-center">
                <span>
                  Créé par{" "}
                  <a
                    href="https://www.simonmyway.com/"
                    className="underline hover:text-gray-700 transition-colors"
                  >
                    Simon
                  </a>
                </span>
                <span className="text-gray-400">•</span>
                <span>
                  Code sur{" "}
                  <a
                    href="https://github.com/simonpicard/calabssa.be"
                    className="underline hover:text-gray-700 transition-colors"
                  >
                    GitHub
                  </a>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
