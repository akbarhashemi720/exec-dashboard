import { useEffect, useState, useCallback } from 'react'

export default function Header({ lastUpdated, onRefresh, onReset, fileName, autoRefreshMs = 180000 }) {
  const [countdown, setCountdown] = useState(autoRefreshMs / 1000)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [timeStr, setTimeStr] = useState('')

  // Format timestamp
  useEffect(() => {
    if (!lastUpdated) return
    const fmt = () => {
      const now = new Date()
      const diff = Math.floor((now - lastUpdated) / 1000)
      if (diff < 5) return 'just now'
      if (diff < 60) return `${diff}s ago`
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
      return lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setTimeStr(fmt())
    const t = setInterval(() => setTimeStr(fmt()), 15000)
    return () => clearInterval(t)
  }, [lastUpdated])

  // Auto-refresh countdown
  useEffect(() => {
    setCountdown(autoRefreshMs / 1000)
    const tick = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onRefresh()
          return autoRefreshMs / 1000
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [lastUpdated, autoRefreshMs, onRefresh])

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const mins = Math.floor(countdown / 60)
  const secs = countdown % 60

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-gray-100"
      style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
    >
      {/* Left: brand + file */}
      <div className="flex items-center gap-4">
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 font-medium">
          Exec Dashboard
        </p>
        {fileName && (
          <>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400 font-mono truncate max-w-[180px]">{fileName}</span>
          </>
        )}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-5">
        {/* Auto-refresh indicator */}
        <div className="flex items-center gap-2">
          <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="text-xs text-gray-400 font-mono tabular-nums">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
        </div>

        {/* Last updated */}
        {timeStr && (
          <span className="text-xs text-gray-400 hidden sm:inline">
            Updated {timeStr}
          </span>
        )}

        {/* Manual refresh */}
        <button
          onClick={onRefresh}
          title="Refresh now"
          className="text-gray-300 hover:text-gray-600 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5c1.8 0 3.4.87 4.4 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 2v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Change file */}
        <button
          onClick={onReset}
          title="Change file"
          className="text-xs text-gray-300 hover:text-gray-600 transition-colors"
        >
          Change file
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          className="text-gray-300 hover:text-gray-600 transition-colors"
        >
          {isFullscreen ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M5 1v4H1M11 1v4h4M5 15v-4H1M11 15v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
