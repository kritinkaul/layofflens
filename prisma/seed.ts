import { PrismaClient, CompanySize } from '@prisma/client'

const prisma = new PrismaClient()

const companies = [
  {
    name: 'TechCorp',
    industry: 'Technology',
    country: 'United States',
    city: 'San Francisco',
    size: CompanySize.LARGE,
    founded: 2010,
    website: 'https://techcorp.com',
    description: 'Leading technology company specializing in software solutions'
  },
  {
    name: 'FinanceBank',
    industry: 'Finance',
    country: 'United States',
    city: 'New York',
    size: CompanySize.ENTERPRISE,
    founded: 1995,
    website: 'https://financebank.com',
    description: 'Global financial services provider'
  },
  {
    name: 'HealthCare Inc',
    industry: 'Healthcare',
    country: 'United States',
    city: 'Boston',
    size: CompanySize.LARGE,
    founded: 2005,
    website: 'https://healthcareinc.com',
    description: 'Healthcare technology and services company'
  },
  {
    name: 'RetailStore',
    industry: 'Retail',
    country: 'United States',
    city: 'Seattle',
    size: CompanySize.MEDIUM,
    founded: 2015,
    website: 'https://retailstore.com',
    description: 'E-commerce retail platform'
  },
  {
    name: 'Manufacturing Co',
    industry: 'Manufacturing',
    country: 'Germany',
    city: 'Berlin',
    size: CompanySize.LARGE,
    founded: 1980,
    website: 'https://manufacturingco.com',
    description: 'Industrial manufacturing company'
  },
  {
    name: 'StartupXYZ',
    industry: 'Technology',
    country: 'United Kingdom',
    city: 'London',
    size: CompanySize.STARTUP,
    founded: 2020,
    website: 'https://startupxyz.com',
    description: 'Innovative startup in AI and machine learning'
  }
]

const layoffs = [
  {
    companyName: 'TechCorp',
    date: new Date('2024-12-15'),
    employeesAffected: 1200,
    percentage: 15,
    reason: 'Restructuring and cost optimization',
    source: 'Company announcement'
  },
  {
    companyName: 'FinanceBank',
    date: new Date('2024-12-14'),
    employeesAffected: 800,
    percentage: 8,
    reason: 'Digital transformation and automation',
    source: 'Internal memo'
  },
  {
    companyName: 'HealthCare Inc',
    date: new Date('2024-12-13'),
    employeesAffected: 500,
    percentage: 12,
    reason: 'Market consolidation',
    source: 'Press release'
  },
  {
    companyName: 'RetailStore',
    date: new Date('2024-12-12'),
    employeesAffected: 300,
    percentage: 20,
    reason: 'Store closures and online focus',
    source: 'Company announcement'
  },
  {
    companyName: 'Manufacturing Co',
    date: new Date('2024-12-11'),
    employeesAffected: 450,
    percentage: 10,
    reason: 'Supply chain optimization',
    source: 'Internal communication'
  },
  {
    companyName: 'StartupXYZ',
    date: new Date('2024-12-10'),
    employeesAffected: 50,
    percentage: 25,
    reason: 'Funding challenges and pivot',
    source: 'CEO announcement'
  },
  {
    companyName: 'TechCorp',
    date: new Date('2024-11-20'),
    employeesAffected: 800,
    percentage: 10,
    reason: 'Product line consolidation',
    source: 'Company announcement'
  },
  {
    companyName: 'FinanceBank',
    date: new Date('2024-11-15'),
    employeesAffected: 600,
    percentage: 6,
    reason: 'Branch network optimization',
    source: 'Internal memo'
  },
  {
    companyName: 'HealthCare Inc',
    date: new Date('2024-11-10'),
    employeesAffected: 350,
    percentage: 8,
    reason: 'Administrative efficiency',
    source: 'Press release'
  },
  {
    companyName: 'RetailStore',
    date: new Date('2024-11-05'),
    employeesAffected: 200,
    percentage: 15,
    reason: 'Inventory management optimization',
    source: 'Company announcement'
  }
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.layoff.deleteMany()
  await prisma.company.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create companies
  const createdCompanies = await Promise.all(
    companies.map(company => prisma.company.create({ data: company }))
  )

  console.log(`✅ Created ${createdCompanies.length} companies`)

  // Create layoffs
  const layoffPromises = layoffs.map(async (layoff) => {
    const company = createdCompanies.find(c => c.name === layoff.companyName)
    if (!company) {
      console.warn(`⚠️  Company not found: ${layoff.companyName}`)
      return
    }

    return prisma.layoff.create({
      data: {
        companyId: company.id,
        date: layoff.date,
        employeesAffected: layoff.employeesAffected,
        percentage: layoff.percentage,
        reason: layoff.reason,
        source: layoff.source,
        confirmed: true
      }
    })
  })

  const createdLayoffs = await Promise.all(layoffPromises)
  const validLayoffs = createdLayoffs.filter(Boolean)

  console.log(`✅ Created ${validLayoffs.length} layoffs`)

  // Create some sample industries
  const industries = [
    { name: 'Technology', description: 'Software, hardware, and IT services' },
    { name: 'Finance', description: 'Banking, insurance, and financial services' },
    { name: 'Healthcare', description: 'Medical, pharmaceutical, and health services' },
    { name: 'Retail', description: 'E-commerce, brick-and-mortar retail' },
    { name: 'Manufacturing', description: 'Industrial and consumer manufacturing' },
    { name: 'Education', description: 'Educational institutions and edtech' },
    { name: 'Transportation', description: 'Logistics, shipping, and mobility' },
    { name: 'Energy', description: 'Oil, gas, renewable energy, and utilities' }
  ]

  await Promise.all(
    industries.map(industry => 
      prisma.industry.upsert({
        where: { name: industry.name },
        update: {},
        create: industry
      })
    )
  )

  console.log(`✅ Created ${industries.length} industries`)

  // Create some sample countries
  const countries = [
    { name: 'United States', code: 'US', region: 'North America' },
    { name: 'United Kingdom', code: 'UK', region: 'Europe' },
    { name: 'Germany', code: 'DE', region: 'Europe' },
    { name: 'Canada', code: 'CA', region: 'North America' },
    { name: 'Australia', code: 'AU', region: 'Oceania' },
    { name: 'Japan', code: 'JP', region: 'Asia' },
    { name: 'India', code: 'IN', region: 'Asia' },
    { name: 'Brazil', code: 'BR', region: 'South America' }
  ]

  await Promise.all(
    countries.map(country => 
      prisma.country.upsert({
        where: { code: country.code },
        update: {},
        create: country
      })
    )
  )

  console.log(`✅ Created ${countries.length} countries`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 