'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Home, PieChart, Database, Info, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isActive = (path: string) => pathname === path
  
  const navItems = [
    { href: '/', label: 'Home', icon: Home, emoji: '🏠' },
    { href: '/dashboard', label: 'Dashboard', icon: PieChart, emoji: '📊' },
    { href: '/analytics', label: 'Analytics', icon: Database, emoji: '📈' },
    { href: '/about', label: 'About', icon: Info, emoji: 'ℹ️' }
  ]
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <BarChart3 className="h-6 w-6 text-blue-600 group-hover:text-blue-500 transition-all duration-200 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-blue-600 group-hover:text-blue-500 transition-colors">
              LayoffLens
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`group relative nav-link px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href) 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-sm mr-2 group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                    <Icon className={`h-4 w-4 mr-2 group-hover:scale-110 transition-transform ${
                      isActive(item.href) ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                </Link>
              )
            })}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600 group-hover:rotate-90 transition-transform" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top-4 duration-200 bg-white">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg mr-3">{item.emoji}</span>
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.href) && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 