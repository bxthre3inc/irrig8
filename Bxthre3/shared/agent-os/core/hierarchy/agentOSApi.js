// AgentOS v6.0.0 — Canonical API
// Source: shared/agent-os/core/hierarchy/agentOSApi.ts
// NOTE: Edit the .ts source. This .js is deployed directly.

var mod = require("./org.js");
var org = mod.org;
var __require = (x) => { if (typeof require !== 'undefined') return require(x); };

// org is loaded by the importing route via /shared/agent-os/core/hierarchy/org.js
var CANONICAL_VERSION = '6.0.0';

var CANONICAL_AGENT_IDS = new Set([
  'brodiblanco','zoe','atlas','vance','pulse','sentinel',
  'iris','dev','sam','taylor','theo',
  'casey','maya','raj','drew',
  'irrig8','rain','vpc','trenchbabys',
]);

var DEPT_MAP = {
  executive:'Executive',engineering:'Engineering',operations:'Operations',
  marketing:'Marketing',grants:'Grants',legal:'Legal',sales:'Sales',
  finance:'Finance',security:'Security',bi:'BI & Analytics',
  research:'Research',design:'Design',channel:'Channel',
  corp_dev:'Corp Dev',professional_services:'Professional Services',
  retail:'Retail',strategy:'Strategy',compliance:'Compliance',
  hr:'HR',funding:'Funding',integrations:'Integrations',
};

function departmentLabel(d) {
  return DEPT_MAP[d] || (d.charAt(0).toUpperCase() + d.slice(1));
}

function mapStatus(s) {
  if (s === 'working' || s === 'monitoring') return 'ACTIVE';
  if (s === 'idle') return 'IDLE';
  if (s === 'blocked') return 'ERROR';
  return 'OFFLINE';
}

function initials(name) {
  return name.split(' ').map(function(p){return p[0];}).join('').slice(0,2).toUpperCase();
}

function roleLabel(emp) {
  var id = emp.id;
  if (id === 'taylor')      return 'Security Engineer';
  if (id === 'casey')       return 'Marketing Lead';
  if (id === 'theo')        return 'DevOps Engineer';
  if (id === 'dev')         return 'Backend Engineer';
  if (id === 'sam')         return 'Data Analyst';
  if (id === 'iris')        return 'Engineering Lead';
  if (id === 'maya')        return 'Grant Strategist';
  if (id === 'raj')         return 'Legal & Compliance';
  if (id === 'drew')        return 'Sales Lead';
  if (id === 'irrig8')      return 'Field Operations';
  if (id === 'rain')        return 'Regulatory Intelligence';
  if (id === 'vpc')         return 'Gaming Operations';
  if (id === 'trenchbabys') return 'Retail Operations';
  if (id === 'brodiblanco') return 'Founder & CEO';
  if (emp.role === 'executive') return 'Executive Agent';
  if (emp.role === 'manager')   return departmentLabel(emp.department) + ' Lead';
  return departmentLabel(emp.department) + ' Agent';
}

function toAgent(emp, completionRate, activeTasks) {
  return {
    id: emp.id, name: emp.name, role: roleLabel(emp),
    department: departmentLabel(emp.department), status: mapStatus(emp.status),
    completionRate: completionRate, activeTasks: activeTasks,
    email: emp.id + '@bxthre3.io',
    lastSeen: new Date().toISOString(), avatar: initials(emp.name),
    type: emp.id === 'brodiblanco' ? 'human' : 'ai',
    skills: emp.skills, tools: emp.tools, shifts: emp.shifts, colleagues: emp.colleagues,
  };
}

function toOrgEntry(emp) {
  return {
    id: emp.id, name: emp.name, role: roleLabel(emp),
    type: emp.id === 'brodiblanco' ? 'human' : 'ai',
    department: departmentLabel(emp.department), reportsTo: emp.managerId,
  };
}

