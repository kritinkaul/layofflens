import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Approximate coordinates for major cities/regions
const cityCoordinates: { [key: string]: { lat: number; lng: number; country: string } } = {
  // USA
  'SF Bay Area': { lat: 37.7749, lng: -122.4194, country: 'United States' },
  'New York City': { lat: 40.7128, lng: -74.0060, country: 'United States' },
  'Seattle': { lat: 47.6062, lng: -122.3321, country: 'United States' },
  'Austin': { lat: 30.2672, lng: -97.7431, country: 'United States' },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, country: 'United States' },
  'Boston': { lat: 42.3601, lng: -71.0589, country: 'United States' },
  'Chicago': { lat: 41.8781, lng: -87.6298, country: 'United States' },
  'Denver': { lat: 39.7392, lng: -104.9903, country: 'United States' },
  'Atlanta': { lat: 33.7490, lng: -84.3880, country: 'United States' },
  'Dallas': { lat: 32.7767, lng: -96.7970, country: 'United States' },
  'Miami': { lat: 25.7617, lng: -80.1918, country: 'United States' },
  'Portland': { lat: 45.5152, lng: -122.6784, country: 'United States' },
  'Phoenix': { lat: 33.4484, lng: -112.0740, country: 'United States' },
  'San Diego': { lat: 32.7157, lng: -117.1611, country: 'United States' },
  'Detroit': { lat: 42.3314, lng: -83.0458, country: 'United States' },
  'Minneapolis': { lat: 44.9778, lng: -93.2650, country: 'United States' },
  'Raleigh': { lat: 35.7796, lng: -78.6382, country: 'United States' },
  'Sacramento': { lat: 38.5816, lng: -121.4944, country: 'United States' },
  'Salt Lake City': { lat: 40.7608, lng: -111.8910, country: 'United States' },
  'Orlando': { lat: 28.5383, lng: -81.3792, country: 'United States' },
  'Baltimore': { lat: 39.2904, lng: -76.6122, country: 'United States' },
  'Wilmington': { lat: 34.2257, lng: -77.9447, country: 'United States' },
  
  // Canada
  'Toronto': { lat: 43.6532, lng: -79.3832, country: 'Canada' },
  'Vancouver': { lat: 49.2827, lng: -123.1207, country: 'Canada' },
  'Montreal': { lat: 45.5017, lng: -73.5673, country: 'Canada' },
  'Quebec': { lat: 46.8139, lng: -71.2080, country: 'Canada' },
  
  // Europe
  'London': { lat: 51.5074, lng: -0.1278, country: 'United Kingdom' },
  'Berlin': { lat: 52.5200, lng: 13.4050, country: 'Germany' },
  'Paris': { lat: 48.8566, lng: 2.3522, country: 'France' },
  'Amsterdam': { lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
  'Stockholm': { lat: 59.3293, lng: 18.0686, country: 'Sweden' },
  'Dublin': { lat: 53.3498, lng: -6.2603, country: 'Ireland' },
  'Zurich': { lat: 47.3769, lng: 8.5417, country: 'Switzerland' },
  
  // Asia
  'Bengaluru': { lat: 12.9716, lng: 77.5946, country: 'India' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, country: 'India' },
  'New Delhi': { lat: 28.6139, lng: 77.2090, country: 'India' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, country: 'India' },
  'Gurugram': { lat: 28.4595, lng: 77.0266, country: 'India' },
  'Singapore': { lat: 1.3521, lng: 103.8198, country: 'Singapore' },
  'Tokyo': { lat: 35.6762, lng: 139.6503, country: 'Japan' },
  'Beijing': { lat: 39.9042, lng: 116.4074, country: 'China' },
  'Tel Aviv': { lat: 32.0853, lng: 34.7818, country: 'Israel' },
  
  // Australia
  'Sydney': { lat: -33.8688, lng: 151.2093, country: 'Australia' },
  'Melbourne': { lat: -37.8136, lng: 144.9631, country: 'Australia' },
  
  // Africa
  'Lagos': { lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
  'Cape Town': { lat: -33.9249, lng: 18.4241, country: 'South Africa' },
  
  // Default for unknown locations
  'Unknown': { lat: 0, lng: 0, country: 'Unknown' }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build base query
    let query = supabase.from('layoffs').select('location, count')
    
    if (startDate) {
      query = query.gte('date', startDate)
    }
    
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data: layoffs, error } = await query

    if (error) {
      console.error('Error fetching geographic data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch geographic data', success: false },
        { status: 500 }
      )
    }

    // Aggregate data by location
    const locationData: { [key: string]: number } = {}
    layoffs?.forEach(layoff => {
      const location = layoff.location || 'Unknown'
      const count = layoff.count || 0
      locationData[location] = (locationData[location] || 0) + count
    })

    // Convert to map data format
    const mapData = Object.entries(locationData)
      .map(([location, count]) => {
        // Try to find coordinates - check if location contains any known city
        let coords = cityCoordinates['Unknown']
        let matchedCity = 'Unknown'
        
        // Check for exact match first
        if (cityCoordinates[location]) {
          coords = cityCoordinates[location]
          matchedCity = location
        } else {
          // Check if location contains any known city name
          for (const [city, cityCoords] of Object.entries(cityCoordinates)) {
            if (location.includes(city) || city.includes(location)) {
              coords = cityCoords
              matchedCity = city
              break
            }
          }
        }
        
        return {
          location,
          city: matchedCity,
          lat: coords.lat,
          lng: coords.lng,
          country: coords.country,
          count,
          intensity: Math.min(count / 1000, 1) // Normalize intensity
        }
      })
      .filter(item => item.city !== 'Unknown') // Filter out unknown locations
      .sort((a, b) => b.count - a.count) // Sort by count descending

    // Get top affected countries
    const countryData: { [key: string]: number } = {}
    mapData.forEach(item => {
      countryData[item.country] = (countryData[item.country] || 0) + item.count
    })

    const topCountries = Object.entries(countryData)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return NextResponse.json({
      data: {
        locations: mapData,
        topCountries,
        totalLocations: mapData.length
      },
      success: true
    })
  } catch (error) {
    console.error('Error in geographic API:', error)
    return NextResponse.json(
      { error: 'Failed to process geographic data', success: false },
      { status: 500 }
    )
  }
} 