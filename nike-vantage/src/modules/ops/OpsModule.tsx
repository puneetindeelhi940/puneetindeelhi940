import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle2, AlertCircle, ArrowRight, User } from 'lucide-react'
import { workflows } from '../../data/mockData'

const stages = [
  { id: 'queue', label: 'Queue', color: 'border-nike-text-tertiary' },
  { id: 'in-progress', label: 'In Progress', color: 'border-nike-info' },
  { id: 'review', label: 'Review', color: 'border-nike-warning' },
  { id: 'approved', label: 'Approved', color: 'border-nike-success' },
  { id: 'done', label: 'Done', color: 'border-nike-success' },
]

const priorityColors = {
  high: 'bg-nike-error/20 text-nike-error',
  medium: 'bg-nike-warning/20 text-nike-warning',
  low: 'bg-nike-info/20 text-nike-info',
}

export default function OpsModule() {
  const totalWorkflows = 847
  const onTrack = 789
  const atRisk = 58
  const avgApproval = 2.1
  const overdue = 12

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
          <h2 className="text-lg font-bold">Operations</h2>
          <p className="text-xs text-nike-text-tertiary">Workflow Engine · Kanban View</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-nike-text-tertiary">Active:</span>
            <span className="text-sm font-bold">{totalWorkflows}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-nike-text-tertiary">On Track:</span>
            <span className="text-sm font-bold text-nike-success">{onTrack}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-nike-text-tertiary">At Risk:</span>
            <span className="text-sm font-bold text-nike-warning">{atRisk}</span>
          </div>
        </div>
      </div>

      {/* SLA Bar */}
      <div className="px-6 py-2 border-b border-nike-border/50 flex items-center gap-6 shrink-0 bg-nike-black/30">
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-nike-text-tertiary" />
          <span className="text-[10px] text-nike-text-secondary">Avg approval: <span className="font-bold text-white">{avgApproval} days</span> (target: 2.0)</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle size={12} className="text-nike-warning" />
          <span className="text-[10px] text-nike-text-secondary">Overdue: <span className="font-bold text-nike-warning">{overdue}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={12} className="text-nike-success" />
          <span className="text-[10px] text-nike-text-secondary">SLA compliance: <span className="font-bold text-nike-success">94.2%</span></span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 min-h-full" style={{ minWidth: stages.length * 240 }}>
          {stages.map((stage) => {
            const stageItems = workflows.filter(w => w.stage === stage.id)
            return (
              <div key={stage.id} className="w-[240px] shrink-0 flex flex-col">
                <div className={`flex items-center justify-between mb-3 pb-2 border-b-2 ${stage.color}`}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-nike-text-secondary">{stage.label}</span>
                  <span className="text-[10px] bg-nike-surface px-1.5 py-0.5 rounded-full text-nike-text-tertiary">{stageItems.length}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <AnimatePresence>
                    {stageItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 30 }}
                        className="bg-nike-surface rounded-lg p-3 border border-nike-border hover:border-nike-border-light transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${priorityColors[item.priority]}`}>
                            {item.priority.toUpperCase()}
                          </span>
                          <span className="text-[9px] text-nike-text-tertiary">{item.type}</span>
                        </div>
                        <p className="text-xs font-medium text-white mb-2 leading-snug">{item.title}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-nike-border rounded-full flex items-center justify-center">
                              <User size={8} className="text-nike-text-tertiary" />
                            </div>
                            <span className="text-[10px] text-nike-text-tertiary">{item.assignee}</span>
                          </div>
                          <span className="text-[10px] text-nike-text-tertiary">{item.dueDate}</span>
                        </div>
                        <ArrowRight size={12} className="text-nike-volt opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
