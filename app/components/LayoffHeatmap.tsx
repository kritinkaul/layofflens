'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { formatNumber } from '@/lib/utils'

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="text-gray-300">Loading map...</p>
        </div>
      </div>
    )
  }
) as React.ComponentType<{ locations: LocationData[] }>

interface LocationData {
  location: string
  city: string
  lat: number
  lng: number
  country: string
  count: number
  intensity: number
}

interface GeographicData {
  locations: LocationData[]
  topCountries: { country: string; count: number }[]
  totalLocations: number
}

export default function LayoffHeatmap() {
  const [geoData, setGeoData] = useState<GeographicData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const componentMounted = useRef(false)

  useEffect(() => {
    componentMounted.current = true

    // Fetch geographic data
    async function fetchData() {
      try {
        const response = await fetch('/api/geographic')
        const result = await response.json()
        if (result.success && componentMounted.current) {
          setGeoData(result.data)
        }
      } catch (error) {
        console.error('Error fetching geographic data:', error)
      } finally {
        if (componentMounted.current) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function
    return () => {
      componentMounted.current = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="h-[500px] bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="text-gray-300">Loading geographic data...</p>
        </div>
      </div>
    )
  }

  if (!geoData || geoData.locations.length === 0) {
    return (
      <div className="h-[500px] bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
        <div className="text-center">
          <p className="text-gray-400">No geographic data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="h-[500px] rounded-lg overflow-hidden shadow-sm border border-gray-700">
        <MapComponent locations={geoData.locations} />
      </div>

      {/* Top Countries */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Most Affected Countries</h3>
          <div className="space-y-3">
            {geoData.topCountries.slice(0, 5).map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-red-500' :
                    index === 1 ? 'bg-orange-500' :
                    index === 2 ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <span className="text-gray-300">{country.country}</span>
                </div>
                <span className="text-gray-100 font-bold">{formatNumber(country.count)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Geographic Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Locations</span>
              <span className="text-gray-100 font-bold">{geoData.totalLocations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Countries Affected</span>
              <span className="text-gray-100 font-bold">{geoData.topCountries.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Hottest Region</span>
              <span className="text-gray-100 font-bold">{geoData.locations[0]?.city || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 