export type AgentId =
  | 'customer'
  | 'sales'
  | 'marketing'
  | 'inventory'
  | 'finance'
  | 'operations'
  | 'analyst'

export type PlanId = 'free' | 'pro' | 'pro-plus'

export type Agent = {
  id: AgentId
  title: string
  description: string
  specialty: string
  status: 'online' | 'busy' | 'idle'
  accent: string
  freeAccess: boolean
}

export const agents: Agent[] = [
  {
    id: 'customer',
    title: 'Customer Agent',
    description: 'Handles customer questions, follow-ups and support.',
    specialty: 'Customer care & follow-ups',
    status: 'online',
    accent: '#db2777',
    freeAccess: true,
  },
  {
    id: 'sales',
    title: 'Sales Agent',
    description: 'Handles sales opportunities and recommendations.',
    specialty: 'Revenue & closing',
    status: 'online',
    accent: '#2563eb',
    freeAccess: true,
  },
  {
    id: 'marketing',
    title: 'Marketing Agent',
    description: 'Handles marketing insights and campaigns.',
    specialty: 'Growth & content',
    status: 'online',
    accent: '#0ea5e9',
    freeAccess: false,
  },
  {
    id: 'inventory',
    title: 'Inventory Agent',
    description: 'Handles stock and inventory monitoring.',
    specialty: 'Stock & replenishment',
    status: 'online',
    accent: '#d97706',
    freeAccess: true,
  },
  {
    id: 'finance',
    title: 'Finance Agent',
    description: 'Handles financial insights.',
    specialty: 'Cash & forecasting',
    status: 'busy',
    accent: '#059669',
    freeAccess: false,
  },
  {
    id: 'operations',
    title: 'Operations Agent',
    description: 'Handles operational tasks.',
    specialty: 'Fulfillment & SOPs',
    status: 'online',
    accent: '#7c3aed',
    freeAccess: false,
  },
  {
    id: 'analyst',
    title: 'Analyst Agent',
    description: 'Handles business analytics and insights.',
    specialty: 'Planning & insights',
    status: 'online',
    accent: '#0f766e',
    freeAccess: false,
  },
]

export const FREE_AGENT_IDS: AgentId[] = agents.filter((a) => a.freeAccess).map((a) => a.id)

export type NavItem = {
  to: string
  label: string
  icon: 'chat' | 'todo' | 'subscription' | 'team' | 'settings'
}

