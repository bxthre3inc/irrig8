export interface ParsedScript {
  name: string;
  description: string;
  triggers: string[];
  actions: {
    type: string;
    params: Record<string, unknown>;
  }[];
  conditions?: {
    field: string;
    operator: string;
    value: unknown;
  }[];
  metadata?: {
    author: string;
    version: string;
    tags: string[];
  };
}

const ACTION_KEYWORDS: Record<string, string> = {
  greet: 'GREET',
  welcome: 'GREET',
  hello: 'GREET',
  'say hi': 'GREET',
  respond: 'RESPOND',
  reply: 'RESPOND',
  answer: 'RESPOND',
  send: 'SEND_MESSAGE',
  email: 'SEND_EMAIL',
  'send email': 'SEND_EMAIL',
  'send message': 'SEND_MESSAGE',
  message: 'SEND_MESSAGE',
  capture: 'CAPTURE_LEAD',
  'capture lead': 'CAPTURE_LEAD',
  'collect': 'CAPTURE_LEAD',
  'get email': 'CAPTURE_LEAD',
  'get contact': 'CAPTURE_LEAD',
  schedule: 'SCHEDULE',
  'set up meeting': 'SCHEDULE',
  'book': 'SCHEDULE',
  'schedule meeting': 'SCHEDULE',
  scrape: 'SCRAPE_DATA',
  'fetch': 'FETCH_DATA',
  'get data': 'FETCH_DATA',
  'pull data': 'FETCH_DATA',
  'extract': 'EXTRACT_DATA',
  'search': 'SEARCH',
  'find': 'SEARCH',
  'look up': 'LOOKUP',
  'check': 'CHECK',
  'analyze': 'ANALYZE',
  'summarize': 'SUMMARIZE',
  'report': 'GENERATE_REPORT',
  'create': 'CREATE',
  'make': 'CREATE',
  'generate': 'GENERATE',
  'save': 'SAVE',
  'store': 'SAVE',
  'remember': 'STORE_MEMORY',
  'update': 'UPDATE',
  'modify': 'MODIFY',
  'change': 'MODIFY',
  'delete': 'DELETE',
  'remove': 'DELETE',
  'escalate': 'ESCALATE',
  'transfer': 'TRANSFER',
  'redirect': 'REDIRECT',
};

const TRIGGER_PATTERNS: [RegExp, string][] = [
  [/message|chat|conversation|incoming/i, 'on_message'],
  [/scheduled|cron|every| recurring|定时/i, 'on_schedule'],
  [/event|trigger|webhook|api call/i, 'on_event'],
  [/button|click|user action/i, 'on_action'],
  [/keyword|mentions|特定词/i, 'on_keyword'],
];

function extractTriggers(text: string): string[] {
  const triggers: string[] = ['on_message'];
  
  for (const [pattern, trigger] of TRIGGER_PATTERNS) {
    if (pattern.test(text)) {
      if (!triggers.includes(trigger)) {
        triggers.push(trigger);
      }
    }
  }
  
  return triggers;
}

function extractActions(text: string): { type: string; params: Record<string, unknown> }[] {
  const actions: { type: string; params: Record<string, unknown> }[] = [];
  const lowerText = text.toLowerCase();
  
  const actionMap: [string[], string, Record<string, unknown>][] = [
    [['greet', 'welcome', 'hello', 'say hi'], 'GREET', { style: 'warm', delay: 0 }],
    [['respond', 'reply', 'answer'], 'RESPOND', {}],
    [['send message', 'message'], 'SEND_MESSAGE', {}],
    [['send email', 'email'], 'SEND_EMAIL', { channel: 'email' }],
    [['capture lead', 'collect', 'get email', 'get contact', 'capture'], 'CAPTURE_LEAD', { fields: ['email', 'name'] }],
    [['schedule', 'set up meeting', 'book'], 'SCHEDULE', { duration: 30 }],
    [['scrape', 'fetch data', 'get data', 'pull data'], 'FETCH_DATA', { source: 'web' }],
    [['extract'], 'EXTRACT_DATA', {}],
    [['search', 'find'], 'SEARCH', {}],
    [['look up', 'check'], 'LOOKUP', {}],
    [['analyze'], 'ANALYZE', {}],
    [['summarize'], 'SUMMARIZE', {}],
    [['generate report', 'report'], 'GENERATE_REPORT', { format: 'markdown' }],
    [['create', 'make', 'generate'], 'CREATE', {}],
    [['save', 'store', 'remember'], 'SAVE', {}],
    [['update', 'modify', 'change'], 'UPDATE', {}],
    [['delete', 'remove'], 'DELETE', {}],
    [['escalate', 'transfer', 'redirect'], 'ESCALATE', { priority: 'high' }],
  ];
  
  for (const [keywords, type, params] of actionMap) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      const existing = actions.find(a => a.type === type);
      if (!existing) {
        actions.push({ type, params });
      }
    }
  }
  
  if (lowerText.includes('if') || lowerText.includes('when') || lowerText.includes('条件')) {
    actions.push({ type: 'CHECK_CONDITION', params: { evaluate: 'context' } });
  }
  
  return actions.length > 0 ? actions : [{ type: 'RESPOND', params: {} }];
}

