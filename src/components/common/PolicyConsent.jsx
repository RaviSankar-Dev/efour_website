import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const PolicyConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Force showing for the user to confirm the update
        const hasAccepted = localStorage.getItem('efour-policy-v4-accepted');
        if (!hasAccepted) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('efour-policy-v4-accepted', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 100 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 100 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="fixed bottom-12 left-4 right-4 md:left-auto md:right-10 md:w-[420px] z-[200]"
                >
                    <div className="relative group">
                        {/* Premium Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF7A18] to-[#5B8CFF] blur-xl opacity-40 rounded-[2.5rem]"></div>

                        <div className="relative bg-[#080808]/95 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#FF7A18]/10 flex items-center justify-center border border-[#FF7A18]/20 shadow-inner text-[#FF7A18]">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-[#FF7A18] uppercase tracking-[0.4em] mb-1">
                                                Security Protocol
                                            </h4>
                                            <h3 className="text-white font-black text-xl leading-tight uppercase tracking-tight">
                                                Privacy & Cookies
                    </h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/5"
                                        title="Dismiss"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <p className="text-gray-400 text-[13px] font-bold leading-relaxed mb-10 ">
                                    By continuing to explore the E4 Terminal, you acknowledge our use of cookies and agree to the 
                                    <Link to="/privacy" className="mx-1 text-white border-b border-white/10">Privacy Policy</Link>
                                    and 
                                    <Link to="/terms" className="mx-1 text-white border-b border-white/10">Terms of Use</Link>.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={handleAccept}
                                        className="relative overflow-hidden group/btn w-full bg-white text-black py-5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[#FF7A18] hover:text-white active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 "
                                    >
                                        ACCEPT
                                        <Zap size={16} className="fill-current" />
                                    </button>

                                    <div className="flex justify-center">
                                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.3em]">
                                            Secure Connection <span className="text-green-500 ml-1">●</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PolicyConsent;

