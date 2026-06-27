import { Bell, Search, ChevronDown, User } from 'lucide-react'
import { motion } from 'framer-motion'

interface CommandBarProps {
  onSearchOpen: () => void;
  season: string;
  notificationCount: number;
}

export default function CommandBar({ onSearchOpen, season, notificationCount }: CommandBarProps) {
  return (
    <header className="h-12 bg-nike-black/80 backdrop-blur-xl border-b border-nike-border flex items-center justify-between px-4 z-40 shrink-0">
      {/* Left: Season selector */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-nike-surface rounded-md text-sm font-medium hover:bg-nike-surface-hover transition-colors cursor-pointer">
          <span className="text-nike-volt text-xs font-bold">{season}</span>
          <ChevronDown size={14} className="text-nike-text-secondary" />
        </button>
        <div className="h-4 w-px bg-nike-border" />
        <span className="text-xs text-nike-text-secondary">Nike Merchandising</span>
      </div>

      {/* Center: Search */}
      <motion.button
        onClick={onSearchOpen}
        className="flex items-center gap-2 px-4 py-1.5 bg-nike-surface rounded-lg text-nike-text-secondary text-sm hover:bg-nike-surface-hover transition-colors min-w-[320px] cursor-pointer"
        whileHover={{ scale: 1.01 }}
      >
        <Search size={14} />
        <span>Search products, seasons, modules...</span>
        <kbd className="ml-auto text-[10px] bg-nike-border/50 px-1.5 py-0.5 rounded text-nike-text-tertiary">⌘K</kbd>
      </motion.button>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-nike-text-secondary hover:text-white transition-colors cursor-pointer">
          <Bell size={16} />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-nike-error text-[9px] font-bold text-white rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-nike-surface transition-colors cursor-pointer">
          <div className="w-7 h-7 bg-nike-volt rounded-full flex items-center justify-center">
            <User size={14} className="text-nike-black" />
          </div>
          <div className="text-left">
            <div className="text-xs font-medium">Sarah M.</div>
            <div className="text-[10px] text-nike-text-tertiary">VP Merchandising</div>
          </div>
        </div>
      </div>
    </header>
  )
}
