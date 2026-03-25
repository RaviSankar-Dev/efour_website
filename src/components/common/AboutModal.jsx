import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Store, Users, Building2, Zap, ArrowUpRight } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#070B14]/80 backdrop-blur-2xl z-[100]"
                    />

                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="glass-card rounded-[3rem] shadow-3xl w-full max-w-3xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] border border-white/10"
                        >
                            {/* Header */}
                            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/2 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <Info size={24} className="text-[#12796D]" />
                                    </div>
                                    <h2 className="text-3xl font-black text-white">About Us</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-12 h-12 flex items-center justify-center text-[#AAB2C5] hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/5"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-10 overflow-y-auto bg-transparent flex-grow flex flex-col items-center custom-scrollbar">
                                <div className="mb-12 max-w-2xl text-center relative">
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-[#FF7A18]/5 blur-3xl rounded-full" />
                                    <span className="text-[14px] font-bold tracking-[0.3em] text-[#FF7A18] uppercase mb-4 block">OUR STORY</span>
                                    <h3 className="text-5xl sm:text-6xl font-black text-white mb-8 leading-none tracking-tight">
                                        Eat. Enjoy. <span className="text-[#12796D]">Entertain.</span>
                                    </h3>
                                    <p className="text-xl text-[#AAB2C5] leading-relaxed font-bold">
                                        Efour is a premier Food Court and Play Zone bringing families together through diverse cuisines and recreation under one roof.
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6 w-full mb-10">
                                    <div className="bg-[#0D7066] p-6 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                                        <Store size={40} className="text-white mb-8" />
                                        <h4 className="text-4xl font-black text-white mb-4">For Vendors</h4>
                                        <p className="text-white/80 leading-relaxed font-bold text-lg">
                                            Promote your culinary business directly to thousands. Benefit from an enhanced e-Experience with direct customer reviews.
                                        </p>
                                    </div>

                                    <div className="bg-[#FF5722] p-6 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                                        <Users size={40} className="text-white mb-8" />
                                        <h4 className="text-4xl font-black text-white mb-4">For Users</h4>
                                        <p className="text-white/80 leading-relaxed font-bold text-lg">
                                            A wide range of services suited to your needs —from diverse cuisines to customized entertainment packages.
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full bg-[#F8FAFC] p-6 md:p-10 rounded-[2.5rem] shadow-xl relative mt-8">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-[#E6F3F2] flex items-center justify-center border border-[#12796D]/10">
                                            <Building2 size={28} className="text-[#12796D]" />
                                        </div>
                                        <h4 className="text-2xl font-black text-[#1A1F2C]">Founder's Vision</h4>
                                    </div>

                                    <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl mb-10 border border-black/5 shadow-inner">
                                        <p className="text-xl sm:text-2xl italic text-[#4A5568] font-medium leading-relaxed">
                                            "We designed an ample space for all cuisines and play zone activities to suit all ages and promote local talent."
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-10 pt-10 border-t border-black/5">
                                        <div className="relative shrink-0">
                                            <img
                                                src="/jaynarayana.jpeg"
                                                alt="Jayanarayana Kureti"
                                                className="w-24 h-24 xs:w-32 xs:h-32 sm:w-48 sm:h-48 rounded-[1.5rem] sm:rounded-[2.5rem] object-cover object-top border-4 sm:border-8 border-white shadow-2xl relative z-10"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="hidden w-24 h-24 xs:w-32 xs:h-32 sm:w-48 sm:h-48 rounded-[1.5rem] sm:rounded-[2.5rem] bg-[#1A1F2C] items-center justify-center text-white font-black text-2xl sm:text-4xl border-4 sm:border-8 border-white shadow-2xl">
                                                JK
                                            </div>
                                        </div>
                                        <div className="text-center sm:text-left pt-4">
                                            <h3 className="text-2xl xs:text-3xl sm:text-5xl font-black text-[#1A1F2C] leading-tight mb-2 tracking-tighter">Jayanarayana Kureti</h3>
                                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                                <div className="w-8 h-1 bg-[#12796D] rounded-full" />
                                                <span className="text-lg font-bold text-[#718096] uppercase tracking-[0.2em]">Founder & CEO</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-10 py-8 bg-white/2 border-t border-white/5">
                                <button
                                    onClick={onClose}
                                    className="btn-premium w-full py-6 rounded-3xl font-bold uppercase tracking-[0.4em] text-[14px] transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 italic shadow-2xl shadow-[#FF7A18]/20"
                                >
                                    CLOSE INFORMATION <ArrowUpRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AboutModal;
