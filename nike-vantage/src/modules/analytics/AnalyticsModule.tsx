import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Sparkles, TrendingUp, TrendingDown, Globe } from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import { categoryPerformance } from '../../data/mockData'

const pieData = [
  { name: 'Running', value: 38, color: '#FF6B35' },
  { name: 'Basketball', value: 25, color: '#FF3366' },
  { name: 'Lifestyle', value: 21, color: '#9B59B6' },
  { name: 'Football', value: 11, color: '#2ECC71' },
  { name: 'Training', value: 5, color: '#3498DB' },
]

const monthlyTrend = [
  { month: 'Jan', revenue: 380, margin: 44.2 },
  { month: 'Feb', revenue: 420, margin: 44.8 },
  { month: 'Mar', revenue: 510, margin: 45.1 },
  { month: 'Apr', revenue: 480, margin: 44.5 },
  { month: 'May', revenue: 550, margin: 45.3 },
  { month: 'Jun', revenue: 620, margin: 45.8 },
]

const aiInsights = [
  { type: 'positive' as const, message: 'Running category outperformance is driven primarily by Pegasus 43 — up 22% vs forecast. Consider increasing allocation for FA26.' },
  { type: 'warning' as const, message: 'Lifestyle underperformance correlates with competitor launches in $100–130 range. Recommend pricing review.' },
  { type: 'positive' as const, message: 'Forecast accuracy improved to 94.2% this quarter — best in 3 years. ML model v4.2 contributing +2.1pp improvement.' },
  { type: 'info' as const, message: 'APAC sell-through trending 4.5% above global average. Japan and Korea leading with 78% and 76% respectively.' },
]

const regionalData = [
  { name: 'N. America', revenue: 1900, growth: 6 },
  { name: 'EMEA', revenue: 1200, growth: 3 },
  { name: 'Gr. China', revenue: 800, growth: -4 },
  { name: 'APAC', revenue: 500, growth: 11 },
  { name: 'India', revenue: 300, growth: 18 },
]

export default function AnalyticsModule() {
  return (
    <motion.div
      className="h-full overflow-y-auto p-6 space-y-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Analytics & Insights</h2>
          <p className="text-xs text-nike-text-tertiary">Executive Dashboard · SP26 · As of Jun 27, 2026</p>
        </div>
        <button className="px-3 py-1.5 bg-nike-surface border border-nike-border rounded-lg text-xs font-medium hover:bg-nike-surface-hover transition-colors cursor-pointer">Export Report</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Revenue" value="$4.7B" change="+6.2%" changeLabel="vs plan" positive delay={0.05} />
        <StatCard label="Margin" value="45.1%" change="+0.8pp" changeLabel="vs plan" positive delay={0.1} />
        <StatCard label="Sell-Through" value="72.3%" change="+3.1pp" changeLabel="vs LY" positive delay={0.15} />
        <StatCard label="Inventory Turns" value="4.2x" change="+0.3x" changeLabel="vs LY" positive delay={0.2} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-2 bg-nike-surface rounded-xl border border-nike-border p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Revenue Trend (Monthly)</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#666' }} axisLine={{ stroke: '#333' }} />
                <YAxis tick={{ fontSize: 10, fill: '#666' }} axisLine={{ stroke: '#333' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(value) => [`$${value}M`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#CDFF00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Mix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-nike-surface rounded-xl border border-nike-border p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Category Mix</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] text-nike-text-secondary flex-1">{d.name}</span>
                <span className="text-[10px] font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-nike-surface rounded-xl border border-nike-border p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Category Performance</h3>
          <div className="space-y-3">
            {categoryPerformance.map((cat, i) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">${(cat.revenue / 1000).toFixed(1)}B</span>
                    <span className={`flex items-center gap-0.5 text-[10px] font-medium ${cat.growth >= 0 ? 'text-nike-success' : 'text-nike-error'}`}>
                      {cat.growth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {cat.growth > 0 ? '+' : ''}{cat.growth}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-nike-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.revenue / 2000) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Regional Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-nike-surface rounded-xl border border-nike-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe size={14} className="text-nike-text-tertiary" />
            <h3 className="text-sm font-semibold">Regional Performance</h3>
          </div>
          <div className="space-y-3">
            {regionalData.map((reg, i) => (
              <div key={reg.name} className="flex items-center gap-3">
                <span className="text-xs text-nike-text-secondary w-20">{reg.name}</span>
                <div className="flex-1 h-5 bg-nike-border/30 rounded overflow-hidden">
                  <motion.div
                    className={`h-full rounded ${reg.growth >= 0 ? 'bg-nike-volt/60' : 'bg-nike-error/40'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(reg.revenue / 2000) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                  />
                </div>
                <span className="text-xs font-bold w-14 text-right">${(reg.revenue / 1000).toFixed(1)}B</span>
                <span className={`text-[10px] font-medium w-10 text-right ${reg.growth >= 0 ? 'text-nike-success' : 'text-nike-error'}`}>
                  {reg.growth > 0 ? '+' : ''}{reg.growth}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-nike-volt" />
          <h3 className="text-sm font-semibold">AI Insights</h3>
        </div>
        <div className="space-y-3">
          {aiInsights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className={`p-3 rounded-lg border ${
                insight.type === 'positive' ? 'bg-nike-success/5 border-nike-success/20' :
                insight.type === 'warning' ? 'bg-nike-warning/5 border-nike-warning/20' :
                'bg-nike-info/5 border-nike-info/20'
              }`}
            >
              <p className="text-xs text-nike-text-secondary leading-relaxed">{insight.message}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
