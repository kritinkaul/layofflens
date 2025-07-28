'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, BarChart3, TrendingUp, Users, Building2, Globe, Calendar, RefreshCw, MapPin, Activity, ChevronDown, ChevronUp, ExternalLink, Search, X, Table } from 'lucide-react'
import Navigation from './components/Navigation'
import LayoffHeatmap from './components/LayoffHeatmap'
import LayoffTable from './components/LayoffTable'
import { fetchDashboardStats, fetchIndustryDistribution, fetchRecentLayoffs, fetchLayoffs, LayoffData, getCompanyLogo } from '@/lib/api'
import { DashboardStats, ChartData } from '@/types'
import { formatNumber, formatDate, getCountryFlag, getIndustryIcon, getRelativeTime, formatCompanyName, getLocationDisplayName } from '@/lib/utils'

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [industryData, setIndustryData] = useState<ChartData[]>([])
  const [recentLayoffs, setRecentLayoffs] = useState<LayoffData[]>([])
  const [allLayoffs, setAllLayoffs] = useState<LayoffData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedIndustry, setExpandedIndustry] = useState<string | null>(null)
  const [industryLayoffs, setIndustryLayoffs] = useState<{ [key: string]: LayoffData[] }>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<LayoffData[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, industryDistribution, recentData, allLayoffsData] = await Promise.all([
          fetchDashboardStats(),
          fetchIndustryDistribution(),
          fetchRecentLayoffs(6),
          fetchLayoffs({}, 1, 4000) // Load more records for the scrollable table
        ])
        
        setStats(statsData)
        setIndustryData(industryDistribution.slice(0, 5))
        setRecentLayoffs(recentData)
        setAllLayoffs(allLayoffsData.data)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Global search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = allLayoffs.filter(layoff => 
        layoff.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        layoff.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        layoff.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchTerm, allLayoffs])

  const handleIndustryClick = async (industryName: string) => {
    if (expandedIndustry === industryName) {
      setExpandedIndustry(null)
      return
    }

    setExpandedIndustry(industryName)
    
    // If we haven't loaded layoffs for this industry yet, fetch them
    if (!industryLayoffs[industryName]) {
      try {
        const response = await fetchLayoffs({ sector: industryName }, 1, 50)
        setIndustryLayoffs(prev => ({
          ...prev,
          [industryName]: response.data
        }))
      } catch (error) {
        console.error('Error loading industry layoffs:', error)
      }
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
    setShowSearchResults(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Global Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search companies, sectors, or locations across all data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white text-gray-900 placeholder-gray-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Search Results */}
          {showSearchResults && (
            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Results for "{searchTerm}"
                </h3>
                <p className="text-sm text-gray-600">
                  Found {searchResults.length} results across all data
                </p>
              </div>
              
              {searchResults.length === 0 ? (
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No results found for "{searchTerm}"</p>
                  <p className="text-sm text-gray-500 mt-2">Try searching for a different company, sector, or location</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {searchResults.slice(0, 20).map((layoff) => {
                    const logo = getCompanyLogo(layoff.company)
                    return (
                      <div key={layoff.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
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
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {formatCompanyName(layoff.company)}
                            </div>
                            <div className="text-xs text-gray-600 flex items-center space-x-2">
                              <span className="inline-flex items-center">
                                <span className="mr-1">{getIndustryIcon(layoff.sector)}</span>
                                {layoff.sector}
                              </span>
                              <span>•</span>
                              <span className="inline-flex items-center">
                                <span className="mr-1">{getCountryFlag(layoff.location)}</span>
                                {getLocationDisplayName(layoff.location)}
                              </span>
                              <span>•</span>
                              <span>{layoff.count ? formatNumber(layoff.count) : 'N/A'} employees</span>
                              <span>•</span>
                              <span className="text-blue-600 font-medium">{getRelativeTime(new Date(layoff.date))}</span>
                            </div>
                          </div>
                          <a 
                            href={layoff.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              
              {searchResults.length > 20 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <Link 
                    href={`/analytics?search=${encodeURIComponent(searchTerm)}`}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    View all {searchResults.length} results in analytics →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100 rounded-full opacity-40 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-100 rounded-full opacity-40 animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Track Workforce Changes with
              <span className="text-blue-600 block">LayoffLens</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Real-time layoff data and analytics across 4,000+ companies with CSV export and advanced filtering capabilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-3 group">
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/analytics" className="btn-secondary text-lg px-8 py-3 group">
                Explore Data
                <BarChart3 className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="flex flex-col items-center space-y-2 animate-bounce">
              <span className="text-sm text-gray-500 font-medium">Scroll to explore more</span>
              <ChevronDown className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          {/* Live Stats */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Loading live data...</span>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="stat-card text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <div className="icon-container bg-blue-50 mx-auto mb-3 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                  <BarChart3 className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{formatNumber(stats.totalEmployeesAffected)}</div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">Total Affected</div>
              </div>
              
              <div className="stat-card text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <div className="icon-container bg-green-50 mx-auto mb-3 group-hover:bg-green-100 group-hover:scale-110 transition-all duration-300">
                  <Building2 className="h-6 w-6 text-green-600 group-hover:text-green-700" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">{formatNumber(stats.totalCompanies)}</div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">Companies</div>
              </div>
              
              <div className="stat-card text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <div className="icon-container bg-yellow-50 mx-auto mb-3 group-hover:bg-yellow-100 group-hover:scale-110 transition-all duration-300">
                  <Users className="h-6 w-6 text-yellow-600 group-hover:text-yellow-700" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">{formatNumber(stats.totalLayoffs)}</div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">Layoff Events</div>
              </div>
              
              <div className="stat-card text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <div className="icon-container bg-red-50 mx-auto mb-3 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                  <Activity className="h-6 w-6 text-red-600 group-hover:text-red-700" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">{stats.averageLayoffSize}</div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">Avg. Size</div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Preview Section - Show a glimpse of what's below */}
      <section className="py-8 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Inside LayoffLens?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Geographic Heatmap</h3>
                  <p className="text-sm text-gray-600">Interactive visualization</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Industry Analysis</h3>
                  <p className="text-sm text-gray-600">Detailed breakdowns</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Table className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">4,000+ Records with CSV Export</h3>
                  <p className="text-sm text-gray-600">Complete database with download capability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Layoff Data Table with Full Database */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Table className="h-8 w-8 mr-3 text-blue-500" />
              Complete Layoff Database
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore all 4,000+ layoff records with advanced filtering, search, and CSV export capabilities
            </p>
          </div>
          <LayoffTable showAllRecords={true} />
        </div>
      </section>

      {/* Geographic Heatmap Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <MapPin className="h-8 w-8 mr-3 text-red-500" />
              Geographic Impact Visualization
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Interactive heatmap showing layoff concentration by location with real-time data
            </p>
          </div>
          
          <div className="card p-8">
            <LayoffHeatmap />
          </div>
          
          <div className="text-center mt-8">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-3 group">
              Explore Full Dashboard
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Most Affected Industries Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 mr-3 text-red-500" />
              Most Affected Industries
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Click on any industry to see recent layoffs and explore detailed analytics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {industryData.map((industry, index) => (
              <div 
                key={industry.name}
                className="card cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-2 border-transparent hover:border-blue-500"
                onClick={() => handleIndustryClick(industry.name)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                      <span className="text-xl">{getIndustryIcon(industry.name)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{industry.name}</h3>
                      <p className="text-sm text-gray-600">{formatNumber(industry.value)} layoffs</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${expandedIndustry === industry.name ? 'rotate-180' : ''}`} />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Impact Level</span>
                    <span>{Math.round((industry.value / Math.max(...industryData.map(i => i.value))) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-purple-700"
                      style={{ width: `${(industry.value / Math.max(...industryData.map(i => i.value))) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {expandedIndustry === industry.name && industryLayoffs[industry.name] && industryLayoffs[industry.name].length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">📊</span>
                      Recent Layoffs in {industry.name}
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {industryLayoffs[industry.name].slice(0, 5).map((layoff) => {
                        const logo = getCompanyLogo(layoff.company)
                        return (
                          <div key={layoff.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded transition-colors">
                            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
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
                              <div className="text-xs text-gray-600 flex items-center space-x-1">
                                <span className="inline-flex items-center">
                                  <span className="mr-1">{getCountryFlag(layoff.location)}</span>
                                  {getLocationDisplayName(layoff.location)}
                                </span>
                                <span>•</span>
                                <span>{layoff.count ? formatNumber(layoff.count) : 'N/A'} employees</span>
                                <span>•</span>
                                <span className="text-blue-400">{getRelativeTime(new Date(layoff.date))}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <Link 
                      href="/analytics" 
                      className="mt-3 inline-flex items-center text-sm text-blue-400 hover:text-blue-300 font-medium"
                    >
                      View all {industry.name} layoffs →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/analytics" className="btn-primary text-lg px-8 py-3 group">
              Explore All Industries
              <BarChart3 className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Scrollable Recent Layoffs */}
      <section className="py-16 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Table className="h-8 w-8 mr-3 text-blue-600" />
              All Recent Layoffs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive database of {formatNumber(allLayoffs.length)}+ layoff records with real-time updates
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Scrollable Recent Layoffs */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Live Layoff Feed</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📜 Scroll to see all {formatNumber(allLayoffs.length)} records</span>
                </div>
              </div>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3 table-scroll smooth-scroll scroll-fade">
                    {allLayoffs.map((layoff, index) => {
                      const logo = getCompanyLogo(layoff.company)
                      return (
                        <div key={layoff.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer group hover:shadow-md border border-transparent hover:border-gray-200">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
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
                            <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{formatCompanyName(layoff.company)}</div>
                            <div className="text-xs text-gray-600 flex items-center space-x-2 group-hover:text-gray-700 transition-colors">
                              <span className="inline-flex items-center">
                                <span className="mr-1">{getIndustryIcon(layoff.sector)}</span>
                                {layoff.sector}
                              </span>
                              <span>•</span>
                              <span className="inline-flex items-center">
                                <span className="mr-1">{getCountryFlag(layoff.location)}</span>
                                {getLocationDisplayName(layoff.location)}
                              </span>
                              <span>•</span>
                              <span className="text-blue-400 font-medium">{getRelativeTime(new Date(layoff.date))}</span>
                            </div>
                          </div>
                          <a 
                            href={layoff.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      )
                    })}
                  </div>
                  {/* Scroll fade indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none"></div>
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link href="/analytics" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all {formatNumber(allLayoffs.length)} layoffs in analytics →
                </Link>
              </div>
            </div>

            {/* Features Preview */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-green-600" />
                  Advanced Analytics
                </h3>
                <p className="text-gray-600 mb-4">
                  Dive deep into layoff trends with our comprehensive analytics dashboard.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Geographic heatmaps and trends
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Industry-specific analysis
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Real-time data updates
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Export and filtering options
                  </li>
                </ul>
                <Link href="/analytics" className="btn-primary mt-4 inline-flex items-center">
                  Explore Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                  Geographic Insights
                </h3>
                <p className="text-gray-600 mb-4">
                  Visualize layoff patterns across different regions and countries.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center text-sm text-gray-500">
                    Interactive heatmap showing global layoff distribution
                  </div>
                </div>
                <Link href="/dashboard" className="btn-secondary mt-4 inline-flex items-center">
                  View Dashboard
                  <BarChart3 className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Insights */}
      {stats && !isLoading && (
        <section className="py-12 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Key Insights</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto mb-4 text-blue-300" />
                <div className="text-3xl font-bold text-white mb-2">{stats.mostAffectedIndustry}</div>
                <div className="text-blue-100">Most Affected Industry</div>
              </div>
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-green-300" />
                <div className="text-3xl font-bold text-white mb-2">{stats.mostAffectedCountry}</div>
                <div className="text-green-100">Most Affected Region</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
                <div className="text-3xl font-bold text-white mb-2 capitalize">{stats.recentTrend}</div>
                <div className="text-yellow-100">Recent Trend</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get Deeper Insights
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore comprehensive analytics and filters to understand workforce trends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
              Full Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/analytics" className="btn-secondary text-lg px-8 py-3">
              Advanced Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-lg font-bold">LayoffLens</span>
              </div>
              <p className="text-gray-400">
                Real-time layoff data analytics for workforce insights.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LayoffLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 