import { useState, useCallback, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import './Portfolio.css'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const ABOUT_IMAGES = ['/images/about1.png', '/images/about2.png', '/images/about3.png', '/images/about4.png']

function daysSinceJan10(): number {
  const year = new Date().getFullYear()
  const start = new Date(year, 0, 10)
  const now = new Date()
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
}

function daysSinceNov2(): number {
  const start = new Date(2025, 10, 2)
  const now = new Date()
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
}

type PortfolioProps = {
  onBack?: () => void
}

export default function Portfolio({ onBack }: PortfolioProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  const updateActiveFromScroll = useCallback(() => {
    const main = mainRef.current
    if (!main) return
    const ids = ['about', 'projects', 'contact'] as const
    const mainRect = main.getBoundingClientRect()
    const viewCenter = mainRect.left + mainRect.width / 2

    let bestId: string | null = null
    let bestDist = Infinity

    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const elCenter = rect.left + rect.width / 2
      const dist = Math.abs(elCenter - viewCenter)
      if (dist < bestDist) {
        bestDist = dist
        bestId = id
      }
    }
    setActiveNav(bestId)
  }, [])

  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    updateActiveFromScroll()
    main.addEventListener('scroll', updateActiveFromScroll, { passive: true })
    const ro = new ResizeObserver(updateActiveFromScroll)
    ro.observe(main)
    return () => {
      main.removeEventListener('scroll', updateActiveFromScroll)
      ro.disconnect()
    }
  }, [updateActiveFromScroll])

  const scrollToSection = useCallback((id: string) => {
    setActiveNav(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.location.hash = ''
      window.location.reload()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to .env')
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { name, email, message },
        { publicKey: EMAILJS_PUBLIC_KEY }
      )
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      console.error('Email send failed:', err)
      setStatus('error')
    }
  }

  return (
    <div className="portfolio">
      <header className="portfolio-top-bar">
        {onBack && (
          <button
            type="button"
            className="portfolio-back-button"
            onClick={handleBack}
            aria-label="Back"
          >
            <span className="portfolio-back-button-icon">‹</span>
          </button>
        )}
        <p className="portfolio-bar-name" aria-hidden="true">
          EVELYN!
        </p>
        <div className="portfolio-top-bar-right">
          <div className="portfolio-bar-parallelograms">
            <a
              href="https://www.linkedin.com/in/evelynhwong"
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-bar-icon"
              aria-label="LinkedIn"
            >
              <span className="portfolio-bar-icon-circle portfolio-bar-icon-circle--linkedin">
                <svg viewBox="0 0 24 24" className="portfolio-bar-icon-svg" aria-hidden>
                  <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </span>
              <span className="portfolio-bar-icon-shape"><span>LINKEDIN</span></span>
            </a>
            <a
              href="https://www.x.com/evelynhannah_"
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-bar-icon"
              aria-label="X"
            >
              <span className="portfolio-bar-icon-circle portfolio-bar-icon-circle--x">
                <svg viewBox="0 0 24 24" className="portfolio-bar-icon-svg" aria-hidden>
                  <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </span>
              <span className="portfolio-bar-icon-shape"><span>X</span></span>
            </a>
            <a
              href="https://www.instagram.com/wong.zs"
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-bar-icon"
              aria-label="Insta"
            >
              <span className="portfolio-bar-icon-circle portfolio-bar-icon-circle--instagram">
                <svg viewBox="0 0 24 24" className="portfolio-bar-icon-svg" aria-hidden>
                  <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </span>
              <span className="portfolio-bar-icon-shape"><span>INSTA</span></span>
            </a>
            <a
              href="https://github.com/DefNotEv"
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-bar-icon"
              aria-label="GitHub"
            >
              <span className="portfolio-bar-icon-circle portfolio-bar-icon-circle--github">
                <svg viewBox="0 0 24 24" className="portfolio-bar-icon-svg" aria-hidden>
                  <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </span>
              <span className="portfolio-bar-icon-shape"><span>GITHUB</span></span>
            </a>
          </div>
          <div className="portfolio-back-button-mirror-wrap" aria-hidden="true">
            <div className="portfolio-back-button portfolio-back-button-mirror">
              <img
                src="/images/headshot.jpg"
                alt=""
                className="portfolio-headshot"
              />
            </div>
          </div>
        </div>
      </header>
      <main ref={mainRef} className="portfolio-main">
        <div className="portfolio-parallelograms-track">
          <div id="about" className="portfolio-center-parallelogram portfolio-center-parallelogram--first">
            <p className="portfolio-parallelogram-bar-title">HEY, NICE TO MEET YOU</p>
            <div className="portfolio-first-inner">
              <div className="portfolio-first-text">
                <p className="portfolio-first-intro">
                  I'm Evelyn Hannah Z.S. Wong — but you can call me Evelyn! I'm an 18-year-old student based between Toronto, Canada and Indianapolis, U.S.A.
                </p>
                <p className="portfolio-first-body">
                  I love building, failing, and trying again. I love to try everything from robotics to snowboard racing, but right now, the main things I'm focused on are:
                </p>
                <ul className="portfolio-first-list">
                  <li>Completing my degree in Motorsports Engineering @ Purdue University</li>
                  <li>Building Downtown Indy Rally Team (DIRT)</li>
                  <li>Training for the Purdue 2026 5K Challenge</li>
                  <li>Staying sober from Monster for {daysSinceJan10()} days</li>
                  <li>And, ironically, staying away from Brawl Stars for {daysSinceNov2()} days (this is my proudest achievement)</li>
                </ul>
              </div>
              <div className="portfolio-first-image-wrap">
                {ABOUT_IMAGES.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="portfolio-first-image portfolio-first-carousel-image"
                    style={{ animationDelay: `${i * 4}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Project parallelograms — image paths and content from legacy HTML */}
          <div id="projects" className="parallelogram">
            {/* Project 10: DIRT */}
            <div id="project10" className="parallelogram project">
              <div className="top-bar" aria-hidden />
              <div className="bottom-bar" aria-hidden />
              <div className="project-title">
                <img src="/images/rallylogo.png" alt="DIRT logo" className="title-logo" />
                <p className="dirt-title-text">DIRT</p>
              </div>
              <p className="organizer-text">FOUNDER &amp; SECRETARY</p>
              <p className="subtitle-text">downtown indy rally team!</p>
              <div className="image-container">
                <img src="/images/rallycar.png" alt="DIRT rally car" className="rally-image" />
              </div>
              <div className="project-content">
                <a
                  href="https://www.instagram.com/dirtpurdue"
                  className="project-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VIEW TEAM
                </a>
              </div>
            </div>

            {/* Project 1: Apocalypse */}
            <div id="project1" className="parallelogram project">
              <div className="top-bar" aria-hidden />
              <div className="bottom-bar" aria-hidden />
              <div className="project-title">
                <img src="/images/apotitle.png" alt="Apocalypse" className="title-image" />
              </div>
              <p className="organizer-text">LEAD ORGANIZER</p>
              <p className="subtitle-text">canada&apos;s largest hs hackathon!</p>
              <div className="image-carousel">
                <img src="/images/apo1.png" alt="Apocalypse 1" className="carousel-image" />
                <img src="/images/apo2.png" alt="Apocalypse 2" className="carousel-image" />
                <img src="/images/apo3.png" alt="Apocalypse 3" className="carousel-image" />
                <img src="/images/apo4.png" alt="Apocalypse 4" className="carousel-image" />
                <img src="/images/apo5.jpg" alt="Apocalypse 5" className="carousel-image" />
                <img src="/images/apo6.png" alt="Apocalypse 6" className="carousel-image" />
                <img src="/images/apo7.png" alt="Apocalypse 7" className="carousel-image" />
              </div>
              <div className="project-content">
                <a href="https://apohacks.com" className="project-link" target="_blank" rel="noopener noreferrer">VIEW WEBSITE</a>
              </div>
            </div>

            {/* Project 2: Hack Canada */}
            <div id="project2" className="parallelogram project">
              <div className="top-bar" aria-hidden />
              <div className="bottom-bar" aria-hidden />
              <div className="project-title">
                <img src="/images/hcbeaver.svg" alt="Hack Canada Beaver" className="title-beaver" />
                <p className="title-text">HACK CANADA</p>
              </div>
              <p className="organizer-text">HEAD OF MARKETING</p>
              <p className="subtitle-text">another big canada hackathon!</p>
              <div className="image-carousel">
                <img src="/images/hackcanada1.JPG" alt="Hack Canada 1" className="carousel-image" />
                <img src="/images/hackcanada2.JPG" alt="Hack Canada 2" className="carousel-image" />
                <img src="/images/hackcanada3.JPG" alt="Hack Canada 3" className="carousel-image" />
                <img src="/images/hackcanada4.JPG" alt="Hack Canada 4" className="carousel-image" />
                <img src="/images/hackcanada5.JPG" alt="Hack Canada 5" className="carousel-image" />
                <img src="/images/hackcanada6.JPG" alt="Hack Canada 6" className="carousel-image" />
                <img src="/images/hackcanada7.JPG" alt="Hack Canada 7" className="carousel-image" />
              </div>
              <div className="project-content">
                <a href="https://hackcanada.org" className="project-link" target="_blank" rel="noopener noreferrer">VIEW WEBSITE</a>
              </div>
            </div>

            {/* Project 6: National Events (third) */}
            <div id="project6" className="parallelogram project">
              <div className="top-bar" aria-hidden />
              <div className="bottom-bar" aria-hidden />
              <div className="project-title">
                <img src="/images/nemtitle.png" alt="National Events" className="title-image" />
              </div>
              <p className="organizer-text">MARKETING/OPS INTERN</p>
              <div className="website-embed">
                <iframe
                  src="https://nationalevent.com"
                  title="National Events Website"
                  className="website-embed-iframe"
                />
              </div>
              <div className="project-content">
                <a href="https://nationalwomensshow.com/" className="project-link" target="_blank" rel="noopener noreferrer">WOMEN&apos;S SHOW</a>
                <a href="https://www.franchiseshowinfo.com/" className="project-link" target="_blank" rel="noopener noreferrer">FRANCHISE SHOW</a>
              </div>
            </div>

            {/* Project 3: Hack49 */}
            <div id="project3" className="parallelogram project">
              <div className="top-bar" aria-hidden />
              <div className="bottom-bar" aria-hidden />
              <div className="project-title">
                <img src="/images/hack49title.svg" alt="Hack49" className="title-image" />
              </div>
              <p className="organizer-text">CONTENT CREATOR</p>
              <p className="subtitle-text">a global hackathon!</p>
              <div className="project-content">
                <a href="https://hack49.com" className="project-link" target="_blank" rel="noopener noreferrer">VIEW WEBSITE</a>
              </div>
            </div>

            {/* Project 4: VRC Team 1165A */}
            <div id="project4" className="parallelogram project">
              <div className="top-bar" aria-hidden />
              <div className="bottom-bar" aria-hidden />
              <div className="project-title">
                <p className="title-text">VRC TEAM 1165A</p>
              </div>
              <p className="organizer-text">TEAM MANAGER</p>
              <p className="subtitle-text">worlds qualifier 2025!</p>
              <div className="image-container">
                <img src="/images/vrcbot.png" alt="VRC Bot" className="vrc-image" />
              </div>
              <div className="project-content">
                <a href="https://www.instagram.com/alturafoundation" className="project-link" target="_blank" rel="noopener noreferrer">VIEW TEAM</a>
              </div>
            </div>

            {/* Project 5: FRC */}
            <div id="project5" className="parallelogram project">
              <div className="top-bar" aria-hidden />
              <div className="bottom-bar" aria-hidden />
              <div className="project-title">
                <img src="/images/frctitle.png" alt="FRC" className="title-image" />
              </div>
              <p className="organizer-text">TEAM MEMBER</p>
              <p className="subtitle-text">also worlds qualifier 2025!</p>
              <div className="image-carousel">
                <img src="/images/frc.png" alt="FRC" className="frc-image" />
              </div>
              <div className="project-content">
                <a href="https://www.markhamfirebirds.ca" className="project-link" target="_blank" rel="noopener noreferrer">VIEW TEAM</a>
              </div>
            </div>

            {/* Project 7: Hope Bible Church */}
            <div id="project7" className="parallelogram project">
              <div className="hope-background" aria-hidden />
              <div className="top-bar" aria-hidden />
              <div className="bottom-bar" aria-hidden />
              <div className="project-title">
                <img src="/images/hbcmlogo.svg" alt="HBCM Logo" className="title-logo" />
                <p className="title-text">Hope Bible Church</p>
              </div>
              <p className="organizer-text">A/V TECHNICIAN</p>
              <p className="subtitle-text">livestream and camera operator!</p>
              <div className="project-content">
                <a href="https://hopemarkham.ca" className="project-link" target="_blank" rel="noopener noreferrer">VIEW CHURCH</a>
              </div>
            </div>

          </div>

          <div id="contact" className="portfolio-center-parallelogram portfolio-center-parallelogram--contact">
            <p className="portfolio-contact-title">CONTACT ME</p>
            <div className="portfolio-contact-inner">
              <form className="portfolio-contact-form" onSubmit={handleSubmit}>
                <div className="portfolio-contact-field">
                  <input
                    type="text"
                    className="portfolio-contact-input"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="portfolio-contact-field">
                  <input
                    type="email"
                    className="portfolio-contact-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="portfolio-contact-field">
                  <textarea
                    className="portfolio-contact-textarea"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <div className="portfolio-contact-submit-wrap">
                  <button
                    type="submit"
                    className="portfolio-contact-submit"
                    disabled={status === 'sending'}
                  >
                    <span className="portfolio-contact-submit-text">
                      {status === 'sending' ? 'Sending...' : status === 'success' ? 'Sent!' : 'SEND'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <footer className="portfolio-bottom-bar">
        <button
          type="button"
          className={`portfolio-bottom-nav-btn ${activeNav === 'about' ? 'portfolio-bottom-nav-btn--active' : ''}`}
          onClick={() => scrollToSection('about')}
        >
          ABOUT ME
        </button>
        <button
          type="button"
          className={`portfolio-bottom-nav-btn ${activeNav === 'projects' ? 'portfolio-bottom-nav-btn--active' : ''}`}
          onClick={() => scrollToSection('projects')}
        >
          RESUME
        </button>
        <button
          type="button"
          className={`portfolio-bottom-nav-btn ${activeNav === 'contact' ? 'portfolio-bottom-nav-btn--active' : ''}`}
          onClick={() => scrollToSection('contact')}
        >
          CONTACT ME
        </button>
      </footer>
    </div>
  )
}
