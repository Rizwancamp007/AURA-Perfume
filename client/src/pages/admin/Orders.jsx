import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Clock, Eye, ArrowLeft, Package, Check, Truck, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Orders() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(filterParam === 'pending' ? 'pending' : 'all');
  
  // Modal / detail states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusNote, setStatusNote] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      toast.error('Failed to load orders from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeTab === 'pending') {
      // Show orders where bank transfer needs verification (pending payment)
      setFilteredOrders(orders.filter(o => o.paymentMethod === 'bank_transfer' && o.paymentStatus === 'pending'));
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, activeTab]);

  const handleVerifyPayment = async (orderId) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/verify`);
      if (res.data.success) {
        toast.success('Payment verified! Order confirmed.');
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.order);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
        note: statusNote || `Status updated to ${newStatus}`
      });
      if (res.data.success) {
        toast.success(`Order status updated to ${newStatus}.`);
        setStatusNote('');
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6 space-y-8 pb-16">
      
      {/* Back Button & Title */}
      <div className="space-y-2">
        <Link to="/admin" className="text-luxury-gold hover:text-luxury-gold/80 transition-colors text-xs flex items-center gap-1 w-fit">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <div className="border-b border-luxury-gold/10 pb-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gray">Store Administration</span>
          <h1 className="font-display text-2xl md:text-3xl tracking-widest text-luxury-ivory uppercase mt-1">
            Order Manager
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-luxury-gold/5 pb-2">
        <button 
          onClick={() => setActiveTab('all')}
          className={`text-xs tracking-widest uppercase pb-2 px-1 border-b-2 transition-all ${
            activeTab === 'all' ? 'border-luxury-gold text-luxury-gold font-medium' : 'border-transparent text-luxury-gray hover:text-luxury-ivory'
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`text-xs tracking-widest uppercase pb-2 px-1 border-b-2 transition-all ${
            activeTab === 'pending' ? 'border-luxury-gold text-luxury-gold font-medium' : 'border-transparent text-luxury-gray hover:text-luxury-ivory'
          }`}
        >
          Receipts Pending Verification ({orders.filter(o => o.paymentMethod === 'bank_transfer' && o.paymentStatus === 'pending').length})
        </button>
      </div>

      {/* Orders View */}
      {loading ? (
        <div className="text-center py-12 text-luxury-gray">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-card p-12 text-center text-luxury-gray">
          No orders found matching this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main List Table */}
          <div className="lg:col-span-2 glass-card rounded-lg overflow-hidden border border-luxury-gold/10">
            <table className="w-full text-left text-xs font-light">
              <thead className="bg-luxury-slate/50 text-luxury-gold font-display uppercase tracking-widest border-b border-luxury-gold/10">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-gold/5 text-luxury-gray">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-luxury-gold/[0.01] transition-colors">
                    <td className="p-4 font-semibold text-luxury-ivory font-mono">{order.orderId}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-luxury-ivory">{order.user?.name || 'Guest User'}</div>
                        <div className="text-[10px] text-luxury-gray">{order.user?.email}</div>
                      </div>
                    </td>
                    <td className="p-4 uppercase text-[10px]">{order.paymentMethod.replace('_', ' ')}</td>
                    <td className="p-4 font-mono text-luxury-gold">Rs. {order.total.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider w-fit border ${
                          order.status === 'delivered' ? 'bg-green-950/20 text-green-500 border-green-900' :
                          order.status === 'shipped' ? 'bg-blue-950/20 text-blue-500 border-blue-900' :
                          order.status === 'confirmed' ? 'bg-indigo-950/20 text-indigo-500 border-indigo-900' :
                          'bg-amber-950/20 text-amber-500 border-amber-900'
                        }`}>
                          {order.status}
                        </span>
                        
                        {order.paymentMethod === 'bank_transfer' && (
                          <span className={`text-[9px] ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>
                            {order.paymentStatus === 'paid' ? '● Verified' : '○ Receipt Unverified'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-1 space-y-1">
                      {order.paymentMethod === 'bank_transfer' && order.paymentStatus === 'pending' && (
                        <button 
                          onClick={() => handleVerifyPayment(order._id)}
                          className="btn-gold px-2.5 py-1 rounded text-[9px] tracking-wider inline-flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verify
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="btn-outline px-2.5 py-1 rounded text-[9px] tracking-wider inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Details Sidebar panel */}
          {selectedOrder ? (
            <div className="glass-card p-6 rounded-lg border border-luxury-gold/15 space-y-6">
              <div className="flex justify-between items-center border-b border-luxury-gold/10 pb-3">
                <h3 className="font-display text-sm tracking-wider text-luxury-gold uppercase">Order Details</h3>
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="text-luxury-gray hover:text-luxury-ivory text-xs"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Info block */}
                <div>
                  <span className="text-[10px] text-luxury-gray uppercase tracking-widest block">Reference ID</span>
                  <span className="font-mono text-luxury-ivory text-sm">{selectedOrder.orderId}</span>
                </div>

                <div>
                  <span className="text-[10px] text-luxury-gray uppercase tracking-widest block">Customer Info</span>
                  <span className="text-luxury-ivory block font-medium">{selectedOrder.shippingAddress?.name}</span>
                  <span className="text-luxury-gray block">{selectedOrder.shippingAddress?.phone}</span>
                </div>

                <div>
                  <span className="text-[10px] text-luxury-gray uppercase tracking-widest block">Shipping Destination</span>
                  <span className="text-luxury-ivory block leading-relaxed">
                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.province}
                  </span>
                </div>

                {/* Items */}
                <div className="border-t border-b border-luxury-gold/5 py-3 space-y-2">
                  <span className="text-[10px] text-luxury-gray uppercase tracking-widest block">Ordered Perfumes</span>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-luxury-ivory">
                      <div>
                        <span>{item.name} <span className="text-luxury-gray">({item.quantity}x)</span></span>
                        {item.engravingText && (
                          <div className="text-[9px] text-luxury-gold italic">Engraved: "{item.engravingText}"</div>
                        )}
                      </div>
                      <span className="font-mono text-luxury-gold">Rs. {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Payment Screenshot Proof */}
                {selectedOrder.paymentScreenshot && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-luxury-gray uppercase tracking-widest block">Bank Transfer Receipt Proof</span>
                    <a 
                      href={selectedOrder.paymentScreenshot} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="block border border-luxury-gold/10 hover:border-luxury-gold/45 rounded overflow-hidden relative group"
                    >
                      <img 
                        src={selectedOrder.paymentScreenshot} 
                        alt="Receipt proof screenshot" 
                        className="w-full h-32 object-cover" 
                      />
                      <div className="absolute inset-0 bg-luxury-obsidian/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] tracking-wider text-luxury-gold uppercase font-medium">
                        View Full Screenshot
                      </div>
                    </a>
                  </div>
                )}

                {/* Status timelines management */}
                <div className="space-y-3 pt-3">
                  <span className="text-[10px] text-luxury-gray uppercase tracking-widest block">Manage Shipping Timeline</span>
                  
                  <textarea
                    rows={2}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Provide tracking code or timeline update notes..."
                    className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded p-2 text-xs focus:outline-none focus:border-luxury-gold text-luxury-ivory placeholder:text-luxury-gray/50"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'confirmed')}
                      disabled={selectedOrder.status === 'confirmed'}
                      className="btn-outline py-2 rounded text-[8px] tracking-widest uppercase flex flex-col items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 text-indigo-400" />
                      Confirm
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'shipped')}
                      disabled={selectedOrder.status === 'shipped'}
                      className="btn-outline py-2 rounded text-[8px] tracking-widest uppercase flex flex-col items-center justify-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5 text-blue-400" />
                      Ship
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'delivered')}
                      disabled={selectedOrder.status === 'delivered'}
                      className="btn-outline py-2 rounded text-[8px] tracking-widest uppercase flex flex-col items-center justify-center gap-1"
                    >
                      <Package className="w-3.5 h-3.5 text-green-400" />
                      Deliver
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="glass-card p-6 rounded-lg border border-luxury-gold/5 flex flex-col items-center justify-center text-center text-luxury-gray min-h-[300px]">
              <AlertCircle className="w-8 h-8 text-luxury-gold/20 mb-2" />
              <p className="text-xs">Select an order from the list to view full customer details, payment receipts, and manage shipping dispatch timelines.</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
