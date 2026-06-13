import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Products() {
  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6 space-y-8">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-luxury-gold/10 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gray">Store Administration</span>
          <h1 className="font-display text-2xl md:text-3xl tracking-widest text-luxury-ivory uppercase mt-1">
            Product Manager
          </h1>
        </div>
        <button className="btn-gold px-4 py-2 rounded text-[10px] tracking-widest flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Add Perfume
        </button>
      </div>

      {/* Product table placeholder */}
      <div className="glass-card rounded-lg overflow-hidden border border-luxury-gold/10">
        <table className="w-full text-left text-xs font-light">
          <thead className="bg-luxury-slate/50 text-luxury-gold font-display uppercase tracking-widest border-b border-luxury-gold/10">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luxury-gold/5 text-luxury-gray">
            <tr>
              <td className="p-4 font-semibold text-luxury-ivory">OUD DE KARACHI</td>
              <td className="p-4 uppercase tracking-wider">Unisex</td>
              <td className="p-4 font-mono">Rs. 8,500</td>
              <td className="p-4 text-green-500 font-medium">12 in Stock</td>
              <td className="p-4 flex justify-end gap-2">
                <button className="p-2 text-luxury-gray hover:text-luxury-gold"><Edit2 className="w-4 h-4" /></button>
                <button className="p-2 text-luxury-gray hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-luxury-ivory">ROSE IMPÉRIAL</td>
              <td className="p-4 uppercase tracking-wider">Woman</td>
              <td className="p-4 font-mono">Rs. 7,200</td>
              <td className="p-4 text-green-500 font-medium">8 in Stock</td>
              <td className="p-4 flex justify-end gap-2">
                <button className="p-2 text-luxury-gray hover:text-luxury-gold"><Edit2 className="w-4 h-4" /></button>
                <button className="p-2 text-luxury-gray hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-luxury-ivory">NIGHT ODYSSEY</td>
              <td className="p-4 uppercase tracking-wider">Man</td>
              <td className="p-4 font-mono">Rs. 6,800</td>
              <td className="p-4 text-amber-500 font-medium">3 in Stock</td>
              <td className="p-4 flex justify-end gap-2">
                <button className="p-2 text-luxury-gray hover:text-luxury-gold"><Edit2 className="w-4 h-4" /></button>
                <button className="p-2 text-luxury-gray hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
