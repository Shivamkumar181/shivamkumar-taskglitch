import { Task } from '@/types';

const priorities: Task['priority'][] = ['High', 'Medium', 'Low'];
const statuses: Task['status'][] = ['Todo', 'In Progress', 'Done'];

export function generateSalesTasks(count: number): Task[] {
  const tasks: Task[] = [];
  const titles = [
    'Prospect outreach',
    'Demo scheduling',
    'Product demo',
    'Proposal drafting',
    'Contract negotiation',
    'Follow-up emails',
    'Lead qualification',
    'Account discovery',
    'Pricing review',
    'Quarterly business review',
    'Customer success handoff',
    'Lead list cleanup',
    'CRM data entry',
    'Renewal discussion',
    'Upsell opportunity review',
    'Cross-sell campaign',
    'Cold calling block',
    'Sequence optimization',
    'Inbound lead response',
    'Outbound campaign setup',
    'LinkedIn networking',
    'Case study sharing',
    'Trial activation support',
    'PO processing',
    'Security questionnaire',
    'Technical validation call',
    'Competitor analysis',
    'Territory planning',
    'Pipeline review',
    'Forecast update',
    'Lead nurturing',
    'Email template A/B test',
    'Webinar follow-up',
    'Event leads import',
    'MQL to SQL handoff',
    'Warm intro request',
    'Sales deck refresh',
    'Objection handling prep',
    'Referral outreach',
    'Lost deal review',
    'Win story write-up',
    'Channel partner sync',
    'Trial usage review',
    'POC scoping',
    'Implementation planning',
    'Champion alignment',
    'Economic buyer meeting',
    'Legal review coordination',
    'Signature collection',
    'Onboarding kickoff'
  ];

  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const title = titles[i % titles.length];
    const id = `t-${2001 + i}`;
    const priority = priorities[i % priorities.length];
    const status = statuses[(i + 1) % statuses.length];
    const timeTaken = 1 + ((i * 3) % 10); // 1..10 hours
    const revenueBase = 150 + (i % 12) * 75; // base pattern
    const multiplier = priority === 'High' ? 8 : priority === 'Medium' ? 4 : 2;
    const revenue = Math.round((revenueBase + (i % 5) * 40) * multiplier);
    const createdAt = new Date(now - (i * 36 + (i % 7) * 12) * 60 * 60 * 1000).toISOString();
    const completedAt = status === 'Done' ? new Date(new Date(createdAt).getTime() + ((i % 10) + 1) * 24 * 3600 * 1000).toISOString() : undefined;
    tasks.push({ id, title: `${title} #${i + 1}`, revenue, timeTaken, priority, status, createdAt, completedAt });
  }
  return tasks;
}


