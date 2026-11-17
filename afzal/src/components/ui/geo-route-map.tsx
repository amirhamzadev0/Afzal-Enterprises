import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import landTopology from 'world-atlas/land-110m.json'

export interface RoutePlace {
  id: string
  name: string
  /** Airport / hub code printed in the route list, e.g. "RUH". */
  code: string
  /** [longitude, latitude] */
  coord: [number, number]
}

export interface GeoRouteMapProps extends React.ComponentProps<'div'> {
  origin: RoutePlace
  destinations: RoutePlace[]
  /** Cycle through the routes until the visitor picks one. */
  autoplay?: boolean
  /** Milliseconds each route stays highlighted during autoplay. */
  interval?: number
}

const WIDTH = 1000
const HEIGHT = 500

const topology = landTopology as unknown as Topology<{ land: GeometryCollection }>
const land = feature(topology, topology.objects.land)
const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], { type: 'Sphere' })
const path = geoPath(projection)
const landPath = path(land) ?? ''
const gridPath = path(geoGraticule10()) ?? ''
// Antarctica is cropped out: the view starts just above the Arctic and ends at lat -58
const top = (projection([0, 80]) ?? [0, 0])[1] - 6
const bottom = (projection([0, -58]) ?? [0, HEIGHT])[1]

function project(coord: [number, number]) {
  const p = projection(coord)
  return { x: p?.[0] ?? 0, y: p?.[1] ?? 0 }
}

function arc(from: { x: number; y: number }, to: { x: number; y: number }) {
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const distance = Math.hypot(to.x - from.x, to.y - from.y)
  return `M${from.x.toFixed(1)} ${from.y.toFixed(1)} Q${mx.toFixed(1)} ${(my - distance * 0.32).toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
}

export function GeoRouteMap({ origin, destinations, autoplay = true, interval = 3200, className, ...rest }: GeoRouteMapProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const reduced = useReducedMotion()
  const [selected, setSelected] = React.useState(0)
  const [auto, setAuto] = React.useState(autoplay)
  const [paused, setPaused] = React.useState(false)

  const from = React.useMemo(() => project(origin.coord), [origin.coord])
  const routes = React.useMemo(
    () => destinations.map((place) => {
      const to = project(place.coord)
      return { place, to, d: arc(from, to) }
    }),
    [destinations, from],
  )

  React.useEffect(() => {
    if (!auto || paused || reduced || routes.length < 2) return
    const timer = window.setInterval(() => setSelected((i) => (i + 1) % routes.length), interval)
    return () => window.clearInterval(timer)
  }, [auto, paused, reduced, routes.length, interval])

  const pick = (index: number) => { setAuto(false); setSelected(index) }
  const current = routes[selected]
  const labelX = current ? Math.min(WIDTH - 90, Math.max(90, current.to.x)) : 0

  return (
    <div className={className} {...rest}>
      <div className="overflow-hidden rounded-2xl border border-border bg-primary p-3 text-primary-foreground shadow-xl md:p-5">
        <svg
          viewBox={`0 ${top} ${WIDTH} ${bottom - top}`}
          role="img"
          aria-label={`Map of placement routes from ${origin.name} to ${destinations.map((d) => d.name).join(', ')}`}
          className="block h-auto w-full"
        >
          <path d={gridPath} fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="0.6" />
          <path d={landPath} fill="color-mix(in oklab, white 13%, var(--color-primary))" stroke="white" strokeOpacity="0.14" strokeWidth="0.5" />

          {routes.map((route, i) => {
            const active = i === selected
            return (
              <g key={route.place.id}>
                <path id={`${uid}-r${i}`} d={route.d} fill="none" stroke="none" />
                <motion.path
                  d={route.d}
                  fill="none"
                  strokeLinecap="round"
                  stroke={active ? 'var(--color-brand-light)' : 'white'}
                  strokeOpacity={active ? 1 : 0.28}
                  strokeWidth={active ? 2.4 : 1.2}
                  strokeDasharray={active ? undefined : '3 5'}
                  initial={reduced ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: i * 0.12, ease: 'easeOut' }}
                />
                {!reduced && (
                  <circle r={active ? 4 : 2.2} fill={active ? 'var(--color-brand-light)' : 'white'} opacity={active ? 1 : 0.7}>
                    <animateMotion dur="3.4s" begin={`${(i * 0.45).toFixed(2)}s`} repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
                      <mpath href={`#${uid}-r${i}`} />
                    </animateMotion>
                  </circle>
                )}
                <circle cx={route.to.x} cy={route.to.y} r={active ? 5 : 3} fill={active ? 'var(--color-brand-light)' : 'oklch(0.85 0.1 200)'} stroke="var(--color-primary)" strokeWidth="1.5" />
              </g>
            )
          })}

          {/* origin */}
          <circle cx={from.x} cy={from.y} r="5" fill="none" stroke="var(--color-brand-light)" strokeWidth="1.5">
            {!reduced && <animate attributeName="r" values="5;22" dur="2.2s" repeatCount="indefinite" />}
            {!reduced && <animate attributeName="opacity" values="0.9;0" dur="2.2s" repeatCount="indefinite" />}
          </circle>
          <circle cx={from.x} cy={from.y} r="5.5" fill="var(--color-brand-light)" stroke="white" strokeWidth="1.6" />
          <text x={from.x} y={from.y + 24} textAnchor="middle" fontSize="15" fontWeight="600" fill="white" stroke="var(--color-primary)" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round">{origin.name}</text>

          {current && (
            <text x={labelX} y={current.to.y - 14} textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--color-brand-light)" stroke="var(--color-primary)" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round">{current.place.name}</text>
          )}
        </svg>

        <ol
          aria-label="Placement routes"
          className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {routes.map((route, i) => {
            const active = i === selected
            return (
              <li key={route.place.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => pick(i)}
                  className={`flex w-full flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-brand-light ${active ? 'border-brand-light bg-white/10' : 'border-white/15 hover:bg-white/5'}`}
                >
                  <span className="font-mono text-[11px] tracking-wider text-primary-foreground/70">
                    {origin.code} <span aria-hidden="true">→</span><span className="sr-only">to</span> <span className={active ? 'text-brand-light' : ''}>{route.place.code}</span>
                  </span>
                  <span className="mt-0.5 text-sm font-medium">{route.place.name}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