function extractConditions(text: string): { field: string; operator: string; value: unknown }[] {
  const conditions: { field: string; operator: string; value: unknown }[] = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('interested') || lowerText.includes('want to buy') || lowerText.includes('ready to purchase')) {
    conditions.push({ field: 'intent', operator: 'equals', value: 'purchase' });
  }
  
  if (lowerText.includes('pricing') || lowerText.includes('cost') || lowerText.includes('how much')) {
    conditions.push({ field: 'topic', operator: 'equals', value: 'pricing' });
  }
  
  if (lowerText.includes('question') || lowerText.includes('help')) {
    conditions.push({ field: 'topic', operator: 'equals', value: 'support' });
  }
  
  if (lowerText.includes('repeat') || lowerText.includes('second time')) {
    conditions.push({ field: 'message_count', operator: '>', value: 1 });
  }
  
  if (lowerText.includes('not interested') || lowerText.includes('dont want')) {
    conditions.push({ field: 'intent', operator: 'equals', value: 'negative' });
  }
  
  return conditions;
}

function extractName(text: string): string {
  const patterns = [
    /(?:create|build|make|generate|script for|agent for|a|I need an?)\s+(.+?)(?:\s+script|\s+agent|\s+bot)/i,
    /^(.+?)(?:\s+script|\s+agent|\s+bot)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const name = match[1].trim();
      if (name.length > 3 && name.length < 50) {
        return name
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
      }
    }
  }
  
  const words = text.split(' ').slice(0, 4);
  if (words.length > 1) {
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') + ' Script';
  }
  
  return 'Custom Script';
}

function extractDescription(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('sales')) return 'Engages customers, answers product questions, and captures qualified leads for the sales pipeline.';
  if (lowerText.includes('support')) return 'Provides customer support, answers FAQs, and escalates complex issues to human agents.';
  if (lowerText.includes('scrap')) return 'Automated data extraction script that gathers and organizes information from specified sources.';
  if (lowerText.includes('schedule')) return 'Automates meeting scheduling and calendar management workflows.';
  if (lowerText.includes('lead')) return 'Captures and qualifies leads with intelligent conversation flows and data collection.';
  
  return text.slice(0, 150) + (text.length > 150 ? '...' : '');
}

function extractTags(text: string): string[] {
  const tags: string[] = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('sales') || lowerText.includes('crm') || lowerText.includes('purchase')) tags.push('sales', 'crm');
  if (lowerText.includes('support') || lowerText.includes('help') || lowerText.includes('faq')) tags.push('support', 'customer-service');
  if (lowerText.includes('scrap') || lowerText.includes('data')) tags.push('data', 'automation');
  if (lowerText.includes('schedule') || lowerText.includes('calendar')) tags.push('scheduling', 'productivity');
  if (lowerText.includes('social') || lowerText.includes('twitter') || lowerText.includes('linkedin')) tags.push('social', 'outreach');
  if (lowerText.includes('email')) tags.push('email', 'communication');
  if (lowerText.includes('lead')) tags.push('lead-generation', 'crm');
  
  if (tags.length === 0) tags.push('custom');
  
  return [...new Set(tags)];
}

export async function parseScript(naturalLanguage: string): Promise<ParsedScript> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const name = extractName(naturalLanguage);
  const description = extractDescription(naturalLanguage);
  const triggers = extractTriggers(naturalLanguage);
  const actions = extractActions(naturalLanguage);
  const conditions = extractConditions(naturalLanguage);
  const tags = extractTags(naturalLanguage);
  
  return {
    name,
    description,
    triggers,
    actions,
    conditions: conditions.length > 0 ? conditions : undefined,
    metadata: {
      author: 'PS5cript User',
      version: '1.0.0',
      tags,
    },
  };
}
