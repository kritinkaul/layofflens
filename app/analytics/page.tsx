'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Database, 
  Filter, 
  Search, 
  Calendar,
  MapPin,
  Globe,
  Activity,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  PieChart,
  LineChart,
  BarChart,
  Target,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react'
import { DashboardStats, ChartData } from '@/types'
import { formatNumber, formatDate, getCountryFlag, getIndustryIcon, getRelativeTime, formatCompanyName, getLocationDisplayName } from '@/lib/utils'
import { 
  fetchDashboardStats, 
  fetchIndustryDistribution, 
  fetchTimeSeriesData, 
  fetchLayoffs, 
  LayoffData,
  getCompanyLogo
} from '@/lib/api'
import Navigation from '../components/Navigation'
import LayoffTable from '../components/LayoffTable'
import LayoffHeatmap from '../components/LayoffHeatmap'

// Simple chart components for now - can be enhanced with Recharts later

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [industryData, setIndustryData] = useState<ChartData[]>([])
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])
  const [recentLayoffs, setRecentLayoffs] = useState<LayoffData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'geography' | 'data'>('overview')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSector, setSelectedSector] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false)

  // Load all data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null)
      
      try {
        const [statsData, industryDistribution, timeData, recentData] = await Promise.all([
          fetchDashboardStats({}),
          fetchIndustryDistribution({}),
          fetchTimeSeriesData({}),
          fetchLayoffs({}, 1, 10)
        ])
        
        setStats(statsData)
        setIndustryData(industryDistribution)
        setTimeSeriesData(timeData)
        setRecentLayoffs(recentData.data)
      } catch (err) {
        console.error('Error loading analytics data:', err)
        setError('Failed to load analytics data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Filter data based on selected filters
  const filteredStats = useMemo(() => {
    if (!stats) return null
    
    // Apply filters to stats (simplified for now)
    return stats
  }, [stats, selectedSector, selectedLocation, dateRange])

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

  const clearFilters = () => {
    setSelectedSector('')
    setSelectedLocation('')
    setDateRange({ start: '', end: '' })
  }

  const exportData = () => {
    // Implementation for data export
    console.log('Exporting data...')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading analytics data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-2 flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-blue-400" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-300 text-lg">
                Comprehensive insights and trends from layoff data
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-750 transition-colors text-gray-300"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sector</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-100"
                >
                  <option value="">All Sectors</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-100"
                >
                  <option value="">All Locations</option>
                  <option value="United States">United States</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'trends', label: 'Trends', icon: TrendingUp },
              { id: 'geography', label: 'Geography', icon: MapPin },
              { id: 'data', label: 'Raw Data', icon: Database }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 text-red-400">⚠️</div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Layoffs</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalLayoffs)}</p>
                    <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Companies Affected</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalCompanies)}</p>
                    <p className="text-xs text-blue-600 mt-1">Across all industries</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Avg. Layoff Size</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(Math.round(stats.averageLayoffSize))}</p>
                    <p className="text-xs text-purple-600 mt-1">Employees per event</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Most Affected</p>
                    <p className="text-lg font-bold text-gray-900">{stats.mostAffectedIndustry}</p>
                    <p className="text-xs text-green-600 mt-1">Leading sector</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Industry Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Industry Distribution</h3>
                  <PieChart className="h-5 w-5 text-gray-400" />
                </div>
                                 <div className="h-64">
                   {industryData.length > 0 ? (
                     <div className="h-full flex items-center justify-center">
                       <div className="text-center">
                         <div className="text-2xl font-bold text-gray-900 mb-4">Industry Distribution</div>
                         <div className="space-y-3">
                           {industryData.slice(0, 5).map((industry, index) => (
                             <div key={index} className="flex items-center space-x-3">
                               <div 
                                 className="w-4 h-4 rounded-full" 
                                 style={{ backgroundColor: chartColors[index % chartColors.length] }}
                               ></div>
                               <span className="text-sm text-gray-700">{industry.name}</span>
                               <span className="text-sm font-medium text-gray-900">{industry.value}%</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                   ) : (
                     <div className="h-full flex items-center justify-center text-gray-500">
                       No data available
                     </div>
                   )}
                 </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Layoffs</h3>
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {recentLayoffs.map((layoff) => {
                    const logo = getCompanyLogo(layoff.company)
                    return (
                      <div key={layoff.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <img 
                            src={logo.src} 
                            alt={layoff.company}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center" style={{ display: 'none' }}>
                            {logo.fallback}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{formatCompanyName(layoff.company)}</div>
                          <div className="text-xs text-gray-500 flex items-center space-x-2">
                            <span className="inline-flex items-center">
                              <span className="mr-1">{getIndustryIcon(layoff.sector)}</span>
                              {layoff.sector}
                            </span>
                            <span>•</span>
                            <span>{layoff.count ? formatNumber(layoff.count) : 'N/A'} employees</span>
                            <span>•</span>
                            <span className="text-blue-500">{getRelativeTime(new Date(layoff.date))}</span>
                          </div>
                        </div>
                        <a 
                          href={layoff.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Advanced Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Metrics</h3>
                <button
                  onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  {showAdvancedMetrics ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>{showAdvancedMetrics ? 'Hide' : 'Show'} Details</span>
                </button>
              </div>
              
              {showAdvancedMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.mostAffectedCountry}</div>
                    <div className="text-sm text-gray-600">Most Affected Region</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1 capitalize">{stats.recentTrend}</div>
                    <div className="text-sm text-gray-600">Recent Trend</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(stats.totalEmployeesAffected)}</div>
                    <div className="text-sm text-gray-600">Total Employees Affected</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Layoff Trends Over Time</h3>
                <LineChart className="h-5 w-5 text-gray-400" />
              </div>
                             <div className="h-80">
                 {timeSeriesData.length > 0 ? (
                   <div className="h-full flex items-center justify-center">
                     <div className="text-center w-full">
                       <div className="text-2xl font-bold text-gray-900 mb-6">Layoff Trends</div>
                       <div className="space-y-4">
                         {timeSeriesData.slice(0, 6).map((item, index) => (
                           <div key={index} className="flex items-center space-x-4">
                             <div className="w-20 text-sm text-gray-600">{item.date}</div>
                             <div className="flex-1 bg-gray-200 rounded-full h-4">
                               <div 
                                 className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                 style={{ 
                                   width: `${Math.min(100, (item.value / Math.max(...timeSeriesData.map(d => d.value))) * 100)}%` 
                                 }}
                               ></div>
                             </div>
                             <div className="w-16 text-sm font-medium text-gray-900">{formatNumber(item.value)}</div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 ) : (
                   <div className="h-full flex items-center justify-center text-gray-500">
                     No trend data available
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}

        {/* Geography Tab */}
        {activeTab === 'geography' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <LayoffHeatmap />
            </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Complete Dataset</h3>
                <Database className="h-5 w-5 text-gray-400" />
              </div>
              <LayoffTable showAllRecords={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 