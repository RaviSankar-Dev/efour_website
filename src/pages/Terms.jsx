import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    X, UserCheck, Scale, Lock, CreditCard, 
    FileText, Ban, Copyright, Shield, 
    AlertTriangle, RotateCcw, Globe, Power, 
    Gavel, Building2, Mail, Phone, Zap 
} from 'lucide-react';

const Terms = () => {
    const navigate = useNavigate();
    const onClose = () => navigate(-1);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
        <div className="min-h-screen bg-[#02040a] flex flex-col justify-center items-center p-6 sm:p-12 pt-40 pb-24 relative overflow-hidden">
            <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#6C5CE7]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#FF7A00]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute inset-0 noise-overlay opacity-[0.02]" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 60 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#0A0F1D] rounded-[2.5rem] shadow-4xl w-full max-w-4xl overflow-hidden flex flex-col border border-white/10 relative z-10"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.03] relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-4xl group">
                            <FileText size={24} className="text-white group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-1 block italic leading-none">PROTOCOL 2026</span>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase transform -skew-x-12 text-white leading-none">TERMS OF USE</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/10 active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 overflow-y-auto bg-transparent flex-grow custom-scrollbar max-h-[70vh]">
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] mb-10 shadow-inner group transition-all duration-700">
                        <p className="text-white/40 text-base font-bold italic uppercase tracking-[0.08em] leading-relaxed border-l-2 border-white/10 pl-8">
                            Usage of <span className="text-white font-black italic">EFOUR ELURU</span> (efour-eluru.com) is subject to these Terms & Conditions. Acceptance is implied by using the site.
                        </p>
                    </div>

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

                {/* Footer Action */}
                <div className="px-8 py-6 bg-white/[0.03] border-t border-white/5 relative z-10">
                    <button
                        onClick={onClose}
                        className="btn-premium w-full py-6 rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-4xl hover:-translate-y-1 transition-all duration-700 italic flex items-center justify-center gap-4"
                    >
                        I AGREE <Zap size={18} className="group-hover:scale-125 transition-transform" />
                    </button>
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .backdrop-blur-4xl { backdrop-filter: blur(80px); }
                .shadow-4xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.9); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            `}} />
        </div>
    );
};

export default Terms;