var AGENT_TASKS = {
  zoe:[
    {id:'t-zoe-1',title:'AgentOS Architecture Review',priority:'P0',status:'IN_PROGRESS',due:'Today',description:'Cross-client consistency across web, Android, zo.space API'},
    {id:'t-zoe-2',title:'Weekly Executive Briefing',priority:'P1',status:'IN_PROGRESS',due:'Today',description:'Compile 12h briefing for brodiblanco'},
  ],
  iris:[
    {id:'t-iris-1',title:'Irrig8 Product Roadmap Q2',priority:'P1',status:'IN_PROGRESS',due:'This Week',description:'Finalize Q2 hardware and firmware roadmap'},
    {id:'t-iris-2',title:'SLV Pilot Deployment Plan',priority:'P1',status:'IN_PROGRESS',due:'This Week',description:'Detailed deployment plan for June 2026 SLV pilot'},
    {id:'t-iris-3',title:'AgentOS v6.0.0 Release Prep',priority:'P0',status:'IN_PROGRESS',due:'Today',description:'Execute Phase 1 API overhaul per PREPARATION.md'},
  ],
  dev:[
    {id:'t-dev-1',title:'Deploy Irrig8 Sensor Firmware v2.1',priority:'P1',status:'IN_PROGRESS',due:'Today',description:'Push OTA update to LRZ1/LRZ2 field units'},
  ],
  casey:[
  ],
  maya:[
    {id:'t-maya-1',title:'SBIR Phase 1 Narrative Draft',priority:'P0',status:'IN_PROGRESS',due:'Today',description:'Complete first draft for DOE submission'},
  ],
  raj:[
    {id:'t-raj-1',title:'VPC Sweepstakes Compliance Audit',priority:'P1',status:'TODO',due:'Tomorrow',description:'Review latest sweepstakes regulations for CO'},
  ],
  sentinel:[
    {id:'t-sentinel-1',title:'AgentOS Health Check Daily',priority:'P0',status:'DONE',due:'Today',description:'All services operational'},
  ],
  pulse:[
    {id:'t-pulse-1',title:'Workforce Health Report',priority:'P1',status:'DONE',due:'Today',description:'Weekly workforce report posted to INBOX'},
  ],
  sam:[
    {id:'t-sam-1',title:'Weekly Sprint Data Pull',priority:'P2',status:'DONE',due:'Today',description:'Sprint metrics compiled and posted to INBOX'},
  ],
  drew:[
    {id:'t-drew-1',title:'VPC Platform Launch Readiness',priority:'P1',status:'IN_PROGRESS',due:'This Week',description:'Finalize VPC platform pre-launch checklist'},
  ],
  irrig8:[
    {id:'t-irrig8-1',title:'SLV Sensor Calibration Check',priority:'P1',status:'IN_PROGRESS',due:'This Week',description:'Verify all LRZ sensor calibration ahead of spring planting'},
  ],
  rain:[
    {id:'t-rain-1',title:'Water Court Evidence Preparation',priority:'P0',status:'IN_PROGRESS',due:'Jun 29',description:'Prepare regulatory evidence for June 29 water court hearing'},
  ],
  vpc:[
    {id:'t-vpc-1',title:'VPC KYC Flow Audit',priority:'P1',status:'IN_PROGRESS',due:'This Week',description:'Audit KYC onboarding flow for sweepstakes compliance'},
  ],
};

var COMPLETION_RATES = {
  brodiblanco:1.00,zoe:0.97,atlas:0.94,vance:0.95,
  iris:0.91,dev:0.88,sam:0.87,taylor:0.92,theo:0.89,
  pulse:0.96,sentinel:0.99,
  casey:0.85,maya:0.90,raj:0.92,
  drew:0.93,irrig8:0.90,rain:0.88,vpc:0.87,trenchbabys:0.85,
};

var INTEGRATIONS = [
  {name:'Gmail',    status:'CONNECTED',icon:'email',    lastSync:new Date().toISOString(),actions:['read','send']},
  {name:'Calendar', status:'CONNECTED',icon:'event',    lastSync:new Date().toISOString(),actions:['read','write']},
  {name:'Tasks',    status:'CONNECTED',icon:'checklist',lastSync:new Date().toISOString(),actions:['read','write']},
  {name:'Drive',    status:'CONNECTED',icon:'folder',   lastSync:new Date().toISOString(),actions:['read','write']},
  {name:'Notion',   status:'CONNECTED',icon:'article',  lastSync:new Date().toISOString(),actions:['read','write']},
  {name:'Airtable', status:'CONNECTED',icon:'table',    lastSync:new Date().toISOString(),actions:['read','write']},
  {name:'Linear',   status:'CONNECTED',icon:'issue',    lastSync:new Date().toISOString(),actions:['read','write']},
  {name:'Spotify',  status:'CONNECTED',icon:'music',    lastSync:new Date().toISOString(),actions:['read']},
  {name:'Dropbox',  status:'CONNECTED',icon:'cloud',    lastSync:new Date().toISOString(),actions:['read']},
  {name:'Stripe',   status:'PARTIAL',  icon:'payment', lastSync:new Date().toISOString(),actions:['read']},
];

var STARTING5 = [
  {name:'Zoe Patel',  archetype:'Chief of Staff',     specialty:'Orchestration & Strategy',   currentFocus:'AgentOS v6.0 architecture',         metrics:{tasksOwned:2,completionRate:0.97,escalations:0}},
  {name:'Drew',       archetype:'Sales Lead',         specialty:'Revenue & Partnerships',   currentFocus:'VPC platform launch',              metrics:{tasksOwned:1,completionRate:0.93,pipeline:'$2.4M'}},
  {name:'Casey Wu',   archetype:'Marketing Lead',      specialty:'Brand & Demand Gen',       currentFocus:'Irrig8 launch campaign',          metrics:{tasksOwned:1,completionRate:0.85,reach:'12K'}},
  {name:'Vance',      archetype:'Pattern Architect',  specialty:'Gap Detection & Continuity',currentFocus:'Cross-system anomaly monitoring',   metrics:{tasksOwned:1,completionRate:0.95,patternsFound:24}},
];

