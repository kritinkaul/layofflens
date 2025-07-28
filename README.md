# 📊 LayoffLens - Layoff Data Analytics Platform

A comprehensive, real-time layoff data analytics platform that tracks workforce trends across industries and geographies. Built with Next.js, TypeScript, and Supabase.

![LayoffLens Demo](https://img.shields.io/badge/Status-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)

## ✨ Features

### 🎯 **Core Analytics**
- **Real-time layoff tracking** across 4,000+ companies
- **Interactive charts and visualizations** using Recharts
- **Advanced filtering and search** with real-time results
- **Geographic heatmap** with Leaflet integration
- **Industry trend analysis** with drill-down capabilities

### 📊 **Data Management**
- **CSV export functionality** for filtered datasets
- **Pagination and infinite scroll** for large datasets (4,000+ records)
- **Advanced sorting** by company, date, industry, location, and size
- **Real-time search** across companies, sectors, and locations
- **Date range filtering** with calendar picker

### 🎨 **User Experience**
- **Clean, modern UI** with light theme design
- **Responsive design** - works on all devices
- **Smooth animations and transitions**
- **Scroll-to-top functionality** for large datasets
- **Loading states and error handling**

### 🔧 **Technical Features**
- **Type-safe development** with TypeScript
- **Server-side rendering** with Next.js
- **Database integration** with Supabase/PostgreSQL
- **Performance optimized** for large datasets
- **SEO optimized** with proper meta tags

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts/D3.js** - Data visualization
- **React Query** - Data fetching and caching

### Backend
- **Next.js API Routes** - Serverless functions
- **PostgreSQL** - Relational database
- **Prisma** - Database ORM
- **Node.js** - Runtime environment

### Deployment & Infrastructure
- **Vercel** - Frontend deployment
- **Railway/Heroku** - Backend and database hosting
- **GitHub** - Version control

## 📊 Data Sources

- Public layoff databases
- Company announcements
- Government reports
- News aggregators
- Manual data collection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/layofflens.git
   cd layofflens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
layofflens/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── analytics/         # Analytics pages
│   └── components/        # Reusable components
├── lib/                   # Utility functions
├── prisma/               # Database schema
├── public/               # Static assets
└── types/                # TypeScript definitions
```

## 🎨 Design System

- **Color Palette**: Professional blues and grays
- **Typography**: Clean, readable fonts
- **Components**: Consistent UI patterns
- **Accessibility**: WCAG 2.1 compliant

## 📈 Roadmap

### Phase 1: Core Features
- [x] Project setup and structure
- [ ] Basic dashboard layout
- [ ] Data visualization components
- [ ] Database schema design

### Phase 2: Data & Analytics
- [ ] Data collection pipeline
- [ ] Advanced filtering system
- [ ] Analytics algorithms
- [ ] Export functionality

### Phase 3: Advanced Features
- [ ] Real-time data updates
- [ ] Predictive analytics
- [ ] User accounts and preferences
- [ ] API documentation

### Phase 4: Deployment & Optimization
- [ ] Production deployment
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Monitoring and analytics

## 🤝 Contributing

This is an internship project. Contributions are welcome through:
- Bug reports
- Feature suggestions
- Code improvements
- Documentation updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Career Impact

This project demonstrates:
- **Data Analysis**: Complex data processing and visualization
- **Full-Stack Development**: Modern web technologies
- **Financial Domain Knowledge**: Understanding of economic indicators
- **Problem Solving**: Real-world application development
- **Professional Presentation**: Clean, scalable code architecture

Perfect for showcasing skills to banking and financial technology employers! 