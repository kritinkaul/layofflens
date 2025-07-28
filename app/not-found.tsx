'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Home, Search, TrendingUp, BarChart3, ArrowLeft, RefreshCw } from 'lucide-react'
import Navigation from './components/Navigation'

export default function NotFound() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 500)
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  const floatingIcons = [
    { icon: BarChart3, color: 'text-blue-500', delay: '0s' },
    { icon: TrendingUp, color: 'text-green-500', delay: '0.5s' },
    { icon: Search, color: 'text-purple-500', delay: '1s' },
    { icon: RefreshCw, color: 'text-orange-500', delay: '1.5s' }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
      <Navigation />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            left: '10%',
            top: '20%'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            right: '10%',
            bottom: '20%',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
            left: '50%',
            top: '50%',
            animationDelay: '2s'
          }}
        />
      </div>
      
      {/* Floating Icons */}
      {floatingIcons.map((item, index) => {
        const Icon = item.icon
        return (
          <div
            key={index}
            className={`absolute ${item.color} opacity-20 animate-float`}
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + (index % 2) * 40}%`,
              animationDelay: item.delay,
              transform: `translate(${mousePosition.x * 0.005 * (index + 1)}px, ${mousePosition.y * 0.005 * (index + 1)}px)`
            }}
          >
            <Icon className="w-16 h-16 md:w-24 md:h-24" />
          </div>
        )
      })}
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="mb-8 relative">
            <h1 className={`text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-1000 ${
              isAnimating ? 'scale-100 opacity-100' : 'scale-150 opacity-0'
            }`}>
              404
            </h1>
            
            {/* Floating emojis around 404 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="absolute text-4xl animate-bounce" style={{ left: '-10%', top: '20%', animationDelay: '0.5s' }}>📊</span>
              <span className="absolute text-4xl animate-bounce" style={{ right: '-10%', top: '20%', animationDelay: '1s' }}>📈</span>
              <span className="absolute text-4xl animate-bounce" style={{ left: '10%', bottom: '20%', animationDelay: '1.5s' }}>🔍</span>
              <span className="absolute text-4xl animate-bounce" style={{ right: '10%', bottom: '20%', animationDelay: '2s' }}>💼</span>
            </div>
          </div>
          
          {/* Error Message */}
          <div className={`mb-8 transition-all duration-1000 delay-300 ${
            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Oops! Data Not Found
            </h2>
            <p className="text-lg text-gray-300 mb-2">
              Looks like this page got laid off too! 😅
            </p>
            <p className="text-md text-gray-400">
              But don't worry, we've got plenty of other insights to explore.
            </p>
          </div>
          
          {/* Interactive Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-1000 delay-500 ${
            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-750 transition-all duration-200 cursor-pointer hover:scale-105">
              <div className="text-2xl font-bold text-blue-400 group-hover:scale-110 transition-transform">0</div>
              <div className="text-xs text-gray-400">Pages Found</div>
            </div>
            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-750 transition-all duration-200 cursor-pointer hover:scale-105">
              <div className="text-2xl font-bold text-green-400 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-xs text-gray-400">Error Rate</div>
            </div>
            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-750 transition-all duration-200 cursor-pointer hover:scale-105">
              <div className="text-2xl font-bold text-purple-400 group-hover:scale-110 transition-transform">∞</div>
              <div className="text-xs text-gray-400">Possibilities</div>
            </div>
            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-750 transition-all duration-200 cursor-pointer hover:scale-105">
              <div className="text-2xl font-bold text-orange-400 group-hover:scale-110 transition-transform">1</div>
              <div className="text-xs text-gray-400">Solution</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-700 ${
            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <Link href="/" className="group btn-primary text-lg px-8 py-3">
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Back to Home
              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">🏠</span>
            </Link>
            
            <Link href="/dashboard" className="group btn-secondary text-lg px-8 py-3">
              <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              View Dashboard
              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">📊</span>
            </Link>
          </div>
          
          {/* Fun Suggestion */}
          <div className={`mt-12 p-6 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/40 transition-all duration-1000 delay-1000 ${
            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse-glow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Pro Tip for Recruiters 💡
            </h3>
            <p className="text-gray-300">
              This 404 page demonstrates attention to detail, user experience design, 
              and the ability to make even error states engaging. Pretty neat, right?
            </p>
          </div>
          
          {/* Easter Egg */}
          <div className="mt-8">
            <button 
              onClick={() => setIsAnimating(!isAnimating)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              🎨 Click to re-animate (because why not?)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 