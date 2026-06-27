import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts'
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import { forecastData, inventoryItems } from '../../data/mockData'

const statusColors = {
  ok: { bg: 'bg-nike-success/20', text: 'text-nike-success', icon: CheckCircle2 },
  low: { bg: 'bg-nike-warning/20', text: 'text-nike-warning', icon: AlertTriangle },
  critical: { bg: 'bg-nike-error/20', text: 'text-nike-error', icon: AlertTriangle },
}

export default function ForecastModule() {
  return (
    <motion.div
      className="h-full overflow-y-auto p-6 space-y-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Demand & Inventory</h2>
          <p className="text-xs text-nike-text-tertiary">SP26 Running · Pegasus 43</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-nike-surface rounded-lg px-3 py-1.5">
            <span className="text-[10px] text-nike-text-tertiary">Accuracy</span>
            <span className="text-sm font-bold text-nike-success">94.2%</span>
          </div>
          <div className="flex items-center gap-2 bg-nike-surface rounded-lg px-3 py-1.5">
            <span className="text-[10px] text-nike-text-tertiary">Bias</span>
            <span className="text-sm font-bold text-nike-info">+1.8%</span>
          </div>
          <div className="flex items-center gap-2 bg-nike-surface rounded-lg px-3 py-1.5">
            <span className="text-[10px] text-nike-text-tertiary">MAPE</span>
            <span className="text-sm font-bold">5.8%</span>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-5"
      >
        <h3 className="text-sm font-semibold mb-4">Forecast vs Actual</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CDFF00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#CDFF00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CDFF00" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#CDFF00" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#666' }} axisLine={{ stroke: '#333' }} />
              <YAxis tick={{ fontSize: 10, fill: '#666' }} axisLine={{ stroke: '#333' }} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ color: '#999' }}
                formatter={(value) => [`${(Number(value) / 1000).toFixed(0)}K units`, '']}
              />
              <Area type="monotone" dataKey="upper" stackId="band" stroke="none" fill="url(#bandGrad)" />
              <Area type="monotone" dataKey="lower" stackId="band" stroke="none" fill="transparent" />
              <Line type="monotone" dataKey="forecast" stroke="#CDFF00" strokeWidth={2} strokeDasharray="8 4" dot={false} />
              <Line type="monotone" dataKey="actual" stroke="#FFFFFF" strokeWidth={2.5} dot={{ fill: '#FFFFFF', r: 4 }} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-white rounded" />
            <span className="text-[10px] text-nike-text-secondary">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-nike-volt rounded border-dashed" style={{ borderTop: '2px dashed #CDFF00', height: 0 }} />
            <span className="text-[10px] text-nike-text-secondary">AI Forecast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 bg-nike-volt/10 rounded" />
            <span className="text-[10px] text-nike-text-secondary">Confidence band</span>
          </div>
        </div>
      </motion.div>

      {/* Inventory Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-5"
      >
        <h3 className="text-sm font-semibold mb-4">Inventory Health</h3>
        <table className="w-full">
          <thead>
            <tr className="text-[10px] text-nike-text-tertiary uppercase tracking-wider border-b border-nike-border">
              <th className="text-left py-2 px-3">Style</th>
              <th className="text-left py-2 px-3">Colorway</th>
              <th className="text-right py-2 px-3">On Hand</th>
              <th className="text-right py-2 px-3">In Transit</th>
              <th className="text-right py-2 px-3">WOS</th>
              <th className="text-center py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, i) => {
              const status = statusColors[item.status]
              const StatusIcon = status.icon
              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className="border-b border-nike-border/50 hover:bg-nike-surface-hover/50 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3 text-xs font-medium">{item.style}</td>
                  <td className="py-2.5 px-3 text-xs text-nike-text-secondary">{item.colorway}</td>
                  <td className="py-2.5 px-3 text-xs text-right">{(item.onHand / 1000).toFixed(0)}K</td>
                  <td className="py-2.5 px-3 text-xs text-right text-nike-text-secondary">{(item.inTransit / 1000).toFixed(0)}K</td>
                  <td className="py-2.5 px-3 text-xs text-right font-medium">{item.wos}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 ${status.bg} ${status.text} text-[9px] font-bold px-2 py-0.5 rounded-full`}>
                      <StatusIcon size={10} />
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>

        {/* AI Alert */}
        <div className="mt-4 p-3 bg-nike-error/5 border border-nike-error/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-nike-volt shrink-0 mt-0.5" />
            <p className="text-xs text-nike-text-secondary">
              <span className="text-nike-error font-medium">Stockout Alert:</span> Pegasus 43 Pink will stockout in <span className="text-white font-medium">6 days</span>. Recommend expediting 20K units from Factory 7. Lead time: 12 days.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Supply Signals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-5"
      >
        <h3 className="text-sm font-semibold mb-3">Supply Signals</h3>
        <div className="space-y-2">
          {[
            { icon: AlertTriangle, color: 'text-nike-warning', message: 'Factory 3 — Delayed 2 weeks (raw material shortage)' },
            { icon: CheckCircle2, color: 'text-nike-success', message: 'Port Shanghai — Normal transit times (18-22 days)' },
            { icon: TrendingUp, color: 'text-nike-info', message: 'Duty rate change alert: Vietnam +2% effective Aug 1' },
          ].map((signal, i) => {
            const Icon = signal.icon
            return (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-nike-surface-hover transition-colors">
                <Icon size={14} className={signal.color} />
                <span className="text-xs text-nike-text-secondary">{signal.message}</span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
