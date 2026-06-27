import { motion } from 'framer-motion'
import { Sparkles, AlertTriangle, CheckCircle2, Clock, ArrowRight, Shield, ChevronRight } from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import { seasons, approvals, activities, milestones, risks } from '../../data/mockData'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 30 } }
}

export default function HomeModule() {
  return (
    <motion.div
      className="h-full overflow-y-auto p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* AI Briefing */}
      <motion.div variants={itemVariants} className="ai-processing rounded-xl p-4 border border-nike-volt/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-nike-volt/20 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-nike-volt" />
          </div>
          <div>
            <p className="text-xs font-semibold text-nike-volt mb-1">AI Morning Briefing</p>
            <p className="text-sm text-nike-text-secondary leading-relaxed">
              Good morning, Sarah. <span className="text-white font-medium">3 items need your attention.</span> SP26 Women's Running is on track with 82% readiness. FA25 margins are <span className="text-nike-warning font-medium">1.2% below target</span> — Lifestyle category is the primary driver. Pegasus 43 Pink has a <span className="text-nike-error font-medium">critical stockout risk</span> within 6 days.
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Revenue" value="$4.7B" change="+6.2%" changeLabel="vs plan" positive delay={0.1} />
        <StatCard label="Margin" value="45.1%" change="+0.8pp" changeLabel="vs plan" positive delay={0.15} />
        <StatCard label="Sell-Through" value="72.3%" change="+3.1pp" changeLabel="vs LY" positive delay={0.2} />
        <StatCard label="Inventory Turns" value="4.2x" change="+0.3x" changeLabel="vs LY" positive delay={0.25} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Season Health */}
        <motion.div variants={itemVariants} className="col-span-1 bg-nike-surface rounded-xl border border-nike-border p-4">
          <h3 className="text-xs font-semibold text-nike-text-tertiary uppercase tracking-wider mb-3">Season Health</h3>
          <div className="space-y-3">
            {seasons.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-nike-surface-hover transition-colors cursor-pointer">
                <div className={`w-2 h-2 rounded-full ${
                  s.status === 'on-track' ? 'bg-nike-success' : s.status === 'at-risk' ? 'bg-nike-warning' : 'bg-nike-error'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{s.code}</span>
                    <span className="text-xs text-nike-text-secondary">{s.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-nike-border rounded-full mt-1 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        s.status === 'on-track' ? 'bg-nike-success' : s.status === 'at-risk' ? 'bg-nike-warning' : 'bg-nike-error'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Approval Queue */}
        <motion.div variants={itemVariants} className="col-span-1 bg-nike-surface rounded-xl border border-nike-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-nike-text-tertiary uppercase tracking-wider">Approvals</h3>
            <span className="text-xs bg-nike-volt/20 text-nike-volt px-2 py-0.5 rounded-full font-medium">{approvals.length}</span>
          </div>
          <div className="space-y-2">
            {approvals.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-nike-surface-hover transition-colors cursor-pointer group">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  a.priority === 'critical' ? 'bg-nike-error' : a.priority === 'high' ? 'bg-nike-warning' : 'bg-nike-info'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{a.title}</p>
                  <p className="text-[10px] text-nike-text-tertiary">{a.requester} · {a.type} · Due {a.dueDate.slice(5)}</p>
                </div>
                <ChevronRight size={14} className="text-nike-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk Alerts */}
        <motion.div variants={itemVariants} className="col-span-1 bg-nike-surface rounded-xl border border-nike-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-nike-text-tertiary uppercase tracking-wider">Risk Alerts</h3>
            <span className="text-xs bg-nike-error/20 text-nike-error px-2 py-0.5 rounded-full font-medium">
              {risks.filter(r => r.severity === 'critical').length} critical
            </span>
          </div>
          <div className="space-y-2">
            {risks.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-nike-surface-hover transition-colors cursor-pointer">
                {r.severity === 'critical' ? (
                  <AlertTriangle size={14} className="text-nike-error shrink-0 mt-0.5" />
                ) : r.severity === 'warning' ? (
                  <Shield size={14} className="text-nike-warning shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 size={14} className="text-nike-info shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-nike-text-secondary leading-relaxed">{r.message}</p>
                  {r.assignee && <p className="text-[10px] text-nike-text-tertiary mt-0.5">→ {r.assignee}</p>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="bg-nike-surface rounded-xl border border-nike-border p-4">
          <h3 className="text-xs font-semibold text-nike-text-tertiary uppercase tracking-wider mb-3">Activity Timeline</h3>
          <div className="space-y-1">
            {activities.map((e) => (
              <div key={e.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-nike-surface-hover transition-colors cursor-pointer">
                <span className="text-[10px] text-nike-text-tertiary w-16 shrink-0 text-right mt-0.5">{e.timestamp}</span>
                <div className="flex-1">
                  <p className="text-xs text-nike-text-secondary">
                    <span className={`font-medium ${e.isAI ? 'text-nike-volt' : 'text-white'}`}>
                      {e.isAI && <Sparkles size={10} className="inline mr-1 text-nike-volt" />}
                      {e.actor}
                    </span>{' '}
                    {e.action}{' '}
                    <span className="text-nike-text">{e.object}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div variants={itemVariants} className="bg-nike-surface rounded-xl border border-nike-border p-4">
          <h3 className="text-xs font-semibold text-nike-text-tertiary uppercase tracking-wider mb-3">Upcoming Milestones</h3>
          <div className="space-y-2">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-nike-surface-hover transition-colors cursor-pointer group">
                <div className={`w-2.5 h-2.5 rounded-full border-2 ${
                  m.status === 'completed' ? 'bg-nike-success border-nike-success' :
                  m.status === 'in-progress' ? 'bg-transparent border-nike-volt' :
                  m.status === 'overdue' ? 'bg-nike-error border-nike-error' :
                  'bg-transparent border-nike-border-light'
                }`} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{m.name}</p>
                  <p className="text-[10px] text-nike-text-tertiary">{m.season} · {m.date}</p>
                </div>
                <Clock size={12} className="text-nike-text-tertiary" />
                <ArrowRight size={14} className="text-nike-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
