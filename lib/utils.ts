import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Country flag utilities
export function getCountryFlag(location: string): string {
  const countryMappings: { [key: string]: string } = {
    // United States
    'united states': '🇺🇸',
    'usa': '🇺🇸',
    'us': '🇺🇸',
    'america': '🇺🇸',
    'new york': '🇺🇸',
    'new york city': '🇺🇸',
    'nyc': '🇺🇸',
    'san francisco': '🇺🇸',
    'sf': '🇺🇸',
    'sf bay area': '🇺🇸',
    'bay area': '🇺🇸',
    'los angeles': '🇺🇸',
    'la': '🇺🇸',
    'chicago': '🇺🇸',
    'boston': '🇺🇸',
    'seattle': '🇺🇸',
    'austin': '🇺🇸',
    'denver': '🇺🇸',
    'atlanta': '🇺🇸',
    'miami': '🇺🇸',
    'dallas': '🇺🇸',
    'houston': '🇺🇸',
    'philadelphia': '🇺🇸',
    'philly': '🇺🇸',
    'detroit': '🇺🇸',
    'pittsburgh': '🇺🇸',
    'cleveland': '🇺🇸',
    'columbus': '🇺🇸',
    'indianapolis': '🇺🇸',
    'milwaukee': '🇺🇸',
    'kansas city': '🇺🇸',
    'st. louis': '🇺🇸',
    'minneapolis': '🇺🇸',
    'portland': '🇺🇸',
    'washington': '🇺🇸',
    'dc': '🇺🇸',
    'raleigh': '🇺🇸',
    'phoenix': '🇺🇸',
    'las vegas': '🇺🇸',
    'san diego': '🇺🇸',
    'sacramento': '🇺🇸',
    
    // International
    'india': '🇮🇳',
    'bangalore': '🇮🇳',
    'bengaluru': '🇮🇳',
    'mumbai': '🇮🇳',
    'delhi': '🇮🇳',
    'hyderabad': '🇮🇳',
    'pune': '🇮🇳',
    'chennai': '🇮🇳',
    'gurugram': '🇮🇳',
    'noida': '🇮🇳',
    
    'united kingdom': '🇬🇧',
    'uk': '🇬🇧',
    'london': '🇬🇧',
    'manchester': '🇬🇧',
    'edinburgh': '🇬🇧',
    'cambridge': '🇬🇧',
    
    'canada': '🇨🇦',
    'toronto': '🇨🇦',
    'vancouver': '🇨🇦',
    'montreal': '🇨🇦',
    'ottawa': '🇨🇦',
    
    'germany': '🇩🇪',
    'berlin': '🇩🇪',
    'munich': '🇩🇪',
    'hamburg': '🇩🇪',
    
    'france': '🇫🇷',
    'paris': '🇫🇷',
    'lyon': '🇫🇷',
    
    'sweden': '🇸🇪',
    'stockholm': '🇸🇪',
    'malmo': '🇸🇪',
    
    'japan': '🇯🇵',
    'tokyo': '🇯🇵',
    'osaka': '🇯🇵',
    
    'china': '🇨🇳',
    'beijing': '🇨🇳',
    'shanghai': '🇨🇳',
    'shenzhen': '🇨🇳',
    
    'australia': '🇦🇺',
    'sydney': '🇦🇺',
    'melbourne': '🇦🇺',
    
    'netherlands': '🇳🇱',
    'amsterdam': '🇳🇱',
    
    'israel': '🇮🇱',
    'tel aviv': '🇮🇱',
    
    'singapore': '🇸🇬',
    'brazil': '🇧🇷',
    'sao paulo': '🇧🇷',
    'mexico': '🇲🇽',
    'ireland': '🇮🇪',
    'dublin': '🇮🇪',
    'spain': '🇪🇸',
    'madrid': '🇪🇸',
    'italy': '🇮🇹',
    'milan': '🇮🇹',
    'south korea': '🇰🇷',
    'seoul': '🇰🇷',
    'remote': '🌐',
    'worldwide': '🌍',
    'global': '🌍',
    'non-us': '🌍', // Better default for non-US locations
    'international': '🌍',
    'europe': '🇪🇺',
    'asia': '🌏',
    'africa': '🌍',
    'south america': '🌎',
    'north america': '🌎',
    'oceania': '🌏'
  }
  
  const location_lower = location.toLowerCase().trim()
  
  // Handle empty or null locations
  if (!location_lower || location_lower === 'null' || location_lower === 'undefined') {
    return '🌐'
  }
  
  // Direct match
  if (countryMappings[location_lower]) {
    return countryMappings[location_lower]
  }
  
  // Partial match for complex location strings
  for (const [key, flag] of Object.entries(countryMappings)) {
    if (location_lower.includes(key) || key.includes(location_lower)) {
      return flag
    }
  }
  
  // Try to extract country from common patterns
  const patterns = [
    /(?:in|from|at)\s+([a-zA-Z\s]+)/i,
    /([a-zA-Z\s]+),\s*([a-zA-Z\s]+)/i,
    /([a-zA-Z\s]+)\s*-\s*([a-zA-Z\s]+)/i
  ]
  
  for (const pattern of patterns) {
    const match = location_lower.match(pattern)
    if (match) {
      for (let i = 1; i < match.length; i++) {
        const potentialCountry = match[i].trim()
        if (countryMappings[potentialCountry]) {
          return countryMappings[potentialCountry]
        }
      }
    }
  }
  
  // If location contains "non-us" or similar, return globe
  if (location_lower.includes('non-us') || location_lower.includes('non us') || location_lower.includes('international')) {
    return '🌍'
  }
  
  return '🌐' // Default globe for unknown locations
}

