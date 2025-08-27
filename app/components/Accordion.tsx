'use client'

import { ReactNode, useRef, useState } from 'react'

interface AccordionProps {
  className?: string
  children: ReactNode[]
  openAction?: () => void
  offsetArrow?: boolean
}

export default function Accordion({
  className = '',
  children,
  openAction,
  offsetArrow = false
}: AccordionProps) {
  const [open, setOpen] = useState(false)
  const detailRef = useRef<HTMLDivElement>(null)

  const [summary, ...details] = Array.isArray(children) ? children : [children]

  const toggleHandler = () => {
    setOpen(!open)
    if (openAction) openAction()
  }

  return (
    <div className={className}>
      <div
        className="relative flex hover:text-sky-600 cursor-pointer"
        onClick={toggleHandler}
      >
        <div className="w-full min-h-full items-center flex">{summary}</div>
        <div className="place-self-center h-min my-auto">
          <p
            className="text-2xl transition-[transform] ease-out duration-200 delay-[0ms] select-none"
            style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            ❯
          </p>
        </div>
      </div>

      <div
        className="flex overflow-hidden transition-[max-height] ease-out duration-200 delay-[0ms]"
        style={{
          maxHeight: open ? (detailRef.current?.scrollHeight || 0) + 'px' : '0px',
        }}
        ref={detailRef}
      >
        <div className="w-full">
          {details}
        </div>
        {offsetArrow && <p className="text-2xl invisible">❯</p>}
      </div>
    </div>
  )
}
