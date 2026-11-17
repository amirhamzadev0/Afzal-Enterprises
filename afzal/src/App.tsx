import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import ArcCarousel, { type ArcCarouselItem } from '@/components/ui/cue-chained-spring-arc-carousel'
import GlobeFeatureSection from '@/components/ui/globe-feature-section'
import { InteractiveImageAccordion } from '@/components/ui/interactive-image-accordion'
import { HolographicCard } from '@/components/ui/holographic-card'
import PushpinTearFooter from '@/components/ui/pushpin-tear-footer'
import { TeamLanyardRail, type LanyardMember } from '@/components/ui/team-lanyard-rail'

const PHONE_1 = '+92 345 9555500'
const PHONE_2 = '+92 51 4425189'
const EMAIL = 'md@afzalenterprises.com'
const ADDRESS = 'B-10, Flat #7 Bangsar Plaza, Commercial Center, Satellite Town, Rawalpindi'
const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS + ', Pakistan')}`
const MOU_HREF = 'https://afzalenterprises.com/mou-overseas-recruitment-agency-in-pakistan'

const nav = [
  ['About', '#about'],
  ['Services', '#services'],
  ['Industries', '#industries'],
  ['Parwaaz Card', '#parwaaz'],
  ['Countries', '#countries'],
  ['Achievements', '#achievements'],
  ['Contact', '#contact'],
] as const

// Badges represent the trades Afzal Enterprises supplies, not individual people.
const trades: LanyardMember[] = [
  { id: 't1', name: 'Electrician', role: 'Skilled · Electrical', team: 'Saudi Arabia · UAE', image: '', bio: 'Trade-tested electricians screened for industrial and construction projects.', tags: ['Wiring', 'Maintenance', 'Trade tested'], links: [{ label: 'Hire', href: '#contact' }], tone: 1 },
  { id: 't2', name: 'Mechanical Technician', role: 'Skilled · Mechanical', team: 'Qatar · Kuwait', image: '', bio: 'Plant and equipment technicians for manufacturing and maintenance contracts.', tags: ['Plant', 'HVAC', 'Maintenance'], links: [{ label: 'Hire', href: '#contact' }], tone: 2 },
  { id: 't3', name: 'Construction Crew', role: 'Semi-skilled · Civil', team: 'Saudi Arabia · Oman', image: '', bio: 'Mason, carpenter, steel-fixer and site crews for infrastructure projects.', tags: ['Masonry', 'Steel fixing', 'Site work'], links: [{ label: 'Hire', href: '#contact' }], tone: 3 },
  { id: 't4', name: 'Driver & Logistics', role: 'Skilled · Transport', team: 'UAE · Bahrain', image: '', bio: 'Licensed heavy and light vehicle drivers, warehouse and logistics staff.', tags: ['HTV / LTV', 'Warehouse', 'Fleet'], links: [{ label: 'Hire', href: '#contact' }], tone: 4 },
  { id: 't5', name: 'Hospitality Staff', role: 'Semi-skilled · Services', team: 'Gulf region', image: '', bio: 'Catering, housekeeping and front-of-house teams for hotels and restaurants.', tags: ['Catering', 'Housekeeping', 'Retail'], links: [{ label: 'Hire', href: '#contact' }], tone: 5 },
]

const stats = [
  ['35+', 'Years in workforce recruitment'],
  ['70,000+', 'Overseas job placements'],
  ['800,000+', 'Verified workers in database'],
  ['200+', 'Employees worldwide'],
] as const

const services = [
  ['Global Recruitment Solutions', 'We source, screen and deploy skilled Pakistani workers matched to each employer’s requirement.'],
  ['Pre-departure Orientation', 'Workers are prepared for the cultural and workplace standards of their destination before they travel.'],
  ['Overseas Visa & Assistance', 'Complete documentation and processing guidance from offer letter to departure.'],
  ['International Support Services', 'Continuous support for employer and worker throughout the overseas assignment.'],
] as const

const highlights = [
  { title: '35+ Years of Experience', description: 'More than three decades of experience in overseas recruitment and international manpower placement.', image: '/brand/mark.jpeg', contain: true },
  { title: 'Skilled Pakistani Workforce', description: 'Access to a broad network of skilled, semi-skilled and professional Pakistani workers.', image: '/brand/skilled.jpg' },
  { title: 'Industry-Specific Recruitment', description: 'Candidates sourced according to specific trades, qualifications, experience and employer requirements.', image: '/brand/industries.jpg' },
  { title: 'Candidate Screening', description: 'Candidates are carefully screened and shortlisted according to the employer’s recruitment requirements.', image: '/brand/screening.jpg' },
  { title: 'Complete Recruitment Support', description: 'Comprehensive support throughout the recruitment process, including documentation and pre-departure procedures.', image: '/brand/support.jpg' },
  { title: 'Gulf Recruitment Experience', description: 'Extensive experience supporting manpower requirements across Kuwait and other Gulf countries.', image: '/brand/gulf.jpg' },
]

const training = {
  areas: ['Construction & Infrastructure', 'Manufacturing & Industrial', 'Mechanical & Maintenance', 'Electrical & Electronics', 'Oil, Gas & Energy', 'Logistics & Transportation'],
  cities: ['Rawalpindi', 'Islamabad', 'Lahore', 'Gujrat', 'Sheikhupura', 'Peshawar', 'Mardan', 'Swabi'],
}

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&q=70&auto=format&fit=crop`
const industries: ArcCarouselItem[] = [
  { label: 'Construction', image: photo('1504307651254-35680f356dfd'), description: 'Site crews, masons, steel fixers and civil trades.' },
  { label: 'Healthcare', image: photo('1576091160399-112ba8d25d1d'), description: 'Nurses, technicians and hospital support staff.' },
  { label: 'Hospitality', image: photo('1566073771259-6a8506099945'), description: 'Hotels, resorts, catering and housekeeping teams.' },
  { label: 'FMCG', image: photo('1542838132-92c53300491e'), description: 'Food, beverage and consumer goods operations.' },
  { label: 'IT & Technology', image: photo('1581094794329-c8112a89af12'), description: 'Developers, support engineers and technical staff.' },
  { label: 'Oil & Gas', image: photo('1611273426858-450d8e3c9fce'), description: 'Plant, refinery and field operations manpower.' },
  { label: 'Energy', image: photo('1473341304170-971dccb5ac1e'), description: 'Power, utilities and transmission workforce.' },
  { label: 'Manufacturing', image: photo('1513828583688-c52646db42da'), description: 'Industrial plant operators and technicians.' },
  { label: 'Logistics & Transport', image: photo('1586528116311-ad8dd3c8310d'), description: 'Drivers, warehouse and supply-chain staff.' },
  { label: 'Automotive', image: photo('1492144534655-ae79c964c9d7'), description: 'Automotive and aeronautics trades.' },
]

