/**
 * Parse an Excel/CSV file into KPI rows.
 * Expected columns (case-insensitive): title, value, type, subtitle, color, group
 */
export async function parseExcelFile(file) {
  const XLSX = await import('xlsx')

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        const normalize = (obj) => {
          const out = {}
          for (const k of Object.keys(obj)) {
            out[k.trim().toLowerCase()] = obj[k]
          }
          return out
        }

        const cards = rows
          .map(normalize)
          .filter((r) => r.title && r.value !== '')
          .map((r, i) => ({
            id: `card-${i}-${Date.now()}`,
            title: String(r.title).trim(),
            value: r.value,
            type: String(r.type || 'text').trim().toLowerCase(),
            subtitle: r.subtitle ? String(r.subtitle).trim() : '',
            color: r.color ? String(r.color).trim().toLowerCase() : '',
            group: r.group ? String(r.group).trim() : '',
          }))

        resolve(cards)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Group cards by their `group` field.
 * Returns: [{ name: string, cards: Card[] }]
 */
export function groupCards(cards) {
  const groups = []
  const ungrouped = []

  for (const card of cards) {
    if (!card.group) {
      ungrouped.push(card)
    } else {
      const existing = groups.find((g) => g.name === card.group)
      if (existing) {
        existing.cards.push(card)
      } else {
        groups.push({ name: card.group, cards: [card] })
      }
    }
  }

  // Ungrouped cards go first without a heading
  if (ungrouped.length > 0) {
    return [{ name: '', cards: ungrouped }, ...groups]
  }
  return groups
}
