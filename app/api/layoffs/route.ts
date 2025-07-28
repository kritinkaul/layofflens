import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sector = searchParams.get('sector')
    const location = searchParams.get('location')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const from = (page - 1) * limit
    const to = from + limit - 1

    // Build query
    let query = supabase
      .from('layoffs')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, to)
    
    // Add filters
    if (sector) {
      query = query.eq('sector', sector)
    }
    
    if (location) {
      query = query.eq('location', location)
    }
    
    if (startDate) {
      query = query.gte('date', startDate)
    }
    
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data: layoffs, error, count } = await query

    if (error) {
      console.error('Error fetching layoffs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch layoffs', success: false },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: layoffs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      success: true
    })
  } catch (error) {
    console.error('Error fetching layoffs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch layoffs', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company, date, count, sector, location, source_url } = body

    const { data: layoff, error } = await supabase
      .from('layoffs')
      .insert({
        company,
        date: new Date(date).toISOString(),
        count,
        sector,
        location,
        source_url
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating layoff:', error)
      return NextResponse.json(
        { error: 'Failed to create layoff', success: false },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: layoff,
      success: true
    })
  } catch (error) {
    console.error('Error creating layoff:', error)
    return NextResponse.json(
      { error: 'Failed to create layoff', success: false },
      { status: 500 }
    )
  }
} 