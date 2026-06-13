import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Box, Check, MessageSquare, Clock, ShieldCheck, Truck, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderTrack() {
  const { orderId } = useParams();
  const [order, setOrder] = useState({
    orderId: orderId || 'PB-20260613-0042',
    status: 'placed',
    statusHistory: [
      { status: 'placed', note: 'Order successfully created', timestamp: new Date().toISOString() }
    ],
    paymentMethod: 'bank_transfer',
    paymentStatus: 'pending',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  });

  // Track websocket connection status
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect socket
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      withCredentials: true
    });

    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to socket gateway');
      // Join order room
      socket.emit('joinOrderRoom', order.orderId);
    });

    // Listen to live updates
    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrder(updatedOrder);
      toast.success(`Order status updated to: ${updatedOrder.status.toUpperCase()}`);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      // Clean up
      socket.emit('leaveOrderRoom', order.orderId);
      socket.disconnect();
    };
  }, [order.orderId]);

  // Status map for UI step nodes
  const steps = [
    { key: 'placed', label: 'Placed', icon: Box },
    { key: 'confirmed', label: 'Confirmed', icon: ShieldCheck },
    { key: 'packed', label: 'Packed', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Check }
  ];

  const getStepStatusClass = (stepKey) => {
    const statusOrder = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
    const currentIdx = statusOrder.indexOf(order.status);
    const stepIdx = statusOrder.indexOf(stepKey);

    if (stepIdx < currentIdx) {
      return 'bg-luxury-gold text-luxury-obsidian border-luxury-gold'; // Completed
    } else if (stepIdx === currentIdx) {
      return 'bg-luxury-gold/20 text-luxury-gold border-luxury-gold animate-pulse'; // Active
    } else {
      return 'bg-luxury-slate/50 text-luxury-gray border-luxury-gold/10'; // Inactive
    }
  };

  return (
    <div className="pt-28 min-h-[90vh] max-w-4xl mx-auto px-6 space-y-8">
      
      {/* Title & Sockets Indicators */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-luxury-gold/10 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-bold">
            Real-Time Order Tracker
          </span>
          <h1 className="font-display text-2xl md:text-3xl tracking-widest text-luxury-ivory uppercase mt-1">
            Tracking {order.orderId}
          </h1>
        </div>

        {/* Live connection badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-500 animate-ping' : 'bg-red-500'}`}></span>
          <span className="text-luxury-gray">
            {connected ? 'Live Status Connected' : 'Connecting gateway...'}
          </span>
        </div>
      </div>

      {/* Progress timeline nodes */}
      <div className="glass-card p-8 rounded-lg border border-luxury-gold/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 relative">
        
        {/* Connection bar behind nodes */}
        <div className="absolute top-1/2 left-10 right-10 h-[2px] bg-luxury-gold/10 -translate-y-1/2 hidden md:block z-0"></div>

        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center space-y-2 z-10 w-24">
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${getStepStatusClass(step.key)}`}>
                <StepIcon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-semibold ${
                order.status === step.key ? 'text-luxury-gold' : 'text-luxury-gray'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detail breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Delivery estimates */}
        <div className="glass-card p-6 rounded-lg border border-luxury-gold/10 md:col-span-2 space-y-4">
          <h3 className="font-display text-sm tracking-widest text-luxury-gold uppercase border-b border-luxury-gold/5 pb-2">
            Status Activity Log
          </h3>

          <div className="space-y-4">
            {order.statusHistory.map((history, idx) => (
              <div key={idx} className="flex gap-4 text-xs font-light">
                <div className="text-luxury-gold pt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-grow space-y-1">
                  <div className="uppercase tracking-wider font-semibold text-luxury-ivory">
                    {history.status}
                  </div>
                  <p className="text-luxury-gray leading-relaxed">{history.note}</p>
                  <span className="text-[10px] text-luxury-gray/50 block font-mono">
                    {new Date(history.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Summaries */}
        <div className="glass-card p-6 rounded-lg border border-luxury-gold/10 space-y-4 h-fit">
          <h3 className="font-display text-sm tracking-widest text-luxury-gold uppercase border-b border-luxury-gold/5 pb-2">
            Details
          </h3>
          
          <div className="text-xs space-y-3 font-light text-luxury-gray">
            <div>
              Payment Mode:{' '}
              <span className="text-luxury-ivory font-mono uppercase">{order.paymentMethod.replace('_', ' ')}</span>
            </div>
            <div>
              Payment Status:{' '}
              <span className="text-luxury-ivory font-mono uppercase">{order.paymentStatus}</span>
            </div>
            <div>
              Est. Arrival:{' '}
              <span className="text-luxury-gold font-mono">
                {new Date(order.estimatedDelivery).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
          
          <div className="border-t border-luxury-gold/5 pt-4">
            <Link to="/contact" className="btn-outline w-full py-2.5 rounded text-[10px] tracking-widest flex items-center justify-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Contact Support
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
