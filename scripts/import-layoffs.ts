import fs from 'fs-extra'
import csv from 'csv-parser'
import { supabase } from '../lib/supabase'

interface CSVRow {
  Company: string
  'Location HQ': string
  '# Laid Off': string
  Date: string
  '%': string
  Industry: string
  Source: string
  Stage: string
  '$ Raised (mm)': string
  Country: string
  'Date Added': string
}

interface TransformedRow {
  company: string
  location: string
  count: number | null
  date: string
  sector: string
  source_url: string
}

// Helper function to parse date
function parseDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === '') return null
  
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null
    return date.toISOString()
  } catch {
    return null
  }
}

// Helper function to parse number
function parseNumber(value: string): number | null {
  if (!value || value.trim() === '') return null
  
  // Remove any non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '')
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? null : parsed
}

// Helper function to parse percentage
function parsePercentage(value: string): number | null {
  if (!value || value.trim() === '') return null
  
  // Remove % sign and parse
  const cleaned = value.replace('%', '').trim()
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? null : parsed
}

// Transform CSV row to database format
function transformRow(row: CSVRow): TransformedRow {
  return {
    company: row.Company?.trim() || '',
    location: row['Location HQ']?.trim() || '',
    count: parseNumber(row['# Laid Off']),
    date: parseDate(row.Date) || new Date().toISOString(),
    sector: row.Industry?.trim() || 'Unknown',
    source_url: row.Source?.trim() || ''
  }
}

// Import data in batches
async function importBatch(rows: TransformedRow[], batchNumber: number): Promise<{ success: number; errors: string[] }> {
  console.log(`📦 Processing batch ${batchNumber} with ${rows.length} records...`)
  
  try {
    const { data, error } = await supabase
      .from('layoffs')
      .insert(rows)
      .select()
    
    if (error) {
      console.error(`❌ Batch ${batchNumber} failed:`, error.message)
      return { success: 0, errors: [error.message] }
    }
    
    console.log(`✅ Batch ${batchNumber} imported successfully: ${data?.length || 0} records`)
    return { success: data?.length || 0, errors: [] }
  } catch (error) {
    console.error(`❌ Batch ${batchNumber} error:`, error)
    return { success: 0, errors: [error instanceof Error ? error.message : 'Unknown error'] }
  }
}

// Main import function
async function importLayoffsData() {
  console.log('🚀 Starting layoffs data import...')
  
  const results: TransformedRow[] = []
  const errors: string[] = []
  let rowCount = 0
  
  try {
    // Read and parse CSV file
    console.log('📖 Reading CSV file...')
    
    await new Promise((resolve, reject) => {
      // Read the file and strip BOM if present
      const fileContent = fs.readFileSync('layoffs.csv', 'utf8')
      const contentWithoutBOM = fileContent.replace(/^\uFEFF/, '')
      
      // Create a temporary file without BOM
      const tempFile = 'layoffs_temp.csv'
      fs.writeFileSync(tempFile, contentWithoutBOM)
      
      fs.createReadStream(tempFile)
        .pipe(csv())
        .on('data', (row: CSVRow) => {
          rowCount++
          
          // Skip header row if it's duplicated
          if (rowCount === 1 && row.Company === 'Company') {
            return
          }
          
          try {
            const transformed = transformRow(row)
            
            // Basic validation
            if (!transformed.company) {
              errors.push(`Row ${rowCount}: Missing company name`)
              return
            }
            
            results.push(transformed)
            
            // Progress indicator
            if (rowCount % 500 === 0) {
              console.log(`📊 Processed ${rowCount} rows...`)
            }
          } catch (error) {
            errors.push(`Row ${rowCount}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        })
        .on('end', () => {
          console.log(`✅ CSV parsing completed. Total rows: ${rowCount}`)
          // Clean up temporary file
          try {
            fs.unlinkSync('layoffs_temp.csv')
          } catch (error) {
            console.log('Note: Could not remove temporary file')
          }
          resolve(true)
        })
        .on('error', (error: any) => {
          console.error('❌ CSV parsing error:', error)
          reject(error)
        })
    })
    
    console.log(`📊 Total valid records: ${results.length}`)
    console.log(`❌ Total errors: ${errors.length}`)
    
    if (results.length === 0) {
      console.log('❌ No valid records to import')
      return
    }
    
    // Clear existing data (optional - comment out if you want to append)
    console.log('🗑️  Clearing existing data...')
    const { error: deleteError } = await supabase
      .from('layoffs')
      .delete()
      .neq('id', '') // Delete all records
    
    if (deleteError) {
      console.error('❌ Error clearing existing data:', deleteError.message)
    } else {
      console.log('✅ Existing data cleared')
    }
    
    // Import in batches
    const BATCH_SIZE = 100
    let totalImported = 0
    let totalErrors = 0
    
    for (let i = 0; i < results.length; i += BATCH_SIZE) {
      const batch = results.slice(i, i + BATCH_SIZE)
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1
      
      const result = await importBatch(batch, batchNumber)
      totalImported += result.success
      totalErrors += result.errors.length
      
      // Add a small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < results.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    // Final summary
    console.log('\n🎉 Import completed!')
    console.log(`📊 Total records processed: ${rowCount}`)
    console.log(`✅ Successfully imported: ${totalImported}`)
    console.log(`❌ Import errors: ${totalErrors}`)
    console.log(`⚠️  Validation errors: ${errors.length}`)
    
    if (errors.length > 0) {
      console.log('\n📋 Validation errors:')
      errors.slice(0, 10).forEach(error => console.log(`  - ${error}`))
      if (errors.length > 10) {
        console.log(`  ... and ${errors.length - 10} more errors`)
      }
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

// Run the import
if (require.main === module) {
  importLayoffsData()
    .then(() => {
      console.log('✅ Import script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Import script failed:', error)
      process.exit(1)
    })
}

export { importLayoffsData } 