// [latitude, longitude]
const origin = { name: 'Rawalpindi', location: [33.57, 73.05] as [number, number] }
const destinations = [
  { name: 'Saudi Arabia', location: [24.71, 46.68] },
  { name: 'UAE', location: [25.2, 55.27] },
  { name: 'Qatar', location: [25.29, 51.53] },
  { name: 'Kuwait', location: [29.38, 47.98] },
  { name: 'Oman', location: [23.59, 58.41] },
  { name: 'Bahrain', location: [26.23, 50.59] },
  { name: 'Turkey', location: [39.93, 32.86] },
  { name: 'Azerbaijan', location: [40.41, 49.87] },
  { name: 'Malaysia', location: [3.14, 101.69] },
  { name: 'United Kingdom', location: [51.51, -0.13] },
  { name: 'Canada', location: [45.42, -75.7] },
  { name: 'South Korea', location: [37.57, 126.98] },
] as { name: string; location: [number, number] }[]
const clients = ['Saudi Bin Ladin Group', 'AL-AYUNI', 'Al-Majal Group']
const partners = ['Punjab Board of Technical Education (PBTE) — MoU for structured overseas employment pathways', 'National Vocational and Technical Training Commission', 'Rawalpindi Chamber of Commerce and Industry', 'Islamabad Chamber of Commerce & Industry']

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

