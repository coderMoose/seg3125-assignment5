import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import speedyMemoryImage from './assets/speedymemory-logo.png'
import mongooseImage from './assets/mongoose-logo.png'
import design4Img from './assets/design4.png'
import './App.css'

const studyLinks = [
  {
    label: 'Interaction Design Foundation portfolio article',
    href: 'https://www.interaction-design.org/literature/article/what-should-a-ux-design-portfolio-contain',
  },
  {
    label: 'Nielsen Norman Group',
    href: 'https://www.nngroup.com/',
  },
]

const caseStudies = [
  {
    title: 'Design 1',
    name: 'Service site',
    description: 'Clean Beaks, goose & duck grooming.',
    status: 'Open',
    href: '/clean-beaks',
    image: '/logo.png',
  },
  {
    title: 'Design 2',
    name: 'Memory game',
    description: 'Speedy Memory, a card-matching game',
    status: 'Open',
    href: '/speedy-memory',
    image: speedyMemoryImage,
  },
  {
    title: 'Design 3',
    name: 'E-commerce site',
    description: 'Mongoose, a small handkerchief store.',
    status: 'Open',
    href: '/mongoose',
    image: mongooseImage,
  },
  {
    title: 'Design 4',
    name: 'Analytics site',
    description: '...',
    status: 'Coming soon',
    href: '#design-4',
    image: design4Img,
  },
]

const sphereVelocities = [
  { vx: 0.9, vy: 1.1 },
  { vx: -1.1, vy: 0.8 },
  { vx: 0.8, vy: -1.0 },
  { vx: 1.0, vy: -0.7 },
  { vx: -0.8, vy: -1.1 },
  { vx: -1.0, vy: 0.9 },
]

const sphereStyles = [
  { color: 'bg-blue-500', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.55)]' },
  { color: 'bg-purple-500', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.55)]' },
  { color: 'bg-green-500', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.5)]' },
  { color: 'bg-blue-400', glow: 'shadow-[0_0_28px_rgba(96,165,250,0.5)]' },
  { color: 'bg-purple-400', glow: 'shadow-[0_0_28px_rgba(192,132,252,0.5)]' },
  { color: 'bg-emerald-400', glow: 'shadow-[0_0_28px_rgba(52,211,153,0.5)]' },
  { color: 'bg-blue-500', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.55)]' },
  { color: 'bg-purple-500', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.55)]' },
  { color: 'bg-green-500', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.5)]' },
  { color: 'bg-blue-400', glow: 'shadow-[0_0_28px_rgba(96,165,250,0.5)]' },
  { color: 'bg-purple-400', glow: 'shadow-[0_0_28px_rgba(192,132,252,0.5)]' },
  { color: 'bg-emerald-400', glow: 'shadow-[0_0_28px_rgba(52,211,153,0.5)]' },
]

