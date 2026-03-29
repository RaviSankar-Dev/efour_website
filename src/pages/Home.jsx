import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import useStore from '../store/useStore';
import RideCard from '../components/RideCard';
import OptimizedImage from '../components/common/OptimizedImage';
import Hero from '../components/Hero';
import About from '../components/About';

const Home = () => {
    // Selectors for optimized re-renders
    const rides = useStore(state => state.rides);
    const fetchRides = useStore(state => state.fetchRides);
    const isLoading = useStore(state => state.isLoading.rides);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search input to prevent expensive re-filtering
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchRides(false); // Use cache if available (5 mins) instead of forcing fetch
    }, [fetchRides]);

    const visibleRides = useMemo(() => {
        const term = debouncedSearch.trim().toLowerCase();
        return rides
            .filter(r => (r?.status ? r.status === 'on' : true))
            .filter(r => (term ? (r?.title || '').toLowerCase().includes(term) : true));
    }, [rides, debouncedSearch]);


    return (
        <div className="flex flex-col bg-[#02040a]">
            {/* --- HERO SECTION --- */}
            <Hero />

            {/* --- RIDES SECTION --- */}
            <section id="rides" className="relative py-16 md:py-24 overflow-hidden selection:bg-[#6C5CE7]/30">
                {/* Background Depth Layers */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6C5CE7]/20 to-transparent" />
                    <div className="absolute top-[10%] right-[-5%] w-[60rem] h-[60rem] bg-[#6C5CE7]/5 blur-[160px] rounded-full" />
                    <div className="absolute bottom-[10%] left-[-5%] w-[50rem] h-[50rem] bg-[#FF7A00]/5 blur-[140px] rounded-full" />
                    <div className="absolute inset-0 noise-overlay opacity-[0.02]" />
                </div>

                <div className="relative z-10 container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-16 mb-12 border-b border-white/5 pb-12">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-10 h-[1px] bg-[#6C5CE7]" />
                                <span className="text-[10px] font-black uppercase text-[#6C5CE7] tracking-[0.4em]">All Rides</span>
                            </motion.div>

                            <h2 className="text-4xl xs:text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-white">
                                OUR <span className="text-gradient-primary">RIDES.</span>
                            </h2>
                            <p className="text-[#94A3B8] text-lg font-bold max-w-lg opacity-40 border-l border-white/5 pl-8">
                                Have fun with your family and friends. We have rides for everyone to enjoy.
                            </p>
                        </div>

                        <div className="w-full lg:max-w-md">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7]/20 to-transparent rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#6C5CE7] transition-colors" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="SEARCH RIDES..."
                                    className="w-full rounded-[2rem] border border-white/10 bg-white/[0.03] text-white placeholder-slate-600 px-16 py-6 text-xs font-black uppercase tracking-[0.2em] outline-none focus:border-[#6C5CE7]/50 backdrop-blur-3xl transition-all duration-500"
                                />
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {isLoading && rides.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-48 gap-8">
                                <div className="relative">
                                    <div className="w-20 h-20 border-[3px] border-[#6C5CE7]/20 border-t-[#6C5CE7] rounded-full animate-spin" />
                                    <div className="absolute inset-0 blur-xl bg-[#6C5CE7]/20 animate-pulse rounded-full" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#6C5CE7] animate-pulse">Loading...</p>
                            </div>
                        ) : visibleRides.length === 0 ? (
                            <div className="glass-card rounded-[4rem] p-24 text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-24 h-24 bg-white/[0.02] border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-slate-700">
                                    <Sparkles size={48} />
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4 ">No Rides Found</h3>
                                <p className="text-[#94A3B8] font-bold opacity-30 uppercase tracking-widest text-xs">Try searching for something else</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-8">
                                {visibleRides.map((ride, index) => (
                                    <RideCard key={ride.id} ride={ride} priority={index < 10} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* --- ABOUT SECTION --- */}
            <About />
        </div>
    );
};

export default Home;

