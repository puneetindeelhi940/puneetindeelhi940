import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const competitors = [
  { name: 'Adidas Ultra', price: 190, perf: 72, isNike: false },
  { name: 'NB FuelCell', price: 165, perf: 68, isNike: false },
  { name: 'Puma Velocity', price: 120, perf: 55, isNike: false },
  { name: 'Asics Nimbus', price: 160, perf: 70, isNike: false },
  { name: 'On Cloud', price: 150, perf: 65, isNike: false },
  { name: 'Hoka Clifton', price: 145, perf: 67, isNike: false },
]

const nikeProducts = [
  { name: 'Alphafly 4', price: 300, perf: 95 },
  { name: 'Vomero 20', price: 180, perf: 78 },
  { name: 'Pegasus 43', price: 130, perf: 72 },
  { name: 'Downshifter', price: 75, perf: 42 },
]

export default function PriceModule() {
  const [selectedPrice, setSelectedPrice] = useState(130)
  const margin = 35 + (selectedPrice - 75) * 0.08
  const volume = Math.round(200000 - (selectedPrice - 75) * 1200)
  const revenue = Math.round(selectedPrice * volume / 1000000 * 10) / 10

  return (
    <motion.div
      className="h-full overflow-y-auto p-6 space-y-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Pricing & Margin</h2>
          <p className="text-xs text-nike-text-tertiary">SP26 Running · Competitive Positioning</p>
        </div>
        <button className="px-3 py-1.5 bg-nike-volt text-nike-black rounded-lg text-xs font-bold hover:bg-nike-volt-dim transition-colors cursor-pointer">Lock Pricing</button>
      </div>

      {/* Price Positioning Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-5"
      >
        <h3 className="text-sm font-semibold mb-4">Price Positioning Map</h3>
        <div className="relative h-[300px] border border-nike-border/50 rounded-lg overflow-hidden bg-nike-dark/50">
          {/* Grid lines */}
          {[75, 150, 225, 300].map((price) => (
            <div key={price} className="absolute left-12 right-4 border-t border-nike-border/30" style={{ bottom: `${((price - 50) / 300) * 100}%` }}>
              <span className="absolute -left-12 -top-2 text-[9px] text-nike-text-tertiary w-10 text-right">${price}</span>
            </div>
          ))}

          {/* Competitors */}
          {competitors.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08, type: 'spring' }}
              className="absolute group"
              style={{
                left: `${12 + (c.perf / 100) * 80}%`,
                bottom: `${((c.price - 50) / 300) * 100}%`,
              }}
            >
              <div className="w-3 h-3 bg-nike-text-tertiary rounded-full -translate-x-1/2 translate-y-1/2 hover:scale-150 transition-transform cursor-pointer" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-nike-surface px-2 py-1 rounded text-[9px] text-white shadow-lg border border-nike-border z-10">
                {c.name} · ${c.price}
              </div>
            </motion.div>
          ))}

          {/* Nike products */}
          {nikeProducts.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
              className="absolute group"
              style={{
                left: `${12 + (p.perf / 100) * 80}%`,
                bottom: `${((p.price - 50) / 300) * 100}%`,
              }}
            >
              <div className="w-4 h-4 bg-nike-volt rounded-full -translate-x-1/2 translate-y-1/2 hover:scale-150 transition-transform cursor-pointer ring-2 ring-nike-volt/30" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-nike-volt text-nike-black px-2 py-1 rounded text-[9px] font-bold shadow-lg z-10">
                {p.name} · ${p.price}
              </div>
            </motion.div>
          ))}

          {/* Axis labels */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-nike-text-tertiary">
            Low ← Performance Index → High
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-nike-volt rounded-full" />
            <span className="text-[10px] text-nike-text-secondary">Nike</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-nike-text-tertiary rounded-full" />
            <span className="text-[10px] text-nike-text-secondary">Competitor</span>
          </div>
        </div>
      </motion.div>

      {/* What-If Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-5"
      >
        <h3 className="text-sm font-semibold mb-4">What-If Simulator — Pegasus 43</h3>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-nike-text-secondary">MSRP</span>
            <span className="text-xl font-bold text-nike-volt">${selectedPrice}</span>
          </div>
          <input
            type="range"
            min={90}
            max={170}
            step={5}
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(Number(e.target.value))}
            className="w-full h-2 bg-nike-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-nike-volt [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-nike-text-tertiary">$90</span>
            <span className="text-[10px] text-nike-text-tertiary">$170</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-nike-dark rounded-lg p-3 text-center">
            <p className="text-[10px] text-nike-text-tertiary">Margin</p>
            <p className="text-lg font-bold text-nike-success">{margin.toFixed(1)}%</p>
          </div>
          <div className="bg-nike-dark rounded-lg p-3 text-center">
            <p className="text-[10px] text-nike-text-tertiary">Volume</p>
            <p className="text-lg font-bold">{(volume / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-nike-dark rounded-lg p-3 text-center">
            <p className="text-[10px] text-nike-text-tertiary">Revenue</p>
            <p className="text-lg font-bold">${revenue}M</p>
          </div>
          <div className="bg-nike-dark rounded-lg p-3 text-center">
            <p className="text-[10px] text-nike-text-tertiary">vs Asics</p>
            <p className="text-lg font-bold text-nike-info">${selectedPrice - 160}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-nike-volt/5 border border-nike-volt/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-nike-volt shrink-0 mt-0.5" />
            <p className="text-xs text-nike-text-secondary">
              <span className="text-nike-volt font-medium">AI Insight:</span> Historical elasticity suggests <span className="text-white font-medium">$135</span> is the optimal price for margin × volume in North America. Current setting: ${selectedPrice}.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Markdown Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-5"
      >
        <h3 className="text-sm font-semibold mb-4">Markdown Calendar</h3>
        <div className="grid grid-cols-6 gap-2">
          {['W1-4', 'W5-8', 'W9-12', 'W13-16', 'W17-20', 'W21-24'].map((period, i) => (
            <div key={period} className="text-center">
              <p className="text-[9px] text-nike-text-tertiary mb-2">{period}</p>
              <motion.div
                className={`h-20 rounded-lg flex items-end justify-center pb-2 ${
                  i < 3 ? 'bg-nike-success/20 border border-nike-success/30' :
                  i < 5 ? 'bg-nike-warning/20 border border-nike-warning/30' :
                  'bg-nike-error/20 border border-nike-error/30'
                }`}
                initial={{ height: 0 }}
                animate={{ height: 80 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="text-xs font-bold">
                  {i < 3 ? 'Full' : i < 5 ? `-${(i - 2) * 15}%` : `-${(i - 2) * 15}%`}
                </span>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
