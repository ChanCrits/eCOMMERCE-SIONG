'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(role);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tighter text-primary">
                  {mode === 'login' ? 'Welcome Back' : 'Join Siong'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex bg-secondary p-1 rounded-2xl mb-8">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                >
                  Register
                </button>
              </div>

              {mode === 'register' && (
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">I want to be a</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setRole('buyer')}
                      className={`py-4 rounded-2xl border-2 transition-all ${role === 'buyer' ? 'border-primary bg-primary/5 text-primary' : 'border-secondary text-gray-400'}`}
                    >
                      <p className="font-bold">Buyer</p>
                      <p className="text-[10px]">Shop products</p>
                    </button>
                    <button
                      onClick={() => setRole('seller')}
                      className={`py-4 rounded-2xl border-2 transition-all ${role === 'seller' ? 'border-primary bg-primary/5 text-primary' : 'border-secondary text-gray-400'}`}
                    >
                      <p className="font-bold">Seller</p>
                      <p className="text-[10px]">Sell products</p>
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleAuth}
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                    Continue with Google
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-8">
                By continuing, you agree to Siong&apos;s Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
