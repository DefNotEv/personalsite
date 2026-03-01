import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import PhoneView from './components/PhoneView'
import Portfolio from './components/Portfolio'
import './App.css'

type Screen = 'loading' | 'phone' | 'app-loading' | 'portfolio'
type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'portfolio-theme'
const INITIAL_LOAD_MS = 2200
const LOADING_FADE_MS = 500
const APP_LOAD_MS = 2900
const REVEAL_FADE_OUT_MS = 600
const TEXT_REVEAL_DELAY_MS = 1200
const PORTFOLIO_BACK_FADE_MS = 450

function getInitialScreen(): Screen {
  return window.location.hash === '#portfolio' ? 'portfolio' : 'loading'
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function App() {
  const [screen, setScreen] = useState<Screen>(getInitialScreen)
  const [portfolioVisible, setPortfolioVisible] = useState(
    () => window.location.hash === '#portfolio'
  )
  const [loadingFadingOut, setLoadingFadingOut] = useState(false)
  const [revealVisible, setRevealVisible] = useState(false)
  const [revealFadingOut, setRevealFadingOut] = useState(false)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  /* Show viewport warning when aspect ratio is 1.25:1 or smaller (narrower viewport) */
  const [showViewportWarning, setShowViewportWarning] = useState(
    () => window.matchMedia('(max-aspect-ratio: 5/4)').matches
  )
  const [portfolioFadingOut, setPortfolioFadingOut] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-aspect-ratio: 5/4)')
    const handleChange = (e: MediaQueryListEvent) => setShowViewportWarning(e.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('app-reveal-active')
    document.body.classList.remove('theme-light', 'theme-dark', 'app-reveal-active')
    if (screen === 'app-loading') {
      root.classList.add('app-reveal-active')
      document.body.classList.add('app-reveal-active')
    } else if (screen !== 'portfolio') {
      document.body.classList.add(`theme-${theme}`)
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme, screen])

  // Initial loading → fade out → phone (skip if we started on portfolio)
  useEffect(() => {
    if (screen !== 'loading') return
    const t1 = setTimeout(() => setLoadingFadingOut(true), INITIAL_LOAD_MS)
    return () => clearTimeout(t1)
  }, [screen])
  useEffect(() => {
    if (!loadingFadingOut) return
    const t2 = setTimeout(() => {
      setScreen('phone')
      setLoadingFadingOut(false)
    }, LOADING_FADE_MS)
    return () => clearTimeout(t2)
  }, [loadingFadingOut])

  // Keep portfolio in URL so reload stays on portfolio
  useEffect(() => {
    if (screen === 'portfolio') {
      window.location.hash = '#portfolio'
    } else if (window.location.hash === '#portfolio') {
      window.location.hash = ''
    }
  }, [screen])

  // App loading: fade to black (over phone) → show name → fade out (reveal portfolio) → switch to portfolio
  useEffect(() => {
    if (screen !== 'app-loading') {
      setRevealVisible(false)
      setRevealFadingOut(false)
      return
    }
    // Fade black overlay in over the phone (phone stays mounted)
    const startFade = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealVisible(true))
    })
    // Play Supercell intro sound when the name animation starts
    const soundTimeout = setTimeout(() => {
      try {
        const audio = new Audio('/sounds/supercell-intro-sound.mp3')
        audio.volume = 0.9
        void audio.play()
      } catch {
        // ignore audio errors (e.g., autoplay blocked)
      }
    }, TEXT_REVEAL_DELAY_MS)
    // Start fade out; portfolio mounts underneath and becomes visible so we reveal it
    const startFadeOut = setTimeout(() => {
      setPortfolioVisible(true)
      setRevealFadingOut(true)
      // Play Brawl Stars sound when portfolio fades in
      try {
        const brawlAudio = new Audio('/sounds/brawl-stars-loading-sound.mp3')
        brawlAudio.volume = 0.9
        void brawlAudio.play()
      } catch {
        // ignore audio errors (e.g., autoplay blocked)
      }
    }, APP_LOAD_MS)
    const goToPortfolio = setTimeout(() => {
      setScreen('portfolio')
      setRevealVisible(false)
      setRevealFadingOut(false)
    }, APP_LOAD_MS + REVEAL_FADE_OUT_MS)
    return () => {
      cancelAnimationFrame(startFade)
      clearTimeout(soundTimeout)
      clearTimeout(startFadeOut)
      clearTimeout(goToPortfolio)
    }
  }, [screen])

  const handleAppClick = () => {
    setScreen('app-loading')
  }

  const handlePortfolioBack = () => {
    setPortfolioFadingOut(true)
    setTimeout(() => {
      setScreen('phone')
      window.location.hash = ''
      setPortfolioFadingOut(false)
    }, PORTFOLIO_BACK_FADE_MS)
  }

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  return (
    <>
      <div
        className={`viewport-warning ${showViewportWarning && screen === 'portfolio' ? 'visible' : ''}`}
        role="alert"
        aria-live="polite"
        aria-hidden={!(showViewportWarning && screen === 'portfolio')}
      >
        <p className="viewport-warning-title">Viewport not supported</p>
        <p className="viewport-warning-subtitle">Rotate your phone or switch devices</p>
      </div>
      {/* Keep phone visible during app-loading and when fading back from portfolio */}
      {(screen === 'phone' || screen === 'app-loading' || (screen === 'loading' && loadingFadingOut) || (screen === 'portfolio' && portfolioFadingOut)) && (
        <PhoneView onAppClick={handleAppClick} theme={theme} onToggleTheme={toggleTheme} />
      )}
      {screen === 'loading' && (
        <LoadingScreen message="Loading..." fading={loadingFadingOut} theme={theme} onToggleTheme={toggleTheme} />
      )}
      {screen === 'app-loading' && (
        <div
          className={`app-reveal ${revealVisible ? 'visible' : ''} ${revealFadingOut ? 'fade-out' : ''}`}
          aria-hidden="true"
        >
          <p className="app-reveal-name">
            <span>EVELYN</span>
            <span>HANNAH</span>
            <span>ZS WONG</span>
          </p>
          <p className="app-reveal-disclaimer">
            This website is a parody of Brawl Stars and Clash Royale. This is not endorsed by Supercell. For more info
            see Supercell&apos;s Fan Content Policy.
          </p>
        </div>
      )}
      {/* Mount portfolio under overlay when fading out so we reveal it smoothly (no flash) */}
      {(screen === 'portfolio' || (screen === 'app-loading' && revealFadingOut)) && (
        <div className={`portfolio-wrap ${portfolioVisible ? 'visible' : ''} ${portfolioFadingOut ? 'fade-out' : ''}`}>
          <Portfolio onBack={handlePortfolioBack} />
        </div>
      )}
    </>
  )
}

export default App
