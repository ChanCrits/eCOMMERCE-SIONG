'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Apparel',
    description: '',
    image: '',
    stock: '10'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || profile?.role !== 'seller') return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sellerId: user.uid,
        sellerName: user.displayName,
        createdAt: serverTimestamp(),
        status: 'active'
      });
      setFormData({
        name: '',
        price: '',
        category: 'Apparel',
        description: '',
        image: '',
        stock: '10'
      });
      onClose();
    } catch (error) {
      console.error('Failed to add product', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-[110] overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tighter uppercase">Add New Product</h2>
                <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Product Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                      placeholder="e.g. Minimalist T-Shirt"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Price ($)</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                        placeholder="45.00"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Stock</label>
                      <input
                        required
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none"
                    >
                      <option>Apparel</option>
                      <option>Home</option>
                      <option>Accessories</option>
                      <option>Lifestyle</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Image URL</label>
                    <div className="relative">
                      <input
                        required
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none pl-12"
                        placeholder="https://picsum.photos/..."
                      />
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                      placeholder="Describe your product..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={20} />
                        List Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