function Section({ id, eyebrow, title, intro, children, tint }: { id: string; eyebrow: string; title: string; intro?: string; children: ReactNode; tint?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-28 py-20 md:py-24 ${tint ? 'bg-muted/60' : ''}`}>
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">{eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-primary md:text-4xl">{title}</h2>
          {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return <li className="rounded-full border border-border bg-card px-4 py-2 text-sm">{children}</li>
}

function Header() {
  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a className="hover:text-brand-light" href={`mailto:${EMAIL}`}>Email: {EMAIL}</a>
            <a className="hover:text-brand-light" href={MAPS_HREF} target="_blank" rel="noreferrer">{ADDRESS}</a>
          </div>
          <div className="flex items-center gap-5">
            <a className="hover:text-brand-light" href={`tel:${PHONE_1.replace(/\s/g, '')}`}>{PHONE_1}</a>
            <a className="hover:text-brand-light" href={`tel:${PHONE_2.replace(/\s/g, '')}`}>{PHONE_2}</a>
          </div>
        </div>
      </div>
      <div className="border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-6">
          <a href="#home" aria-label="Afzal Enterprises, home">
            <img src="/brand/logo-landscape.png" alt="Afzal Enterprises, Overseas Employment Promoters" className="h-14 w-auto" />
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm font-medium text-primary xl:flex">
            {nav.map(([label, href]) => (
              <a key={href} href={href} className="transition-colors hover:text-brand">{label}</a>
            ))}
          </nav>
          <a href="#contact" className="inline-flex h-10 shrink-0 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-primary">
            Hire Manpower
          </a>
        </div>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main id="home">
        {/* Banner: lanyard badge rail over the original construction hero */}
        <div className="relative isolate overflow-hidden bg-white">
          <img src="/brand/hero.jpeg" alt="" aria-hidden="true" className="pointer-events-none absolute right-0 top-0 -z-10 hidden h-full w-[62%] object-cover object-right md:block" />
          <TeamLanyardRail
            autoplay
            items={trades}
            className="bg-transparent! text-primary!"
            eyebrow="Overseas recruitment agency in Pakistan"
            heading="Providing skilled manpower to businesses worldwide"
            caption="Hover or tap a badge to see the trade we supply"
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <motion.a href="#contact" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex h-11 items-center rounded-lg bg-brand px-6 text-sm font-semibold text-white">
                  Contact Us
                </motion.a>
                <motion.a href="#parwaaz" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex h-11 items-center rounded-lg border border-primary bg-white px-6 text-sm font-semibold text-primary">
                  Parwaaz Card
                </motion.a>
              </div>
            }
          />
        </div>

        {/* Overview */}
        <section id="about" className="scroll-mt-28 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="panel-sky grid gap-8 p-6 md:grid-cols-[1fr_220px] md:p-10">
              <div>
                <h2 className="text-balance text-3xl font-bold tracking-tight text-brand md:text-5xl">Overseas Recruitment Agency in Pakistan</h2>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.28em] text-primary md:text-sm">Connecting Global Employers with Skilled Pakistani Manpower</p>
                <div className="mt-8 space-y-5 leading-relaxed">
                  <p><strong className="text-[#9a3412]">Afzal Enterprises</strong> is a leading manpower recruitment agency in Pakistan dedicated to connecting employers with skilled and qualified workforce. With more than 35 years of experience in workforce recruitment, we specialize in sourcing, screening, selecting, and placing candidates across a wide range of industries.</p>
                  <p>Our recruitment approach focuses on reliability, quality, efficiency, and understanding the workforce requirements of our clients. We work to provide businesses with access to the right talent while supporting candidates throughout the recruitment and deployment process.</p>
                  <p>As a licensed company authorized by the Ministry of Overseas Pakistanis &amp; Human Resource Development and the Bureau of Emigration &amp; Overseas Employment, Afzal Enterprises operates as an established overseas employment and manpower recruitment provider.</p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-around gap-4 rounded-xl bg-white p-4 md:flex-col">
                <img src="/brand/mark.jpeg" alt="Afzal Enterprises logo" className="w-32 md:w-full" loading="lazy" />
                <img src="/brand/iso9001.png" alt="ISO 9001 certified" className="w-32 md:w-full" loading="lazy" />
              </div>
            </Reveal>

            <Reveal className="panel-sky mt-8 p-6 md:p-10">
              <h2 className="text-balance text-center text-2xl font-bold tracking-tight text-primary md:text-4xl">Why Afzal Enterprises Is a Trusted Overseas Recruitment Agency in Pakistan</h2>
              <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
                <div className="space-y-5 leading-relaxed">
                  <p>For more than three decades, Afzal Enterprises has been bridging the gap between skilled talent and top-tier employers across the Middle East. As one of Pakistan’s most trusted <strong>overseas employment promoters in Pakistan</strong>, we specialize in delivering reliable, efficient, and compliant manpower solutions backed by 35+ years of industry expertise.</p>
                  <p>With <strong>70,000+</strong> successful overseas job placements and a fast-growing database of <strong>800,000</strong> verified and skilled workers, our role as leading <strong>overseas employment promoters</strong> gives us unmatched depth, capability, and insight to meet every hiring requirement. Our extensive experience enables us to understand the international labor market, evolving industry demands, and employer expectations better than anyone else.</p>
                  <h3 className="pt-2 text-2xl font-bold text-primary md:text-3xl">Successful Overseas Job placements</h3>
                  <p>From <strong>technical trades and engineering staff</strong> to <strong>general labor and specialized professionals</strong>, we provide manpower for all major sectors including construction, oil &amp; gas, logistics, hospitality, security, and facility management. As a <strong className="text-primary underline underline-offset-4">licensed workforce supplier and employment promoter</strong>, we ensure smooth end-to-end hiring—covering candidate sourcing, testing, documentation, training, and deployment.</p>
                  <p>At Afzal Enterprises, our commitment is simple: <strong>deliver the right people, at the right time, with complete recruitment support that employers can depend on.</strong></p>
                </div>
                <img src="/brand/poster-workers.jpeg" alt="Afzal Enterprises: skilled, hardworking and reliable workforce across construction, oil and gas, healthcare, hospitality and more" className="w-full self-start rounded-xl shadow-lg" loading="lazy" />
              </div>
            </Reveal>

            <Reveal className="mt-8">
              <InteractiveImageAccordion items={highlights} />
            </Reveal>
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Company figures" className="bg-primary text-primary-foreground">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-6 py-12 md:grid-cols-4">
            {stats.map(([value, label], i) => (
              <Reveal key={label} delay={i * 0.08} className="text-center">
                <dt className="font-heading text-4xl font-semibold text-brand-light md:text-5xl">{value}</dt>
                <dd className="mt-2 text-sm text-primary-foreground/80">{label}</dd>
              </Reveal>
            ))}
          </dl>
        </section>

        <Section id="services" eyebrow="What we do" title="End-to-end overseas recruitment" intro="From sourcing and screening to visa processing and post-deployment support, one agency handles the complete pathway.">
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map(([title, text], i) => (
              <Reveal key={title} delay={i * 0.06}>
                <article className="h-full rounded-xl border border-border bg-card p-7 transition-shadow hover:shadow-md">
                  <span className="font-heading text-sm font-semibold text-brand">0{i + 1}</span>
                  <h3 className="mt-2 text-xl font-semibold text-primary">{title}</h3>
                  <p className="mt-3 text-muted-foreground">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>

        <section id="industries" className="scroll-mt-28 bg-muted/60 pt-20 md:pt-24">
          <Reveal className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Industries we serve</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-primary md:text-4xl">One trusted partner across every sector</h2>
            <p className="mt-4 text-muted-foreground">
              Afzal Enterprises has been a trusted partner in delivering top-quality human resources to industries such as Construction, Healthcare, Hospitality, FMCG, IT and Oil &amp; Gas across Saudi Arabia, UAE, Turkey, Malaysia, Azerbaijan and other countries.
            </p>
          </Reveal>
          <ArcCarousel items={industries} className="mt-4" />
        </section>

        <Section id="parwaaz" eyebrow="Parwaaz Card" title="Interest-free pre-departure financing" intro="Financial support for overseas job holders, so the cost of travelling does not stand between a worker and a valid job offer.">
          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
            <Reveal>
              <HolographicCard
                className="mx-auto w-full max-w-md"
                brand="Afzal Enterprises"
                title="Parwaaz Card"
                subtitle="Interest-free pre-departure financing"
                backTitle="What you need to apply"
                backItems={['Valid job offer letter', 'Passport', 'Medical & police certificates', 'CNIC of applicant and co-borrower']}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-lg font-semibold text-primary">Requirements</h3>
              <ul className="mt-4 space-y-3">
                {['Valid overseas job offer letter', 'Passport', 'Medical certificate', 'Police certificate', 'CNIC of the applicant and the co-borrower'].map((x) => (
                  <li key={x} className="flex items-start gap-3">
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9" /></svg>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="mt-8 inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground">Enquire about Parwaaz Card</a>
            </Reveal>
          </div>
        </Section>

        <Section id="training" tint eyebrow="Training facilities" title="Trade training across eight cities" intro="Workers are trained and assessed before deployment so employers receive job-ready manpower.">
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="text-lg font-semibold text-primary">Training areas</h3>
              <ul className="mt-4 grid gap-3">
                {training.areas.map((x) => <li key={x} className="rounded-lg border border-border bg-card px-5 py-3">{x}</li>)}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-lg font-semibold text-primary">Locations</h3>
              <ul className="mt-4 flex flex-wrap gap-3">{training.cities.map((x) => <Chip key={x}>{x}</Chip>)}</ul>
            </Reveal>
          </div>
        </Section>

        <section id="countries" className="scroll-mt-28 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <GlobeFeatureSection
                eyebrow="Destinations"
                heading="Where our workers are placed"
                description="From Rawalpindi to employers across Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain, Turkey, Azerbaijan, Malaysia and beyond. Drag the globe to follow every route."
                origin={origin}
                destinations={destinations}
                ctaLabel="Hire Manpower"
                ctaHref="#contact"
              />
            </Reveal>
            <Reveal className="mt-14">
              <h3 className="text-lg font-semibold text-primary">Clients who trust us</h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                {clients.map((x) => (
                  <li key={x} className="flex h-24 items-center justify-center rounded-lg border border-border bg-card px-4 text-center font-heading text-lg font-semibold text-primary">{x}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Achievements / blog */}
        <section id="achievements" className="scroll-mt-28 bg-muted/60 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <article className="panel-sky grid gap-8 overflow-hidden p-6 md:grid-cols-[320px_1fr] md:items-center md:p-10">
                <img src="/brand/pbte-award.jpg" alt="Award from the Punjab Board of Technical Education, Lahore, presented to the Managing Director of Afzal Enterprises" className="mx-auto w-full max-w-xs rounded-xl shadow-xl" loading="lazy" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Blog</p>
                  <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary md:text-4xl">Our Achievements &amp; Strategic Milestones</h2>
                  <div className="mt-6 space-y-4 leading-relaxed">
                    <p>Afzal Enterprises (Overseas Employment Promoters in Pakistan) is honored to announce a historic collaboration with the Punjab Board of Technical Education (PBTE) through the signing of Memorandums of Understanding (MoUs). This landmark partnership marks a significant step toward strengthening industry-academia linkages and creating structured pathways for skilled Pakistani professionals to access international employment opportunities.</p>
                    <p>Afzal Enterprises, a leading Overseas Employment Promoter in Pakistan, has signed a historic MoU with PBTE, marking a first-of-its-kind partnership to enhance technical training, certification, and employability outcomes. As a result, PBTE-certified graduates will gain access to structured pathways that connect their skills with verified and sustainable international employment opportunities.</p>
                    <p>Through this collaboration, Afzal Enterprises will actively work with PBTE to facilitate overseas employment linkages, ensuring that graduates not only acquire industry-relevant skills but also have access to practical career opportunities abroad. Moreover, the initiative bridges the gap between technical education and global workforce demands, empowering Pakistan’s skilled youth and contributing to the country’s labor export.</p>
                  </div>
                  <a href={MOU_HREF} target="_blank" rel="noreferrer" className="mt-6 inline-flex h-11 items-center rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-primary">Read More</a>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        <Section id="approach" eyebrow="Our approach" title="Licensed, partnered and accountable" intro="Afzal Enterprises is licensed by the Ministry of Overseas Pakistanis & Human Resource Development and the Bureau of Emigration & Overseas Employment.">
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="text-lg font-semibold text-primary">How we work</h3>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                {['Expert, industry-focused talent acquisition', 'Smart candidate screening matched to each employer’s needs', 'Global recruitment network with international partnerships', 'Technology-driven HR solutions for accuracy and transparency', 'Corporate ethics programming'].map((x) => (
                  <li key={x} className="flex gap-3"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />{x}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-lg font-semibold text-primary">Strategic partnerships</h3>
              <ul className="mt-4 space-y-3">
                {partners.map((x) => <li key={x} className="rounded-lg border border-border bg-card px-5 py-3 text-sm">{x}</li>)}
              </ul>
            </Reveal>
          </div>
        </Section>

        <Section id="contact" tint eyebrow="Contact us" title="Speak with our recruitment team" intro="Tell us the trades and numbers you need, or ask about the Parwaaz Card.">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <address className="space-y-5 not-italic">
                <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Office</p><p className="mt-1">{ADDRESS}</p></div>
                <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Phone</p><p className="mt-1"><a className="hover:text-brand" href={`tel:${PHONE_1.replace(/\s/g, '')}`}>{PHONE_1}</a><br /><a className="hover:text-brand" href={`tel:${PHONE_2.replace(/\s/g, '')}`}>{PHONE_2}</a></p></div>
                <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email</p><p className="mt-1"><a className="hover:text-brand" href={`mailto:${EMAIL}`}>{EMAIL}</a></p></div>
              </address>
            </Reveal>
            <Reveal delay={0.1}>
              <form
                className="grid gap-4 rounded-xl border border-border bg-card p-6"
                onSubmit={(event) => {
                  event.preventDefault()
                  const data = new FormData(event.currentTarget)
                  const body = `Name: ${data.get('name')}\nCompany: ${data.get('company')}\n\n${data.get('message')}`
                  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Enquiry from website')}&body=${encodeURIComponent(body)}`
                }}
              >
                {[['name', 'Your name'], ['company', 'Company / organisation']].map(([name, label]) => (
                  <label key={name} className="grid gap-1.5 text-sm font-medium">
                    {label}
                    <input name={name} required className="h-11 rounded-lg border border-border bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  </label>
                ))}
                <label className="grid gap-1.5 text-sm font-medium">
                  How can we help?
                  <textarea name="message" required rows={4} className="rounded-lg border border-border bg-background px-3 py-2 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </label>
                <button type="submit" className="h-11 rounded-lg bg-primary text-sm font-semibold text-primary-foreground">Send enquiry</button>
              </form>
            </Reveal>
          </div>
        </Section>
      </main>

      <PushpinTearFooter
        sheet="#000080"
        paper="#eef7ff"
        pinColor="#cc0000"
        sheetInk="#ffffff"
        brand="afzal."
        name="Afzal Enterprises"
        logo={<span className="grid size-14 place-items-center rounded-full bg-white p-1.5 shadow-md"><img src="/brand/icon.png" alt="Afzal Enterprises" className="size-full object-contain" /></span>}
        logoHref="#home"
        socials={[
          { icon: 'mail', label: 'Email us', href: 'mailto:' + EMAIL },
          { icon: 'globe', label: 'Our office on Google Maps', href: MAPS_HREF },
        ]}
        email={EMAIL}
        newsletter={null}
        status={{ label: 'hiring for employers abroad', href: '#contact' }}
        mark="Rawalpindi, PK"
        timeZone="Asia/Karachi"
        timeLabel="PKT"
        columns={[
          { title: 'explore', links: [{ label: 'About', href: '#about' }, { label: 'Services', href: '#services' }, { label: 'Industries', href: '#industries' }, { label: 'Parwaaz Card', href: '#parwaaz' }], cta: { label: 'hire.', href: '#contact' } },
          { title: 'company', links: [{ label: 'Countries', href: '#countries' }, { label: 'Achievements', href: '#achievements' }, { label: 'Contact', href: '#contact' }], cta: { label: 'visit.', href: MAPS_HREF } },
        ]}
        chat={{ label: 'enquire', href: '#contact' }}
        sideLinks={[
          { icon: 'globe', label: 'find our office', href: MAPS_HREF },
          { icon: 'doc', label: 'parwaaz card', href: '#parwaaz' },
        ]}
        copyright={'© ' + new Date().getFullYear() + ' Afzal Enterprises'}
        credit="overseas employment promoters"
        handle={{ label: 'Satellite Town, Rawalpindi', href: MAPS_HREF }}
        height="clamp(620px, 100svh, 820px)"
        fontSans='"Montserrat", system-ui, sans-serif'
      />
    </>
  )
}
