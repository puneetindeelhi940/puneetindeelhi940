import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GripVertical, Plus, X, Sparkles, AlertTriangle, Filter } from 'lucide-react'
import { products, type Product } from '../../data/mockData'

interface AssortmentSlot {
  product: Product;
  tier: 'good' | 'better' | 'best';
}

export default function AssortModule() {
  const [pool, setPool] = useState<Product[]>(products.filter(p => !['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].includes(p.id)))
  const [assortment, setAssortment] = useState<AssortmentSlot[]>([
    { product: products[0], tier: 'good' },
    { product: products[3], tier: 'good' },
    { product: products[1], tier: 'better' },
    { product: products[2], tier: 'better' },
    { product: products[4], tier: 'best' },
    { product: products[5], tier: 'best' },
  ])
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null)
  const [hoveredTier, setHoveredTier] = useState<string | null>(null)

  const totalSKUs = assortment.reduce((sum, s) => sum + s.product.colorways, 0)
  const avgMargin = assortment.length > 0
    ? (assortment.reduce((sum, s) => sum + s.product.margin, 0) / assortment.length).toFixed(1)
    : '0'
  const totalBudget = assortment.reduce((sum, s) => sum + s.product.price * (s.product.forecast || 0), 0)

  const handleDrop = useCallback((tier: 'good' | 'better' | 'best') => {
    if (draggedProduct) {
      setAssortment(prev => [...prev, { product: draggedProduct, tier }])
      setPool(prev => prev.filter(p => p.id !== draggedProduct.id))
      setDraggedProduct(null)
      setHoveredTier(null)
    }
  }, [draggedProduct])

  const removeFromAssortment = useCallback((productId: string) => {
    const slot = assortment.find(s => s.product.id === productId)
    if (slot) {
      setAssortment(prev => prev.filter(s => s.product.id !== productId))
      setPool(prev => [...prev, slot.product])
    }
  }, [assortment])

  const tiers: { id: 'good' | 'better' | 'best'; label: string; range: string }[] = [
    { id: 'good', label: 'GOOD', range: '$75–$140' },
    { id: 'better', label: 'BETTER', range: '$140–$200' },
    { id: 'best', label: 'BEST', range: '$200+' },
  ]

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-nike-border shrink-0">
        <div>
          <h2 className="text-lg font-bold">Assortment Workspace</h2>
          <p className="text-xs text-nike-text-tertiary">SP26 Women's Running · North America</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-nike-surface border border-nike-border rounded-lg text-xs font-medium hover:bg-nike-surface-hover transition-colors cursor-pointer">
            <Filter size={12} className="inline mr-1" />
            Filters
          </button>
          <button className="px-3 py-1.5 bg-nike-surface border border-nike-border rounded-lg text-xs font-medium hover:bg-nike-surface-hover transition-colors cursor-pointer">Compare</button>
          <button className="px-3 py-1.5 bg-nike-volt text-nike-black rounded-lg text-xs font-bold hover:bg-nike-volt-dim transition-colors cursor-pointer">Save & Submit</button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Product Pool */}
        <div className="w-[260px] border-r border-nike-border flex flex-col shrink-0 bg-nike-black/50">
          <div className="p-3 border-b border-nike-border/50">
            <div className="flex items-center gap-2 bg-nike-surface rounded-lg px-3 py-1.5">
              <Filter size={12} className="text-nike-text-tertiary" />
              <input type="text" placeholder="Filter pool..." className="bg-transparent text-xs text-white placeholder-nike-text-tertiary outline-none flex-1" />
            </div>
            <p className="text-[10px] text-nike-text-tertiary mt-2">{pool.length} available · Drag to add</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {pool.map((p) => (
              <motion.div
                key={p.id}
                draggable
                onDragStart={() => setDraggedProduct(p)}
                onDragEnd={() => { setDraggedProduct(null); setHoveredTier(null) }}
                className="flex items-center gap-2 p-2 bg-nike-surface rounded-lg cursor-grab active:cursor-grabbing border border-nike-border hover:border-nike-border-light transition-colors group"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <GripVertical size={14} className="text-nike-text-tertiary shrink-0" />
                <div className="w-10 h-10 bg-gradient-to-br from-nike-surface-hover to-nike-border rounded-md flex items-center justify-center shrink-0">
                  <span className="text-lg opacity-40">👟</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{p.name}</p>
                  <p className="text-[10px] text-nike-text-tertiary">${p.price} · {p.margin}%</p>
                </div>
              </motion.div>
            ))}

            {/* AI suggestion */}
            <div className="p-2 bg-nike-volt/5 border border-nike-volt/20 rounded-lg mt-3">
              <div className="flex items-start gap-1.5">
                <Sparkles size={12} className="text-nike-volt shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-nike-volt font-medium">AI Recommendation</p>
                  <p className="text-[10px] text-nike-text-secondary mt-0.5">Consider adding Wildhorse 9 — high search demand in trail segment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assortment Board */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-4 min-h-full">
            {tiers.map((tier) => {
              const tierProducts = assortment.filter(s => s.tier === tier.id)
              const isHovered = hoveredTier === tier.id
              return (
                <div
                  key={tier.id}
                  onDragOver={(e) => { e.preventDefault(); setHoveredTier(tier.id) }}
                  onDragLeave={() => setHoveredTier(null)}
                  onDrop={() => handleDrop(tier.id)}
                  className={`rounded-xl border-2 border-dashed p-4 transition-colors min-h-[300px] ${
                    isHovered ? 'border-nike-volt/60 bg-nike-volt/5' : 'border-nike-border/50 bg-nike-surface/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-nike-text-secondary">{tier.label}</h3>
                      <p className="text-[10px] text-nike-text-tertiary">{tier.range}</p>
                    </div>
                    <span className="text-[10px] bg-nike-surface px-2 py-0.5 rounded-full text-nike-text-secondary">{tierProducts.length} styles</span>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {tierProducts.map((slot) => (
                        <motion.div
                          key={slot.product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                          className="flex items-center gap-2 p-2.5 bg-nike-surface rounded-lg border border-nike-border hover:border-nike-border-light transition-colors group"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-nike-surface-hover to-nike-border rounded-md flex items-center justify-center shrink-0">
                            <span className="text-xl opacity-40">👟</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{slot.product.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-nike-volt font-medium">${slot.product.price}</span>
                              <span className="text-[10px] text-nike-text-tertiary">{slot.product.margin}%</span>
                              <span className="text-[10px] text-nike-text-tertiary">{slot.product.colorways}c</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromAssortment(slot.product.id)}
                            className="p-1 opacity-0 group-hover:opacity-100 text-nike-text-tertiary hover:text-nike-error transition-all cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Drop zone indicator */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 48 }}
                        className="border-2 border-dashed border-nike-volt/40 rounded-lg flex items-center justify-center"
                      >
                        <Plus size={14} className="text-nike-volt" />
                      </motion.div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Constraints bar */}
      <div className="px-6 py-3 border-t border-nike-border bg-nike-black/80 backdrop-blur flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-nike-text-tertiary uppercase tracking-wider">SKUs</span>
          <span className="text-sm font-bold">{totalSKUs}/40</span>
          <div className="w-24 h-1.5 bg-nike-border rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${totalSKUs > 40 ? 'bg-nike-error' : 'bg-nike-volt'}`} style={{ width: `${Math.min(100, (totalSKUs / 40) * 100)}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-nike-text-tertiary uppercase tracking-wider">Styles</span>
          <span className="text-sm font-bold">{assortment.length}/15</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-nike-text-tertiary uppercase tracking-wider">Margin</span>
          <span className={`text-sm font-bold ${Number(avgMargin) >= 45 ? 'text-nike-success' : 'text-nike-warning'}`}>{avgMargin}%</span>
          <span className="text-[10px] text-nike-text-tertiary">Target: 45.0%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-nike-text-tertiary uppercase tracking-wider">Budget</span>
          <span className="text-sm font-bold">${(totalBudget / 1000000).toFixed(1)}M</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <AlertTriangle size={12} className="text-nike-warning" />
          <span className="text-[10px] text-nike-warning">No trail running in $140–160 range</span>
        </div>
      </div>
    </motion.div>
  )
}
