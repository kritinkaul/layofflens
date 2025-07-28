import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sector = searchParams.get('sector')
    const location = searchParams.get('location')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build base query
    let baseQuery = supabase.from('layoffs').select('*')
    
    if (sector) {
      baseQuery = baseQuery.eq('sector', sector)
    }
    
    if (location) {
      baseQuery = baseQuery.eq('location', location)
    }
    
    if (startDate) {
      baseQuery = baseQuery.gte('date', startDate)
    }
    
    if (endDate) {
      baseQuery = baseQuery.lte('date', endDate)
    }

    // Get all layoffs for calculations
    const { data: allLayoffs, error: dataError } = await baseQuery
    
    if (dataError) {
      console.error('Error getting layoffs data:', dataError)
      return NextResponse.json(
        { error: 'Failed to fetch stats', success: false },
        { status: 500 }
      )
    }

    const layoffs = allLayoffs || []

    // Calculate total layoff events
    const totalLayoffs = layoffs.length

    // Calculate total employees affected (sum of all count values)
    const totalEmployeesAffected = layoffs.reduce((sum, layoff) => {
      const count = layoff.count || 0
      return sum + count
    }, 0)

    // Calculate total unique companies affected
    const uniqueCompanies = new Set(layoffs.map(layoff => layoff.company?.trim().toLowerCase()).filter(Boolean))
    const totalCompanies = uniqueCompanies.size

    // Calculate average layoff size (employees per layoff event)
    const avgLayoffSize = totalLayoffs > 0 ? Math.round(totalEmployeesAffected / totalLayoffs) : 0

    // Get most affected sector by total employees affected
    const sectorCounts: { [key: string]: number } = {}
    layoffs.forEach(layoff => {
      const sector = layoff.sector || 'Unknown'
      sectorCounts[sector] = (sectorCounts[sector] || 0) + (layoff.count || 0)
    })
    
    const mostAffectedSector = Object.entries(sectorCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown'

    // Get most affected location by total employees affected
    const locationCounts: { [key: string]: number } = {}
    layoffs.forEach(layoff => {
      const location = layoff.location || 'Unknown'
      locationCounts[location] = (locationCounts[location] || 0) + (layoff.count || 0)
    })
    
    const mostAffectedLocation = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown'

    // Get recent trend (compare last 30 days vs previous 30 days) based on employees affected
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const recentEmployeesAffected = layoffs.filter(layoff => {
      const layoffDate = new Date(layoff.date)
      return layoffDate >= thirtyDaysAgo && layoffDate <= now
    }).reduce((sum, layoff) => sum + (layoff.count || 0), 0)

    const previousEmployeesAffected = layoffs.filter(layoff => {
      const layoffDate = new Date(layoff.date)
      return layoffDate >= sixtyDaysAgo && layoffDate < thirtyDaysAgo
    }).reduce((sum, layoff) => sum + (layoff.count || 0), 0)

    let recentTrend: 'increasing' | 'decreasing' | 'stable' = 'stable'
    if (previousEmployeesAffected > 0) {
      const change = ((recentEmployeesAffected - previousEmployeesAffected) / previousEmployeesAffected) * 100
      if (change > 10) recentTrend = 'increasing'
      else if (change < -10) recentTrend = 'decreasing'
    } else if (recentEmployeesAffected > 0) {
      recentTrend = 'increasing'
    }

    const stats = {
      totalLayoffs,
      totalCompanies,
      totalEmployeesAffected,
      averageLayoffSize: avgLayoffSize,
      mostAffectedIndustry: mostAffectedSector,
      mostAffectedCountry: mostAffectedLocation,
      recentTrend
    }

    return NextResponse.json({
      data: stats,
      success: true
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats', success: false },
      { status: 500 }
    )
  }
} 