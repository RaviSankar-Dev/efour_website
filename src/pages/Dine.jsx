import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Clock, Bell, Sparkles, Search, ShoppingBag, Plus, Star, Zap } from 'lucide-react';
import useStore from '../store/useStore';
import OptimizedImage from '../components/common/OptimizedImage';

const Dine = () => {
    const { menuData, fetchMenu, isLoading, addToCart, showToast } = useStore();
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchMenu(true);
    }, [fetchMenu]);

    const filteredMenu = useMemo(() => {
        return menuData.filter(item => {
            const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.stall?.toLowerCase().includes(search.toLowerCase());
            return matchesSearch && (item.open !== false && item.status !== 'off');
        });
    }, [menuData, search]);

    const [selectedMenu, setSelectedMenu] = useState(null);

    const handleAddToCart = (item) => {
        addToCart(item);
        showToast(`${item.name} added to cart!`);
    };

    if (isLoading.menu && menuData.length === 0) {
        return (
            <div className="min-h-screen bg-[#02040a] flex flex-col items-center justify-center gap-8">
                <div className="relative">
                    <div className="w-20 h-20 border-[3px] border-[#6C5CE7]/20 border-t-[#6C5CE7] rounded-full animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-[#6C5CE7]/20 animate-pulse rounded-full" />
                </div>
                <p className="text-[#6C5CE7] font-black uppercase tracking-[0.6em] text-[10px] animate-pulse italic">Setting up the Table...</p>
            </div>
        );
    }

    const showComingSoon = !isLoading.menu && menuData.length === 0;

    if (showComingSoon) {
        return (
            <div className="min-h-screen bg-[#02040a] pt-24 md:pt-48 px-6 md:px-12 pb-32 relative overflow-hidden selection:bg-[#6C5CE7]/30">
                {/* Advanced Light Architecture */}
                <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-[#6C5CE7]/5 blur-[160px] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-[#FF7A00]/5 blur-[140px] rounded-full translate-y-1/4 -translate-x-1/4" />
                <div className="absolute inset-0 noise-overlay opacity-[0.03]" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="flex justify-center mb-16">
                                <div className="relative group">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-20px] border border-white/5 rounded-full"
                                    />
                                    <div className="w-32 h-32 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] shadow-3xl flex items-center justify-center relative z-10 border border-white/10 group-hover:border-[#6C5CE7]/30 transition-all duration-1000">
                                        <Utensils className="text-[#6C5CE7] drop-shadow-[0_0_20px_rgba(108,92,231,0.3)]" size={48} />
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1], y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-4 -right-4 w-12 h-12 bg-[#FF7A00] rounded-2xl flex items-center justify-center text-white shadow-2xl z-20 border border-white/20"
                                    >
                                        <Sparkles size={20} className="animate-pulse" />
                                    </motion.div>
                                </div>
                            </div>

                            <h4 className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-[0.8em] mb-8 italic">
                                EFOUR FOOD COURT
                            </h4>

                            <h1 className="text-4xl xs:text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] transform -skew-x-12 mb-12 text-white">
                                COMING <br />
                                <span className="text-gradient-primary">SOON.</span>
                            </h1>

                            <p className="text-[#94A3B8] text-xl font-bold max-w-2xl mx-auto italic leading-relaxed mb-24 px-4 opacity-40">
                                Great food is coming soon to Efour. We are preparing the best tastes for you.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-40">
                                <div className="group flex items-center gap-8 bg-white/[0.02] backdrop-blur-3xl px-12 py-8 rounded-[3rem] shadow-3xl border border-white/5 hover:border-[#6C5CE7]/30 transition-all duration-1000">
                                    <div className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center text-[#6C5CE7] group-hover:bg-[#6C5CE7] group-hover:text-white transition-all duration-700 shadow-inner">
                                        <Clock size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#94A3B8] opacity-30 mb-1">Status</p>
                                        <p className="text-lg font-black uppercase text-white italic tracking-widest">In Development</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                            {[
                                {
                                    title: "Fresh Food",
                                    desc: "We serve the best local and international dishes.",
                                    icon: "01"
                                },
                                {
                                    title: "Nice Seating",
                                    desc: "Enjoy your meal in our nice and clean dining area.",
                                    icon: "02"
                                },
                                {
                                    title: "Easy Ordering",
                                    desc: "Order your food quickly using our website or app.",
                                    icon: "03"
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 * i, duration: 1 }}
                                    className="group bg-white/[0.02] backdrop-blur-3xl p-12 rounded-[4rem] border border-white/5 shadow-2xl hover:border-white/10 hover:-translate-y-4 transition-all duration-1000 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-10 text-9xl font-black italic text-white/[0.02] select-none">
                                        {feature.icon}
                                    </div>
                                    <h4 className="font-black text-white uppercase tracking-[0.4em] mb-8 text-xs relative z-10 italic">{feature.title}</h4>
                                    <div className="w-16 h-1 bg-[#6C5CE7] mb-10 group-hover:w-24 transition-all duration-700 shadow-[0_0_20px_#6C5CE7]" />
                                    <p className="text-[#94A3B8] text-sm font-bold italic leading-relaxed relative z-10 opacity-30 group-hover:opacity-100 transition-opacity duration-1000">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#02040a] min-h-screen pt-24 md:pt-48 pb-40 selection:bg-[#6C5CE7]/30 overflow-hidden relative">
            {/* Background Decorative Architecture */}
            <div className="absolute top-0 left-0 w-full h-[60rem] bg-gradient-to-b from-[#6C5CE7]/5 to-transparent z-0 pointer-events-none" />
            <div className="absolute inset-0 noise-overlay opacity-[0.02]" />

            <div className="container mx-auto px-6 relative z-10">
                {/* --- Header Section --- */}
                <div className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-16 border-b border-white/5 pb-20">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2 }}
                        >
                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-[#6C5CE7] font-black uppercase tracking-[0.6em] text-xs italic">OUR DINE</span>
                                <div className="w-12 h-[1px] bg-white/10" />
                            </div>
                            <h1 className="text-4xl xs:text-5xl md:text-9xl font-black italic tracking-tighter text-white leading-[0.85] transform -skew-x-12 mb-10 uppercase">
                                OUR <span className="text-gradient-primary">DINE.</span>
                            </h1>
                            <p className="text-[#94A3B8] text-xl font-bold italic opacity-40 max-w-lg border-l border-[#6C5CE7]/30 pl-10">
                                Best food in Eluru. Choose your favorite dish and enjoy.
                            </p>
                        </motion.div>
                    </div>

                    <div className="w-full lg:max-w-md">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7]/20 to-transparent rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-500" />
                            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#6C5CE7] transition-colors" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="SEARCH DINE..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-white placeholder-slate-600 backdrop-blur-3xl outline-none focus:border-[#6C5CE7]/50 transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>

                {/* --- Dine Indicator --- */}
                <div className="flex gap-4 pb-12 mb-20">
                    <div className="px-12 py-5 rounded-2xl bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-xl shadow-[#6C5CE7]/20 text-xs font-black uppercase tracking-[0.3em] italic transform -skew-x-12">
                        DINE
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredMenu.map((item, idx) => (
                            <motion.div
                                key={item.id || idx}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.8, delay: Math.min(idx, 10) * 0.05 }}
                                className="group relative bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden hover:border-[#6C5CE7]/40 transition-all duration-700 shadow-3xl"
                            >
                                {/* Media Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <OptimizedImage
                                        src={item.image}
                                        alt={item.name}
                                        priority={idx < 8}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out brightness-75 group-hover:brightness-100"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent opacity-80" />
                                    
                                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30">
                                        <button
                                            onClick={() => setSelectedMenu(item)}
                                            className="w-full btn-premium py-4 rounded-2xl text-[10px] flex items-center justify-center gap-3"
                                        >
                                            <Utensils size={18} />
                                            VIEW MENU
                                        </button>
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className="p-8">
                                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-3 group-hover:text-[#FF7A00] transition-colors duration-700 transform -skew-x-6">
                                        {item.name}
                                    </h3>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-[1px] bg-[#6C5CE7]/30 group-hover:w-10 group-hover:bg-[#6C5CE7] transition-all duration-700" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic group-hover:text-slate-400">
                                            {item.stall || 'EFOUR AREA'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* --- Empty State --- */}
                {filteredMenu.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-48 text-center"
                    >
                        <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-slate-700">
                            <Utensils size={40} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight italic">NO FOOD FOUND</h3>
                        <p className="text-sm font-bold italic opacity-30 uppercase tracking-widest">Adjust your search or filter</p>
                    </motion.div>
                )}
            </div>

            {/* --- Menu Gallery Modal --- */}
            <AnimatePresence>
                {selectedMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02040a]/90 backdrop-blur-2xl p-6 md:p-12"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white/[0.03] border border-white/10 rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-3xl"
                        >
                            <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6C5CE7] mb-2 block italic">GALLERY OVERRIDE</span>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter transform -skew-x-6">{selectedMenu.name} MENU</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedMenu(null)}
                                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-xl"
                                >
                                    <Zap size={24} className="fill-current" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {selectedMenu.menuImages.map((img, idx) => (
                                        <div key={idx} className="group relative rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 shadow-2xl">
                                            <img
                                                src={img}
                                                alt={`${selectedMenu.name} Menu Page ${idx + 1}`}
                                                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="px-10 py-8 bg-white/2 border-t border-white/5 text-center">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">END OF DATA MATRIX</p>
                            </div>
                        </motion.div>
                        
                        {/* Backdrop Close Click */}
                        <div className="absolute inset-0 -z-10" onClick={() => setSelectedMenu(null)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dine;
