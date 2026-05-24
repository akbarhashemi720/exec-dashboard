import { useEffect, useState } from 'react'

const TYPE_FORMATS = {
  currency: (v) => {
    const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
    if (isNaN(n)) return v
    return n.toLocaleString('fa-IR')
  },
  percent: (v) => {
    const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
    if (isNaN(n)) return v
    return `${n}٪`
  },
  number: (v) => {
    const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
    if (isNaN(n)) return v
    return n.toLocaleString('fa-IR')
  },
  text: (v) => String(v),
  time: (v) => String(v),
  ratio: (v) => String(v),
}

const COLOR_MAP = {
  green: { dot: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  red: { dot: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  blue: { dot: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  yellow: { dot: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  orange: { dot: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
  purple: { dot: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  gray: { dot: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
}

function formatValue(value, type) {
  const fmt = TYPE_FORMATS[type?.toLowerCase()] || TYPE_FORMATS.text
  return fmt(value)
}

export default function KPICard({ title, value, type, subtitle, color, index }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 40)
    return () => clearTimeout(t)
  }, [index])

  const colorScheme = color ? COLOR_MAP[color.toLowerCase()] : null
  const formatted = formatValue(value, type)

  return (
    <div
      className="card-appear rounded-lg border flex flex-col items-center justify-center transition-all duration-200 hover:shadow-sm"
      style={{
        opacity: visible ? 1 : 0,
        borderColor: colorScheme ? colorScheme.border : '#e5e7eb',
        backgroundColor: colorScheme ? colorScheme.bg : '#ffffff',
        animationDelay: `${index * 40}ms`,
        direction: 'rtl',
        minHeight: '180px',
        padding: '1.5rem 1rem',
      }}
    >
      <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.75rem', textAlign: 'center' }}>
        {title}
      </p>

      <span
        style={{
          fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
          color: colorScheme ? colorScheme.dot : '#0a0a0a',
          fontFamily: 'var(--font-mono)',
          fontWeight: '300',
          textAlign: 'center',
          lineHeight: '1.3',
          wordBreak: 'break-word',
        }}
      >
        {formatted}
      </span>
    </div>
  )
}
