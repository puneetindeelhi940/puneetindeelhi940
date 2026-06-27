import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { type ReactNode } from 'react'

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  positive?: boolean;
  icon?: ReactNode;
  delay?: number;
}

export default function StatCard({ label, value, change, changeLabel, positive = true, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-nike-surface rounded-xl p-4 border border-nike-border hover:border-nike-border-light transition-colors group"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] text-nike-text-tertiary uppercase tracking-wider font-medium">{label}</p>
        {icon && <div className="text-nike-text-tertiary group-hover:text-nike-volt transition-colors">{icon}</div>}
      </div>
      <motion.p
        className="text-2xl font-bold text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.15, type: 'spring', stiffness: 300 }}
      >
        {value}
      </motion.p>
      <div className="flex items-center gap-1 mt-1">
        {positive ? (
          <TrendingUp size={12} className="text-nike-success" />
        ) : (
          <TrendingDown size={12} className="text-nike-error" />
        )}
        <span className={`text-xs font-medium ${positive ? 'text-nike-success' : 'text-nike-error'}`}>
          {change}
        </span>
        <span className="text-[11px] text-nike-text-tertiary ml-1">{changeLabel}</span>
      </div>
    </motion.div>
  )
}
