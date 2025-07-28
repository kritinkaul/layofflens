'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { formatNumber, formatDate, getCountryFlag, getIndustryIcon, getRelativeTime, formatCompanyName } from '@/lib/utils'
import { LayoffData, getCompanyLogo, fetchLayoffs } from '@/lib/api'
import { ExternalLink, ChevronDown, ChevronUp, Search, Filter, Download, RefreshCw, Calendar, ArrowUp } from 'lucide-react'

interface LayoffTableProps {
  limit?: number
  showAllRecords?: boolean
}

export default function LayoffTable({ limit = 20, showAllRecords = false }: LayoffTableProps) {
  const [allLayoffs, setAllLayoffs] = useState<LayoffData[]>([])
  const [displayedLayoffs, setDisplayedLayoffs] = useState<LayoffData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'count' | 'sector' | 'location'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSector, setSelectedSector] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(100) // Increased from 50 to 100 for better scrolling
  const [isExporting, setIsExporting] = useState(false)
  const [viewMode, setViewMode] = useState<'pagination' | 'infinite'>('pagination') // New view mode option
  const [loadedItems, setLoadedItems] = useState(100) // For infinite scroll
  const [showScrollTop, setShowScrollTop] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)

  // Get unique sectors and locations for filters
  const sectors = useMemo(() => {
    const sectorSet = new Set(allLayoffs.map(layoff => layoff.sector).filter(Boolean))
    return Array.from(sectorSet).sort()
  }, [allLayoffs])

  const locations = useMemo(() => {
    const locationSet = new Set(allLayoffs.map(layoff => layoff.location).filter(Boolean))
    return Array.from(locationSet).sort()
  }, [allLayoffs])

  // Load all layoffs data
  useEffect(() => {
    async function fetchAllData() {
      try {
        setIsLoading(true)
        const targetLimit = showAllRecords ? 5000 : limit
        const response = await fetchLayoffs({}, 1, targetLimit)
        setAllLayoffs(response.data)
      } catch (error) {
        console.error('Error fetching layoffs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [limit, showAllRecords])

  // Filter and search functionality
  const filteredLayoffs = useMemo(() => {
    return allLayoffs.filter(layoff => {
      // Text search
      const matchesSearch = !searchTerm || 
        layoff.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        layoff.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        layoff.location.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by sector
      const matchesSector = !selectedSector || layoff.sector === selectedSector

      // Filter by location
      const matchesLocation = !selectedLocation || layoff.location === selectedLocation

      // Filter by date range
      const layoffDate = new Date(layoff.date)
      const matchesStartDate = !startDate || layoffDate >= new Date(startDate)
      const matchesEndDate = !endDate || layoffDate <= new Date(endDate)

      return matchesSearch && matchesSector && matchesLocation && matchesStartDate && matchesEndDate
    })
  }, [allLayoffs, searchTerm, selectedSector, selectedLocation, startDate, endDate])

  // Sorting functionality
  const sortedLayoffs = useMemo(() => {
    return [...filteredLayoffs].sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case 'company':
          aValue = a.company.toLowerCase()
          bValue = b.company.toLowerCase()
          break
        case 'count':
          aValue = a.count || 0
          bValue = b.count || 0
          break
        case 'sector':
          aValue = a.sector.toLowerCase()
          bValue = b.sector.toLowerCase()
          break
        case 'location':
          aValue = a.location.toLowerCase()
          bValue = b.location.toLowerCase()
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [filteredLayoffs, sortBy, sortOrder])

  // Pagination and infinite scroll
  const paginatedLayoffs = useMemo(() => {
    if (!showAllRecords) return sortedLayoffs.slice(0, limit)
    
    if (viewMode === 'infinite') {
      return sortedLayoffs.slice(0, loadedItems)
    } else {
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      return sortedLayoffs.slice(startIndex, endIndex)
    }
  }, [sortedLayoffs, currentPage, itemsPerPage, showAllRecords, limit, viewMode, loadedItems])

  const totalPages = Math.ceil(sortedLayoffs.length / itemsPerPage)

  // Load more items for infinite scroll
  const loadMoreItems = useCallback(() => {
    setLoadedItems(prev => Math.min(prev + 100, sortedLayoffs.length))
  }, [sortedLayoffs.length])

  // Jump to specific page
  const jumpToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const handleSort = (column: 'date' | 'company' | 'count' | 'sector' | 'location') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
    setCurrentPage(1) // Reset to first page when sorting
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSector('')
    setSelectedLocation('')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
  }

  // Scroll to top functionality
  const scrollToTop = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Monitor scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // CSV Export functionality
  const exportToCSV = useCallback(() => {
    setIsExporting(true)
    
    try {
      const csvHeaders = [
        'Company',
        'Date',
        'Employees Laid Off',
        'Industry/Sector', 
        'Location',
        'Source URL'
      ]
      
      const csvData = sortedLayoffs.map(layoff => [
        `"${layoff.company.replace(/"/g, '""')}"`,
        layoff.date,
        layoff.count || 'N/A',
        `"${layoff.sector.replace(/"/g, '""')}"`,
        `"${layoff.location.replace(/"/g, '""')}"`,
        layoff.source_url || 'N/A'
      ])
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `layoffs_data_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting CSV:', error)
    } finally {
      setIsExporting(false)
    }
  }, [sortedLayoffs])

  const SortButton = ({ column, children }: { column: 'date' | 'company' | 'count' | 'sector' | 'location', children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center space-x-1 hover:text-blue-600 transition-colors font-medium"
    >
      <span>{children}</span>
      {sortBy === column && (
        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
      )}
    </button>
  )

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {showAllRecords ? 'All Layoff Records' : 'Recent Layoffs'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {showAllRecords 
                ? `Complete database with ${formatNumber(allLayoffs.length)} records` 
                : 'Latest layoff data from companies worldwide'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {showAllRecords && (
              <>
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 mr-2">
                  <span className="text-xs text-gray-500">View:</span>
                  <button
                    onClick={() => {
                      setViewMode(viewMode === 'pagination' ? 'infinite' : 'pagination')
                      setCurrentPage(1)
                      setLoadedItems(100)
                    }}
                    className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {viewMode === 'pagination' ? '📖 Pages' : '♾️ Infinite'}
                  </button>
                </div>

                {/* Items per page selector */}
                {viewMode === 'pagination' && (
                  <div className="flex items-center space-x-2 mr-2">
                    <span className="text-xs text-gray-500">Per page:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      className="text-xs px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                      <option value={500}>500</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={exportToCSV}
                  disabled={isExporting}
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                </button>
              </>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {/* Advanced Search and Filters */}
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies, sectors, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Sector Filter */}
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">All Industries</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>

              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 inline mr-1" />
                Clear
              </button>
            </div>

            {/* Date Range */}
            {showAllRecords && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto" style={{ maxHeight: showAllRecords ? '600px' : 'none', overflowY: showAllRecords ? 'auto' : 'visible' }} ref={tableRef}>
        <table className="data-table">
          <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <tr>
              <th className="text-left">
                <SortButton column="company">Company</SortButton>
              </th>
              <th className="text-left">
                <SortButton column="location">Location</SortButton>
              </th>
              <th className="text-left">
                <SortButton column="count"># Laid Off</SortButton>
              </th>
              <th className="text-left">
                <SortButton column="date">Date</SortButton>
              </th>
              <th className="text-left">
                <SortButton column="sector">Industry</SortButton>
              </th>
              <th className="text-left">Source</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLayoffs.map((layoff) => {
              const logo = getCompanyLogo(layoff.company)
              return (
                <tr key={layoff.id} className="table-row hover:bg-blue-50 transition-colors group">
                  <td>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3 overflow-hidden group-hover:scale-110 transition-transform">
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
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {formatCompanyName(layoff.company)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getRelativeTime(new Date(layoff.date))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCountryFlag(layoff.location)}</span>
                      <span className="text-sm text-gray-700">{layoff.location}</span>
                    </div>
                  </td>
                  <td className="font-medium">
                    {layoff.count ? (
                      <span className="text-red-600">{formatNumber(layoff.count)}</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="text-gray-600">
                    {formatDate(new Date(layoff.date))}
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{getIndustryIcon(layoff.sector)}</span>
                      <span className="text-sm text-gray-700">{layoff.sector}</span>
                    </div>
                  </td>
                  <td>
                    {layoff.source_url ? (
                      <a 
                        href={layoff.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors group-hover:text-blue-600"
                        title="View source"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer with pagination and stats */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Showing {paginatedLayoffs.length} of {formatNumber(sortedLayoffs.length)} records
              {searchTerm && ` (filtered by "${searchTerm}")`}
            </span>
            {sortedLayoffs.length !== allLayoffs.length && (
              <span className="text-xs text-gray-500">
                ({formatNumber(allLayoffs.length)} total in database)
              </span>
            )}
          </div>
          
          {/* Enhanced pagination and infinite scroll controls */}
          {showAllRecords && (
            <div className="flex items-center space-x-4">
              {viewMode === 'infinite' ? (
                // Infinite scroll controls
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Loaded {paginatedLayoffs.length} of {formatNumber(sortedLayoffs.length)}
                  </span>
                  {loadedItems < sortedLayoffs.length && (
                    <button
                      onClick={loadMoreItems}
                      className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
                    >
                      Load More (+100)
                    </button>
                  )}
                  {loadedItems >= sortedLayoffs.length && (
                    <span className="text-sm text-green-600 font-medium">✓ All records loaded</span>
                  )}
                </div>
              ) : (
                // Enhanced pagination controls
                totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    {/* First page */}
                    <button
                      onClick={() => jumpToPage(1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      First
                    </button>
                    
                    {/* Previous page */}
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {/* Page input */}
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Page</span>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value)
                          if (page >= 1 && page <= totalPages) {
                            jumpToPage(page)
                          }
                        }}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                      />
                      <span className="text-sm text-gray-600">of {totalPages}</span>
                    </div>
                    
                    {/* Next page */}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                    
                    {/* Last page */}
                    <button
                      onClick={() => jumpToPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Last
                    </button>
                    
                    {/* Quick jump buttons for large datasets */}
                    {totalPages > 10 && (
                      <div className="flex items-center space-x-1 ml-4">
                        <span className="text-xs text-gray-500">Jump:</span>
                        {[Math.ceil(totalPages * 0.25), Math.ceil(totalPages * 0.5), Math.ceil(totalPages * 0.75)].map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => jumpToPage(pageNum)}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
          
          {!showAllRecords && (
            <a href="/analytics" className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
              View all {formatNumber(allLayoffs.length)} records →
            </a>
          )}
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}