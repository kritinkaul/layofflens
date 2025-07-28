// Updated types to match actual implementation
export interface LayoffRecord {
  id: string
  company: string
  date: string
  count: number | null
  sector: string
  location: string
  source_url: string
  created_at?: string
  updated_at?: string
}

// Legacy interfaces for backward compatibility
export interface Company {
  id: string
  name: string
  industry: string
  country: string
  city?: string
  size: CompanySize
  founded?: number
  website?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Layoff {
  id: string
  companyId: string
  company: Company
  date: Date
  employeesAffected: number
  percentage?: number
  reason?: string
  source: string
  confirmed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Industry {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Country {
  id: string
  name: string
  code: string
  region?: string
  createdAt: Date
  updatedAt: Date
}

export interface Analytics {
  id: string
  type: AnalyticsType
  data: any
  date: Date
  createdAt: Date
  updatedAt: Date
}

export enum CompanySize {
  STARTUP = 'STARTUP',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE'
}

export enum AnalyticsType {
  INDUSTRY_TRENDS = 'INDUSTRY_TRENDS',
  GEOGRAPHIC_ANALYSIS = 'GEOGRAPHIC_ANALYSIS',
  TEMPORAL_ANALYSIS = 'TEMPORAL_ANALYSIS',
  COMPANY_COMPARISON = 'COMPANY_COMPARISON',
  PREDICTIVE_MODEL = 'PREDICTIVE_MODEL'
}

export interface FilterOptions {
  sector?: string
  location?: string
  startDate?: string
  endDate?: string
  countries?: string[]
  industries?: string[]
  companySizes?: CompanySize[]
  dateRange?: {
    start: Date
    end: Date
  }
  confirmed?: boolean
}

export interface DashboardStats {
  totalLayoffs: number
  totalCompanies: number
  totalEmployeesAffected: number
  averageLayoffSize: number
  mostAffectedIndustry: string
  mostAffectedCountry: string
  recentTrend: 'increasing' | 'decreasing' | 'stable'
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  date: string
  value: number
}

export interface APIResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
} 