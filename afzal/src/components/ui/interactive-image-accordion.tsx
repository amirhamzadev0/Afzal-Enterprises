"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface AccordionItem {
  title: string
  description: string
  image: string
  /** Show the whole image on a white card instead of cropping it (for logos). */
  contain?: boolean
}

export interface InteractiveImageAccordionProps extends React.ComponentProps<"div"> {
  items: readonly AccordionItem[]
  defaultIndex?: number
}

/**
 * A row of image panels; the active one opens up to show its title and text while the
 * others fold into slim strips. Hover (desktop), click, tap or keyboard focus opens a panel.
 * On narrow screens the panels stack and open vertically.
 */
export function InteractiveImageAccordion({ items, defaultIndex = 0, className, ...rest }: InteractiveImageAccordionProps) {
  const [active, setActive] = React.useState(defaultIndex)

  return (
    <div {...rest} className={cn("flex h-[640px] flex-col gap-3 md:h-[460px] md:flex-row", className)}>
      {items.map((item, i) => {
        const open = i === active
        return (
          <button
            key={item.title}
            type="button"
            aria-expanded={open}
            onClick={() => setActive(i)}
            onFocus={() => setActive(i)}
            onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
            className={cn(
              "group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-sky bg-white text-left shadow-md outline-none transition-[flex-grow,box-shadow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none",
              open ? "grow-[6] shadow-xl" : "grow",
            )}
            style={{ flexBasis: 0 }}
          >
            <img
              src={item.image}
              alt=""
              loading="lazy"
              draggable={false}
              className={cn(
                "absolute inset-0 size-full transition-transform duration-700 motion-reduce:transition-none",
                item.contain ? "object-contain p-8" : "object-cover",
                open ? "scale-100" : "scale-110",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-[#000050]/90 via-[#000050]/35 to-transparent transition-opacity duration-500",
                open ? "opacity-100" : "opacity-70",
              )}
            />

            {/* collapsed: a slim label */}
            <span
              className={cn(
                "absolute bottom-4 left-4 right-4 font-heading text-sm font-bold text-white transition-opacity duration-300 md:bottom-5 md:left-1/2 md:right-auto md:-translate-x-1/2 md:whitespace-nowrap md:text-base md:[writing-mode:vertical-rl] md:rotate-180",
                open ? "pointer-events-none opacity-0" : "opacity-100 delay-200",
              )}
            >
              {item.title}
            </span>

            {/* expanded: title and text */}
            <span
              className={cn(
                "absolute inset-x-0 bottom-0 block p-5 text-white transition-all duration-500 md:p-6",
                open ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-4 opacity-0",
              )}
            >
              <span className="mb-2 block h-1 w-10 rounded-full bg-brand" />
              <span className="block font-heading text-xl font-bold leading-tight md:text-2xl">{item.title}</span>
              <span className="mt-2 block max-w-md text-sm leading-relaxed text-white/90">{item.description}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
