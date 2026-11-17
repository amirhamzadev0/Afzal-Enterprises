"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import createGlobe, { type COBEOptions } from "cobe"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface GlobePlace {
  name: string
  /** [latitude, longitude] */
  location: [number, number]
}

export interface GlobeFeatureSectionProps extends React.ComponentProps<"section"> {
  eyebrow?: string
  heading: string
  description: string
  origin: GlobePlace
  destinations: GlobePlace[]
  ctaLabel?: string
  ctaHref?: string
}

const NAVY: [number, number, number] = [0, 0, 0.5]
const RED: [number, number, number] = [0.8, 0, 0]

export default function GlobeFeatureSection({ eyebrow, heading, description, origin, destinations, ctaLabel, ctaHref, className, ...rest }: GlobeFeatureSectionProps) {
  const config = React.useMemo(
    () => ({
      devicePixelRatio: 2,
      phi: 4.2,
      theta: 0.3,
      dark: 0,
      diffuse: 0.5,
      mapSamples: 16000,
      mapBrightness: 1.15,
      baseColor: [1, 1, 1] as [number, number, number],
      markerColor: RED,
      glowColor: [0.7, 0.86, 1] as [number, number, number],
      markerElevation: 0.01,
      arcColor: RED,
      arcWidth: 0.5,
      arcHeight: 0.28,
      markers: [
        { location: origin.location, size: 0.1, color: NAVY },
        ...destinations.map((d) => ({ location: d.location, size: 0.055 })),
      ],
      arcs: destinations.map((d) => ({ from: origin.location, to: d.location })),
    }),
    [origin, destinations],
  )

  return (
    <section {...rest} className={cn("panel-sky relative w-full overflow-hidden px-6 py-12 md:px-14 md:py-16", className)}>
      <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
        <div className="z-10 max-w-xl text-left">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">{eyebrow}</p>}
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">{heading}</h2>
          <p className="mt-4 text-muted-foreground">{description}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Destination countries">
            {destinations.map((d) => (
              <li key={d.name} className="rounded-full border border-sky bg-white/80 px-3 py-1 text-xs font-medium text-primary">{d.name}</li>
            ))}
          </ul>
          {ctaLabel && (
            <Button asChild variant="brand" size="lg" className="mt-8 gap-2 rounded-full px-6 font-semibold">
              <a href={ctaHref ?? "#contact"}>
                {ctaLabel} <ArrowRight className="size-4" />
              </a>
            </Button>
          )}
        </div>
        <div className="relative aspect-square w-full max-w-[520px] shrink-0">
          <Globe config={config} className="absolute inset-0" />
        </div>
      </div>
    </section>
  )
}

type GlobeConfig = Omit<COBEOptions, "width" | "height" | "onRender">

export function Globe({ className, config }: { className?: string; config: GlobeConfig }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const drag = React.useRef<{ start: number; offset: number } | null>(null)
  const offsetRef = React.useRef(0)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let width = canvas.offsetWidth
    let phi = config.phi
    let raf = 0
    let visible = true

    const globe = createGlobe(canvas, { ...config, width: width * 2, height: width * 2 })
    requestAnimationFrame(() => { canvas.style.opacity = "1" })

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      if (!drag.current && !reduced) phi += 0.004
      globe.update({ phi: phi + offsetRef.current, width: width * 2, height: width * 2 })
    }
    raf = requestAnimationFrame(frame)

    const onResize = () => { width = canvas.offsetWidth }
    window.addEventListener("resize", onResize)
    const io = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      io.disconnect()
      globe.destroy()
    }
  }, [config])

  const setGrab = (grabbing: boolean) => {
    if (canvasRef.current) canvasRef.current.style.cursor = grabbing ? "grabbing" : "grab"
  }

  return (
    <div className={cn("mx-auto aspect-square w-full", className)}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Rotating globe with routes from Rawalpindi to our destination countries"
        className="size-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        onPointerDown={(e) => { drag.current = { start: e.clientX, offset: offsetRef.current }; setGrab(true) }}
        onPointerMove={(e) => { if (drag.current) offsetRef.current = drag.current.offset + (e.clientX - drag.current.start) / 200 }}
        onPointerUp={() => { drag.current = null; setGrab(false) }}
        onPointerLeave={() => { drag.current = null; setGrab(false) }}
      />
    </div>
  )
}
