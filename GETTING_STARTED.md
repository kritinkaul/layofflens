# Getting Started with LayoffLens

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd layofflens
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your database URL
DATABASE_URL="postgresql://username:password@localhost:5432/layofflens"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📊 Available Pages

- **Homepage** (`/`) - Landing page with project overview
- **Dashboard** (`/dashboard`) - Main analytics dashboard
- **API Routes** (`/api/*`) - Backend API endpoints

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 📁 Project Structure

```
layofflens/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── providers.tsx      # Context providers
├── lib/                   # Utility functions
│   ├── prisma.ts          # Database client
│   └── utils.ts           # Helper functions
├── prisma/                # Database schema
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Sample data
├── types/                 # TypeScript types
└── public/                # Static assets
```

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL (for auth)
- `NEXTAUTH_SECRET` - Secret key for sessions

### Database Schema
The application uses the following main entities:
- **Companies** - Company information
- **Layoffs** - Layoff events
- **Industries** - Industry categories
- **Countries** - Geographic data
- **Analytics** - Cached analytics data

## 🎯 Next Steps

1. **Customize Data**: Modify the seed script to add your own data
2. **Add Features**: Implement additional analytics and visualizations
3. **Deploy**: Follow the deployment guide in `DEPLOYMENT.md`
4. **Enhance**: Add authentication, real-time updates, and more

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check your DATABASE_URL in .env.local
# Ensure PostgreSQL is running
# Test connection: npx prisma db push
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**TypeScript Errors**
```bash
# Check types
npm run type-check
# Regenerate Prisma client
npm run db:generate
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Happy Coding! 🚀** 