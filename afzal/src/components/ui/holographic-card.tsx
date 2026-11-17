import * as React from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

export interface HolographicCardProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  title: string
  subtitle: string
  brand: string
  /** Lines printed on the back of the card. */
  backTitle: string
  backItems: string[]
  /** Maximum tilt in degrees. */
  tilt?: number
}

const FOIL =
  'linear-gradient(115deg, transparent 18%, rgb(255 60 170 / 0.55) 32%, rgb(60 230 255 / 0.55) 46%, rgb(255 235 80 / 0.5) 60%, rgb(140 255 140 / 0.45) 72%, transparent 86%)'
const GRAIN =
  'repeating-linear-gradient(135deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 4px)'

export function HolographicCard({ title, subtitle, brand, backTitle, backItems, tilt = 14, className, ...rest }: HolographicCardProps) {
  const reduced = useReducedMotion()
  const [flipped, setFlipped] = React.useState(false)

  // pointer position inside the card, 0..1
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 180, damping: 20 })
  const sy = useSpring(py, { stiffness: 180, damping: 20 })

  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt])
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt])
  const foilPos = useMotionTemplate`${useTransform(sx, [0, 1], [0, 100])}% ${useTransform(sy, [0, 1], [0, 100])}%`
  const glare = useMotionTemplate`radial-gradient(circle at ${useTransform(sx, [0, 1], [0, 100])}% ${useTransform(sy, [0, 1], [0, 100])}%, rgb(255 255 255 / 0.38), transparent 55%)`
  const foilOpacity = useTransform(sx, (x) => 0.35 + Math.abs(x - 0.5) * 0.9)

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return
    const box = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - box.left) / box.width)
    py.set((event.clientY - box.top) / box.height)
  }
  const reset = () => { px.set(0.5); py.set(0.5) }

  const overlays = (
    <>
      <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 block mix-blend-color-dodge" style={{ backgroundImage: FOIL, backgroundSize: '260% 260%', backgroundPosition: foilPos, opacity: foilOpacity }} />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 block" style={{ backgroundImage: GRAIN }} />
      <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 block mix-blend-overlay" style={{ backgroundImage: glare }} />
    </>
  )

  const face = 'absolute inset-0 overflow-hidden rounded-2xl border border-white/15 bg-primary text-primary-foreground [backface-visibility:hidden]'

  return (
    <div className={`[perspective:1100px] ${className ?? ''}`} {...rest}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${title} card. Press to turn it over.`}
        onPointerMove={move}
        onPointerLeave={reset}
        onClick={() => setFlipped((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setFlipped((v) => !v) }
        }}
        whileHover={reduced ? undefined : { scale: 1.03 }}
        whileTap={reduced ? undefined : { scale: 0.98 }}
        style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformStyle: 'preserve-3d' }}
        className="relative aspect-[1.586] w-full cursor-pointer touch-pan-y rounded-2xl shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 16 }}
        >
          {/* front */}
          <div className={face} style={{ backgroundImage: 'linear-gradient(140deg, #1a1aa6, #000080 60%, #0a0a5c)' }}>
            <div className="absolute -right-16 -top-16 size-56 rounded-full bg-brand-light/20 blur-2xl" />
            <div className="relative flex h-full flex-col justify-between p-6 md:p-7">
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground/75">{brand}</p>
                <span className="text-xs font-medium text-brand-light">Interest-free</span>
              </div>
              <div>
                <span aria-hidden="true" className="mb-4 block h-8 w-11 rounded-md" style={{ background: 'linear-gradient(135deg, oklch(0.85 0.1 85), oklch(0.62 0.12 75))', boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.25)' }} />
                <p className="font-heading text-3xl font-semibold leading-none md:text-4xl">{title}</p>
                <p className="mt-2 text-sm text-primary-foreground/80">{subtitle}</p>
              </div>
            </div>
            {overlays}
          </div>

          {/* back */}
          <div className={face} style={{ transform: 'rotateY(180deg)', backgroundImage: 'linear-gradient(140deg, #00005c, #000040)' }}>
            <span aria-hidden="true" className="absolute inset-x-0 top-6 block h-9 bg-black/70" />
            <div className="relative px-6 pt-20 md:px-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-light">{backTitle}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-primary-foreground/90">
                {backItems.map((item) => (
                  <li key={item} className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand-light" />{item}</li>
                ))}
              </ul>
            </div>
            {overlays}
          </div>
        </motion.div>
      </motion.div>
      <p className="mt-4 text-center text-xs text-muted-foreground">Move your cursor over the card · click to turn it over</p>
    </div>
  )
}
