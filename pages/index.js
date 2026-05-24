import Head from 'next/head'
import { useState, useCallback, useRef } from 'react'
import { parseExcelFile, groupCards } from '../utils/parseExcel'
import KPICard from '../components/KPICard'
import UploadZone from '../components/UploadZone'
import Header from '../components/Header'

export default function Home() {
  const [cards, setCards] = useState([])
  const [groups, setGroups] = useState([])
  const [fileName, setFileName] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)

  const processFile = useCallback(async (file) => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const parsed = await parseExcelFile(file)
      if (parsed.length === 0) {
        setError('ردیف معتبری پیدا نشد. مطمئن شوید ستون‌های title، value و type وجود دارند.')
        setLoading(false)
        return
      }
      setCards(parsed)
      setGroups(groupCards(parsed))
      setFileName(file.name)
      setLastUpdated(new Date())
      fileRef.current = file
    } catch (err) {
      setError('فایل قابل خواندن نیست. مطمئن شوید فایل xlsx، xls یا csv معتبر است.')
      console.error(err)
    }
    setLoading(false)
  }, [])

  const handleRefresh = useCallback(() => {
    if (fileRef.current) processFile(fileRef.current)
  }, [processFile])

  const handleReset = useCallback(() => {
    setCards([])
    setGroups([])
    setFileName('')
    setLastUpdated(null)
    fileRef.current = null
  }, [])

  const hasDashboard = cards.length > 0
  let cardIndex = 0

  return (
    <>
      <Head>
        <title>{fileName ? `${fileName} — داشبورد مدیریتی` : 'داشبورد مدیریتی'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="داشبورد مدیریتی" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%230a0a0a'/><text y='72' x='50' text-anchor='middle' font-size='60' fill='white'>⬛</text></svg>" />
      </Head>

      <div className="min-h-screen bg-white" dir="rtl">
        {hasDashboard && (
          <Header
            lastUpdated={lastUpdated}
            onRefresh={handleRefresh}
            onReset={handleReset}
            fileName={fileName}
            autoRefreshMs={180000}
          />
        )}

        <main>
          {loading && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-5 h-5 border border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                <p className="text-xs text-gray-400">در حال پردازش فایل...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center min-h-[60vh] px-6">
              <div className="max-w-sm text-center">
                <p className="text-sm text-red-500 mb-4">{error}</p>
                <button onClick={handleReset} className="text-xs text-gray-400 underline hover:text-gray-700 transition-colors">
                  تلاش مجدد
                </button>
              </div>
            </div>
          )}

          {!loading && !error && !hasDashboard && (
            <UploadZone onFile={processFile} />
          )}

          {!loading && !error && hasDashboard && (
            <div className="px-6 py-8 max-w-screen-2xl mx-auto">
              {groups.map((group) => (
                <section key={group.name || '__ungrouped__'} className="mb-10">
                  {group.name && (
                    <div className="flex items-center gap-4 mb-5" style={{ direction: 'rtl' }}>
                      <h2
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#111827',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {group.name}
                      </h2>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                  )}

                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    }}
                  >
                    {group.cards.map((card) => {
                      const idx = cardIndex++
                      return (
                        <KPICard
                          key={card.id}
                          title={card.title}
                          value={card.value}
                          type={card.type}
                          subtitle={card.subtitle}
                          color={card.color}
                          index={idx}
                        />
                      )
                    })}
                  </div>
                </section>
              ))}

              <footer className="mt-16 pb-10 flex items-center justify-between border-t border-gray-50 pt-6">
                <p className="text-xs text-gray-300 font-mono">
                  {lastUpdated?.toLocaleString('fa-IR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="text-xs text-gray-300">{cards.length} شاخص</p>
              </footer>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
