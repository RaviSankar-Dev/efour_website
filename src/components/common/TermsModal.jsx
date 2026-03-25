import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, UserCheck, Scale, Lock, CreditCard, 
    FileText, Ban, Copyright, Shield, 
    AlertTriangle, RotateCcw, Globe, Power, 
    Gavel, Building2, Mail, Phone, Zap 
} from 'lucide-react';

const TermsModal = ({ isOpen, onClose }) => {
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

    const sections = [
        {
            icon: UserCheck,
            title: "Eligibility",
            desc: "You must be at least 18 years old or visiting under parental supervision. You represent that you have the legal capacity to enter into a binding agreement.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/5"
        },
        {
            icon: Scale,
            title: "User Obligations",
            desc: "Use for lawful purposes only. You must provide accurate info and keep your login credentials secure. Do not share your account.",
            color: "text-blue-500",
            bg: "bg-blue-500/5"
        },
        {
            icon: Lock,
            title: "Account Responsibility",
            desc: "You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use or security breach.",
            color: "text-purple-500",
            bg: "bg-purple-500/5"
        },
        {
            icon: CreditCard,
            title: "Payments & Transactions",
            desc: "All payments are processed securely via Razorpay. Prices are inclusive of applicable GST. Transactions are final once confirmed.",
            color: "text-amber-500",
            bg: "bg-amber-500/5"
        },
        {
            icon: FileText,
            title: "Content Usage",
            desc: "Materials are for PERSONAL USE ONLY. No data mining or scraping. We aren't responsible for accuracy of third-party menu descriptions.",
            color: "text-sky-500",
            bg: "bg-sky-500/5"
        },
        {
            icon: Ban,
            title: "Prohibited Activities",
            desc: "No hacking, reverse-engineering, or using automated tools to access the site. Do not post offensive or illegal content.",
            color: "text-red-500",
            bg: "bg-red-500/5"
        },
        {
            icon: Copyright,
            title: "Intellectual Property",
            desc: "All site content, including the EFOUR logo, text, and graphics, is the property of Jaan Entertainment Pvt Ltd and protected by IP laws.",
            color: "text-teal-500",
            bg: "bg-teal-500/5"
        },
        {
            icon: Shield,
            title: "Privacy Policy Reference",
            desc: "Your use of our platform is also governed by our Privacy Policy, which details how we collect and manage your data.",
            color: "text-indigo-500",
            bg: "bg-indigo-500/5"
        },
        {
            icon: AlertTriangle,
            title: "Liability Limitation",
            desc: "We are not liable for any indirect, incidental, or consequential damages arising from site usage or service interruptions. Use is at your own risk.",
            color: "text-orange-500",
            bg: "bg-orange-500/5"
        },
        {
            icon: RotateCcw,
            title: "Refund & Return Policy",
            desc: "All bookings and purchases are final. We maintain a strict no-refund and no-return policy once a service has been booked, food has been served, or entry has been granted. Please double-check your order before proceeding.",
            color: "text-rose-500",
            bg: "bg-rose-500/5",
            fullWidth: true
        },
        {
            icon: Globe,
            title: "Service Availability",
            desc: "We strive for 24/7 uptime but do not guarantee uninterrupted access. We reserve the right to perform maintenance without prior notice.",
            color: "text-blue-400",
            bg: "bg-blue-400/5"
        },
        {
            icon: Power,
            title: "Termination",
            desc: "We reserve the right to suspend or terminate your account at our sole discretion if these terms are violated.",
            color: "text-emerald-400",
            bg: "bg-emerald-400/5"
        },
        {
            icon: Gavel,
            title: "Governing Law",
            desc: "These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts in Vijayawada.",
            color: "text-slate-400",
            bg: "bg-slate-400/5"
        },
        {
            icon: Building2,
            title: "Contact Information",
            desc: (
                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2 text-white/60">
                         <Mail size={14} className="text-sky-400" />
                         <span>ceo@efour-eluru.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                         <Phone size={14} className="text-emerald-400" />
                         <span>+91 70369 23456</span>
                    </div>
                </div>
            ),
            color: "text-white/40",
            bg: "bg-white/5"
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#070B14]/90 backdrop-blur-2xl z-[100]"
                    />

                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="bg-[#0A0F1D] rounded-[2.5rem] shadow-3xl w-full max-w-4xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] border border-white/10"
                        >
                            {/* Header */}
                            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <FileText size={24} className="text-white" />
                                    </div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Terms & Conditions</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/5"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-10 overflow-y-auto bg-transparent flex-grow custom-scrollbar">
                                <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em] mb-10 italic border-l-2 border-white/10 pl-6">
                                    Usage of <span className="text-white">EFOUR ELURU</span> (efour-eluru.com) is subject to these Terms & Conditions. Acceptance is implied by using the site.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {sections.map((section, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`${section.bg} p-8 rounded-[2rem] border border-white/5 shadow-2xl transition-all duration-500 hover:border-white/10 group ${section.fullWidth ? 'md:col-span-2' : ''}`}
                                        >
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                                    <section.icon size={20} className={section.color} />
                                                </div>
                                                <h3 className="font-bold text-white uppercase tracking-widest text-[14px]">{section.title}</h3>
                                            </div>
                                            {typeof section.desc === 'string' ? (
                                                <p className="text-[13px] text-white/60 leading-relaxed font-medium">
                                                    {section.desc}
                                                </p>
                                            ) : section.desc}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-10 py-6 bg-white/[0.02] border-t border-white/5">
                                <button
                                    onClick={onClose}
                                    className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.4em] text-[12px] hover:bg-white/10 transition-all flex items-center justify-center gap-4 italic"
                                >
                                    AGREE & CONTINUE <Zap size={16} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
            ` }} />
        </AnimatePresence>
    );
};

export default TermsModal;