export function getIndustryIcon(sector: string): string {
  const sectorIcons: { [key: string]: string } = {
    'technology': '💻',
    'tech': '💻',
    'software': '💻',
    'ai': '🤖',
    'fintech': '💰',
    'finance': '💰',
    'banking': '🏦',
    'healthcare': '🏥',
    'biotech': '🧬',
    'pharmaceutical': '💊',
    'retail': '🛍️',
    'e-commerce': '🛒',
    'automotive': '🚗',
    'transportation': '🚛',
    'energy': '⚡',
    'oil': '🛢️',
    'renewable': '🌱',
    'manufacturing': '🏭',
    'construction': '🏗️',
    'real estate': '🏠',
    'media': '📺',
    'entertainment': '🎬',
    'gaming': '🎮',
    'education': '📚',
    'consulting': '👔',
    'marketing': '📊',
    'advertising': '📢',
    'telecommunications': '📱',
    'aerospace': '✈️',
    'food': '🍕',
    'hospitality': '🏨',
    'travel': '✈️',
    'crypto': '₿',
    'blockchain': '⛓️',
    'logistics': '📦',
    'hr': '👥',
    'security': '🛡️',
    'other': '🏢'
  }
  
  const sector_lower = sector.toLowerCase().trim()
  
  // Direct match
  if (sectorIcons[sector_lower]) {
    return sectorIcons[sector_lower]
  }
  
  // Partial match
  for (const [key, icon] of Object.entries(sectorIcons)) {
    if (sector_lower.includes(key) || key.includes(sector_lower)) {
      return icon
    }
  }
  
  return '🏢' // Default building for unknown sectors
}

export function formatCompanyName(name: string): string {
  // Clean up common company suffixes for better display
  return name
    .replace(/\s+(Inc\.?|LLC|Ltd\.?|Corp\.?|Corporation|Company)$/i, '')
    .trim()
}

export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  }
  
  return formatDate(date)
}

// Animation and interaction utilities
export function getGradientForValue(value: number, max: number): string {
  const percentage = Math.min(value / max, 1)
  
  if (percentage < 0.2) return 'from-green-400 to-green-600'
  if (percentage < 0.4) return 'from-yellow-400 to-yellow-600'
  if (percentage < 0.6) return 'from-orange-400 to-orange-600'
  if (percentage < 0.8) return 'from-red-400 to-red-600'
  return 'from-red-600 to-red-800'
}

export function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9)
} 

