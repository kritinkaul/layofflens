'use client'

import { BarChart3, Users, Globe, Shield, Zap, Database, Target, Heart, Github, Code, Server, Database as DatabaseIcon, Cpu, Layers, GitBranch, ExternalLink, Mail, Linkedin, Twitter } from 'lucide-react'
import Navigation from '../components/Navigation'

export default function AboutPage() {
  const techStack = [
    {
      category: "Frontend",
      technologies: [
        { name: "Next.js 14", description: "React framework with App Router" },
        { name: "TypeScript", description: "Type-safe JavaScript" },
        { name: "Tailwind CSS", description: "Utility-first CSS framework" },
        { name: "React Query", description: "Data fetching and caching" },
        { name: "Framer Motion", description: "Animation library" }
      ]
    },
    {
      category: "Backend & Database",
      technologies: [
        { name: "Prisma ORM", description: "Database toolkit and ORM" },
        { name: "PostgreSQL", description: "Primary database" },
        { name: "Supabase", description: "Backend-as-a-Service" },
        { name: "Next.js API Routes", description: "Serverless API endpoints" }
      ]
    },
    {
      category: "Data & Analytics",
      technologies: [
        { name: "Recharts", description: "Chart library for React" },
        { name: "Leaflet", description: "Interactive maps" },
        { name: "CSV Processing", description: "Data import/export" },
        { name: "Real-time Updates", description: "Live data synchronization" }
      ]
    },
    {
      category: "Deployment & Tools",
      technologies: [
        { name: "Vercel", description: "Hosting and deployment" },
        { name: "GitHub", description: "Version control" },
        { name: "ESLint", description: "Code quality" },
        { name: "TypeScript", description: "Type checking" }
      ]
    }
  ]

  const appProcess = [
    {
      step: "01",
      title: "Data Collection",
      description: "Aggregating layoff data from multiple verified sources including company announcements, SEC filings, and news reports.",
      icon: Database
    },
    {
      step: "02",
      title: "Data Processing",
      description: "Cleaning, validating, and structuring the raw data into a consistent format for analysis and visualization.",
      icon: Cpu
    },
    {
      step: "03",
      title: "Database Storage",
      description: "Storing processed data in PostgreSQL with Prisma ORM for efficient querying and relationship management.",
      icon: DatabaseIcon
    },
    {
      step: "04",
      title: "API Development",
      description: "Building RESTful APIs with Next.js API routes to serve data to the frontend with filtering and pagination.",
      icon: Server
    },
    {
      step: "05",
      title: "Frontend Rendering",
      description: "Creating responsive UI components with React, TypeScript, and Tailwind CSS for optimal user experience.",
      icon: Code
    },
    {
      step: "06",
      title: "Data Visualization",
      description: "Implementing interactive charts, maps, and tables using Recharts and Leaflet for comprehensive data insights.",
      icon: BarChart3
    }
  ]

  const stats = [
    { number: "4,100+", label: "Layoff Records" },
    { number: "500+", label: "Companies Tracked" },
    { number: "50+", label: "Industries Covered" },
    { number: "25+", label: "Countries & Regions" }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-900/50 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-100 mb-6">
              About LayoffLens
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Hi there! 👋 I'm a developer passionate about building tools that make complex data accessible and meaningful. 
              LayoffLens is my attempt to create a comprehensive platform for understanding workforce trends through 
              real-time layoff data analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a 
                href="/dashboard" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Explore Dashboard
              </a>
              <a 
                href="/analytics" 
                className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-750 transition-colors"
              >
                View Analytics
              </a>
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://linkedin.com/in/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              <a 
                href="mailto:your.email@example.com" 
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Story Section */}
      <div className="py-16 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">The Story Behind LayoffLens</h2>
            <div className="w-16 h-16 bg-green-900/50 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="prose prose-lg mx-auto text-gray-300 space-y-6">
            <p>
              As someone who's always been fascinated by data and its power to tell stories, I noticed that 
              while layoff data was scattered across various news sources, there wasn't a centralized platform 
              that made this information easily accessible and analyzable.
            </p>
            
            <p>
              LayoffLens started as a weekend project to solve this problem. I wanted to create something that 
              would help researchers, journalists, and anyone interested in understanding workforce trends 
              access comprehensive, well-organized data about layoffs across different industries and geographies.
            </p>
            
            <p>
              The project has evolved significantly since its initial version. What began as a simple data 
              collection script has grown into a full-stack web application with real-time updates, 
              interactive visualizations, and advanced filtering capabilities.
            </p>
            
            <p>
              I believe in the power of open data and transparency. By making this information more accessible, 
              we can better understand economic trends, help people make informed decisions, and contribute to 
              a more informed public discourse about workforce changes.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How LayoffLens Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From data collection to visualization, here's the complete process behind the platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appProcess.map((process, index) => {
              const IconComponent = process.icon
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-sm font-bold text-blue-600">{process.step}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {process.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {process.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with modern technologies for performance, scalability, and developer experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {techStack.map((category, index) => (
              <div key={index} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900">{tech.name}</div>
                        <div className="text-sm text-gray-600">{tech.description}</div>
                      </div>
                      <div className="text-blue-600">
                        <Code className="h-5 w-5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Other Projects Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Other Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Check out some of my other work and contributions to the developer community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GitBranch className="h-6 w-6 text-purple-600" />
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Source Contributions</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contributing to various open source projects and maintaining useful libraries for the community.
              </p>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View on GitHub →
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Projects</h3>
              <p className="text-gray-600 text-sm mb-4">
                Building tools and platforms that make data more accessible and actionable for everyone.
              </p>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Explore Projects →
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-orange-600" />
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Web Development</h3>
              <p className="text-gray-600 text-sm mb-4">
                Creating modern web applications with focus on performance, accessibility, and user experience.
              </p>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                See Portfolio →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Let's Connect!
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            I'm always interested in collaborating on interesting projects or discussing data, technology, and innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:your.email@example.com" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </a>
            <a 
              href="https://github.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-blue-300 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <BarChart3 className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold text-white">LayoffLens</span>
            </div>
            <p className="text-gray-400 mb-4">
              Built with ❤️ by a developer passionate about data and transparency
            </p>
            <p className="text-sm text-gray-500">
              © 2024 LayoffLens. Open source project for workforce analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 