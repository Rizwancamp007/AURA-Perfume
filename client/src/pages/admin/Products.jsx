import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, Save, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'unisex',
    tagline: '',
    description: '',
    price: '',
    stock: '',
    imagesString: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.products || res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load products from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'unisex',
      tagline: '',
      description: '',
      price: '',
      stock: '',
      imagesString: '',
      topNotes: '',
      heartNotes: '',
      baseNotes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      tagline: product.tagline || '',
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      imagesString: product.images ? product.images.join(', ') : '',
      topNotes: product.scentNotes?.top ? product.scentNotes.top.join(', ') : '',
      heartNotes: product.scentNotes?.heart ? product.scentNotes.heart.join(', ') : '',
      baseNotes: product.scentNotes?.base ? product.scentNotes.base.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this perfume?')) return;
    try {
      const res = await api.delete(`/products/${productId}`);
      if (res.data.success) {
        toast.success('Product deleted successfully.');
        fetchProducts();
      }
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse image URLs and notes
    const images = formData.imagesString.split(',').map(s => s.trim()).filter(Boolean);
    const top = formData.topNotes.split(',').map(s => s.trim()).filter(Boolean);
    const heart = formData.heartNotes.split(',').map(s => s.trim()).filter(Boolean);
    const base = formData.baseNotes.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      name: formData.name,
      category: formData.category,
      tagline: formData.tagline,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop'],
      scentNotes: { top, heart, base }
    };

    try {
      if (editingProduct) {
        // Update
        const res = await api.put(`/products/${editingProduct._id}`, payload);
        if (res.data.success) {
          toast.success('Product updated successfully.');
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        // Create
        const res = await api.post('/products', payload);
        if (res.data.success) {
          toast.success('Product created successfully.');
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product changes.');
    }
  };

  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6 space-y-8 pb-16">
      
      {/* Back Button & Header */}
      <div className="space-y-2">
        <Link to="/admin" className="text-luxury-gold hover:text-luxury-gold/80 transition-colors text-xs flex items-center gap-1 w-fit">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center border-b border-luxury-gold/10 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gray">Store Administration</span>
            <h1 className="font-display text-2xl md:text-3xl tracking-widest text-luxury-ivory uppercase mt-1">
              Product Manager
            </h1>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="btn-gold px-4 py-2 rounded text-[10px] tracking-widest flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Perfume
          </button>
        </div>
      </div>

      {/* Main product list table */}
      {loading ? (
        <div className="text-center py-12 text-luxury-gray">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="glass-card p-12 text-center text-luxury-gray">
          No boutique fragrances registered. Click "Add Perfume" to create one.
        </div>
      ) : (
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
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-luxury-gold/[0.01] transition-colors">
                  <td className="p-4 font-semibold text-luxury-ivory">{product.name}</td>
                  <td className="p-4 uppercase tracking-wider text-[10px]">{product.category}</td>
                  <td className="p-4 font-mono text-luxury-gold">Rs. {product.price.toLocaleString()}</td>
                  <td className={`p-4 font-medium ${product.stock <= 3 ? 'text-amber-500' : 'text-green-500'}`}>
                    {product.stock} in Stock
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      onClick={() => handleOpenEditModal(product)}
                      className="p-2 text-luxury-gray hover:text-luxury-gold transition-colors"
                      title="Edit details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-luxury-gray hover:text-red-400 transition-colors"
                      title="Delete perfume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Form Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-luxury-obsidian/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-lg border border-luxury-gold/20 p-6 space-y-6 relative">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-luxury-gray hover:text-luxury-ivory transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-base tracking-widest text-luxury-gold uppercase border-b border-luxury-gold/10 pb-2">
              {editingProduct ? 'Edit Fragrance Details' : 'Add Luxury Fragrance'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Perfume Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-3 py-2 text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-3 py-2 text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="man">Man</option>
                    <option value="woman">Woman</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Scent Tagline</label>
                <input 
                  type="text" 
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  placeholder="e.g. Artisanal Golden Saffron & Warm Oud Wood"
                  className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-3 py-2 text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Scent Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-3 py-2 text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Price (Rs.)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-3 py-2 text-luxury-ivory focus:outline-none focus:border-luxury-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-3 py-2 text-luxury-ivory focus:outline-none focus:border-luxury-gold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Image URLs (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.imagesString}
                  onChange={(e) => setFormData({...formData, imagesString: e.target.value})}
                  placeholder="https://image1.jpg, https://image2.jpg"
                  className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-3 py-2 text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="border-t border-luxury-gold/10 pt-3 space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold block">Olfactory Scent Notes</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase text-luxury-gray mb-1">Top Notes (comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.topNotes}
                      onChange={(e) => setFormData({...formData, topNotes: e.target.value})}
                      placeholder="Saffron, Nutmeg"
                      className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-2 py-1.5 text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase text-luxury-gray mb-1">Heart Notes (comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.heartNotes}
                      onChange={(e) => setFormData({...formData, heartNotes: e.target.value})}
                      placeholder="Oud, Lavender"
                      className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-2 py-1.5 text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase text-luxury-gray mb-1">Base Notes (comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.baseNotes}
                      onChange={(e) => setFormData({...formData, baseNotes: e.target.value})}
                      placeholder="Amber, Sandalwood"
                      className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-2 py-1.5 text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-luxury-gold/10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-outline px-4 py-2 rounded text-[10px] tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-gold px-5 py-2 rounded text-[10px] tracking-widest flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Fragrance
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
