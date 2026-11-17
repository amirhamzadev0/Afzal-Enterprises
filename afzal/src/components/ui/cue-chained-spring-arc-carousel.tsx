/**
 * Cue Foundations · Chained Spring Arc Carousel (cue063)
 *
 * A fanned wheel of cards where moving the focus triggers a chained spring ripple,
 * propagating tension outward from the leading card like a plucked string.
 * All physics runs in a ref-backed rAF loop, so there are no React re-renders per frame.
 *
 * Adapted for in-page use: it fills its parent section instead of the viewport, and it
 * never captures vertical page scroll. Navigate with the arrow buttons, ←/→ keys,
 * horizontal wheel / trackpad, swipe, or by clicking a card.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface ArcCarouselItem {
  image: string;
  label: string;
  /** One short line shown under the focused label. */
  description?: string;
}

export interface ArcCarouselProps extends React.ComponentProps<'div'> {
  items?: ArcCarouselItem[];
  initialIndex?: number;
  /** Degrees between neighbouring cards. */
  gapAngle?: number;
  stiffness?: number;
  damping?: number;
}

const DEFAULT_ITEMS: ArcCarouselItem[] = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945',
  'https://images.unsplash.com/photo-1542838132-92c53300491e',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
].map((url, i) => ({ image: `${url}?w=600&q=70&auto=format&fit=crop`, label: ['Construction', 'Healthcare', 'Hospitality', 'FMCG', 'IT'][i] ?? '' }));

export default function ArcCarousel({
  items = DEFAULT_ITEMS,
  initialIndex,
  gapAngle = 16,
  stiffness = 0.2,
  damping = 0.4,
  className,
  ...rest
}: ArcCarouselProps) {
  const start = Math.min(items.length - 1, Math.max(0, initialIndex ?? Math.floor(items.length / 2)));
  const [focusedIndex, setFocusedIndex] = useState(start);
  const [labelVisible, setLabelVisible] = useState(false);

  const cardsElRef = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({
    activeIndex: start,
    cards: items.map(() => ({ angle: 0, velocity: 0 })),
    isIntro: true,
    introFanning: false,
    lastStep: 0,
  });
  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    : false;

  const goTo = useCallback((index: number) => {
    const st = stateRef.current;
    if (st.isIntro) return;
    st.activeIndex = Math.min(items.length - 1, Math.max(0, index));
  }, [items.length]);

  const step = useCallback((delta: number) => goTo(stateRef.current.activeIndex + delta), [goTo]);

  useEffect(() => {
    const st = stateRef.current;
    st.cards = items.map(() => ({ angle: 0, velocity: 0 }));
    st.isIntro = true;
    st.introFanning = false;
    st.activeIndex = start;

    cardsElRef.current.forEach((el, i) => {
      if (el) el.style.zIndex = String(items.length - Math.abs(i - start));
    });

    let fanTimer: ReturnType<typeof setTimeout> | undefined;
    if (reducedMotion) {
      st.cards.forEach((c, i) => {
        c.angle = (i - st.activeIndex) * gapAngle;
        c.velocity = 0;
      });
      st.isIntro = false;
      setLabelVisible(true);
    } else {
      fanTimer = setTimeout(() => { st.introFanning = true; }, 1000);
    }

    const tick = () => {
      if (st.isIntro) {
        if (st.introFanning) {
          let settled = true;
          for (let i = 0; i < st.cards.length; i++) {
            const target = (i - st.activeIndex) * gapAngle;
            const card = st.cards[i];
            card.velocity += (target - card.angle) * 0.01;
            card.velocity *= 0.88;
            card.angle += card.velocity;
            if (Math.abs(target - card.angle) > 0.5 || Math.abs(card.velocity) > 0.5) settled = false;
          }
          if (settled) {
            st.isIntro = false;
            setLabelVisible(true);
          }
        }
      } else {
        // chained spring: the last card leads, every other card follows its neighbour
        const leaderIdx = st.cards.length - 1;
        const leader = st.cards[leaderIdx];
        leader.velocity += ((leaderIdx - st.activeIndex) * gapAngle - leader.angle) * stiffness;
        leader.velocity *= damping;
        leader.angle += leader.velocity;
        for (let i = leaderIdx - 1; i >= 0; i--) {
          const cur = st.cards[i];
          cur.velocity += (st.cards[i + 1].angle - gapAngle - cur.angle) * stiffness;
          cur.velocity *= damping;
          cur.angle += cur.velocity;
        }
      }

      let minAbs = Infinity;
      let closest = 0;
      st.cards.forEach((c, i) => {
        const el = cardsElRef.current[i];
        if (el) el.style.transform = `rotate(${c.angle}deg) translateY(-800px)`;
        if (Math.abs(c.angle) < minAbs) {
          minAbs = Math.abs(c.angle);
          closest = i;
        }
      });
      if (!st.isIntro) setFocusedIndex((prev) => (prev === closest ? prev : closest));

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (fanTimer) clearTimeout(fanTimer);
    };
  }, [items, start, gapAngle, stiffness, damping, reducedMotion]);

  // horizontal wheel / trackpad only, so vertical page scrolling is never hijacked
  const wheelLock = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < 15 || Math.abs(e.deltaX) < Math.abs(e.deltaY) || wheelLock.current) return;
      e.preventDefault();
      step(e.deltaX > 0 ? 1 : -1);
      wheelLock.current = true;
      setTimeout(() => { wheelLock.current = false; }, 400);
    };
    root.addEventListener('wheel', onWheel, { passive: false });
    return () => root.removeEventListener('wheel', onWheel);
  }, [step]);

  const swipe = useRef<{ x: number; id: number } | null>(null);
  const focused = items[focusedIndex];

  return (
    <div
      {...rest}
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Industries we serve"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      }}
      onPointerDown={(e) => { swipe.current = { x: e.clientX, id: e.pointerId }; }}
      onPointerUp={(e) => {
        const s = swipe.current;
        swipe.current = null;
        if (s && s.id === e.pointerId && Math.abs(e.clientX - s.x) > 50) step(e.clientX < s.x ? 1 : -1);
      }}
      className={`ac-root ${className ?? ''}`}
    >
      <style>{CSS}</style>

      <div className="ac-global-label" style={{ opacity: labelVisible ? 1 : 0 }} aria-live="polite">
        <div className="ac-gl-num">{String(focusedIndex + 1).padStart(2, '0')}</div>
        <div className="ac-gl-name">{focused?.label}</div>
        {focused?.description && <div className="ac-gl-desc">{focused.description}</div>}
      </div>

      <div className="ac-arch" />
      <div className="ac-pivot">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="ac-card"
            ref={(el) => { cardsElRef.current[i] = el; }}
            onClick={() => goTo(i)}
            aria-label={item.label}
          >
            <div className="ac-card-inner" style={{ backgroundImage: `url('${item.image}')` }}>
              <span className="ac-card-shade" />
              <span className="ac-card-label">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ac-controls">
        <button type="button" aria-label="Previous industry" disabled={focusedIndex === 0} onClick={() => step(-1)}>
          <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 4 6.5 10l6 6" /></svg>
        </button>
        <button type="button" aria-label="Next industry" disabled={focusedIndex === items.length - 1} onClick={() => step(1)}>
          <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4 6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}

