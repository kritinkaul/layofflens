import { DashboardStats, FilterOptions } from '@/types'

const API_BASE_URL = '' // Use relative URLs for both dev and production

export interface LayoffData {
  id: string
  company: string
  date: string
  count: number | null
  sector: string
  location: string
  source_url: string
}

export interface LayoffResponse {
  data: LayoffData[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  success: boolean
}

export interface StatsResponse {
  data: DashboardStats
  success: boolean
}

// Fetch layoffs with filters and pagination
export async function fetchLayoffs(filters: FilterOptions = {}, page = 1, limit = 10): Promise<LayoffResponse> {
  const params = new URLSearchParams()
  
  params.append('page', page.toString())
  params.append('limit', limit.toString())
  
  if (filters.sector) params.append('sector', filters.sector)
  if (filters.location) params.append('location', filters.location)
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)
  
  const response = await fetch(`${API_BASE_URL}/api/layoffs?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch layoffs: ${response.statusText}`)
  }
  
  return response.json()
}

// Fetch dashboard statistics
export async function fetchDashboardStats(filters: FilterOptions = {}): Promise<DashboardStats> {
  const params = new URLSearchParams()
  
  if (filters.sector) params.append('sector', filters.sector)
  if (filters.location) params.append('location', filters.location)
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)
  
  const response = await fetch(`${API_BASE_URL}/api/stats?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`)
  }
  
  const result: StatsResponse = await response.json()
  return result.data
}

// Get unique sectors for filter options
export async function fetchSectors(): Promise<string[]> {
  const response = await fetchLayoffs({}, 1, 1000) // Get more records to extract unique sectors
  const sectorSet = new Set(response.data.map(layoff => layoff.sector))
  const sectors = Array.from(sectorSet)
  return sectors.filter(Boolean).sort()
}

// Get unique locations for filter options
export async function fetchLocations(): Promise<string[]> {
  const response = await fetchLayoffs({}, 1, 1000) // Get more records to extract unique locations
  const locationSet = new Set(response.data.map(layoff => layoff.location))
  const locations = Array.from(locationSet)
  return locations.filter(Boolean).sort()
}

// Get recent layoffs for activity feed
export async function fetchRecentLayoffs(limit = 10): Promise<LayoffData[]> {
  const response = await fetchLayoffs({}, 1, limit)
  return response.data
}

// Create industry distribution data from layoffs based on employees affected
export async function fetchIndustryDistribution(filters: FilterOptions = {}) {
  const response = await fetchLayoffs(filters, 1, 1000)
  const sectorCounts: { [key: string]: number } = {}
  
  // Sum employees affected by sector
  response.data.forEach(layoff => {
    const sector = layoff.sector || 'Unknown'
    const employeesAffected = layoff.count || 0
    sectorCounts[sector] = (sectorCounts[sector] || 0) + employeesAffected
  })
  
  const total = Object.values(sectorCounts).reduce((sum, count) => sum + count, 0)
  
  if (total === 0) {
    return []
  }
  
  const industryData = Object.entries(sectorCounts)
    .map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
      color: getColorForSector(name)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Top 8 industries
  
  return industryData
}

// Helper function to get consistent colors for sectors
function getColorForSector(sector: string): string {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
    '#EC4899', '#14B8A6', '#F472B6', '#A78BFA'
  ]
  
  const sectorLowerCase = sector.toLowerCase()
  let hash = 0
  for (let i = 0; i < sectorLowerCase.length; i++) {
    hash = sectorLowerCase.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Create time series data from layoffs based on employees affected
export async function fetchTimeSeriesData(filters: FilterOptions = {}) {
  const response = await fetchLayoffs(filters, 1, 1000)
  const monthlyCounts: { [key: string]: number } = {}
  
  // Sum employees affected by month
  response.data.forEach(layoff => {
    const date = new Date(layoff.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const employeesAffected = layoff.count || 0
    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + employeesAffected
  })
  
  // Get last 12 months
  const timeSeriesData = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    timeSeriesData.push({
      date: monthName,
      value: monthlyCounts[monthKey] || 0
    })
  }
  
  return timeSeriesData
}

// Helper function to get company logo URL
export function getCompanyLogoUrl(companyName: string): string {
  if (!companyName) return ''
  
  // Clean company name for logo services
  const cleanName = companyName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .trim()
  
  // Use Clearbit Logo API as primary, with fallbacks
  return `https://logo.clearbit.com/${cleanName}.com`
}

// Helper function to get company logo with fallback
export function getCompanyLogo(companyName: string): {
  src: string;
  fallback: string;
} {
  const logoUrl = getCompanyLogoUrl(companyName)
  const initials = companyName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
  
  return {
    src: logoUrl,
    fallback: initials
  }
} 