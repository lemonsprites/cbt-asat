import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

// Dari UTC (ISO string) ke format datetime-local (yyyy-MM-ddTHH:mm) sesuai zona lokal
export function toDatetimeLocal(isoString) {
  if (!isoString) return ''
  const d = dayjs(isoString)
  return d.format('YYYY-MM-DDTHH:mm')
}

// Dari input datetime-local (waktu lokal) ke ISO string (UTC)
export function toISOString(datetimeLocal) {
  if (!datetimeLocal) return null
  return dayjs(datetimeLocal).toISOString()
}

// Format untuk tampilan
export function formatTime(isoString, format = 'DD/MM/YYYY HH:mm') {
  if (!isoString) return '-'
  return dayjs(isoString).format(format)
}