export interface Product {
  id: string;
  name: string;
  styleNumber: string;
  category: string;
  sport: string;
  gender: string;
  price: number;
  margin: number;
  colorways: number;
  status: 'ready' | 'wip' | 'brief' | 'review';
  season: string;
  image: string;
  tier: 'good' | 'better' | 'best';
  sellThrough?: number;
  forecast?: number;
}

export interface SeasonHealth {
  id: string;
  name: string;
  code: string;
  score: number;
  revenue: { target: number; current: number };
  margin: { target: number; current: number };
  skuCount: number;
  status: 'on-track' | 'at-risk' | 'behind';
}

export interface ApprovalItem {
  id: string;
  title: string;
  type: string;
  requester: string;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  module: string;
}

export interface ActivityEvent {
  id: string;
  actor: string;
  action: string;
  object: string;
  module: string;
  timestamp: string;
  isAI?: boolean;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  season: string;
  status: 'completed' | 'upcoming' | 'overdue' | 'in-progress';
}

export interface RiskAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  module: string;
  assignee: string;
}

export interface RegionStatus {
  id: string;
  name: string;
  readiness: number;
  inventory: 'ready' | 'partial' | 'pending';
  vm: 'ready' | 'partial' | 'pending';
  digital: 'ready' | 'partial' | 'pending';
}

export interface CategoryPerformance {
  name: string;
  revenue: number;
  target: number;
  growth: number;
  color: string;
}

export interface ForecastData {
  week: string;
  actual: number | null;
  forecast: number;
  lower: number;
  upper: number;
}

export interface InventoryItem {
  style: string;
  colorway: string;
  onHand: number;
  inTransit: number;
  wos: number;
  status: 'ok' | 'low' | 'critical';
}

