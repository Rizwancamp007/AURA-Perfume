import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShieldAlert, ShoppingCart, Users, ArrowRight, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    registeredMembers: 0,
    pendingVerifications: 0
  });
  const [view, setView] = useState('overview'); // overview, members, messages
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      toast.error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setMembers(res.data.members);
      }
    } catch (err) {
      toast.error('Failed to load registered members.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/messages');
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      toast.error('Failed to load customer messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (view === 'members') {
      fetchMembers();
    } else if (view === 'messages') {
      fetchMessages();
    } else if (view === 'overview') {
      fetchStats();
    }
  }, [view]);

  if (loading && view === 'overview') {
    return (
      <div className="min-h-screen bg-luxury-obsidian flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6 space-y-8 pb-16">
      
      {/* Header / Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-gold/10 pb-4 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-bold">Store Administration</span>
          <h1 className="font-display text-2xl md:text-3xl tracking-widest text-luxury-ivory uppercase mt-1">
            {view === 'overview' && 'Dashboard Overview'}
            {view === 'members' && 'Registered Members'}
            {view === 'messages' && 'Concierge Messages'}
          </h1>
        </div>

        {view !== 'overview' && (
          <button 
            onClick={() => setView('overview')}
            className="btn-outline px-4 py-2 rounded text-[10px] tracking-widest flex items-center gap-1.5 w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
        )}
      </div>

      {view === 'overview' ? (
        <>
          {/* KPI statistics row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Total Revenue */}
            <div className="glass-card p-6 rounded-lg border border-luxury-gold/10 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gray">Total Revenue</span>
                <div className="text-xl font-mono text-luxury-gold">Rs. {stats.totalRevenue.toLocaleString()}</div>
              </div>
              <DollarSign className="w-8 h-8 text-luxury-gold/20" />
            </div>

            {/* Total Orders Card -> Clickable */}
            <Link to="/admin/orders" className="glass-card p-6 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all flex items-center justify-between group cursor-pointer">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gray group-hover:text-luxury-gold transition-colors">Total Orders</span>
                <div className="text-xl font-mono text-luxury-ivory">{stats.totalOrders}</div>
              </div>
              <ShoppingCart className="w-8 h-8 text-luxury-gold/20 group-hover:text-luxury-gold/40 transition-colors" />
            </Link>

            {/* Registered Members Card -> Clickable to switch view */}
            <div 
              onClick={() => setView('members')}
              className="glass-card p-6 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gray group-hover:text-luxury-gold transition-colors">Registered Members</span>
                <div className="text-xl font-mono text-luxury-ivory">{stats.registeredMembers}</div>
              </div>
              <Users className="w-8 h-8 text-luxury-gold/20 group-hover:text-luxury-gold/40 transition-colors" />
            </div>

            {/* Pending Verifications Card -> Clickable */}
            <Link 
              to="/admin/orders?filter=pending" 
              className="glass-card p-6 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gray group-hover:text-amber-500 transition-colors">Pending Verifications</span>
                <div className="text-xl font-mono text-amber-500 font-bold">{stats.pendingVerifications}</div>
              </div>
              <ShieldAlert className="w-8 h-8 text-amber-500/20 group-hover:text-amber-500/40 transition-colors" />
            </Link>

          </div>

          {/* Navigation shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            
            <Link to="/admin/products" className="glass-card p-6 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all flex justify-between items-center group">
              <div>
                <h4 className="font-display uppercase text-xs tracking-widest text-luxury-gold">Manage Products</h4>
                <p className="text-[10px] text-luxury-gray mt-1">Add, update, or remove boutique perfumes</p>
              </div>
              <ArrowRight className="w-4 h-4 text-luxury-gray group-hover:text-luxury-gold transition-colors" />
            </Link>

            <Link to="/admin/orders" className="glass-card p-6 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all flex justify-between items-center group">
              <div>
                <h4 className="font-display uppercase text-xs tracking-widest text-luxury-gold">Manage Orders</h4>
                <p className="text-[10px] text-luxury-gray mt-1">Verify bank receipts, modify tracking</p>
              </div>
              <ArrowRight className="w-4 h-4 text-luxury-gray group-hover:text-luxury-gold transition-colors" />
            </Link>

            <Link to="/admin/hero" className="glass-card p-6 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all flex justify-between items-center group">
              <div>
                <h4 className="font-display uppercase text-xs tracking-widest text-luxury-gold">Hero Banner Editor</h4>
                <p className="text-[10px] text-luxury-gray mt-1">Instantly change homepage content layouts</p>
              </div>
              <ArrowRight className="w-4 h-4 text-luxury-gray group-hover:text-luxury-gold transition-colors" />
            </Link>

            <div 
              onClick={() => setView('messages')}
              className="glass-card p-6 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all flex justify-between items-center group cursor-pointer"
            >
              <div>
                <h4 className="font-display uppercase text-xs tracking-widest text-luxury-gold">Customer Inquiries</h4>
                <p className="text-[10px] text-luxury-gray mt-1">View messages received via contact form</p>
              </div>
              <ArrowRight className="w-4 h-4 text-luxury-gray group-hover:text-luxury-gold transition-colors" />
            </div>

          </div>
        </>
      ) : view === 'members' ? (
        /* Members List View */
        <div className="glass-card rounded-lg overflow-hidden border border-luxury-gold/10">
          {loading ? (
            <div className="p-12 text-center text-luxury-gray">Loading registered members...</div>
          ) : members.length === 0 ? (
            <div className="p-12 text-center text-luxury-gray">No registered customer accounts found.</div>
          ) : (
            <table className="w-full text-left text-xs font-light">
              <thead className="bg-luxury-slate/50 text-luxury-gold font-display uppercase tracking-widest border-b border-luxury-gold/10">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-gold/5 text-luxury-gray">
                {members.map((member) => (
                  <tr key={member._id} className="hover:bg-luxury-gold/[0.02] transition-colors">
                    <td className="p-4 font-semibold text-luxury-ivory">{member.name}</td>
                    <td className="p-4 font-mono">{member.email}</td>
                    <td className="p-4">{member.phone || '—'}</td>
                    <td className="p-4 font-mono text-[10px]">
                      {new Date(member.createdAt).toLocaleDateString()} {new Date(member.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* Messages List View */
        <div className="space-y-6">
          {loading ? (
            <div className="glass-card p-12 text-center text-luxury-gray">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="glass-card p-12 text-center text-luxury-gray">No customer messages received yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {messages.map((msg) => (
                <div key={msg._id} className="glass-card p-6 rounded-lg border border-luxury-gold/10 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-gold/5 pb-3 gap-2">
                    <div>
                      <h3 className="font-display uppercase text-xs tracking-wider text-luxury-gold">{msg.name}</h3>
                      <div className="flex flex-wrap gap-4 text-[10px] text-luxury-gray mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-luxury-gold/50" />
                          {msg.email}
                        </span>
                        {msg.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-luxury-gold/50" />
                            {msg.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-luxury-gray">
                      <Calendar className="w-3.5 h-3.5 text-luxury-gold/50" />
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-luxury-gray block">Subject: {msg.subject}</span>
                    <p className="text-xs text-luxury-ivory font-light leading-relaxed mt-2 bg-luxury-slate/30 p-4 rounded border border-luxury-gold/5 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