const CSS = `
.ac-root {
  position: relative;
  width: 100%;
  height: 680px;
  overflow: hidden;
  display: flex; justify-content: center; align-items: center;
  touch-action: pan-y;
  outline: none;
}
.ac-root:focus-visible { box-shadow: inset 0 0 0 2px var(--color-ring); }

.ac-arch {
  position: absolute;
  bottom: -600px;
  width: 1600px; height: 800px;
  background: color-mix(in oklab, var(--color-primary) 10%, var(--color-muted));
  border-radius: 50% 50% 0 0;
  z-index: 1;
}

.ac-pivot {
  position: absolute;
  bottom: -600px;
  width: 0; height: 0;
  z-index: 5;
  transform: translateY(100vh);
  opacity: 0;
  animation: ac-slideUpArrival 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes ac-slideUpArrival { to { transform: translateY(0); opacity: 1; } }

.ac-card {
  position: absolute;
  width: 220px; height: 340px;
  left: -110px;
  bottom: -170px;
  will-change: transform;
  display: flex; justify-content: center;
  cursor: pointer;
}

.ac-card-inner {
  position: absolute; inset: 0;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  overflow: hidden;
  background-size: cover; background-position: center;
  background-color: var(--color-muted);
  transform: translateY(0);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.ac-card:hover .ac-card-inner { transform: translateY(-40px); box-shadow: 0 20px 50px rgba(0,0,0,0.28); }

.ac-card-shade {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 45%, rgba(8, 16, 36, 0.78));
}
.ac-card-label {
  position: absolute; left: 16px; right: 16px; bottom: 16px;
  color: #fff;
  font-family: var(--font-heading);
  font-size: 20px; font-weight: 600; line-height: 1.15;
}

.ac-global-label {
  position: absolute;
  top: 28px; left: 50%;
  transform: translateX(-50%);
  width: min(90%, 520px);
  display: flex; flex-direction: column; align-items: center;
  gap: 8px;
  z-index: 20;
  text-align: center;
  transition: opacity 0.8s ease;
  pointer-events: none;
}
.ac-gl-num  { font-family: var(--font-heading); font-size: 52px; font-weight: 500; color: var(--color-foreground); letter-spacing: -2px; line-height: 1; }
.ac-gl-name { font-size: 13px; font-weight: 600; color: var(--color-brand); text-transform: uppercase; letter-spacing: 5px; }
.ac-gl-desc { font-size: 14px; color: var(--color-muted-foreground); }

.ac-controls {
  position: absolute; bottom: 20px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 12px;
  z-index: 30;
}
.ac-controls button {
  display: grid; place-items: center;
  width: 44px; height: 44px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  color: var(--color-foreground);
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
}
.ac-controls button:hover:not(:disabled) { background: var(--color-muted); }
.ac-controls button:disabled { opacity: 0.35; cursor: default; }
.ac-controls button:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; }

@media (max-width: 900px) {
  .ac-root { height: 560px; }
  .ac-card { width: 160px; height: 240px; left: -80px; bottom: -120px; }
  .ac-card-label { font-size: 16px; left: 12px; right: 12px; bottom: 12px; }
  .ac-arch { width: 1200px; height: 600px; bottom: -450px; }
  .ac-pivot { bottom: -450px; }
}
@media (prefers-reduced-motion: reduce) {
  .ac-pivot { animation: none !important; opacity: 1 !important; transform: none !important; }
  .ac-card-inner { transition: none !important; }
}
`;
