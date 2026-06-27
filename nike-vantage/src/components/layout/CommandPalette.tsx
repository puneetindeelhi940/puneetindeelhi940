import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Clock, Sparkles, Zap } from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
}

const recentItems = [
  { label: 'SP26 Women\'s Running Assortment', module: 'assort' },
  { label: 'Air Max DN Launch Readiness', module: 'launch' },
  { label: 'Pegasus 43 Costing Review', module: 'create' },
]

const quickActions = [
  { label: 'Create new style', module: 'create' },
  { label: 'Start assortment review', module: 'assort' },
  { label: 'Open margin simulator', module: 'price' },
]

const aiSuggestions = [
  { label: '3 assortments pending your approval', module: 'assort' },
  { label: 'SP26 forecast updated — review changes', module: 'forecast' },
]

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
      }
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[560px] max-w-[90vw] bg-nike-surface border border-nike-border rounded-xl shadow-2xl z-[101] overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-nike-border">
              <Search size={18} className="text-nike-text-tertiary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need?"
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-nike-text-tertiary"
              />
              <kbd className="text-[10px] bg-nike-border/50 px-1.5 py-0.5 rounded text-nike-text-tertiary">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto p-2">
              {/* Recent */}
              <div className="mb-3">
                <p className="px-2 py-1 text-[10px] font-semibold text-nike-text-tertiary uppercase tracking-wider">Recent</p>
                {recentItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { onNavigate(item.module); onClose() }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-nike-text-secondary hover:bg-nike-surface-hover hover:text-white transition-colors cursor-pointer group"
                  >
                    <Clock size={14} className="shrink-0 text-nike-text-tertiary" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-nike-volt" />
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mb-3">
                <p className="px-2 py-1 text-[10px] font-semibold text-nike-text-tertiary uppercase tracking-wider">Quick Actions</p>
                {quickActions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { onNavigate(item.module); onClose() }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-nike-text-secondary hover:bg-nike-surface-hover hover:text-white transition-colors cursor-pointer group"
                  >
                    <Zap size={14} className="shrink-0 text-nike-volt" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-nike-volt" />
                  </button>
                ))}
              </div>

              {/* AI Suggestions */}
              <div>
                <p className="px-2 py-1 text-[10px] font-semibold text-nike-text-tertiary uppercase tracking-wider">AI Suggestions</p>
                {aiSuggestions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { onNavigate(item.module); onClose() }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-nike-text-secondary hover:bg-nike-surface-hover hover:text-white transition-colors cursor-pointer group"
                  >
                    <Sparkles size={14} className="shrink-0 text-nike-volt" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-nike-volt" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
