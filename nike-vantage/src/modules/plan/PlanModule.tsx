import { useState } from 'react'
import { motion } from 'framer-motion'
import { seasons } from '../../data/mockData'

const categoryBudgets = [
  { name: 'Footwear', pct: 62, amount: 3100, color: '#CDFF00' },
  { name: 'Apparel', pct: 28, amount: 1400, color: '#00B4FF' },
  { name: 'Accessories', pct: 10, amount: 500, color: '#9B59B6' },
]

const scenarios = [
  { name: 'Base Case', revenue: 5000, margin: 45.2, risk: 'Low' },
  { name: 'Aggressive', revenue: 5400, margin: 44.1, risk: 'Medium' },
  { name: 'Conservative', revenue: 4600, margin: 46.5, risk: 'Low' },
]

export default function PlanModule() {
  const [activeScenario, setActiveScenario] = useState(0)
  const [revenueTarget, setRevenueTarget] = useState(5000)
  const season = seasons[0]

  return (
    <motion.div
      className="h-full overflow-y-auto p-6 space-y-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Strategic Planning</h2>
          <p className="text-xs text-nike-text-tertiary mt-0.5">Season: {season.name} ({season.code})</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-nike-surface border border-nike-border rounded-lg text-xs font-medium hover:bg-nike-surface-hover transition-colors cursor-pointer">Export</button>
          <button className="px-3 py-1.5 bg-nike-volt text-nike-black rounded-lg text-xs font-bold hover:bg-nike-volt-dim transition-colors cursor-pointer">Save Plan</button>
        </div>
      </div>

      {/* Revenue Slider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Revenue Target</h3>
          <span className="text-2xl font-bold text-nike-volt">${(revenueTarget / 1000).toFixed(1)}B</span>
        </div>
        <input
          type="range"
          min={3000}
          max={7000}
          step={100}
          value={revenueTarget}
          onChange={(e) => setRevenueTarget(Number(e.target.value))}
          className="w-full h-2 bg-nike-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-nike-volt [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-nike-text-tertiary">$3.0B</span>
          <span className="text-[10px] text-nike-text-tertiary">$7.0B</span>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-nike-text-secondary">Current: ${(season.revenue.current / 1000).toFixed(1)}B</span>
            <span className="text-xs text-nike-text-secondary">{Math.round((season.revenue.current / revenueTarget) * 100)}% achieved</span>
          </div>
          <div className="w-full h-3 bg-nike-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-nike-volt to-nike-volt-dim rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (season.revenue.current / revenueTarget) * 100)}%` }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {/* Category Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-nike-surface rounded-xl border border-nike-border p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Category Allocation</h3>
          <div className="space-y-4">
            {categoryBudgets.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium">{cat.name}</span>
                  <span className="text-xs text-nike-text-secondary">{cat.pct}% · ${(cat.amount / 1000).toFixed(1)}B</span>
                </div>
                <div className="w-full h-3 bg-nike-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.pct}%` }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-nike-text-tertiary mt-4 italic">Drag dividers to reallocate (interactive in full build)</p>
        </motion.div>

        {/* Margin Waterfall */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-nike-surface rounded-xl border border-nike-border p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Margin Waterfall</h3>
          <div className="space-y-3">
            {[
              { label: 'MSRP', value: 100, color: '#CDFF00' },
              { label: 'COGS', value: -38, color: '#FF4444' },
              { label: 'Freight', value: -6, color: '#FF4444' },
              { label: 'Duty', value: -4, color: '#FF4444' },
              { label: 'Discount', value: -7, color: '#FFB800' },
              { label: 'Net Margin', value: 45, color: '#00FF87' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-nike-text-secondary w-16 text-right">{item.label}</span>
                <div className="flex-1 h-5 bg-nike-border/30 rounded overflow-hidden">
                  <motion.div
                    className="h-full rounded"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(item.value)}%` }}
                    transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="text-xs font-medium w-10">{item.value > 0 ? '' : '-'}{Math.abs(item.value)}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-nike-border flex items-center justify-between">
            <span className="text-xs text-nike-text-secondary">Target: {season.margin.target}%</span>
            <span className={`text-xs font-bold ${season.margin.current >= season.margin.target ? 'text-nike-success' : 'text-nike-warning'}`}>
              Current: {season.margin.current}%
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-5"
      >
        <h3 className="text-sm font-semibold mb-4">Scenario Comparison</h3>
        <div className="grid grid-cols-3 gap-4">
          {scenarios.map((s, i) => (
            <motion.button
              key={s.name}
              onClick={() => setActiveScenario(i)}
              className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                activeScenario === i
                  ? 'border-nike-volt bg-nike-volt/5'
                  : 'border-nike-border hover:border-nike-border-light'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-xs font-semibold text-nike-text-secondary uppercase tracking-wider">{s.name}</p>
              <p className="text-xl font-bold text-white mt-2">${(s.revenue / 1000).toFixed(1)}B</p>
              <p className="text-xs text-nike-text-secondary mt-1">Margin: {s.margin}%</p>
              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium mt-2 ${
                s.risk === 'Low' ? 'bg-nike-success/20 text-nike-success' : 'bg-nike-warning/20 text-nike-warning'
              }`}>
                Risk: {s.risk}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
