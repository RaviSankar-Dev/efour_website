import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, Clock, Info, User, LogOut, LayoutDashboard, Globe, Zap, Shield, Activity, Fingerprint, Lock, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cart from '../Cart';
import useStore from '../../store/useStore';
import PolicyConsent from '../common/PolicyConsent';
import Footer from '../Footer';
import BumperCar from '../common/BumperCar';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const toggleCart = useStore(state => state.toggleCart);
    const cart = useStore(state => state.cart);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'DINE', path: '/dine' },
        ...(user ? [{ name: 'YOUR TICKETS', path: '/tickets' }] : []),
        { name: 'CONTACT', path: '/contact' },
    ];

    const isMainPage = ['/', '/login'].includes(location.pathname);

    // Function to handle navigating to rides section from other pages
    const handleBookRide = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            document.getElementById('rides')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="floating-navbar">
            <div className="container mx-auto max-w-7xl h-20 md:h-32 flex justify-between items-center px-6 md:px-12 relative">
                <Link to="/" className="w-28 md:w-56 flex items-center group shrink-0 relative z-30">
                    <img
                        src="/E4LOGO.jpeg"
                        alt="E4 Logo"
                        className="h-[4.5rem] md:h-28 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-700 group-hover:scale-105 group-hover:rotate-2"
                        loading="eager"
                        fetchpriority="high"
                    />
                </Link>

                {/* Desktop Nav Matrix */}
                <nav className="hidden lg:flex gap-1 items-center bg-white/[0.02] p-1.5 rounded-full border border-white/5 backdrop-blur-3xl shadow-2xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link-premium px-8 py-3 ${location.pathname === link.path ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                        >
                            {location.pathname === link.path && (
                                <motion.div
                                    layout
                                    className="absolute inset-0 bg-white/[0.05] rounded-full z-0 border border-white/5"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-6">
                    <button
                        onClick={toggleCart}
                        className="relative w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white hover:bg-white/[0.08] hover:border-[#6C5CE7]/30 transition-all duration-500 group/cart"
                    >
                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform group-hover:text-[#6C5CE7]" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#6C5CE7] text-white text-[10px] w-6 h-6 rounded-lg flex items-center justify-center font-black shadow-lg shadow-[#6C5CE7]/40 ring-4 ring-[#02040a]">
                                {cart.length}
                            </span>
                        )}
                    </button>

                    {!isMainPage && (
                        <Link
                            to="/#rides"
                            onClick={handleBookRide}
                            className="px-8 py-4 rounded-2xl bg-[#6C5CE7] text-white font-black text-xs uppercase tracking-widest hover:bg-[#5849D1] transition-all shadow-xl shadow-[#6C5CE7]/20 flex items-center gap-3 active:scale-95"
                        >
                            RIDE NOW <Zap size={12} className="fill-current animate-pulse" />
                        </Link>
                    )}

                    <Link to="/login" className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white hover:bg-white/[0.08] hover:border-[#6C5CE7]/30 transition-all duration-500 group/user">
                        <User size={20} className="group-hover:scale-110 transition-transform group-hover:text-[#6C5CE7]" />
                    </Link>

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="px-5 py-3 rounded-xl border border-white/10 text-[#6C5CE7] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#6C5CE7]/10 transition-all">
                            ADMIN
                        </Link>
                    )}

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="w-14 h-14 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/40 hover:bg-red-500 hover:text-white transition-all duration-500 flex items-center justify-center active:scale-90"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>

                {/* Mobile Identity */}
                <div className="flex md:hidden items-center gap-4">
                    <button
                        onClick={toggleCart}
                        className="relative w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white"
                    >
                        <ShoppingCart size={20} />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#6C5CE7] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg">
                                {cart.length}
                            </span>
                        )}
                    </button>
                    <Link
                        to="/login"
                        className={`font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl shadow-2xl border border-white/10 active:scale-95 transition-all flex items-center justify-center bg-[#6C5CE7] text-white ${user ? 'w-12 h-12 px-0' : 'text-[11px]'}`}
                    >
                        {user ? <User size={20} /> : 'LOGIN'}
                    </Link>
                </div>
            </div>
        </header>
    );
};

const FooterInfoBar = () => {
    return (
        <div className="hidden lg:block fixed bottom-0 left-0 w-full bg-[#02040a]/80 backdrop-blur-3xl border-t border-white/5 text-[#94A3B8] py-5 px-12 z-40">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-8 group transition-all hover:text-[#6C5CE7]">
                    <div className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-pulse shadow-[0_0_20px_#6C5CE7]" />
                     <span className="text-xs font-black uppercase tracking-[0.5em] italic opacity-40">EFOUR ELURU @ 2026</span>
                </div>
                <div className="flex items-center gap-12 text-xs font-black uppercase tracking-[0.4em] italic opacity-40">
                    <span className="flex items-center gap-4 hover:opacity-100 transition-opacity hover:text-[#6C5CE7]"><Clock size={14} /> UNTIL 11:00 PM</span>
                    <span className="flex items-center gap-4 hover:opacity-100 transition-opacity hover:text-[#FF7A00]"><MapPin size={14} /> NR PETA, ELURU</span>
                </div>
            </div>
        </div>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#02040a] selection:bg-[#6C5CE7]/30 selection:text-white font-sans overflow-x-hidden antialiased scroll-smooth">
            {/* Global Dark Depth */}
            <div className="noise-overlay" />
            <div className="premium-blur-bg">
                <div className="ambient-light w-[50%] h-[50%] bg-[#6C5CE7]/5 top-[-10%] left-[-10%]" />
                <div className="ambient-light w-[40%] h-[40%] bg-[#FF7A00]/5 bottom-[-10%] right-[-10%]" />
            </div>
            
            <Header />
            
            <main className="flex-grow relative">
                {children}
            </main>

            <Footer />

            <Cart />
            <BumperCar />
            <Toast />
            <PolicyConsent />
            
            <div className="hidden xl:block">
                <FooterInfoBar />
            </div>
            
            <BottomNav />
        </div>
    );
};


import BottomNav from './BottomNav';
import Toast from '../common/Toast';

export default Layout;
