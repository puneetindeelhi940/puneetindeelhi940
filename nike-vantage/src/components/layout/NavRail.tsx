import { motion } from 'framer-motion'
import {
  Home, CalendarRange, PackagePlus, LayoutGrid,
  DollarSign, TrendingUp, Rocket, Settings2,
  BarChart3, Zap
} from 'lucide-react'

interface NavRailProps {
  activeModule: string;
  onNavigate: (module: string) => void;
}

const modules = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'plan', label: 'Plan', icon: CalendarRange },
  { id: 'create', label: 'Create', icon: PackagePlus },
  { id: 'assort', label: 'Assort', icon: LayoutGrid },
  { id: 'price', label: 'Price', icon: DollarSign },
  { id: 'forecast', label: 'Forecast', icon: TrendingUp },
  { id: 'launch', label: 'Launch', icon: Rocket },
  { id: 'ops', label: 'Ops', icon: Zap },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export default function NavRail({ activeModule, onNavigate }: NavRailProps) {
  return (
    <nav className="w-[72px] h-full bg-nike-black flex flex-col items-center py-4 border-r border-nike-border z-50 shrink-0">
      {/* Logo */}
      <div className="mb-6 px-2">
        <svg viewBox="0 0 69 32" className="w-10 h-5 fill-white">
          <path d="M68.56 4.58L28.24 24.3l-4.08 1.82c-3.17 1.42-5.65.67-5.65-2.3 0-1.2.37-2.6 1.15-4.19L29.1 2.4C30.6.6 32.56-.18 34.38.04c1.22.14 2.16.8 2.5 2.08.2.72.06 1.6-.38 2.44L24.48 24.7l39.96-18.56 4.12-1.56z"/>
        </svg>
      </div>

      <div className="text-[8px] font-bold tracking-[0.2em] text-nike-volt mb-6 uppercase">Vantage</div>

      {/* Module icons */}
      <div className="flex-1 flex flex-col gap-1 w-full px-2">
        {modules.map((mod) => {
          const Icon = mod.icon
          const isActive = activeModule === mod.id
          return (
            <motion.button
              key={mod.id}
              onClick={() => onNavigate(mod.id)}
              className={`relative flex flex-col items-center justify-center w-full py-2.5 rounded-lg cursor-pointer transition-colors group ${
                isActive
                  ? 'bg-nike-surface text-nike-volt'
                  : 'text-nike-text-tertiary hover:text-nike-text hover:bg-nike-surface/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-nike-volt rounded-r-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-[9px] mt-1 font-medium tracking-wide ${isActive ? 'text-nike-volt' : ''}`}>
                {mod.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Settings */}
      <motion.button
        onClick={() => {}}
        className="flex flex-col items-center justify-center py-2.5 text-nike-text-tertiary hover:text-nike-text cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings2 size={18} strokeWidth={1.5} />
        <span className="text-[9px] mt-1 font-medium tracking-wide">Settings</span>
      </motion.button>
    </nav>
  )
}
