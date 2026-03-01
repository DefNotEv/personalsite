import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import './PhoneView.css'

type PhoneViewProps = {
  onAppClick: () => void
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default function PhoneView({ onAppClick, theme = 'dark', onToggleTheme }: PhoneViewProps) {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const interval = setInterval(() => setTime(formatTime(new Date())), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="phone-view">
      {onToggleTheme && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-wallpaper" />
          <div className="phone-time" aria-hidden="true">{time}</div>
          <div className="phone-status" aria-hidden="true">
            <svg className="phone-status-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M2 20h2V8H2v12zm4 0h2V4H6v16zm4 0h2v-8h-2v8zm4 0h2V4h-2v16z" />
            </svg>
            <svg className="phone-status-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.14 2.14 7.86 2.14 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
            </svg>
            <svg className="phone-status-icon phone-battery" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
            </svg>
          </div>
          <button
            type="button"
            className="app-icon"
            onClick={onAppClick}
            aria-label="Open portfolio"
          >
            <img src="/images/app.jpg" alt="" className="app-icon-img" />
          </button>
        </div>
        <div className="phone-home-bar" />
      </div>
    </div>
  )
}