export const navItems: NavItem[] = [
  { to: '/business-chat', label: 'Business Chat', icon: 'chat' },
  { to: '/todo', label: 'To-Do List', icon: 'todo' },
  { to: '/subscription', label: 'Subscription', icon: 'subscription' },
  { to: '/team', label: 'Team Members', icon: 'team' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

export type PlatformId =
  | 'tiktok'
  | 'instagram'
  | 'shopify'
  | 'amazon'
  | 'whatsapp'
  | 'stripe'
  | 'gmail'

export type Platform = {
  id: PlatformId
  name: string
  category: string
  description: string
  color: string
}

export const platforms: Platform[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Social commerce',
    description: 'Connect your TikTok Shop or business page.',
    color: '#111111',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social',
    description: 'Sync DMs, mentions, and product tags.',
    color: '#E1306C',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'Commerce',
    description: 'Orders, inventory, and customer data.',
    color: '#96BF48',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'Marketplace',
    description: 'Seller Central orders and listings.',
    color: '#FF9900',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Messaging',
    description: 'Customer conversations and alerts.',
    color: '#25D366',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    description: 'Payments, payouts, and failed charges.',
    color: '#635BFF',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Email',
    description: 'Inbox triage and customer follow-ups.',
    color: '#EA4335',
  },
]

export const tiktokAccounts = [
  { id: 'tt-1', name: 'Lacebybritney Official', handle: '@lacebybritney', followers: '128K' },
  { id: 'tt-2', name: 'Lacebybritney Shop', handle: '@lacebybritney.shop', followers: '42K' },
  { id: 'tt-3', name: 'Lacebybritney Support', handle: '@lacebybritney.help', followers: '8.1K' },
]

export type BusinessTask = {
  id: string
  type: 'order' | 'payment' | 'inventory' | 'customer' | 'follow-up' | 'sales'
  title: string
  customer?: string
  orderFrom?: string
  product?: string
  amount?: string
  source: string
  status: string
  priority: 'high' | 'medium' | 'low'
  action: string
  meta?: string
  done?: boolean
}

export const businessTasksSeed: BusinessTask[] = [
  {
    id: 'bt1',
    type: 'order',
    title: 'Order #1024',
    customer: 'John Smith',
    product: 'Nike Shoes',
    amount: '$129',
    source: 'Shopify',
    status: 'Needs attention',
    priority: 'high',
    action: 'Review Order',
    meta: 'Address verification pending',
  },
  {
    id: 'bt2',
    type: 'order',
    title: 'Order #984',
    orderFrom: 'Amazon',
    product: 'Classic Hoodie — Black / M',
    amount: '$64.00',
    source: 'Amazon',
    status: 'Ready to ship',
    priority: 'high',
    action: 'Prepare Shipment',
    meta: 'SLA: 6 hours left',
  },
  {
    id: 'bt3',
    type: 'payment',
    title: 'Failed payment retry',
    customer: 'Maria Lopez',
    amount: '$89.50',
    source: 'Stripe',
    status: 'Payment failed',
    priority: 'high',
    action: 'Retry Charge',
    meta: 'Card declined — send recovery email',
  },
  {
    id: 'bt4',
    type: 'inventory',
    title: 'Low stock alert',
    product: 'Satin Scrunchie Pack',
    source: 'Shopify',
    status: '12 units left',
    priority: 'medium',
    action: 'Reorder Stock',
    meta: 'Avg. weekly sell-through: 48 units',
  },
  {
    id: 'bt5',
    type: 'customer',
    title: 'Customer issue',
    customer: 'Emily Chen',
    product: 'Order #1011 — Damaged item',
    source: 'WhatsApp',
    status: 'Awaiting reply',
    priority: 'high',
    action: 'Respond to Customer',
    meta: 'Opened 2 hours ago',
  },
  {
    id: 'bt6',
    type: 'follow-up',
    title: 'Follow-up needed',
    customer: 'David Park',
    source: 'Instagram',
    status: 'No response 48h',
    priority: 'medium',
    action: 'Send Follow-up',
    meta: 'Asked about restock date',
  },
  {
    id: 'bt7',
    type: 'sales',
    title: 'Sales opportunity',
    orderFrom: 'TikTok',
    product: 'Bundle: Lip Kit + Gloss',
    amount: '$210 potential',
    source: 'TikTok',
    status: 'Hot lead',
    priority: 'medium',
    action: 'Review Opportunity',
    meta: 'Viewer asked about wholesale pricing',
  },
  {
    id: 'bt8',
    type: 'order',
    title: 'Order #1102',
    customer: 'Sofia Alvarez',
    product: 'Summer Dress — Size S',
    amount: '$78',
    source: 'Shopify',
    status: 'Refund requested',
    priority: 'medium',
    action: 'Review Refund',
    meta: 'Wrong size received',
  },
]

export const teamMembers = [
  { id: 'u1', name: 'Rahma', role: 'Owner', email: 'rahma@businessbrain.app', status: 'Active' },
  { id: 'u2', name: 'Sam Ortiz', role: 'Ops Lead', email: 'sam@businessbrain.app', status: 'Active' },
  { id: 'u3', name: 'Priya Shah', role: 'Support', email: 'priya@businessbrain.app', status: 'Invited' },
]

export const DEMO_BUSINESS_NAME = 'Lacebybritney'

export const planLimits: Record<
  PlanId,
  { teamMax: number | null; label: string; teamNote: string }
> = {
  free: {
    teamMax: 1,
    label: 'Free',
    teamNote: 'Team invites are not included on Free. Upgrade to Pro to add teammates.',
  },
  pro: {
    teamMax: 5,
    label: 'Pro',
    teamNote: 'Pro includes up to 5 team members.',
  },
  'pro-plus': {
    teamMax: null,
    label: 'Pro Plus',
    teamNote: 'Pro Plus supports expanded team members and employee seats.',
  },
}

export const invoices = [
  {
    id: 'INV-001',
    date: 'Sep 2026',
    plan: 'Pro',
    amount: '$29.99',
    status: 'Paid' as const,
  },
  {
    id: 'INV-002',
    date: 'Aug 2026',
    plan: 'Pro',
    amount: '$29.99',
    status: 'Paid' as const,
  },
  {
    id: 'INV-003',
    date: 'Jul 2026',
    plan: 'Pro',
    amount: '$29.99',
    status: 'Paid' as const,
  },
]

/** @deprecated kept for any leftover imports */
export const todosSeed = businessTasksSeed.map((t) => ({
  id: t.id,
  title: t.title,
  owner: t.source,
  due: t.status,
  priority: t.priority,
  done: Boolean(t.done),
}))

/** @deprecated */
export const packingOrders = [
  { id: '4821', customer: 'Bloom & Co', items: 4, status: 'ready' as const, sla: '2h left' },
  { id: '4822', customer: 'Harbor Retail', items: 12, status: 'packing' as const, sla: '4h left' },
  { id: '4823', customer: 'Cedar Labs', items: 2, status: 'queued' as const, sla: 'Tomorrow' },
]

/** @deprecated — use platforms */
export const integrations = platforms.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  connected: false,
}))

export const instagramAccounts = [
  { id: 'ig-1', name: 'Lacebybritney Official', handle: '@lacebybritney', followers: '64K' },
  { id: 'ig-2', name: 'Lacebybritney Shop', handle: '@lacebybritney.shop', followers: '21K' },
  { id: 'ig-3', name: 'Lacebybritney Studio', handle: '@lacebybritney.studio', followers: '5.2K' },
]

export const countryCodes = [
  { country: 'US / Canada', code: '+1' },
  { country: 'United Kingdom', code: '+44' },
  { country: 'Vietnam', code: '+84' },
  { country: 'Nigeria', code: '+234' },
  { country: 'Ghana', code: '+233' },
  { country: 'South Africa', code: '+27' },
  { country: 'India', code: '+91' },
  { country: 'Australia', code: '+61' },
  { country: 'Germany', code: '+49' },
  { country: 'France', code: '+33' },
  { country: 'Brazil', code: '+55' },
]

export const amazonMarketplaces = [
  'amazon.com', 'amazon.co.uk', 'amazon.ca', 'amazon.de', 'amazon.fr',
  'amazon.it', 'amazon.es', 'amazon.com.au', 'amazon.co.jp', 'amazon.in',
  'amazon.com.mx', 'amazon.com.br', 'amazon.ae', 'amazon.sg',
]