function App() {
  const [light, setLight] = useState({ x: -9999, y: -9999, visible: false })
  const sphereBoxRef = useRef(null)
  const sphereRefs = useRef([])
  const spheresRef = useRef(
    Array.from({ length: sphereStyles.length }, (_, index) => ({
      x: 0,
      y: 0,
      ...sphereVelocities[index % sphereVelocities.length],
    })),
  )

  useEffect(() => {
    const isInsideSpotlightContainer = (target) => {
      if (!(target instanceof Element)) {
        return false
      }

      return Boolean(target.closest('.spotlight-container'))
    }

    const handlePointerMove = (event) => {
      setLight({
        x: event.clientX,
        y: event.clientY,
        visible: !isInsideSpotlightContainer(event.target),
      })
    }

    const hideLight = () => {
      setLight((current) => ({ ...current, visible: false }))
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', hideLight)
    window.addEventListener('blur', hideLight)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', hideLight)
      window.removeEventListener('blur', hideLight)
    }
  }, [])

  useEffect(() => {
    const box = sphereBoxRef.current

    if (!box) {
      return undefined
    }

    const sphereElements = sphereRefs.current
    let frameId = 0
    let previousTime = performance.now()
    const sphereSize = 42
    const boxSize = { width: box.clientWidth, height: box.clientHeight }
    const damping = 0.985

    const initializeSpherePositions = () => {
      const padding = 14

      spheresRef.current = spheresRef.current.map((sphere, index) => {
        const randomX = padding + Math.random() * Math.max(1, boxSize.width - sphereSize - padding * 2)
        const randomY = padding + Math.random() * Math.max(1, boxSize.height - sphereSize - padding * 2)

        return {
          ...sphere,
          x: index < sphereElements.length ? randomX : sphere.x,
          y: index < sphereElements.length ? randomY : sphere.y,
        }
      })

      spheresRef.current.forEach((sphere, index) => {
        const element = sphereElements[index]
        if (element) {
          element.style.transform = `translate3d(${sphere.x}px, ${sphere.y}px, 0)`
        }
      })
    }

    const handleResize = () => {
      boxSize.width = box.clientWidth
      boxSize.height = box.clientHeight
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(box)
    initializeSpherePositions()

    const step = (time) => {
      const delta = Math.min((time - previousTime) / 16.67, 2)
      previousTime = time

      const spheres = spheresRef.current

      spheres.forEach((sphere, index) => {
        sphere.x += sphere.vx * delta
        sphere.y += sphere.vy * delta

        if (sphere.x <= 0) {
          sphere.x = 0
          sphere.vx = Math.abs(sphere.vx) * 0.92
        }

        if (sphere.y <= 0) {
          sphere.y = 0
          sphere.vy = Math.abs(sphere.vy) * 0.92
        }

        if (sphere.x >= boxSize.width - sphereSize) {
          sphere.x = boxSize.width - sphereSize
          sphere.vx = -Math.abs(sphere.vx) * 0.92
        }

        if (sphere.y >= boxSize.height - sphereSize) {
          sphere.y = boxSize.height - sphereSize
          sphere.vy = -Math.abs(sphere.vy) * 0.92
        }

        sphere.vx *= damping
        sphere.vy *= damping

        const element = sphereElements[index]
        if (element) {
          element.style.transform = `translate3d(${sphere.x}px, ${sphere.y}px, 0)`
        }
      })

      frameId = window.requestAnimationFrame(step)
    }

    const handlePointerMove = (event) => {
      const bounds = box.getBoundingClientRect()
      const cursorX = event.clientX - bounds.left
      const cursorY = event.clientY - bounds.top

      if (cursorX < 0 || cursorY < 0 || cursorX > bounds.width || cursorY > bounds.height) {
        return
      }

      spheresRef.current.forEach((sphere) => {
        const centerX = sphere.x + sphereSize / 2
        const centerY = sphere.y + sphereSize / 2
        const distance = Math.hypot(centerX - cursorX, centerY - cursorY)
        const kickRadius = 92

        if (distance === 0 || distance > kickRadius) {
          return
        }

        const kickStrength = (1 - distance / kickRadius) * 8
        const angle = Math.atan2(centerY - cursorY, centerX - cursorX)

        sphere.vx += Math.cos(angle) * kickStrength
        sphere.vy += Math.sin(angle) * kickStrength

        const velocityCap = 8.5
        sphere.vx = Math.max(-velocityCap, Math.min(velocityCap, sphere.vx))
        sphere.vy = Math.max(-velocityCap, Math.min(velocityCap, sphere.vy))
      })
    }

    const handlePointerLeave = () => {
      spheresRef.current.forEach((sphere, index) => {
        sphere.vx += index % 2 === 0 ? 0.4 : -0.4
        sphere.vy += index % 2 === 0 ? -0.3 : 0.3
      })
    }

    frameId = window.requestAnimationFrame(step)
    box.addEventListener('pointermove', handlePointerMove)
    box.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      box.removeEventListener('pointermove', handlePointerMove)
      box.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    <div className="portfolio-root relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div
          className={`cursor-light absolute rounded-full ${light.visible ? 'cursor-light-visible' : 'cursor-light-hidden'}`}
          style={{
            left: light.x,
            top: light.y,
            width: '5.5rem',
            height: '5.5rem',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-6 sm:px-8 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Portfolio
            </p>
          </div>

          <nav className="flex flex-wrap gap-3 text-sm text-slate-600">
            <a className="rounded-full border border-slate-300 px-4 py-2 transition hover:border-slate-400 hover:text-slate-900" href="#about">
              About Me
            </a>
            <a className="rounded-full border border-slate-300 px-4 py-2 transition hover:border-slate-400 hover:text-slate-900" href="#process">
              Work Experience
            </a>
            <a className="rounded-full border border-slate-300 px-4 py-2 transition hover:border-slate-400 hover:text-slate-900" href="#case-studies">
              Case Studies
            </a>
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" id="about">
          <div className="spotlight-container rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-colors duration-300 hover:border-blue-300 hover:bg-blue-50">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              About Me
            </p>
            <h2 className="font-title mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Daniel Morghati
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              I'm a fourth-year software engineering student interested in UI/UX design. I've mainly worked on software for mobile apps in the past, but I'm excited to dive deeper into the design aspects of these types of projects.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-700">
              <span className="rounded-full bg-slate-100 px-3 py-1">UI design</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Mobile Apps</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Websites</span>
            </div>
          </div>

          <div className="spotlight-container flex min-h-[360px] items-center justify-center rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-blue-300 hover:bg-blue-50">
            <div
              ref={sphereBoxRef}
              className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950/95"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.98))]" />

              {sphereStyles.map((sphere, index) => (
                <div
                  key={index}
                  ref={(node) => {
                    sphereRefs.current[index] = node
                  }}
                  className={`absolute left-0 top-0 h-[42px] w-[42px] rounded-full ${sphere.color} ${sphere.glow}`}
                  style={{ transform: 'translate3d(0, 0, 0)' }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-1">
          <article className="spotlight-container rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-colors duration-300 hover:border-blue-300 hover:bg-blue-50" id="process">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Work Experience
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              I have no UI work experience yet, but I'm currently taking a UI design course (SEG 3125). We're learning about different design elements related to UI and UX. References:
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {studyLinks.map((link) => (
                <a
                  key={link.label}
                  className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        </section>

        <section className="spotlight-container rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-colors duration-300 hover:border-blue-300 hover:bg-blue-50" id="case-studies">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">        
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Case Studies
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {caseStudies.map((study) => (
              <article key={study.title} id={study.href.slice(1)} className="spotlight-container flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition-colors duration-300 hover:border-blue-300 hover:bg-blue-50">
                <img className="h-44 w-full object-cover" src={study.image} alt={`${study.name} preview`} />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    {study.title}
                  </p>
                  <h3 className="font-title mt-2 text-lg font-semibold text-slate-900">{study.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{study.description}</p>
                  {study.status === 'Open' ? (
                    <Link
                      to={study.href}
                      className="mt-4 inline-flex w-fit rounded-full bg-sky-600 px-3 py-1 text-xs font-medium text-white ring-1 ring-sky-500 transition hover:bg-sky-700"
                    >
                      Open
                    </Link>
                  ) : (
                    <div className="mt-4 inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                      {study.status}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
