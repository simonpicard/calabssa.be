'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface AccordionProps {
  className?: string
  children: ReactNode[]
  openAction?: () => void
  offsetArrow?: boolean
  defaultOpen?: boolean
}

export default function Accordion({
  className = '',
  children,
  openAction,
  offsetArrow = false,
  defaultOpen = false
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [maxHeight, setMaxHeight] = useState<string>(defaultOpen ? '1000px' : '0px')
  const detailRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [summary, ...details] = Array.isArray(children) ? children : [children]

  useEffect(() => {
    if (open && contentRef.current) {
      // Measure the actual content height when opened
      const contentHeight = contentRef.current.scrollHeight
      setMaxHeight(`${contentHeight}px`)
    } else {
      setMaxHeight('0px')
    }
  }, [open, details]) // Re-measure if content changes

  const toggleHandler = () => {
    setOpen(!open)
    if (openAction) openAction()
  }

  return (
    <div className={className}>
      <div
        className="relative flex hover:text-sky-600 cursor-pointer select-none"
        onClick={toggleHandler}
      >
        <div className="w-full min-h-full items-center flex">{summary}</div>
        <div className="place-self-center h-min my-auto">
          <p
            className="text-2xl transition-transform ease-out duration-200 select-none"
            style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            ❯
          </p>
        </div>
      </div>

      <div
        className="overflow-hidden transition-[max-height] ease-out duration-200"
        style={{ maxHeight }}
        ref={detailRef}
      >
        <div className="flex" ref={contentRef}>
          <div className="w-full">
            {details}
          </div>
          {offsetArrow && <p className="text-2xl invisible">❯</p>}
        </div>
      </div>
    </div>
  )
}
