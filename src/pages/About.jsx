import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Info, Store, Users, Building2, ArrowUpRight } from 'lucide-react';

const About = () => {
    const navigate = useNavigate();
    const onClose = () => navigate(-1);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                className="bg-white/[0.02] backdrop-blur-4xl rounded-[2.5rem] shadow-4xl w-full max-w-3xl overflow-hidden flex flex-col border border-white/10 relative z-10"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.03] relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-[#6C5CE7]/10 flex items-center justify-center border border-[#6C5CE7]/20 shadow-inner">
                            <Info size={24} className="text-[#6C5CE7]" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter transform leading-none">OUR STORY</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/10 active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 overflow-y-auto bg-transparent flex-grow flex flex-col items-center custom-scrollbar max-h-[60vh]">
                    <div className="mb-12 max-w-2xl text-center relative">
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-[#6C5CE7]/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="flex flex-col items-center gap-6 mb-12">
                            <div className="flex items-center gap-8 mb-4">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-[#6C5CE7]/20 rounded-3xl blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
                                    <img
                                        src="/E4LOGOr.png"
                                        alt="E4 Logo"
                                        className="w-24 h-24 rounded-2xl object-contain bg-black border border-white/10 shadow-3xl relative z-10 brightness-110"
                                    />
                                </div>
                                <div className="text-left space-y-1">
                                    <h3 className="text-3xl font-black text-[#FF7A00] tracking-tighter uppercase transform ">EFOUR <span className="text-[#FBBF24]">ELURU</span></h3>
                                    <p className="text-[10px] font-black text-[#6C5CE7] tracking-[0.4em] uppercase opacity-60 ">NR PETA, ELURU</p>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-5xl sm:text-7xl font-black text-white mb-8 leading-none tracking-tighter transform ">
                            EAT. ENJOY. <br /> <span className="text-[#6C5CE7]">ENTERTAIN. ELURU.</span>
                        </h3>
                        <p className="text-lg text-slate-500 leading-relaxed font-bold uppercase tracking-[0.1em] max-w-xl mx-auto border-l-2 border-[#6C5CE7]/30 pl-8 text-left opacity-70">
                            EFOUR IS A PREMIER FOOD COURT AND PLAY ZONE BRINGING FAMILIES TOGETHER THROUGH DIVERSE CUISINES AND RECREATION UNDER ONE ROOF.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 w-full mb-12">
                        <div className="bg-[#6C5CE7]/5 p-8 rounded-[2rem] shadow-3xl border border-[#6C5CE7]/10 relative overflow-hidden group hover:bg-[#6C5CE7]/10 transition-colors duration-700">
                            <Store size={36} className="text-[#6C5CE7] mb-6 group-hover:scale-110 transition-transform duration-700" />
                            <h4 className="text-2xl font-black text-white mb-4 uppercase transform tracking-tighter">FOR VENDORS</h4>
                            <p className="text-slate-500 leading-relaxed font-bold text-sm uppercase tracking-tight opacity-60">
                                Promote your culinary business directly to thousands. Benefit from an enhanced e-Experience with direct customer reviews.
                            </p>
                        </div>

                        <div className="bg-[#FF7A00]/5 p-8 rounded-[2rem] shadow-3xl border border-[#FF7A00]/10 relative overflow-hidden group hover:bg-[#FF7A00]/10 transition-colors duration-700">
                            <Users size={36} className="text-[#FF7A00] mb-6 group-hover:scale-110 transition-transform duration-700" />
                            <h4 className="text-2xl font-black text-white mb-4 uppercase transform tracking-tighter">FOR USERS</h4>
                            <p className="text-slate-500 leading-relaxed font-bold text-sm uppercase tracking-tight opacity-60">
                                A wide range of services suited to your needs —from diverse cuisines to customized entertainment packages.
                            </p>
                        </div>
                    </div>

                    <div className="w-full bg-white/[0.03] p-8 sm:p-12 rounded-[2.5rem] shadow-4xl relative border border-white/10 group hover:border-[#6C5CE7]/30 transition-all duration-1000">
                        <div className="absolute inset-0 noise-overlay opacity-[0.03] rounded-[2.5rem] pointer-events-none" />
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5 shadow-inner">
                                <Building2 size={24} className="text-[#6C5CE7]" />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase transform tracking-tighter">OUR VISION</h4>
                        </div>

                        <div className="bg-[#02040a] p-8 rounded-[1.5rem] mb-12 border border-white/5 shadow- inner relative group-hover:translate-x-2 transition-transform duration-1000">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#6C5CE7] rounded-full blur-[2px]" />
                            <p className="text-xl sm:text-2xl text-slate-500 font-bold leading-relaxed uppercase tracking-[0.08em] opacity-80">
                                "We designed an ample space for all cuisines and play zone activities to suit all ages and promote local talent."
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pt-8 border-t border-white/5">
                            <div className="relative shrink-0 group">
                                <img
                                    src="/jaynarayana.jpeg"
                                    alt="Jayanarayana Kureti"
                                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] object-cover object-top border-2 border-white/10 shadow-4xl relative z-10 brightness-75 hover:brightness-110 transition-all duration-1000 grayscale hover:grayscale-0"
                                />
                            </div>
                            <div className="text-center sm:text-left pt-4">
                                <h3 className="text-3xl sm:text-4xl font-black text-white leading-[0.85] mb-3 tracking-tighter uppercase transform group-hover:text-[#6C5CE7] transition-colors duration-700">JAYANARAYANA <br /> KURETI</h3>
                                <div className="flex items-center justify-center sm:justify-start gap-4">
                                    <div className="w-8 h-[2px] bg-[#6C5CE7] rounded-full shadow-[0_0_10px_#6C5CE7]" />
                                    <span className="text-base font-bold text-white uppercase tracking-[0.3em] opacity-80">FOUNDER & CEO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="px-8 py-6 bg-white/[0.03] border-t border-white/5 relative z-10">
                    <button
                        onClick={onClose}
                        className="btn-premium w-full py-6 rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-4xl hover:-translate-y-1 transition-all duration-700 flex items-center justify-center gap-4"
                    >
                        GO BACK <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-700" />
                    </button>
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .backdrop-blur-4xl { backdrop-filter: blur(80px); }
                .shadow-4xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.9); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(108, 92, 231, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(108, 92, 231, 0.4); }
            `}} />
        </div>
    );
};

export default About;

