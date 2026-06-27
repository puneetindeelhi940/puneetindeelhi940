import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Grid3X3, List, Plus, ChevronRight } from 'lucide-react'
import { products } from '../../data/mockData'

const statusColors = {
  ready: { bg: 'bg-nike-success/20', text: 'text-nike-success', label: 'Ready' },
  wip: { bg: 'bg-nike-warning/20', text: 'text-nike-warning', label: 'WIP' },
  brief: { bg: 'bg-nike-info/20', text: 'text-nike-info', label: 'Brief' },
  review: { bg: 'bg-nike-lifestyle/20', text: 'text-[#9B59B6]', label: 'Review' },
}

const shoeGradients = [
  'from-[#1a1a2e] to-[#16213e]',
  'from-[#0f3460] to-[#1a1a2e]',
  'from-[#2d1b69] to-[#1a1a2e]',
  'from-[#1b2d1b] to-[#1a1a2e]',
  'from-[#2d1b1b] to-[#1a1a2e]',
  'from-[#1b2d2d] to-[#1a1a2e]',
]

export default function CreateModule() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [filterSport, setFilterSport] = useState('All')

  const filteredProducts = filterSport === 'All' ? products : products.filter(p => p.sport === filterSport)
  const sports = ['All', ...new Set(products.map(p => p.sport))]
  const selected = products.find(p => p.id === selectedProduct)

  return (
    <motion.div
      className="h-full flex"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-nike-border shrink-0">
          <div>
            <h2 className="text-lg font-bold">Product Explorer</h2>
            <p className="text-xs text-nike-text-tertiary">{filteredProducts.length} styles · SP26</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-nike-surface rounded-lg px-3 py-1.5">
              <Search size={14} className="text-nike-text-tertiary" />
              <input
                type="text"
                placeholder="Search styles..."
                className="bg-transparent text-sm text-white placeholder-nike-text-tertiary outline-none w-40"
              />
            </div>
            <div className="flex items-center bg-nike-surface rounded-lg p-0.5">
              {sports.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterSport(s)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors cursor-pointer ${
                    filterSport === s ? 'bg-nike-volt text-nike-black' : 'text-nike-text-secondary hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center bg-nike-surface rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md cursor-pointer ${viewMode === 'grid' ? 'bg-nike-volt/20 text-nike-volt' : 'text-nike-text-tertiary'}`}>
                <Grid3X3 size={14} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md cursor-pointer ${viewMode === 'list' ? 'bg-nike-volt/20 text-nike-volt' : 'text-nike-text-tertiary'}`}>
                <List size={14} />
              </button>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-nike-volt text-nike-black rounded-lg text-xs font-bold hover:bg-nike-volt-dim transition-colors cursor-pointer">
              <Plus size={14} />
              New Style
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 py-2 border-b border-nike-border/50 flex items-center gap-4 shrink-0">
          <span className="text-xs text-nike-text-secondary">{filteredProducts.filter(p => p.status === 'ready').length}/{filteredProducts.length} complete</span>
          <div className="flex-1 h-1.5 bg-nike-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-nike-volt rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(filteredProducts.filter(p => p.status === 'ready').length / filteredProducts.length) * 100}%` }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-4 gap-4"
              >
                {filteredProducts.map((p, i) => {
                  const status = statusColors[p.status]
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 30 }}
                      onClick={() => setSelectedProduct(p.id)}
                      className={`rounded-xl border overflow-hidden cursor-pointer group transition-all ${
                        selectedProduct === p.id ? 'border-nike-volt ring-1 ring-nike-volt/30' : 'border-nike-border hover:border-nike-border-light'
                      }`}
                    >
                      <div className={`h-32 bg-gradient-to-br ${shoeGradients[i % shoeGradients.length]} flex items-center justify-center relative overflow-hidden`}>
                        <div className="text-3xl font-black text-white/5 absolute -right-2 -bottom-2 leading-none">{p.styleNumber}</div>
                        <div className="text-4xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-300">👟</div>
                      </div>
                      <div className="p-3 bg-nike-surface">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold truncate">{p.name}</p>
                          <span className={`${status.bg} ${status.text} text-[9px] font-bold px-1.5 py-0.5 rounded-full`}>{status.label}</span>
                        </div>
                        <p className="text-[10px] text-nike-text-tertiary">{p.styleNumber} · {p.colorways} colors</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-white">${p.price}</span>
                          <span className="text-[10px] text-nike-text-secondary">{p.margin}% margin</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                {/* Add new card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: filteredProducts.length * 0.04 }}
                  className="rounded-xl border border-dashed border-nike-border hover:border-nike-volt/50 flex items-center justify-center min-h-[200px] cursor-pointer transition-colors group"
                >
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-nike-text-tertiary group-hover:text-nike-volt transition-colors" />
                    <p className="text-xs text-nike-text-tertiary mt-1 group-hover:text-nike-volt transition-colors">New Style</p>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] text-nike-text-tertiary uppercase tracking-wider border-b border-nike-border">
                      <th className="text-left py-2 px-3">Style</th>
                      <th className="text-left py-2 px-3">Sport</th>
                      <th className="text-left py-2 px-3">Gender</th>
                      <th className="text-right py-2 px-3">Price</th>
                      <th className="text-right py-2 px-3">Margin</th>
                      <th className="text-right py-2 px-3">Colors</th>
                      <th className="text-center py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p, i) => {
                      const status = statusColors[p.status]
                      return (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => setSelectedProduct(p.id)}
                          className="border-b border-nike-border/50 hover:bg-nike-surface/50 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 px-3">
                            <div>
                              <p className="text-xs font-medium">{p.name}</p>
                              <p className="text-[10px] text-nike-text-tertiary">{p.styleNumber}</p>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-xs text-nike-text-secondary">{p.sport}</td>
                          <td className="py-2.5 px-3 text-xs text-nike-text-secondary">{p.gender}</td>
                          <td className="py-2.5 px-3 text-xs font-medium text-right">${p.price}</td>
                          <td className="py-2.5 px-3 text-xs text-right">{p.margin}%</td>
                          <td className="py-2.5 px-3 text-xs text-right text-nike-text-secondary">{p.colorways}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`${status.bg} ${status.text} text-[9px] font-bold px-1.5 py-0.5 rounded-full`}>{status.label}</span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="h-full border-l border-nike-border bg-nike-black overflow-y-auto shrink-0"
          >
            <div className={`h-48 bg-gradient-to-br ${shoeGradients[0]} flex items-center justify-center relative`}>
              <div className="text-6xl opacity-40">👟</div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 p-1 bg-black/50 rounded text-white hover:bg-black/80 transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-lg font-bold">{selected.name}</h3>
                <p className="text-xs text-nike-text-tertiary">{selected.styleNumber} · {selected.season}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-nike-surface rounded-lg p-3">
                  <p className="text-[10px] text-nike-text-tertiary">Price</p>
                  <p className="text-lg font-bold">${selected.price}</p>
                </div>
                <div className="bg-nike-surface rounded-lg p-3">
                  <p className="text-[10px] text-nike-text-tertiary">Margin</p>
                  <p className="text-lg font-bold text-nike-success">{selected.margin}%</p>
                </div>
                <div className="bg-nike-surface rounded-lg p-3">
                  <p className="text-[10px] text-nike-text-tertiary">Colorways</p>
                  <p className="text-lg font-bold">{selected.colorways}</p>
                </div>
                <div className="bg-nike-surface rounded-lg p-3">
                  <p className="text-[10px] text-nike-text-tertiary">Sport</p>
                  <p className="text-sm font-medium mt-0.5">{selected.sport}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-nike-text-tertiary uppercase tracking-wider mb-2">Colorways</p>
                <div className="flex gap-2">
                  {Array.from({ length: selected.colorways }).map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-lg border border-nike-border cursor-pointer hover:border-nike-volt transition-colors"
                      style={{ backgroundColor: ['#111', '#fff', '#CDFF00', '#00B4FF', '#FF3366', '#2ECC71', '#FFB800', '#9B59B6'][i] || '#333' }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {['Materials & BOM', 'SKU Matrix', 'Costing', 'Samples', 'History'].map((tab) => (
                  <button key={tab} className="w-full flex items-center justify-between px-3 py-2 bg-nike-surface rounded-lg text-xs font-medium hover:bg-nike-surface-hover transition-colors cursor-pointer group">
                    {tab}
                    <ChevronRight size={14} className="text-nike-text-tertiary group-hover:text-nike-volt transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
