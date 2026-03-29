'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Menu, X, ChevronRight, ArrowRight, Star, Instagram, Twitter, Facebook, User, LogOut, PlusCircle, LayoutDashboard, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { AuthModal } from '@/components/auth-modal';
import { AddProductModal } from '@/components/add-product-modal';
import { CartModal } from '@/components/cart-modal';
import { useCart } from '@/hooks/use-cart';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/firebase';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Shop', href: '#shop' },
    { name: 'Collections', href: '#collections' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <a href="#" className="text-2xl font-bold tracking-tighter text-primary">SIONG</a>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest">{item.name}</a>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <button className="hidden sm:block p-2 hover:bg-secondary rounded-full transition-colors">
            <Search size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-secondary rounded-full transition-colors relative"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-secondary p-1 pr-3 rounded-full hover:bg-accent transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {user.displayName?.charAt(0)}
                  </div>
                  <span className="text-xs font-bold hidden md:block">{user.displayName?.split(' ')[0]}</span>
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-secondary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-[100]">
                  <div className="px-4 py-2 border-b border-secondary mb-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{profile?.role}</p>
                    <p className="text-xs font-bold truncate">{user.email}</p>
                  </div>
                  
                  {profile?.role === 'seller' && (
                    <button 
                      onClick={() => setIsAddProductOpen(true)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary rounded-xl transition-colors"
                    >
                      <PlusCircle size={16} /> Add Product
                    </button>
                  )}
                  
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary rounded-xl transition-colors">
                    <LayoutDashboard size={16} /> Dashboard
                  </button>
                  
                  <button 
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 text-red-500 rounded-xl transition-colors mt-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <User size={16} /> Login
              </button>
            )}
          </div>

          <button 
            className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] p-6 flex flex-col"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-8 mt-12">
              {['Shop', 'Collections', 'About', 'Contact'].map((item) => (
                <a key={item} href="#" className="text-4xl font-bold tracking-tighter hover:text-primary transition-colors">{item}</a>
              ))}
              {!user && (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="text-4xl font-bold tracking-tighter text-primary text-left"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-secondary">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent z-10" />
        <Image 
          src="https://picsum.photos/seed/minimalist-fashion/1920/1080" 
          alt="Hero background" 
          fill 
          className="object-cover"
          referrerPolicy="no-referrer"
          priority
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">New Arrival 2026</span>
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
            Elegance in <br />
            <span className="text-primary">Simplicity.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-md">
            Discover our curated collection of minimalist essentials designed for the modern lifestyle. Quality meets aesthetic.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-all hover:gap-4 group">
              Shop Collection <ArrowRight size={18} />
            </button>
            <button className="border border-primary text-primary px-8 py-4 rounded-full font-medium hover:bg-primary hover:text-white transition-all">
              View Lookbook
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-6 z-20 hidden md:block">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-[1px] bg-primary" />
          <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(8)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="shop" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter mb-4">Featured Essentials</h2>
            <p className="text-gray-500">Handpicked pieces for your everyday rotation.</p>
          </div>
          <a href="#" className="text-sm font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors">View All</a>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary mb-4">
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(product);
                    }}
                    className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm py-3 rounded-xl font-medium opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                  >
                    Quick Add
                  </button>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-[10px] text-gray-400">By {product.sellerName}</p>
                  </div>
                  <p className="font-medium text-primary">${product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/30 rounded-[32px]">
            <p className="text-gray-500 font-medium italic">No products listed yet. Be the first to sell!</p>
          </div>
        )}
      </div>
    </section>
  );
};

const CategoryShowcase = () => {
  return (
    <section id="collections" className="py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -10 }}
            className="relative h-[600px] rounded-3xl overflow-hidden group"
          >
            <Image 
              src="https://picsum.photos/seed/men/800/1200" 
              alt="Men&apos;s Collection" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute bottom-12 left-12 text-white">
              <h3 className="text-5xl font-bold tracking-tighter mb-4">Men&apos;s</h3>
              <button className="flex items-center gap-2 font-medium border-b border-white pb-1 hover:gap-4 transition-all">
                Explore Collection <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="relative h-[600px] rounded-3xl overflow-hidden group"
          >
            <Image 
              src="https://picsum.photos/seed/women/800/1200" 
              alt="Women&apos;s Collection" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute bottom-12 left-12 text-white">
              <h3 className="text-5xl font-bold tracking-tighter mb-4">Women&apos;s</h3>
              <button className="flex items-center gap-2 font-medium border-b border-white pb-1 hover:gap-4 transition-all">
                Explore Collection <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-white border-t border-secondary py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-1">
            <a href="#" className="text-3xl font-bold tracking-tighter text-primary mb-6 block">SIONG</a>
            <p className="text-gray-500 mb-8 max-w-xs">
              Redefining minimalist fashion and lifestyle through quality and intentional design.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-all"><Instagram size={20} /></a>
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-all"><Twitter size={20} /></a>
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-all"><Facebook size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-8">Shop</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sale</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-8">Support</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-8">Newsletter</h4>
            <p className="text-sm text-gray-500 mb-6">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-secondary border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
              <button className="bg-primary text-white rounded-full py-3 text-sm font-bold hover:bg-primary/90 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-secondary gap-6">
          <p className="text-xs text-gray-400">© 2026 SIONG. All rights reserved.</p>
          <div className="flex gap-8 text-xs text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <CategoryShowcase />
      
      {/* Testimonial Section */}
      <section className="py-24 bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center gap-1 mb-8">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={20} fill="white" />)}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight mb-8 italic">
              &quot;Siong has completely transformed my wardrobe. The quality is unmatched and the minimalist aesthetic is exactly what I was looking for.&quot;
            </h2>
            <p className="font-bold tracking-widest uppercase text-sm">— Sarah Jenkins, Creative Director</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