export function getLocationDisplayName(location: string): string {
  const locationMappings: { [key: string]: string } = {
    // United States
    'united states': 'United States',
    'usa': 'United States',
    'us': 'United States',
    'america': 'United States',
    'new york': 'New York, US',
    'new york city': 'New York, US',
    'nyc': 'New York, US',
    'san francisco': 'San Francisco, US',
    'sf': 'San Francisco, US',
    'sf bay area': 'SF Bay Area, US',
    'bay area': 'Bay Area, US',
    'los angeles': 'Los Angeles, US',
    'la': 'Los Angeles, US',
    'chicago': 'Chicago, US',
    'boston': 'Boston, US',
    'seattle': 'Seattle, US',
    'austin': 'Austin, US',
    'denver': 'Denver, US',
    'atlanta': 'Atlanta, US',
    'miami': 'Miami, US',
    'dallas': 'Dallas, US',
    'houston': 'Houston, US',
    'philadelphia': 'Philadelphia, US',
    'philly': 'Philadelphia, US',
    'detroit': 'Detroit, US',
    'pittsburgh': 'Pittsburgh, US',
    'cleveland': 'Cleveland, US',
    'columbus': 'Columbus, US',
    'indianapolis': 'Indianapolis, US',
    'milwaukee': 'Milwaukee, US',
    'kansas city': 'Kansas City, US',
    'st. louis': 'St. Louis, US',
    'minneapolis': 'Minneapolis, US',
    'portland': 'Portland, US',
    'washington': 'Washington, US',
    'dc': 'Washington DC, US',
    'raleigh': 'Raleigh, US',
    'phoenix': 'Phoenix, US',
    'las vegas': 'Las Vegas, US',
    'san diego': 'San Diego, US',
    'sacramento': 'Sacramento, US',
    
    // International
    'india': 'India',
    'bangalore': 'Bangalore, India',
    'bengaluru': 'Bengaluru, India',
    'mumbai': 'Mumbai, India',
    'delhi': 'Delhi, India',
    'hyderabad': 'Hyderabad, India',
    'pune': 'Pune, India',
    'chennai': 'Chennai, India',
    'gurugram': 'Gurugram, India',
    'noida': 'Noida, India',
    
    'united kingdom': 'United Kingdom',
    'uk': 'United Kingdom',
    'london': 'London, UK',
    'manchester': 'Manchester, UK',
    'edinburgh': 'Edinburgh, UK',
    'cambridge': 'Cambridge, UK',
    
    'canada': 'Canada',
    'toronto': 'Toronto, Canada',
    'vancouver': 'Vancouver, Canada',
    'montreal': 'Montreal, Canada',
    'ottawa': 'Ottawa, Canada',
    
    'germany': 'Germany',
    'berlin': 'Berlin, Germany',
    'munich': 'Munich, Germany',
    'hamburg': 'Hamburg, Germany',
    
    'france': 'France',
    'paris': 'Paris, France',
    'lyon': 'Lyon, France',
    
    'sweden': 'Sweden',
    'stockholm': 'Stockholm, Sweden',
    'malmo': 'Malmo, Sweden',
    
    'japan': 'Japan',
    'tokyo': 'Tokyo, Japan',
    'osaka': 'Osaka, Japan',
    
    'china': 'China',
    'beijing': 'Beijing, China',
    'shanghai': 'Shanghai, China',
    'shenzhen': 'Shenzhen, China',
    
    'australia': 'Australia',
    'sydney': 'Sydney, Australia',
    'melbourne': 'Melbourne, Australia',
    
    'netherlands': 'Netherlands',
    'amsterdam': 'Amsterdam, Netherlands',
    
    'israel': 'Israel',
    'tel aviv': 'Tel Aviv, Israel',
    
    'singapore': 'Singapore',
    'brazil': 'Brazil',
    'sao paulo': 'Sao Paulo, Brazil',
    'mexico': 'Mexico',
    'ireland': 'Ireland',
    'dublin': 'Dublin, Ireland',
    'spain': 'Spain',
    'madrid': 'Madrid, Spain',
    'italy': 'Italy',
    'milan': 'Milan, Italy',
    'south korea': 'South Korea',
    'seoul': 'Seoul, South Korea',
    'remote': 'Remote',
    'worldwide': 'Worldwide',
    'global': 'Global',
    'non-us': 'International',
    'international': 'International',
    'europe': 'Europe',
    'asia': 'Asia',
    'africa': 'Africa',
    'south america': 'South America',
    'north america': 'North America',
    'oceania': 'Oceania'
  }
  
  const location_lower = location.toLowerCase().trim()
  
  // Handle empty or null locations
  if (!location_lower || location_lower === 'null' || location_lower === 'undefined') {
    return 'Unknown Location'
  }
  
  // Direct match
  if (locationMappings[location_lower]) {
    return locationMappings[location_lower]
  }
  
  // Partial match for complex location strings
  for (const [key, displayName] of Object.entries(locationMappings)) {
    if (location_lower.includes(key) || key.includes(location_lower)) {
      return displayName
    }
  }
  
  // Try to extract country from common patterns
  const patterns = [
    /(?:in|from|at)\s+([a-zA-Z\s]+)/i,
    /([a-zA-Z\s]+),\s*([a-zA-Z\s]+)/i,
    /([a-zA-Z\s]+)\s*-\s*([a-zA-Z\s]+)/i
  ]
  
  for (const pattern of patterns) {
    const match = location_lower.match(pattern)
    if (match) {
      for (let i = 1; i < match.length; i++) {
        const potentialLocation = match[i].trim()
        if (locationMappings[potentialLocation]) {
          return locationMappings[potentialLocation]
        }
      }
    }
  }
  
  // If location contains "non-us" or similar, return International
  if (location_lower.includes('non-us') || location_lower.includes('non us') || location_lower.includes('international')) {
    return 'International'
  }
  
  // Try to capitalize and return the original if no match found
  return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase()
} 