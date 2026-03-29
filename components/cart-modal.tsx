'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, clearCart, totalPrice, totalItems, addItem } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-secondary flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-primary" size={24} />
                <h2 className="text-2xl font-bold tracking-tighter">Your Cart</h2>
                <span className="bg-secondary px-2 py-1 rounded-full text-[10px] font-bold">{totalItems} items</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill 
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-primary font-bold mt-1">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-secondary rounded-full p-1">
                            <button className="p-1 hover:bg-white rounded-full transition-all"><Minus size={12} /></button>
                            <span className="text-xs font-bold px-3">{item.quantity}</span>
                            <button 
                              onClick={() => addItem(item)}
                              className="p-1 hover:bg-white rounded-full transition-all"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
                  <button 
                    onClick={onClose}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-secondary bg-secondary/20">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group">
                  Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={clearCart}
                  className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
