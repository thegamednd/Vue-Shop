/**
 * Date utility functions for handling numeric timestamps
 * Used to convert between numeric timestamps and human-readable dates
 */

/**
 * Convert numeric timestamp to formatted date string
 * @param {number|string} timestamp - Unix timestamp in seconds or milliseconds (auto-detected)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatTimestamp(timestamp, options = {}) {
  if (!timestamp || isNaN(timestamp)) {
    return 'Unknown Date'
  }

  // Convert string to number and assume Unix timestamp (seconds)
  const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
  
  // Convert Unix timestamp (seconds) to milliseconds for JavaScript Date
  const timestampMs = numTimestamp * 1000
  
  const date = new Date(timestampMs)
  
  // Default options
  const defaultOptions = {
    showTime: false,
    format: 'short' // 'short', 'long', 'relative'
  }
  
  const config = { ...defaultOptions, ...options }
  
  switch (config.format) {
    case 'long':
      return config.showTime 
        ? date.toLocaleString()
        : date.toLocaleDateString()
        
    case 'relative':
      return formatRelativeTime(timestamp)
      
    case 'short':
    default:
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
  }
}

/**
 * Format timestamp as relative time (e.g., "2 days ago", "Just now")
 * @param {number|string} timestamp - Unix timestamp in seconds or milliseconds (auto-detected)
 * @returns {string} Relative time string
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp || isNaN(timestamp)) {
    return 'Unknown'
  }

  // Convert string to number and assume Unix timestamp (seconds)
  const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
  const timestampMs = numTimestamp * 1000

  const now = Date.now()
  const diff = now - timestampMs
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}w ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}

/**
 * Format timestamp for fantasy/gaming theme
 * @param {number|string} timestamp - Unix timestamp in seconds or milliseconds (auto-detected)
 * @returns {string} Fantasy-themed date string
 */
export function formatFantasyDate(timestamp) {
  if (!timestamp || isNaN(timestamp)) {
    return 'Time Forgotten'
  }

  // Convert string to number and assume Unix timestamp (seconds)
  const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
  const timestampMs = numTimestamp * 1000

  const date = new Date(timestampMs)
  const months = [
    'First Moon', 'Second Moon', 'Third Moon', 'Fourth Moon',
    'Fifth Moon', 'Sixth Moon', 'Seventh Moon', 'Eighth Moon', 
    'Ninth Moon', 'Tenth Moon', 'Eleventh Moon', 'Twelfth Moon'
  ]
  
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear() + 1000 // Fantasy year offset
  
  const ordinalSuffix = (n) => {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]
  }
  
  return `${day}${ordinalSuffix(day)} of ${month}, Year ${year}`
}

/**
 * Check if a timestamp is recent (within last 24 hours)
 * @param {number|string} timestamp - Unix timestamp in seconds or milliseconds (auto-detected)
 * @returns {boolean} True if recent
 */
export function isRecent(timestamp) {
  if (!timestamp || isNaN(timestamp)) return false
  
  // Convert string to number and assume Unix timestamp (seconds)
  const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
  const timestampMs = numTimestamp * 1000
  
  const now = Date.now()
  const dayInMs = 24 * 60 * 60 * 1000
  return (now - timestampMs) < dayInMs
}

/**
 * Sort products by timestamp (newest first)
 * @param {Array} products - Array of products with CreatedAt timestamps
 * @returns {Array} Sorted products array
 */
export function sortByTimestamp(products, field = 'CreatedAt', descending = true) {
  return [...products].sort((a, b) => {
    const timestampA = a[field] || 0
    const timestampB = b[field] || 0
    
    return descending 
      ? timestampB - timestampA 
      : timestampA - timestampB
  })
}

/**
 * Debug helper to log timestamp information
 * @param {number|string} timestamp - Unix timestamp to debug (seconds or milliseconds)
 * @param {string} label - Label for console output
 */
export function debugTimestamp(timestamp, label = 'Timestamp') {
  if (!timestamp || isNaN(timestamp)) {
    console.log(`${label}:`, { error: 'Invalid timestamp', value: timestamp })
    return
  }

  // Convert string to number and assume Unix timestamp (seconds)
  const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
  const timestampMs = numTimestamp * 1000
  
  try {
    console.log(`${label}:`, {
      original: timestamp,
      detected: 'Unix seconds (converted to ms)',
      numeric: numTimestamp,
      milliseconds: timestampMs,
      date: new Date(timestampMs).toISOString(),
      formatted: formatTimestamp(timestamp),
      relative: formatRelativeTime(timestamp),
      fantasy: formatFantasyDate(timestamp)
    })
  } catch (error) {
    console.error(`${label} error:`, error, 'Value:', timestamp)
  }
}