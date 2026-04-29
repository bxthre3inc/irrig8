import React, { useState, useEffect } from 'react';
import { Globe, Users, Zap, AlertCircle, CheckCircle, Clock, Shield, DollarSign } from 'lucide-react';

const mockAgents = [
  { id: 1, name: 'CEO-Agent', role: 'strategic', state: 'idle', tasks: 0 },
  { id: 2, name: 'Researcher-1', role: 'researcher', state: 'working', tasks: 12 },
  { id: 3, name: 'Developer-1', role: 'developer', state: 'working', tasks: 8 },
  { id: 4, name: 'Reviewer-1', role: 'reviewer', state: 'waiting_hitl', tasks: 3 },
  { id: 5, name: 'Legal-1', role: 'legal', state: 'idle', tasks: 0 },
  { id: 6, name: 'Financial-1', role: 'financial', state: 'idle', tasks: 0 },
  { id: 7, name: 'QA-1', role: 'qa', state: 'working', tasks: 15 },
  { id: 8, name: 'Manager-1', role: 'manager', state: 'working', tasks: 24 },
];

const mockTasks = [
  { id: 1, name: 'Patent Analysis', type: 'research', status: 'completed', agent: 'Researcher-1' },
  { id: 2, name: 'Code Review', type: 'development', status: 'in_progress', agent: 'Developer-1' },
  { id: 3, name: 'Contract Review', type: 'legal', status: 'pending_hitl', agent: 'Legal-1' },
  { id: 4, name: 'Fund Transfer', type: 'financial', status: 'pending_hitl', agent: 'Financial-1' },
];

const mockHITL = [
  { id: 1, type: 'financial_approval', description: 'Fund transfer $50,000', status: 'pending', deadline: '2h' },
  { id: 2, type: 'legal_review', description: 'NDA review for partner', status: 'pending', deadline: '4h' },
];

export default function AgenticDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState(mockAgents);
  const [tasks, setTasks] = useState(mockTasks);
  const [hitlRequests, setHitlRequests] = useState(mockHITL);

  const stats = [
    { label: 'Active Agents', value: agents.filter(a => a.state === 'working').length, icon: Users, color: 'text-blue-500' },
    { label: 'Tasks Running', value: tasks.filter(t => t.status === 'in_progress').length, icon: Zap, color: 'text-green-500' },
    { label: 'HITL Pending', value: hitlRequests.length, icon: Clock, color: 'text-yellow-500' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle, color: 'text-purple-500' },
  ];

  const approveHITL = (id) => {
    setHitlRequests(prev => prev.filter(r => r.id !== id));
  };

  const rejectHITL = (id) => {
    setHitlRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-xl font-bold">Agentic Dashboard</h1>
              <p className="text-sm text-zinc-400">Multi-tiered AI Workforce Orchestration</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-zinc-800">
          {['overview', 'agents', 'tasks', 'hitl'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hierarchy View */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Organization Hierarchy
              </h2>
              <div className="space-y-4">
                <div className="bg-zinc-800 rounded-lg p-4 border-l-4 border-yellow-500">
                  <div className="font-medium">CEO</div>
                  <div className="text-sm text-zinc-400">Strategic Decision Authority</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-zinc-800 rounded-lg p-3 border-l-4 border-blue-500">
                    <div className="font-medium text-sm">C-Suite</div>
                    <div className="text-xs text-zinc-400">Manager</div>
                  </div>
                  <div className="flex-1 bg-zinc-800 rounded-lg p-3 border-l-4 border-green-500">
                    <div className="font-medium text-sm">Legal</div>
                    <div className="text-xs text-zinc-400">Legal</div>
                  </div>
                  <div className="flex-1 bg-zinc-800 rounded-lg p-3 border-l-4 border-purple-500">
                    <div className="font-medium text-sm">Finance</div>
                    <div className="text-xs text-zinc-400">Financial</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['Researcher', 'Developer', 'Reviewer', 'QA'].map((role) => (
                    <div key={role} className="flex-1 bg-zinc-800 rounded-lg p-3 border-l-4 border-cyan-500">
                      <div className="font-medium text-sm">{role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modality Handlers */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Modality Handlers</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Text', icon: 'Aa', color: 'bg-blue-600' },
                  { name: 'Voice', icon: '🎤', color: 'bg-green-600' },
                  { name: 'Visual', icon: '👁', color: 'bg-purple-600' },
                  { name: 'Data', icon: '📊', color: 'bg-yellow-600' },
                  { name: 'Interactive', icon: '🖱', color: 'bg-red-600' },
                ].map((mod) => (
                  <div key={mod.name} className="bg-zinc-800 rounded-lg p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 ${mod.color} rounded-lg flex items-center justify-center font-bold`}>
                      {mod.icon}
                    </div>
                    <span className="text-sm">{mod.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Agent</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">State</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Tasks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium">{agent.name}</td>
                    <td className="px-4 py-3 text-zinc-400 capitalize">{agent.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        agent.state === 'working' ? 'bg-green-600/20 text-green-400' :
                        agent.state === 'waiting_hitl' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-zinc-700 text-zinc-400'
                      }`}>
                        {agent.state.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">{agent.tasks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Task</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Agent</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium">{task.name}</td>
                    <td className="px-4 py-3 text-zinc-400 capitalize">{task.type}</td>
                    <td className="px-4 py-3 text-zinc-400">{task.agent}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                        task.status === 'in_progress' ? 'bg-blue-600/20 text-blue-400' :
                        task.status === 'pending_hitl' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-zinc-700 text-zinc-400'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* HITL Tab */}
        {activeTab === 'hitl' && (
          <div className="space-y-4">
            {hitlRequests.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">All Clear</h3>
                <p className="text-zinc-400">No pending human-in-the-loop approvals</p>
              </div>
            ) : (
              hitlRequests.map((req) => (
                <div key={req.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-yellow-500 mt-1" />
                      <div>
                        <div className="font-medium capitalize">{req.type.replace('_', ' ')}</div>
                        <div className="text-sm text-zinc-400 mt-1">{req.description}</div>
                        <div className="text-xs text-zinc-500 mt-2">Deadline: {req.deadline}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveHITL(req.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectHITL(req.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sub-Agent Monetization Footer */}
        <div className="mt-8 bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <div className="font-medium">Downtime Monetization Active</div>
                <div className="text-sm text-zinc-400">Idle agents are processing micro-tasks</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">$127.50</div>
              <div className="text-xs text-zinc-400">Earned this cycle</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
