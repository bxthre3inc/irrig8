import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, CheckCircle2, XCircle, Clock, FileSignature,
  RefreshCw, Search, Mail, Download, ExternalLink, FileText,
  TrendingUp, DollarSign, Plus, UserPlus, AlertCircle
} from 'lucide-react';

interface AccessRequest {
  id: string;
  name: string;
  email: string;
  firm?: string;
  status: 'pending' | 'approved' | 'rejected';
  ndaSigned: boolean;
  ndaDate?: string;
  requestedAt: string;
  type: 'request' | 'buyin';
  amount?: number;
}

interface BuyInIntent {
  id: string;
  name: string;
  email: string;
  amount: number;
  shares: number;
  ndaSigned: boolean;
  ndaDate: string;
  status: 'pending' | 'approved' | 'completed';
  submittedAt: string;
}

export const InvestorManagement: React.FC = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [buyins, setBuyins] = useState<BuyInIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'access' | 'buyins' | 'analytics'>('access');
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, buyRes] = await Promise.all([
        fetch('/api/investor/list-requests', { headers: { 'Authorization': 'Bearer admin' }}),
        fetch('/api/investor/list-buyins', { headers: { 'Authorization': 'Bearer admin' }})
      ]);
      const reqData = await reqRes.json();
      const buyData = await buyRes.json();
      setRequests(reqData.requests || []);
      setBuyins(buyData.buyins || []);
    } catch (err) {
      console.error('Failed to load investor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: string) => {
    await fetch('/api/investor/grant-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin' },
      body: JSON.stringify({ id })
    });
    fetchData();
  };

  const handleSendInvite = async () => {
    await fetch('/api/investor/send-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin' },
      body: JSON.stringify({ email: inviteEmail, name: inviteName })
    });
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteName('');
    fetchData();
  };

  const filteredRequests = requests.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.firm && r.firm.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    buyinPending: buyins.filter(b => b.status === 'pending').length,
    totalBuyin: buyins.reduce((sum, b) => sum + b.amount, 0)
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            Investor Relations
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Manage NDA status, data room access, and equity pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Send Invite
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-amber-500 mb-3">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-black uppercase">Pending Access</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-500 mb-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-black uppercase">Approved</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.approved}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-indigo-500 mb-3">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-black uppercase">Buy-In Pending</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.buyinPending}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600 mb-3">
            <DollarSign className="w-5 h-5" />
            <span className="text-xs font-black uppercase">Pipeline Value</span>
          </div>
          <p className="text-3xl font-black text-slate-900">${(stats.totalBuyin / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'access', label: 'Access Requests', count: stats.pending },
          { id: 'buyins', label: 'Buy-In Pipeline', count: stats.buyinPending },
          { id: 'analytics', label: 'Analytics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, or firm..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Content */}
      {activeTab === 'access' && (
        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase">Investor</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase">NDA Status</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase">Access Status</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase">Requested</th>
                <th className="px-8 py-5 text-right text-xs font-extrabold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <div>
                      <div className="font-bold text-slate-900">{req.name}</div>
                      <div className="text-xs text-slate-500">{req.email}</div>
                      {req.firm && <div className="text-xs text-emerald-600 font-medium mt-1">{req.firm}</div>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {req.ndaSigned ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700">
                        <FileSignature className="w-3 h-3" /> Signed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500">
                        <AlertCircle className="w-3 h-3" /> Not Signed
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                      req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status === 'pending' ? <Clock className="w-3 h-3" /> : 
                       req.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> :
                       <XCircle className="w-3 h-3" />}
                      {req.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500">
                    {new Date(req.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    {req.status === 'pending' && req.ndaSigned && (
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'buyins' && (
        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase">Investor</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase">Amount</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase">Shares</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase">NDA</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {buyins.map((buy) => (
                <tr key={buy.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-900">{buy.name}</div>
                    <div className="text-xs text-slate-500">{buy.email}</div>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-900">${buy.amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-slate-600">{buy.shares.toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700">
                      <FileSignature className="w-3 h-3" /> ✓
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                      buy.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {buy.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {buy.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-1">Send Investor Invite</h3>
            <p className="text-slate-500 text-sm mb-6">Pre-approve for data room access. NDA still required.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Email *</label>
                <input 
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-emerald-500"
                  placeholder="investor@firm.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Name</label>
                <input 
                  type="text"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-emerald-500"
                  placeholder="Full name"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleSendInvite}
                disabled={!inviteEmail}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold rounded-xl transition-all"
              >
                Send Invite
              </button>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};