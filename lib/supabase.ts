import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gpvxshyozxnvvhlflwsj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwdnhzaHlvenhudnZobGZsd3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTYzNzIsImV4cCI6MjA2NzY5MjM3Mn0.Nj_bSlx0OPesM9b_fEkT2BNOLhD08K0eUd5YZttTBSw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to test the connection
export async function testSupabaseConnection() {
  try {
    // Try to fetch a simple query to test the connection
    // We'll try to access a table to test the connection
    const { data, error } = await supabase
      .from('layoffs')
      .select('count')
      .limit(1)
    
    // If we get an error about the table not existing, that's fine - it means we can connect
    if (error && error.message.includes('does not exist')) {
      console.log('✅ Supabase connection successful! (Table does not exist yet)')
      return { success: true, data: { connected: true, message: 'Connected but table does not exist' } }
    }
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase connection successful!')
    return { success: true, data: { connected: true } }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Helper function to get table names
export async function getTableNames() {
  try {
    // Try common table names that might exist
    const possibleTables = ['layoffs', 'companies', 'users', 'analytics', 'industries', 'countries']
    const existingTables: string[] = []
    
    for (const tableName of possibleTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (!error) {
          existingTables.push(tableName)
        }
      } catch (error) {
        // Table doesn't exist, continue
      }
    }
    
    return { success: true, data: existingTables }
  } catch (error) {
    console.error('Error fetching table names:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
} 