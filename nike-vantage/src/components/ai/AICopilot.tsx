import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, ChevronRight, X, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react'

interface AICopilotProps {
  isOpen: boolean;
  onToggle: () => void;
  context: string;
}

const suggestions = [
  {
    id: 1,
    type: 'gap' as const,
    icon: Lightbulb,
    title: 'Gap detected',
    message: 'No trail running option in $140–160 range. Consider adding Wildhorse 9 — high search demand in this segment.',
    action: 'Add to assortment',
  },
  {
    id: 2,
    type: 'margin' as const,
    icon: TrendingUp,
    title: 'Margin optimization',
    message: 'Swapping Infinity Run colorway BLU→GRN improves margin by 0.4% based on COGS difference.',
    action: 'Simulate swap',
  },
  {
    id: 3,
    type: 'risk' as const,
    icon: AlertTriangle,
    title: 'Stockout risk',
    message: 'Pegasus 43 Pink will stockout in 6 days. Recommend expediting 20K units from Factory 7.',
    action: 'Create expedite request',
  },
]

const chatHistory = [
  {
    role: 'user' as const,
    message: 'How did trail running perform in APAC last season?',
  },
  {
    role: 'ai' as const,
    message: `Trail running in APAC (FA25):
• Revenue: $42M (+18% YoY)
• Top markets: AU, JP, KR
• Sell-through: 78%
• Wildhorse 8 was the hero

Recommendation: Strong case for trail in SP26 APAC assortment.`,
  },
]

export default function AICopilot({ isOpen, onToggle, context }: AICopilotProps) {
  const [input, setInput] = useState('')
  const [showChat, setShowChat] = useState(false)

  return (
    <>
      {/* Toggle button when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={onToggle}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-nike-surface border border-nike-border rounded-l-lg p-3 hover:bg-nike-surface-hover transition-colors cursor-pointer group"
          >
            <Sparkles size={18} className="text-nike-volt group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="h-full bg-nike-black border-l border-nike-border flex flex-col overflow-hidden shrink-0 z-40"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-nike-border shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-nike-volt/20 flex items-center justify-center">
                  <Sparkles size={14} className="text-nike-volt" />
                </div>
                <span className="text-sm font-semibold">Vantage AI</span>
              </div>
              <button onClick={onToggle} className="p-1 text-nike-text-tertiary hover:text-white transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Context */}
            <div className="px-4 py-2 border-b border-nike-border/50 shrink-0">
              <p className="text-[10px] text-nike-text-tertiary uppercase tracking-wider">Context</p>
              <p className="text-xs text-nike-text-secondary mt-0.5">{context}</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Toggle between suggestions and chat */}
              <div className="flex border-b border-nike-border/50 shrink-0">
                <button
                  onClick={() => setShowChat(false)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors cursor-pointer ${!showChat ? 'text-nike-volt border-b-2 border-nike-volt' : 'text-nike-text-tertiary'}`}
                >
                  Suggestions
                </button>
                <button
                  onClick={() => setShowChat(true)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors cursor-pointer ${showChat ? 'text-nike-volt border-b-2 border-nike-volt' : 'text-nike-text-tertiary'}`}
                >
                  Ask Vantage
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!showChat ? (
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 space-y-3"
                  >
                    {suggestions.map((s, i) => {
                      const Icon = s.icon
                      return (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1, type: 'spring', stiffness: 400, damping: 30 }}
                          className={`p-3 rounded-lg border cursor-pointer group transition-colors ${
                            s.type === 'risk'
                              ? 'bg-nike-error/5 border-nike-error/20 hover:border-nike-error/40'
                              : s.type === 'margin'
                              ? 'bg-nike-success/5 border-nike-success/20 hover:border-nike-success/40'
                              : 'bg-nike-volt/5 border-nike-volt/20 hover:border-nike-volt/40'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Icon size={14} className={`mt-0.5 shrink-0 ${
                              s.type === 'risk' ? 'text-nike-error' : s.type === 'margin' ? 'text-nike-success' : 'text-nike-volt'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white">{s.title}</p>
                              <p className="text-[11px] text-nike-text-secondary mt-1 leading-relaxed">{s.message}</p>
                              <button className="flex items-center gap-1 mt-2 text-[11px] font-medium text-nike-volt hover:underline cursor-pointer">
                                {s.action}
                                <ChevronRight size={12} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 space-y-3"
                  >
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] px-3 py-2 rounded-lg text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-nike-volt/20 text-white'
                            : 'bg-nike-surface text-nike-text-secondary'
                        }`}>
                          {msg.role === 'ai' && (
                            <div className="flex items-center gap-1 mb-1">
                              <Sparkles size={10} className="text-nike-volt" />
                              <span className="text-[10px] font-semibold text-nike-volt">Vantage AI</span>
                            </div>
                          )}
                          <p className="whitespace-pre-line">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-nike-border shrink-0">
              <div className="flex items-center gap-2 bg-nike-surface rounded-lg px-3 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-nike-text-tertiary outline-none"
                />
                <button className="p-1 text-nike-volt hover:scale-110 transition-transform cursor-pointer">
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[9px] text-nike-text-tertiary mt-1.5 text-center">AI may produce inaccurate information</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
