'use client'

import { useEffect, useRef } from 'react'
import { formatNumber } from '@/lib/utils'

interface LocationData {
  location: string
  city: string
  lat: number
  lng: number
  country: string
  count: number
  intensity: number
}

interface MapComponentProps {
  locations: LocationData[]
}

export default function MapComponent({ locations }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || !locations.length) return

    // Clean up existing map if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Dynamic import of Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Configure Leaflet icons
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      })

      // Create map instance
      if (mapRef.current) {
        const map = L.map(mapRef.current, {
          center: [20, 0],
          zoom: 2,
          zoomControl: true,
          scrollWheelZoom: true,
        })

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        // Add circle markers for each location
        locations.forEach((location) => {
          const radius = Math.max(8, Math.min(40, Math.sqrt(location.count) * 2))
          const opacity = Math.max(0.4, location.intensity)

          const circle = L.circleMarker([location.lat, location.lng], {
            radius: radius,
            fillColor: '#ef4444',
            color: '#dc2626',
            weight: 2,
            opacity: opacity,
            fillOpacity: opacity * 0.8
          }).addTo(map)

          // Add popup
          const popupContent = `
            <div class="p-2">
              <h3 class="font-bold text-lg mb-1">${location.city}</h3>
              <p class="text-gray-600 text-sm">${location.country}</p>
              <div class="mt-2 pt-2 border-t">
                <p class="text-sm">
                  <span class="font-medium">Affected:</span> ${formatNumber(location.count)} employees
                </p>
                <p class="text-xs text-gray-500 mt-1">Location: ${location.location}</p>
              </div>
            </div>
          `
          circle.bindPopup(popupContent)
        })

        mapInstanceRef.current = map
      }
    }).catch((error) => {
      console.error('Error loading Leaflet:', error)
    })

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [locations])

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full rounded-lg"
      style={{ minHeight: '500px' }}
    />
  )
}
