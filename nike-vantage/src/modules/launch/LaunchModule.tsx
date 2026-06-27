import { motion } from 'framer-motion'
import { AlertTriangle, Clock, Rocket, MapPin } from 'lucide-react'
import ProgressRing from '../../components/shared/ProgressRing'
import { launches, regionStatuses } from '../../data/mockData'

const readinessColors = {
  ready: 'text-nike-success',
  partial: 'text-nike-warning',
  pending: 'text-nike-text-tertiary',
}

const readinessDots = {
  ready: '●',
  partial: '◐',
  pending: '○',
}

const blockers = [
  { severity: 'critical' as const, message: 'China VM graphics not approved', assignee: '@Wei L.', days: 3 },
  { severity: 'critical' as const, message: 'APAC inventory allocation pending', assignee: '@Supply Chain', days: 5 },
  { severity: 'warning' as const, message: 'India store fixtures delayed 5 days', assignee: '@Ops Team', days: 5 },
  { severity: 'warning' as const, message: 'Korea digital assets in review', assignee: '@Creative', days: 2 },
]

export default function LaunchModule() {
  const primaryLaunch = launches[0]

  return (
    <motion.div
      className="h-full overflow-y-auto p-6 space-y-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Launch Readiness</h2>
          <p className="text-xs text-nike-text-tertiary">{launches.length} active launches</p>
        </div>
        <button className="px-3 py-1.5 bg-nike-volt text-nike-black rounded-lg text-xs font-bold hover:bg-nike-volt-dim transition-colors cursor-pointer">
          <Rocket size={12} className="inline mr-1" />
          New Launch
        </button>
      </div>

      {/* Primary Launch Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-6"
      >
        <div className="flex items-start gap-8">
          <div className="text-center">
            <ProgressRing value={primaryLaunch.readiness} size={140} label="READY" sublabel={`${18} days to launch`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-bold">{primaryLaunch.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                primaryLaunch.status === 'on-track' ? 'bg-nike-success/20 text-nike-success' :
                primaryLaunch.status === 'at-risk' ? 'bg-nike-warning/20 text-nike-warning' :
                'bg-nike-error/20 text-nike-error'
              }`}>
                {primaryLaunch.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-nike-text-secondary mb-4">
              <Clock size={12} />
              <span>Launch: {primaryLaunch.date}</span>
              <span className="mx-2">·</span>
              <MapPin size={12} />
              <span>{primaryLaunch.markets} markets</span>
              <span className="mx-2">·</span>
              <AlertTriangle size={12} className="text-nike-warning" />
              <span className="text-nike-warning">{primaryLaunch.blockers} blockers</span>
            </div>

            {/* Readiness dimensions */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Product', score: 100, status: 'on-track' },
                { label: 'Marketing', score: 85, status: 'on-track' },
                { label: 'Digital', score: 60, status: 'at-risk' },
                { label: 'Inventory', score: 55, status: 'at-risk' },
                { label: 'VM / Retail', score: 40, status: 'behind' },
                { label: 'Finance', score: 100, status: 'on-track' },
              ].map((dim) => (
                <div key={dim.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-nike-text-secondary">{dim.label}</span>
                    <span className="text-[10px] font-bold">{dim.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-nike-border rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        dim.score >= 80 ? 'bg-nike-success' : dim.score >= 50 ? 'bg-nike-warning' : 'bg-nike-error'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.score}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {/* Blockers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-nike-surface rounded-xl border border-nike-border p-5"
        >
          <h3 className="text-sm font-semibold mb-3">Blockers</h3>
          <div className="space-y-2">
            {blockers.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex items-start gap-2 p-2.5 rounded-lg border ${
                  b.severity === 'critical' ? 'bg-nike-error/5 border-nike-error/20' : 'bg-nike-warning/5 border-nike-warning/20'
                }`}
              >
                <AlertTriangle size={14} className={b.severity === 'critical' ? 'text-nike-error' : 'text-nike-warning'} />
                <div className="flex-1">
                  <p className="text-xs text-white">{b.message}</p>
                  <p className="text-[10px] text-nike-text-tertiary mt-0.5">{b.assignee} · {b.days} days overdue</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Market Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-nike-surface rounded-xl border border-nike-border p-5"
        >
          <h3 className="text-sm font-semibold mb-3">Market Status</h3>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-nike-text-tertiary uppercase tracking-wider border-b border-nike-border">
                <th className="text-left py-2">Market</th>
                <th className="text-center py-2">Ready</th>
                <th className="text-center py-2">Inv.</th>
                <th className="text-center py-2">VM</th>
                <th className="text-center py-2">Digital</th>
              </tr>
            </thead>
            <tbody>
              {regionStatuses.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 + i * 0.04 }}
                  className="border-b border-nike-border/30 hover:bg-nike-surface-hover/50 cursor-pointer"
                >
                  <td className="py-2 text-xs font-medium">{r.name}</td>
                  <td className="py-2 text-center">
                    <span className={`text-xs font-bold ${
                      r.readiness >= 80 ? 'text-nike-success' : r.readiness >= 60 ? 'text-nike-warning' : 'text-nike-error'
                    }`}>
                      {r.readiness}%
                    </span>
                  </td>
                  <td className={`py-2 text-center text-sm ${readinessColors[r.inventory]}`}>{readinessDots[r.inventory]}</td>
                  <td className={`py-2 text-center text-sm ${readinessColors[r.vm]}`}>{readinessDots[r.vm]}</td>
                  <td className={`py-2 text-center text-sm ${readinessColors[r.digital]}`}>{readinessDots[r.digital]}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* All Launches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-nike-surface rounded-xl border border-nike-border p-5"
      >
        <h3 className="text-sm font-semibold mb-3">All Launches</h3>
        <div className="grid grid-cols-5 gap-3">
          {launches.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className={`p-3 rounded-lg border cursor-pointer hover:scale-[1.02] transition-transform ${
                l.status === 'on-track' ? 'border-nike-success/30 bg-nike-success/5' :
                l.status === 'at-risk' ? 'border-nike-warning/30 bg-nike-warning/5' :
                'border-nike-error/30 bg-nike-error/5'
              }`}
            >
              <p className="text-xs font-semibold truncate">{l.name}</p>
              <p className="text-[10px] text-nike-text-tertiary mt-0.5">{l.date}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold">{l.readiness}%</span>
                {l.blockers > 0 && (
                  <span className="text-[9px] bg-nike-error/20 text-nike-error px-1.5 py-0.5 rounded-full">{l.blockers} blocks</span>
                )}
              </div>
              <div className="w-full h-1 bg-nike-border/50 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    l.readiness >= 80 ? 'bg-nike-success' : l.readiness >= 60 ? 'bg-nike-warning' : 'bg-nike-error'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${l.readiness}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
