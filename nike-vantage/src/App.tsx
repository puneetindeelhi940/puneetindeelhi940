import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavRail from './components/layout/NavRail'
import CommandBar from './components/layout/CommandBar'
import CommandPalette from './components/layout/CommandPalette'
import AICopilot from './components/ai/AICopilot'
import HomeModule from './modules/home/HomeModule'
import PlanModule from './modules/plan/PlanModule'
import CreateModule from './modules/create/CreateModule'
import AssortModule from './modules/assort/AssortModule'
import PriceModule from './modules/price/PriceModule'
import ForecastModule from './modules/forecast/ForecastModule'
import LaunchModule from './modules/launch/LaunchModule'
import OpsModule from './modules/ops/OpsModule'
import AnalyticsModule from './modules/analytics/AnalyticsModule'

const moduleContextMap: Record<string, string> = {
  home: 'Mission Control — Executive Dashboard',
  plan: 'Strategic Planning — SP26',
  create: 'Product Creation — SP26 Running',
  assort: "SP26 Women's Running Assortment — North America",
  price: 'Pricing & Margin — SP26 Running',
  forecast: 'Demand & Inventory — Pegasus 43',
  launch: 'Launch Readiness — Air Max DN',
  ops: 'Operations — Active Workflows',
  analytics: 'Analytics — Executive View',
}

const moduleComponents: Record<string, React.ComponentType> = {
  home: HomeModule,
  plan: PlanModule,
  create: CreateModule,
  assort: AssortModule,
  price: PriceModule,
  forecast: ForecastModule,
  launch: LaunchModule,
  ops: OpsModule,
  analytics: AnalyticsModule,
}

export default function App() {
  const [activeModule, setActiveModule] = useState('home')
  const [copilotOpen, setCopilotOpen] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleNavigate = useCallback((module: string) => {
    setActiveModule(module)
  }, [])

  const ActiveComponent = moduleComponents[activeModule]

  return (
    <>
      {/* Splash screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-[200] bg-nike-dark flex flex-col items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Swoosh */}
            <motion.svg
              viewBox="0 0 69 32"
              className="w-24 h-12 fill-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <path d="M68.56 4.58L28.24 24.3l-4.08 1.82c-3.17 1.42-5.65.67-5.65-2.3 0-1.2.37-2.6 1.15-4.19L29.1 2.4C30.6.6 32.56-.18 34.38.04c1.22.14 2.16.8 2.5 2.08.2.72.06 1.6-.38 2.44L24.48 24.7l39.96-18.56 4.12-1.56z"/>
            </motion.svg>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 text-center"
            >
              <h1 className="text-xl font-bold tracking-[0.3em] text-white uppercase">Vantage</h1>
              <p className="text-[10px] text-nike-volt mt-2 tracking-[0.2em] uppercase">Intelligent Merchandising OS</p>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-0.5 bg-nike-volt mt-6 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main app */}
      <div className="h-screen w-screen flex flex-col bg-nike-dark">
        <CommandBar
          onSearchOpen={() => setPaletteOpen(true)}
          season="SP26"
          notificationCount={5}
        />

        <div className="flex flex-1 overflow-hidden">
          <NavRail activeModule={activeModule} onNavigate={handleNavigate} />

          {/* Arena (main workspace) */}
          <main className="flex-1 overflow-hidden bg-nike-dark relative">
            {/* Context bar */}
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-nike-border/50 bg-nike-black/30 shrink-0">
              <div className="flex items-center gap-2 text-xs text-nike-text-tertiary">
                <span>NIKE VANTAGE</span>
                <span>/</span>
                <span className="text-nike-text-secondary">{activeModule.charAt(0).toUpperCase() + activeModule.slice(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-nike-text-tertiary">Last synced: 2 min ago</span>
                <div className="w-1.5 h-1.5 bg-nike-success rounded-full" />
              </div>
            </div>

            {/* Module content with transitions */}
            <div className="h-[calc(100%-30px)] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, scale: 0.97, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <ActiveComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <AICopilot
            isOpen={copilotOpen}
            onToggle={() => setCopilotOpen(prev => !prev)}
            context={moduleContextMap[activeModule]}
          />
        </div>
      </div>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  )
}