var PROJECTS = [
  {name:'Irrig8',              status:'STANDBY', description:'Precision agriculture OS for center-pivot irrigation in Colorado San Luis Valley', lastUpdated:new Date().toISOString()},
  {name:'Valley Players Club', status:'PLANNING',description:'Responsible sweepstakes gaming platform — legal framework drafted',             lastUpdated:new Date().toISOString()},
  {name:'The Starting 5',      status:'ACTIVE',  description:'AI co-founder archetypes powering all Bxthre3 ventures',                          lastUpdated:new Date().toISOString()},
  {name:'AgentOS',             status:'ACTIVE',  description:'AI workforce orchestration platform — powers all Bxthre3 operations',            lastUpdated:new Date().toISOString()},
  {name:'Rain',                status:'ACTIVE',  description:'Regulatory arbitrage intelligence for water rights and compliance',                lastUpdated:new Date().toISOString()},
  {name:'ARD Project',          status:'UNKNOWN', description:'Under review — status to be determined',                                         lastUpdated:new Date().toISOString()},
];

function getOrg() { return globalThis._org || org; }

function canonicalAgents() {
  return getOrg().listAll().filter(function(e){ return CANONICAL_AGENT_IDS.has(e.id); });
}

function getTasksList() {
  var tasks = [];
  var entries = Object.entries(AGENT_TASKS);
  for (var i = 0; i < entries.length; i++) {
    var agentId = entries[i][0];
    var agentTasks = entries[i][1];
    if (!CANONICAL_AGENT_IDS.has(agentId)) continue;
    var emp = getOrg().getEmployee(agentId);
    if (!emp) continue;
    for (var j = 0; j < agentTasks.length; j++) {
      var t = agentTasks[j];
      tasks.push({
        id:t.id,title:t.title,agentId:agentId,agentName:emp.name,
        priority:t.priority,status:t.status,dueDate:t.due,description:t.description,
      });
    }
  }
  return tasks;
}

function getWorkforceMetricsData() {
  var all = canonicalAgents();
  var active = all.filter(function(e){ return e.status === 'working' || e.status === 'monitoring'; });
  var totalRate = all.reduce(function(s,e){ return s + (COMPLETION_RATES[e.id] || 0.85); }, 0);
  var tasks = getTasksList();
  return {
    totalAgents: all.length,
    activeAgents: active.length,
    avgCompletionRate: parseFloat((totalRate / all.length).toFixed(2)),
    totalTasks: tasks.length,
    completedToday: tasks.filter(function(t){ return t.status === 'DONE'; }).length,
    blockedTasks: tasks.filter(function(t){ return t.status === 'BLOCKED'; }).length,
    openP1s: tasks.filter(function(t){ return t.priority === 'P0' || t.priority === 'P1'; }).length,
  };
}

exports.getAgents = function() {
  return canonicalAgents().map(function(emp) {
    return toAgent(emp,
      COMPLETION_RATES[emp.id] || 0.85,
      (AGENT_TASKS[emp.id] || []).filter(function(t){ return t.status === 'IN_PROGRESS'; }).length
    );
  });
};

exports.getAgent = function(id) {
  var emp = getOrg().getEmployee(id);
  if (!emp || !CANONICAL_AGENT_IDS.has(id)) return null;
  return toAgent(emp, COMPLETION_RATES[id] || 0.85,
    (AGENT_TASKS[id] || []).filter(function(t){ return t.status === 'IN_PROGRESS'; }).length);
};

exports.getTasks = getTasksList;

exports.getActiveTasks = function() {
  return getTasksList().filter(function(t){ return t.status === 'IN_PROGRESS' || t.status === 'TODO'; });
};

exports.getWorkforceMetrics = getWorkforceMetricsData;

exports.getOrgChart = function() {
  return canonicalAgents().map(toOrgEntry);
};

exports.getIntegrations = function() { return INTEGRATIONS; };
exports.getStarting5 = function() { return STARTING5; };
exports.getProjects = function() { return PROJECTS; };

exports.getDashboard = function() {
  var agents = exports.getAgents();
  var metrics = getWorkforceMetricsData();
  var tasks = getTasksList();
  return {
    version: CANONICAL_VERSION,
    status: 'operational',
    agentCount: agents.length,
    activeAgents: metrics.activeAgents,
    workQueueDepth: tasks.filter(function(t){ return t.status === 'IN_PROGRESS' || t.status === 'TODO'; }).length,
    escalationCount: tasks.filter(function(t){ return t.priority === 'P0' || t.priority === 'P1'; }).length,
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    diskUsage: 0,
    avgHealth: metrics.avgCompletionRate,
    knownIssues: tasks.filter(function(t){ return t.status === 'BLOCKED'; }).map(function(t){ return t.title; }),
    agents: agents,
    tasks: tasks,
    integrations: INTEGRATIONS,
    starting5: STARTING5,
    timestamp: new Date().toISOString(),
  };
};
