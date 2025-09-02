/**
 * Date utility functions for handling numeric timestamps
 * Used to convert between numeric timestamps and human-readable dates
 */

/**
 * Convert numeric timestamp to formatted date string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatTimestamp(timestamp, options = {}) {
  if (!timestamp || isNaN(timestamp)) {
    return 'Unknown Date'
  }

  const date = new Date(timestamp)
  
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
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Relative time string
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp || isNaN(timestamp)) {
    return 'Unknown'
  }

  const now = Date.now()
  const diff = now - timestamp
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
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Fantasy-themed date string
 */
export function formatFantasyDate(timestamp) {
  if (!timestamp || isNaN(timestamp)) {
    return 'Time Forgotten'
  }

  const date = new Date(timestamp)
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
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {boolean} True if recent
 */
export function isRecent(timestamp) {
  if (!timestamp || isNaN(timestamp)) return false
  
  const now = Date.now()
  const dayInMs = 24 * 60 * 60 * 1000
  return (now - timestamp) < dayInMs
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
 * @param {number} timestamp - Unix timestamp to debug
 * @param {string} label - Label for console output
 */
export function debugTimestamp(timestamp, label = 'Timestamp') {
  console.log(`${label}:`, {
    numeric: timestamp,
    date: new Date(timestamp).toISOString(),
    formatted: formatTimestamp(timestamp),
    relative: formatRelativeTime(timestamp),
    fantasy: formatFantasyDate(timestamp)
  })
}