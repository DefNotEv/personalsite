import ThemeToggle from './ThemeToggle'
import './LoadingScreen.css'

type LoadingScreenProps = {
  message?: string
  fading?: boolean
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
}

export default function LoadingScreen({ message = 'Loading...', fading = false, theme = 'dark', onToggleTheme }: LoadingScreenProps) {
  return (
    <div className={`loading-screen ${fading ? 'fade-out' : ''}`}>
      {onToggleTheme && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  )
}