export interface WorkflowItem {
  id: string;
  title: string;
  stage: 'queue' | 'in-progress' | 'review' | 'approved' | 'done';
  type: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface LaunchItem {
  id: string;
  name: string;
  date: string;
  readiness: number;
  markets: number;
  blockers: number;
  status: 'on-track' | 'at-risk' | 'blocked';
}

export const products: Product[] = [
  { id: 'p1', name: 'Pegasus 43', styleNumber: 'AX4521', category: 'Footwear', sport: 'Running', gender: 'Unisex', price: 130, margin: 46.2, colorways: 6, status: 'ready', season: 'SP26', image: '', tier: 'good', sellThrough: 78, forecast: 120000 },
  { id: 'p2', name: 'Vomero 20', styleNumber: 'BX2233', category: 'Footwear', sport: 'Running', gender: 'Unisex', price: 180, margin: 44.8, colorways: 4, status: 'wip', season: 'SP26', image: '', tier: 'better', sellThrough: 72, forecast: 85000 },
  { id: 'p3', name: 'Infinity Run 5', styleNumber: 'CX1190', category: 'Footwear', sport: 'Running', gender: "Women's", price: 160, margin: 45.1, colorways: 5, status: 'wip', season: 'SP26', image: '', tier: 'better', sellThrough: 68, forecast: 95000 },
  { id: 'p4', name: 'Structure 26', styleNumber: 'DX3344', category: 'Footwear', sport: 'Running', gender: 'Unisex', price: 140, margin: 47.3, colorways: 3, status: 'brief', season: 'SP26', image: '', tier: 'good', sellThrough: 65, forecast: 70000 },
  { id: 'p5', name: 'Alphafly 4', styleNumber: 'EX5567', category: 'Footwear', sport: 'Running', gender: 'Unisex', price: 300, margin: 52.1, colorways: 2, status: 'ready', season: 'SP26', image: '', tier: 'best', sellThrough: 88, forecast: 45000 },
  { id: 'p6', name: 'Vaporfly 4', styleNumber: 'FX6678', category: 'Footwear', sport: 'Running', gender: 'Unisex', price: 260, margin: 50.3, colorways: 3, status: 'review', season: 'SP26', image: '', tier: 'best', sellThrough: 82, forecast: 55000 },
  { id: 'p7', name: 'React Infinity', styleNumber: 'GX7789', category: 'Footwear', sport: 'Running', gender: "Women's", price: 160, margin: 44.5, colorways: 4, status: 'ready', season: 'SP26', image: '', tier: 'better', sellThrough: 70, forecast: 90000 },
  { id: 'p8', name: 'Downshifter 14', styleNumber: 'HX8890', category: 'Footwear', sport: 'Running', gender: 'Unisex', price: 75, margin: 52.0, colorways: 8, status: 'ready', season: 'SP26', image: '', tier: 'good', sellThrough: 85, forecast: 200000 },
  { id: 'p9', name: 'Wildhorse 9', styleNumber: 'IX9901', category: 'Footwear', sport: 'Trail', gender: 'Unisex', price: 150, margin: 45.8, colorways: 3, status: 'wip', season: 'SP26', image: '', tier: 'better', sellThrough: 62, forecast: 40000 },
  { id: 'p10', name: 'Air Zoom Tempo', styleNumber: 'JX1012', category: 'Footwear', sport: 'Running', gender: 'Unisex', price: 190, margin: 43.2, colorways: 3, status: 'ready', season: 'SP26', image: '', tier: 'better', sellThrough: 74, forecast: 65000 },
  { id: 'p11', name: 'Zoom Fly 6', styleNumber: 'KX1123', category: 'Footwear', sport: 'Running', gender: "Men's", price: 170, margin: 46.0, colorways: 4, status: 'review', season: 'SP26', image: '', tier: 'better', sellThrough: 71, forecast: 75000 },
  { id: 'p12', name: 'Free RN NN', styleNumber: 'LX1234', category: 'Footwear', sport: 'Running', gender: 'Unisex', price: 110, margin: 48.5, colorways: 5, status: 'ready', season: 'SP26', image: '', tier: 'good', sellThrough: 76, forecast: 110000 },
];

export const seasons: SeasonHealth[] = [
  { id: 's1', name: 'Spring 2026', code: 'SP26', score: 82, revenue: { target: 5000, current: 4700 }, margin: { target: 45.0, current: 45.1 }, skuCount: 3240, status: 'on-track' },
  { id: 's2', name: 'Fall 2025', code: 'FA25', score: 68, revenue: { target: 4800, current: 4200 }, margin: { target: 44.5, current: 43.2 }, skuCount: 3100, status: 'at-risk' },
  { id: 's3', name: 'Holiday 2025', code: 'HO25', score: 45, revenue: { target: 5200, current: 3100 }, margin: { target: 44.0, current: 42.8 }, skuCount: 2800, status: 'behind' },
];

export const approvals: ApprovalItem[] = [
  { id: 'a1', title: 'SP26 Women\'s Running Assortment', type: 'Assortment', requester: 'James K.', dueDate: '2026-06-30', priority: 'critical', module: 'assort' },
  { id: 'a2', title: 'FA25 EMEA Pricing Exception', type: 'Pricing', requester: 'Wei L.', dueDate: '2026-07-02', priority: 'high', module: 'price' },
  { id: 'a3', title: 'Air Max DN Launch VM Plan', type: 'Launch', requester: 'Priya S.', dueDate: '2026-07-05', priority: 'high', module: 'launch' },
  { id: 'a4', title: 'SP26 Running BOM Updates', type: 'Product', requester: 'Mika T.', dueDate: '2026-07-01', priority: 'medium', module: 'create' },
  { id: 'a5', title: 'APAC Store Cluster Revision', type: 'Planning', requester: 'David R.', dueDate: '2026-07-08', priority: 'medium', module: 'plan' },
  { id: 'a6', title: 'SP26 Basketball Margin Review', type: 'Finance', requester: 'David R.', dueDate: '2026-07-03', priority: 'high', module: 'price' },
  { id: 'a7', title: 'Korea Digital Asset Package', type: 'Launch', requester: 'Wei L.', dueDate: '2026-07-10', priority: 'low', module: 'launch' },
];

export const activities: ActivityEvent[] = [
  { id: 'e1', actor: 'James K.', action: 'updated', object: 'SP26 Running Assortment — added 2 trail styles', module: 'assort', timestamp: '10:42 AM' },
  { id: 'e2', actor: 'Wei L.', action: 'flagged', object: 'China pricing exception for Pegasus 43', module: 'price', timestamp: '10:15 AM' },
  { id: 'e3', actor: 'Vantage AI', action: 'detected', object: 'Demand forecast updated — Running +4.2% vs plan', module: 'forecast', timestamp: '09:30 AM', isAI: true },
  { id: 'e4', actor: 'Priya S.', action: 'submitted', object: 'India VM compliance photos for 12 stores', module: 'launch', timestamp: '09:15 AM' },
  { id: 'e5', actor: 'Mika T.', action: 'approved', object: 'Pegasus 43 Sunrise colorway materials', module: 'create', timestamp: '08:45 AM' },
  { id: 'e6', actor: 'Vantage AI', action: 'alert', object: 'Pegasus 43 Pink colorway — stockout risk in 6 days', module: 'forecast', timestamp: '08:30 AM', isAI: true },
  { id: 'e7', actor: 'David R.', action: 'completed', object: 'FA25 margin reconciliation', module: 'analytics', timestamp: 'Yesterday' },
  { id: 'e8', actor: 'Sarah M.', action: 'approved', object: 'SP26 Financial Plan — Scenario B', module: 'plan', timestamp: 'Yesterday' },
];

export const milestones: Milestone[] = [
  { id: 'm1', name: 'SP26 Line Review', date: 'Jun 30', season: 'SP26', status: 'upcoming' },
  { id: 'm2', name: 'SP26 Pricing Lock', date: 'Jul 15', season: 'SP26', status: 'upcoming' },
  { id: 'm3', name: 'SP26 Buy Ready', date: 'Aug 01', season: 'SP26', status: 'upcoming' },
  { id: 'm4', name: 'Air Max DN Global Launch', date: 'Jul 15', season: 'SP26', status: 'in-progress' },
  { id: 'm5', name: 'FA25 Markdown Cycle 1', date: 'Jul 20', season: 'FA25', status: 'upcoming' },
];

export const risks: RiskAlert[] = [
  { id: 'r1', severity: 'critical', message: 'Pegasus 43 Pink — stockout risk in 6 days. Expedite recommended.', module: 'forecast', assignee: 'Supply Chain' },
  { id: 'r2', severity: 'critical', message: 'China VM graphics not approved — blocks Air Max DN launch', module: 'launch', assignee: 'Wei L.' },
  { id: 'r3', severity: 'warning', message: 'FA25 margins 1.2% below target across Lifestyle category', module: 'price', assignee: 'David R.' },
  { id: 'r4', severity: 'warning', message: 'India store fixtures delayed 5 days for Air Max DN', module: 'launch', assignee: 'Ops Team' },
  { id: 'r5', severity: 'warning', message: 'APAC inventory allocation pending for 3 launches', module: 'forecast', assignee: 'Supply Chain' },
  { id: 'r6', severity: 'info', message: 'SP26 forecast accuracy improved to 94.2% — best in 3 years', module: 'analytics', assignee: '' },
];

export const regionStatuses: RegionStatus[] = [
  { id: 'reg1', name: 'North America', readiness: 92, inventory: 'ready', vm: 'ready', digital: 'ready' },
  { id: 'reg2', name: 'EMEA', readiness: 85, inventory: 'ready', vm: 'partial', digital: 'ready' },
  { id: 'reg3', name: 'Greater China', readiness: 68, inventory: 'partial', vm: 'pending', digital: 'partial' },
  { id: 'reg4', name: 'Japan', readiness: 88, inventory: 'ready', vm: 'ready', digital: 'partial' },
  { id: 'reg5', name: 'APAC & LATAM', readiness: 52, inventory: 'pending', vm: 'pending', digital: 'pending' },
  { id: 'reg6', name: 'India', readiness: 61, inventory: 'partial', vm: 'pending', digital: 'ready' },
];

export const categoryPerformance: CategoryPerformance[] = [
  { name: 'Running', revenue: 1800, target: 1700, growth: 8, color: '#FF6B35' },
  { name: 'Basketball', revenue: 1200, target: 1250, growth: 4, color: '#FF3366' },
  { name: 'Lifestyle', revenue: 1000, target: 1100, growth: -2, color: '#9B59B6' },
  { name: 'Football', revenue: 500, target: 450, growth: 12, color: '#2ECC71' },
  { name: 'Training', revenue: 200, target: 200, growth: 1, color: '#3498DB' },
];

export const forecastData: ForecastData[] = [
  { week: 'W1', actual: 95000, forecast: 92000, lower: 85000, upper: 99000 },
  { week: 'W2', actual: 102000, forecast: 98000, lower: 90000, upper: 106000 },
  { week: 'W3', actual: 118000, forecast: 110000, lower: 100000, upper: 120000 },
  { week: 'W4', actual: 125000, forecast: 122000, lower: 112000, upper: 132000 },
  { week: 'W5', actual: 130000, forecast: 128000, lower: 118000, upper: 138000 },
  { week: 'W6', actual: 115000, forecast: 120000, lower: 110000, upper: 130000 },
  { week: 'W7', actual: null, forecast: 125000, lower: 112000, upper: 138000 },
  { week: 'W8', actual: null, forecast: 118000, lower: 104000, upper: 132000 },
  { week: 'W9', actual: null, forecast: 110000, lower: 95000, upper: 125000 },
  { week: 'W10', actual: null, forecast: 105000, lower: 88000, upper: 122000 },
];

export const inventoryItems: InventoryItem[] = [
  { style: 'Pegasus 43', colorway: 'Black/White', onHand: 42000, inTransit: 18000, wos: 6.2, status: 'ok' },
  { style: 'Pegasus 43', colorway: 'White/Black', onHand: 38000, inTransit: 12000, wos: 5.1, status: 'ok' },
  { style: 'Pegasus 43', colorway: 'Volt/Black', onHand: 12000, inTransit: 8000, wos: 2.1, status: 'low' },
  { style: 'Pegasus 43', colorway: 'Blue/White', onHand: 28000, inTransit: 15000, wos: 4.8, status: 'ok' },
  { style: 'Pegasus 43', colorway: 'Pink/Orange', onHand: 3000, inTransit: 0, wos: 0.8, status: 'critical' },
  { style: 'Vomero 20', colorway: 'Black/Volt', onHand: 25000, inTransit: 10000, wos: 5.5, status: 'ok' },
  { style: 'Alphafly 4', colorway: 'White/Volt', onHand: 8000, inTransit: 5000, wos: 4.2, status: 'ok' },
];

export const workflows: WorkflowItem[] = [
  { id: 'w1', title: 'SP26 Line Review', stage: 'queue', type: 'Review', assignee: 'Sarah M.', dueDate: 'Jun 30', priority: 'high' },
  { id: 'w2', title: 'FA25 Markdown Planning', stage: 'in-progress', type: 'Planning', assignee: 'David R.', dueDate: 'Jul 10', priority: 'high' },
  { id: 'w3', title: 'SP26 APAC Assortment', stage: 'review', type: 'Assortment', assignee: 'Wei L.', dueDate: 'Jul 05', priority: 'high' },
  { id: 'w4', title: 'FA25 EMEA Pricing', stage: 'approved', type: 'Pricing', assignee: 'James K.', dueDate: 'Jun 28', priority: 'medium' },
  { id: 'w5', title: 'HO25 Global Plan', stage: 'done', type: 'Planning', assignee: 'Sarah M.', dueDate: 'Jun 15', priority: 'medium' },
  { id: 'w6', title: 'SP26 Costing Review', stage: 'queue', type: 'Review', assignee: 'Mika T.', dueDate: 'Jul 01', priority: 'medium' },
  { id: 'w7', title: 'SP26 VM Plan — Japan', stage: 'in-progress', type: 'Launch', assignee: 'Priya S.', dueDate: 'Jul 12', priority: 'medium' },
  { id: 'w8', title: 'SP26 Forecast Review', stage: 'review', type: 'Forecast', assignee: 'David R.', dueDate: 'Jul 03', priority: 'high' },
];

export const launches: LaunchItem[] = [
  { id: 'l1', name: 'Air Max DN', date: 'Jul 15', readiness: 78, markets: 6, blockers: 4, status: 'at-risk' },
  { id: 'l2', name: 'Pegasus 43 Sunrise', date: 'Jul 22', readiness: 65, markets: 4, blockers: 2, status: 'at-risk' },
  { id: 'l3', name: 'LeBron XXII', date: 'Aug 01', readiness: 91, markets: 6, blockers: 0, status: 'on-track' },
  { id: 'l4', name: 'Mercurial Elite', date: 'Aug 10', readiness: 55, markets: 5, blockers: 3, status: 'blocked' },
  { id: 'l5', name: 'Women\'s Training Collection', date: 'Jul 28', readiness: 82, markets: 6, blockers: 1, status: 'on-track' },
];
