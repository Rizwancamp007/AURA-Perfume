import React from 'react';
import { ShieldCheck, Clock, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Orders() {
  const handleVerifyPayment = () => {
    toast.success('Payment verified successfully. Receipt and funds confirmed.');
  };

  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6 space-y-8">
      
      {/* Title */}
      <div className="border-b border-luxury-gold/10 pb-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gray">Store Administration</span>
        <h1 className="font-display text-2xl md:text-3xl tracking-widest text-luxury-ivory uppercase mt-1">
          Order Manager
        </h1>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-lg overflow-hidden border border-luxury-gold/10">
        <table className="w-full text-left text-xs font-light">
          <thead className="bg-luxury-slate/50 text-luxury-gold font-display uppercase tracking-widest border-b border-luxury-gold/10">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Method</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luxury-gold/5 text-luxury-gray">
            <tr>
              <td className="p-4 font-semibold text-luxury-ivory font-mono">PB-20260613-0042</td>
              <td className="p-4 font-medium text-luxury-ivory">Farhan Ahmed</td>
              <td className="p-4 uppercase">Bank Transfer</td>
              <td className="p-4 font-mono">Rs. 7,300</td>
              <td className="p-4">
                <span className="bg-amber-950/20 text-amber-500 border border-amber-900 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 w-fit">
                  <Clock className="w-3 h-3" />
                  Receipt Uploaded
                </span>
              </td>
              <td className="p-4 flex justify-end gap-2">
                <button 
                  onClick={handleVerifyPayment}
                  className="btn-gold px-3 py-1 rounded text-[9px] tracking-widest flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verify
                </button>
                <button className="btn-outline px-3 py-1 rounded text-[9px] tracking-widest flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
