import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, UserCheck, Lock, CheckCircle2, UserCog, Cookie, Share2, History, ThumbsUp, Building2, Mail, Phone, ArrowUpRight, Zap } from 'lucide-react';

const PrivacyModal = ({ isOpen, onClose }) => {
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
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-[#FF7A18]/10 flex items-center justify-center border border-[#FF7A18]/20 shadow-[0_0_20px_rgba(255,122,24,0.1)]">
                                        <ShieldCheck size={28} className="text-[#FF7A18]" />
                                    </div>
                                    <div>
                                        <span className="text-[13px] font-bold text-[#FF7A18] uppercase tracking-[0.4em] mb-1 block ">Security Protocol</span>
                                        <h2 className="text-3xl font-black tracking-tighter uppercase transform text-white">Privacy Policy</h2>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-12 h-12 flex items-center justify-center text-[#AAB2C5] hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-10 overflow-y-auto bg-transparent flex-grow custom-scrollbar">
                                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] mb-10 shadow-inner">
                                    <p className="text-[#AAB2C5] text-base font-bold uppercase tracking-wider leading-relaxed">
                                        <span className="text-white">EFOUR FOOD COURT</span> protects any information you give when visiting the Website. Effective from March 1st, 2026.
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8 mb-8">
                                    <div className="glass-card p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-[#FF7A18]/30 transition-all group">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                                <UserCheck size={18} className="text-[#FF7A18]" />
                                            </div>
                                            <h3 className="font-bold text-white uppercase tracking-widest text-[14px]">Collected Info</h3>
                                        </div>
                                        <ul className="space-y-4">
                                            {['Name & Mobile', 'Email & Address', 'Survey Data'].map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-[13px] text-[#AAB2C5] font-bold uppercase tracking-widest ">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A18]" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="glass-card p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-[#5B8CFF]/30 transition-all group">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                                <ShieldCheck size={18} className="text-[#5B8CFF]" />
                                            </div>
                                            <h3 className="font-bold text-white uppercase tracking-widest text-[14px]">Security</h3>
                                        </div>
                                        <p className="text-[13px] text-[#AAB2C5] leading-relaxed font-bold uppercase tracking-widest ">
                                            We use suitable physical and electronic procedures to safeguard your info. We won't sell your data unless required by law.
                                        </p>
                                    </div>
                                </div>

                                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 mb-8 bg-white/2">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                            <History size={18} className="text-[#FF7A18]" />
                                        </div>
                                        <h3 className="font-bold text-white uppercase tracking-widest text-[14px]">Usage Protocol</h3>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        {[
                                            { id: '1', text: 'Internal record keeping' },
                                            { id: '2', text: 'Improving services' },
                                            { id: '3', text: 'Promotional emails' },
                                            { id: '4', text: 'Market research' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <span className="text-[#FF7A18] font-bold text-[14px]">{item.id}</span>
                                                <p className="text-[12px] text-[#AAB2C5] font-bold uppercase tracking-widest ">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-6 mb-8">
                                    {[
                                        { icon: UserCog, title: "User Rights", desc: "Access, correct, or request deletion of your data core.", color: "#FF7A18" },
                                        { icon: Cookie, title: "Cookies", desc: "Enhancement tokens to optimize your interface experience.", color: "#5B8CFF" },
                                        { icon: Share2, title: "Sharing", desc: "Managed disclosure with trusted service providers only.", color: "#AAB2C5" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl hover:bg-white/5 transition-all">
                                            <item.icon size={20} className="mb-4" style={{ color: item.color }} />
                                            <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.3em] mb-2 ">{item.title}</h4>
                                            <p className="text-[12px] text-[#AAB2C5]/50 font-bold uppercase tracking-widest leading-relaxed ">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8 mb-10">
                                    <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/2">
                                        <h4 className="text-[12px] font-bold text-[#5B8CFF] uppercase tracking-widest mb-4 ">Data Retention</h4>
                                        <p className="text-[13px] text-[#AAB2C5] font-bold uppercase tracking-widest leading-relaxed opacity-60">
                                            We store data only as long as necessary for the purpose it was collected or as required by regulatory policies.
                                        </p>
                                    </div>
                                    <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/2">
                                        <div className="flex items-center gap-3 mb-4">
                                            <ThumbsUp size={16} className="text-[#FF7A18]" />
                                            <h4 className="text-[12px] font-bold text-white uppercase tracking-widest ">Consent</h4>
                                        </div>
                                        <p className="text-[13px] text-[#AAB2C5] font-bold uppercase tracking-widest leading-relaxed opacity-60">
                                            By using <span className="text-white">efour-eluru.com</span>, you consent to our policy. You can withdraw at any time.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8 glass-card rounded-[2.5rem] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8 bg-white/2 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF7A18]/10 to-transparent rounded-bl-full blur-2xl" />
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Building2 size={24} className="text-[#AAB2C5]" />
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] font-bold text-[#AAB2C5]/40 uppercase tracking-[0.4em] mb-1 ">Identity Support</h4>
                                            <h3 className="text-white font-bold text-[14px] uppercase tracking-widest">EFOUR COMMAND CENTER</h3>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                                        <div className="flex items-center gap-3 text-[12px] font-bold text-white bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                                            <Mail size={14} className="text-[#FF7A18]" />
                                            CEO@EFOUR-ELURU.COM
                                        </div>
                                        <div className="flex items-center gap-3 text-[12px] font-bold text-white bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                                            <Phone size={14} className="text-[#5B8CFF]" />
                                            +91 70369 23456
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-10 py-8 bg-white/2 border-t border-white/5">
                                <button
                                    onClick={onClose}
                                    className="btn-premium w-full py-6 rounded-3xl font-bold uppercase tracking-[0.4em] text-[14px] transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-[#FF7A18]/20"
                                >
                                    ACCEPT <Zap size={18} />
                                </button>
                            </div>
                            {/* v2.1 */}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PrivacyModal;

