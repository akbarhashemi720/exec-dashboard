import { useRef, useState } from 'react'

export default function UploadZone({ onFile }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      {/* Logo / brand mark */}
      <div className="mb-12 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-300 mb-3">Executive Dashboard</p>
        <div className="w-8 h-px bg-gray-200 mx-auto" />
      </div>

      {/* Upload area */}
      <div
        className={`upload-zone w-full max-w-md border border-dashed rounded-lg p-12 text-center cursor-pointer ${
          dragging ? 'drag-over' : ''
        }`}
        style={{ borderColor: '#d1d5db' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleChange}
        />

        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-gray-300">
            <rect x="4" y="4" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M16 20V12M12 16l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          <div>
            <p className="text-sm font-medium text-gray-700">Drop your Excel file here</p>
            <p className="text-xs text-gray-400 mt-1">or click to browse</p>
          </div>

          <p className="text-xs text-gray-300">.xlsx · .xls · .csv</p>
        </div>
      </div>

      {/* Column guide */}
      <div className="mt-10 max-w-md w-full">
        <p className="text-xs tracking-[0.15em] uppercase text-gray-300 mb-4 text-center">Required columns</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { col: 'title', note: 'required', desc: 'Card label' },
            { col: 'value', note: 'required', desc: 'Displayed number' },
            { col: 'type', note: 'required', desc: 'currency / number / percent / text' },
            { col: 'subtitle', note: 'optional', desc: 'Small description' },
            { col: 'color', note: 'optional', desc: 'green / red / blue / yellow…' },
            { col: 'group', note: 'optional', desc: 'Section heading' },
          ].map(({ col, note, desc }) => (
            <div key={col} className="border border-gray-100 rounded p-3 bg-gray-50">
              <p className="text-xs font-medium text-gray-700 font-mono">{col}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
