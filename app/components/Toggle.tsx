'use client'

interface ToggleProps {
  state: boolean
  setState: (state: boolean) => void
  children: React.ReactNode
}

export default function Toggle({ state, setState, children }: ToggleProps) {
  const handleToggle = () => {
    setState(!state)
  }

  return (
    <div className="flex items-center space-x-3 mb-4">
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state ? 'bg-sky-600' : 'bg-gray-200'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
      <label className="text-base font-medium">{children}</label>
    </div>
  )
}
