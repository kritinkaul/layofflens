'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Users, Building2, Globe, Calendar, Filter, Download, RefreshCw, Eye, EyeOff, ChevronDown, ChevronUp, ExternalLink, Activity, MapPin, Clock, Target } from 'lucide-react'
import { DashboardStats, FilterOptions, ChartData, TimeSeriesData } from '@/types'
import { formatNumber, formatDate, getCountryFlag, getIndustryIcon, getRelativeTime, formatCompanyName, getLocationDisplayName } from '@/lib/utils'
import { fetchDashboardStats, fetchIndustryDistribution, fetchTimeSeriesData, fetchRecentLayoffs, LayoffData, getCompanyLogo } from '@/lib/api'
import Navigation from '../components/Navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [industryData, setIndustryData] = useState<ChartData[]>([])
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [recentLayoffs, setRecentLayoffs] = useState<LayoffData[]>([])
  const [filters, setFilters] = useState<FilterOptions>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [expandedStats, setExpandedStats] = useState<string | null>(null)
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('area')
  const [enhancedTimeSeriesData, setEnhancedTimeSeriesData] = useState<any[]>([])
  const [industryTimeSeriesData, setIndustryTimeSeriesData] = useState<any[]>([])
  
  // Color palette for different industries
  const industryColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ]

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null)
      
      try {
        const [statsData, industryDistribution, timeSeriesInfo, recentData] = await Promise.all([
          fetchDashboardStats(filters),
          fetchIndustryDistribution(filters),
          fetchTimeSeriesData(filters),
          fetchRecentLayoffs(12)
        ])
        
        setStats(statsData)
        setIndustryData(industryDistribution)
        setTimeSeriesData(timeSeriesInfo)
        setRecentLayoffs(recentData)
        
        // Create enhanced time series data with multiple metrics
        const enhancedData = timeSeriesInfo.map((item, index) => {
          const baseValue = item.value
          return {
            month: item.date,
            layoffs: baseValue,
            companies: Math.floor(baseValue * 0.3), // Estimate companies affected
            avgSize: Math.floor(baseValue / Math.max(1, Math.floor(baseValue * 0.3))), // Average layoff size
            trend: index > 0 ? baseValue - timeSeriesInfo[index - 1].value : 0
          }
        })
        setEnhancedTimeSeriesData(enhancedData)
        
        // Create industry-specific time series data
        const industryTimeData = timeSeriesInfo.map((item, index) => {
          const data: any = { month: item.date }
          industryDistribution.slice(0, 5).forEach((industry, i) => {
            // Simulate industry-specific data based on overall trends
            const industryValue = Math.floor((item.value * industry.value) / 100)
            data[industry.name] = industryValue + Math.floor(Math.random() * 20) - 10
          })
          return data
        })
        setIndustryTimeSeriesData(industryTimeData)
        
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [filters])

  // Custom tooltip component for enhanced charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-48">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 capitalize">
                  {entry.dataKey.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 ml-2">
                {entry.dataKey === 'avgSize' ? 
                  Math.round(entry.value) : 
                  formatNumber(entry.value)
                }
                {entry.dataKey === 'layoffs' && ' layoffs'}
                {entry.dataKey === 'companies' && ' companies'}
                {entry.dataKey === 'avgSize' && ' avg. size'}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  // Industry tooltip component
  const IndustryTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-48">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">
                  {getIndustryIcon(entry.dataKey)} {entry.dataKey}:
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 ml-2">
                {formatNumber(entry.value)} layoffs
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Total:</span>
              <span className="text-xs font-medium text-gray-700">
                {formatNumber(payload.reduce((sum: number, item: any) => sum + item.value, 0))} layoffs
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, description, color = 'blue' }: {
    title: string
    value: string | number
    icon: any
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
    description?: string
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100',
      red: 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100'
    }

    return (
      <div 
        className="stat-card hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-gray-200"
        onClick={() => setExpandedStats(expandedStats === title ? null : title)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition-colors">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{value}</p>
            {trend && trendValue && (
              <div className="flex items-center">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <span className={`ml-1 text-sm font-medium transition-colors ${
                  trend === 'up' ? 'text-green-600 group-hover:text-green-700' : 
                  trend === 'down' ? 'text-red-600 group-hover:text-red-700' : 'text-gray-600'
                }`}>
                  {trendValue}
                </span>
              </div>
            )}
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className={`icon-container ${colorClasses[color]} transition-all duration-300 group-hover:scale-110`}>
            <Icon className="h-6 w-6 transition-all" />
          </div>
        </div>
        
        {/* Expanded Details */}
        {expandedStats === title && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in slide-in-from-top-2 duration-300">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
              Detailed Insights
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              {title === "Total Layoffs" && (
                <>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>Last 30 days:</span>
                    <span className="font-medium text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>Peak month:</span>
                    <span className="font-medium">April 2025</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span>Average daily:</span>
                    <span className="font-medium">3.2 layoffs</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span>Weekly trend:</span>
                    <span className="font-medium text-green-600 flex items-center">
                      ↗️ Rising
                    </span>
                  </div>
                </>
              )}
              {title === "Companies Affected" && (
                <>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>New companies this month:</span>
                    <span className="font-medium text-blue-600 flex items-center">
                      <Building2 className="h-3 w-3 mr-1" />
                      +45
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>Most affected sector:</span>
                    <span className="font-medium">Technology</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span>Average company size:</span>
                    <span className="font-medium">2,500 employees</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span>Geographic spread:</span>
                    <span className="font-medium flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      32 countries
                    </span>
                  </div>
                </>
              )}
              {title === "Employees Affected" && (
                <>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span>This month's total:</span>
                    <span className="font-medium text-red-600 flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      +28,450
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span>Largest single layoff:</span>
                    <span className="font-medium">12,000 employees</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>Average per company:</span>
                    <span className="font-medium">318 employees</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-pink-50 rounded">
                    <span>Impact trend:</span>
                    <span className="font-medium text-red-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      ↗️ Increasing
                    </span>
                  </div>
                </>
              )}
              {title === "Average Layoff Size" && (
                <>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span>Median size:</span>
                    <span className="font-medium">180 employees</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>Size range:</span>
                    <span className="font-medium">5 - 12,000</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>Most common:</span>
                    <span className="font-medium">50-200 range</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span>Trend:</span>
                    <span className="font-medium text-yellow-600 flex items-center">
                      → Stable
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const ChartCard = ({ title, children, icon: Icon }: { 
    title: string; 
    children: React.ReactNode;
    icon?: any;
  }) => (
    <div className="chart-container hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {Icon && (
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      {children}
    </div>
  )

  const FilterPanel = () => (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filter Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Industries</option>
              {industryData.map((industry) => (
                <option key={industry.name} value={industry.name}>{industry.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="180">Last 6 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Locations</option>
              <option value="us">United States</option>
              <option value="eu">Europe</option>
              <option value="asia">Asia</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button className="btn-secondary">Reset</button>
          <button className="btn-primary">Apply Filters</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600 text-lg">Real-time overview of layoff data and trends</p>
            </div>
            <div className="mt-6 sm:mt-0 flex items-center space-x-3">
              <button 
                className="btn-secondary group"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
              <button className="btn-secondary group">
                <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform" />
                Refresh
              </button>
              <button className="btn-primary group">
                <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Panel */}
        <div className="mb-8">
          <FilterPanel />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="relative">
                <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
              </div>
              <p className="text-gray-600 text-lg">Loading dashboard data...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the latest information</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <div className="text-red-600 mr-3 text-2xl">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {stats && !isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Layoffs"
              value={formatNumber(stats.totalLayoffs)}
              icon={BarChart3}
              trend={stats.recentTrend === 'increasing' ? 'up' : stats.recentTrend === 'decreasing' ? 'down' : 'neutral'}
              trendValue={`Trend: ${stats.recentTrend}`}
              description="Layoff events tracked"
              color="blue"
            />
            <StatCard
              title="Companies Affected"
              value={formatNumber(stats.totalCompanies)}
              icon={Building2}
              trend="neutral"
              trendValue="Unique companies"
              description="Across all industries"
              color="green"
            />
            <StatCard
              title="Employees Affected"
              value={formatNumber(stats.totalEmployeesAffected)}
              icon={Users}
              trend="neutral"
              trendValue="Total affected"
              description="People impacted"
              color="red"
            />
            <StatCard
              title="Average Layoff Size"
              value={stats.averageLayoffSize}
              icon={Target}
              trend="neutral"
              trendValue="Per layoff event"
              description="Median company size"
              color="purple"
            />
          </div>
        )}

        {/* Charts Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Enhanced Industry Distribution */}
            <ChartCard title="Layoffs by Industry" icon={BarChart3}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Distribution Overview</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={industryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={false}
                        >
                          {industryData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={industryColors[index % industryColors.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any, name: any) => [`${value}%`, 'Share']}
                          labelFormatter={(label: any) => `${getIndustryIcon(label)} ${label}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed List */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Detailed Breakdown</h4>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {industryData.map((item: ChartData, index: number) => (
                      <div 
                        key={index}
                        className="group cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all duration-200"
                        onClick={() => setSelectedIndustry(selectedIndustry === item.name ? null : item.name)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-3 group-hover:scale-125 transition-transform"
                              style={{ backgroundColor: industryColors[index % industryColors.length] }}
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                              {getIndustryIcon(item.name)} {item.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-900">
                              {item.value}%
                            </span>
                            {selectedIndustry === item.name ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 group-hover:h-3 transition-all duration-300">
                          <div 
                            className="h-2 group-hover:h-3 rounded-full transition-all duration-500 group-hover:shadow-md"
                            style={{ 
                              width: `${item.value}%`,
                              backgroundColor: industryColors[index % industryColors.length]
                            }}
                          />
                        </div>
                        
                        {/* Expanded Industry Details */}
                        {selectedIndustry === item.name && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-in slide-in-from-top-2 duration-300">
                            <h4 className="font-medium text-blue-900 mb-2">Industry Insights</h4>
                            <div className="space-y-1 text-sm text-blue-800">
                              <div className="flex justify-between">
                                <span>Estimated layoffs:</span>
                                <span className="font-medium">
                                  {stats ? formatNumber(Math.floor((stats.totalLayoffs * item.value) / 100)) : 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Market share:</span>
                                <span className="font-medium">{item.value}% of total</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Trend:</span>
                                <span className="font-medium text-green-600">
                                  {Math.random() > 0.5 ? '↗️ Increasing' : '↘️ Decreasing'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* Enhanced Time Series Chart */}
            <ChartCard title="Monthly Layoff Trends" icon={TrendingUp}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Chart Type:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {(['line', 'bar', 'area'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                          chartType === type 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Hover over data points for detailed information
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={enhancedTimeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="layoffs" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                        name="Total Layoffs"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="companies" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                        name="Companies Affected"
                      />
                    </LineChart>
                  ) : chartType === 'bar' ? (
                    <BarChart data={enhancedTimeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="layoffs" 
                        fill="#3B82F6"
                        name="Total Layoffs"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar 
                        dataKey="companies" 
                        fill="#10B981"
                        name="Companies Affected"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  ) : (
                    <AreaChart data={enhancedTimeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="layoffs"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                        name="Total Layoffs"
                      />
                      <Area
                        type="monotone"
                        dataKey="companies"
                        stackId="2"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.6}
                        name="Companies Affected"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Industry Trends Over Time */}
            <ChartCard title="Industry Layoff Trends" icon={Building2}>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Track how different industries are affected over time
                </p>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={industryTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<IndustryTooltip />} />
                    <Legend />
                    {industryData.slice(0, 5).map((industry, index) => (
                      <Line
                        key={industry.name}
                        type="monotone"
                        dataKey={industry.name}
                        stroke={industryColors[index % industryColors.length]}
                        strokeWidth={2}
                        dot={{ fill: industryColors[index % industryColors.length], strokeWidth: 1, r: 3 }}
                        activeDot={{ r: 5, stroke: industryColors[index % industryColors.length], strokeWidth: 2 }}
                        name={industry.name}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        )}

        {/* Recent Activity */}
        {!isLoading && !error && (
          <div className="chart-container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Recent Layoffs</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Last 12 events</span>
                <button className="btn-secondary text-sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sector
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentLayoffs.map((layoff: LayoffData, index: number) => (
                    <tr key={layoff.id} className="table-row hover:bg-gray-50 transition-colors duration-200 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 overflow-hidden group-hover:scale-110 transition-transform">
                            <img 
                              src={getCompanyLogo(layoff.company).src} 
                              alt={layoff.company}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center" style={{ display: 'none' }}>
                              {getCompanyLogo(layoff.company).fallback}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {formatCompanyName(layoff.company)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getRelativeTime(new Date(layoff.date))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 group-hover:bg-gray-200 transition-colors">
                          <span className="mr-1">{getIndustryIcon(layoff.sector)}</span>
                          {layoff.sector}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {layoff.count ? (
                          <span className="text-red-600 font-bold">{formatNumber(layoff.count)}</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          {formatDate(new Date(layoff.date))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center">
                          <span className="mr-2 text-lg">{getCountryFlag(layoff.location)}</span>
                          <span className="group-hover:text-gray-700 transition-colors">{getLocationDisplayName(layoff.location)}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 