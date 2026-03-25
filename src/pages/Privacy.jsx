import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ShieldCheck, UserCheck, History, UserCog, Cookie, Share2, ThumbsUp, Building2, Mail, Phone, Zap } from 'lucide-react';

const Privacy = () => {
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
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#6C5CE7]/10 flex items-center justify-center border border-[#6C5CE7]/20 shadow-4xl group">
                            <ShieldCheck size={24} className="text-[#6C5CE7] group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-[0.5em] mb-1 block italic opacity-60 leading-none">YOUR PROTECTION</span>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase transform -skew-x-12 text-white leading-none">PRIVACY POLICY</h2>
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
                <div className="p-8 lg:p-12 overflow-y-auto bg-transparent flex-grow custom-scrollbar max-h-[60vh]">
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] mb-10 shadow-inner group hover:border-[#6C5CE7]/20 transition-all duration-700">
                        <p className="text-slate-600 text-base font-bold italic uppercase tracking-[0.08em] leading-relaxed border-l-2 border-[#6C5CE7]/30 pl-8">
                            <span className="text-white">EFOUR ELURU</span> protects all your information and data shared with us via this website. Policy started on <span className="text-[#6C5CE7]">MARCH 01, 2026.</span>
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 mb-10">
                        <div className="bg-white/[0.01] p-8 rounded-[2rem] border border-white/5 shadow-4xl hover:border-[#6C5CE7]/30 transition-all duration-700 group">
                            <div className="flex items-center gap-5 mb-6 text-[#6C5CE7]">
                                <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/5 flex items-center justify-center border border-[#6C5CE7]/10 shadow-inner">
                                    <UserCheck size={20} />
                                </div>
                                <h3 className="font-black text-white uppercase tracking-[0.3em] italic text-[12px]">YOUR DATA</h3>
                            </div>
                            <ul className="space-y-4">
                                {['NAME & MOBILE', 'EMAIL & ADDRESS', 'SURVEY DATA'].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-[11px] text-slate-500 font-bold uppercase tracking-[0.15em] italic opacity-80 group-hover:text-white transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] shadow-[0_0_10px_#6C5CE7]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white/[0.01] p-8 rounded-[2rem] border border-white/5 shadow-4xl hover:border-[#FF7A00]/30 transition-all duration-700 group">
                            <div className="flex items-center gap-5 mb-6 text-[#FF7A00]">
                                <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/5 flex items-center justify-center border border-[#FF7A00]/10 shadow-inner">
                                    <ShieldCheck size={20} />
                                </div>
                                <h3 className="font-black text-white uppercase tracking-[0.3em] italic text-[12px]">SECURITY</h3>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.12em] italic leading-relaxed opacity-80 group-hover:text-white transition-colors">
                                We use suitable physical and electronic procedures to safeguard your info. We won't sell your data unless required by law.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/[0.01] p-8 rounded-[2rem] border border-white/5 mb-10 shadow-4xl group hover:border-[#6C5CE7]/20 transition-all duration-700">
                        <div className="flex items-center gap-5 mb-8 text-[#6C5CE7]">
                            <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/5 flex items-center justify-center border border-[#6C5CE7]/10 shadow-inner">
                                <History size={20} />
                            </div>
                            <h3 className="font-black text-white uppercase tracking-[0.3em] italic text-[12px]">HOW WE USE DATA</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {[
                                { id: '01', text: 'INTERNAL RECORDS' },
                                { id: '02', text: 'SERVICE UPDATES' },
                                { id: '03', text: 'PROMOTIONS' },
                                { id: '04', text: 'MARKET ANALYSIS' }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2 group/item">
                                    <span className="text-[#6C5CE7] font-black italic text-[14px] tracking-tighter opacity-40 group-hover/item:opacity-100 transition-opacity">{item.id}</span>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em] italic opacity-70 group-hover/item:text-white transition-colors">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 mb-10">
                        <div className="bg-white/[0.01] p-8 rounded-[2rem] border border-white/5 shadow-4xl hover:border-[#FF7A00]/30 transition-all duration-700 group">
                            <div className="flex items-center gap-5 mb-6 text-[#FF7A00]">
                                <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/5 flex items-center justify-center border border-[#FF7A00]/10 shadow-inner">
                                    <History size={20} />
                                </div>
                                <h3 className="font-black text-white uppercase tracking-[0.3em] italic text-[12px]">DATA RETENTION</h3>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.12em] italic leading-relaxed opacity-80 group-hover:text-white transition-colors">
                                We store data only as long as necessary for the purpose it was collected or as required by regulatory policies.
                            </p>
                        </div>

                        <div className="bg-white/[0.01] p-8 rounded-[2rem] border border-white/5 shadow-4xl hover:border-[#6C5CE7]/30 transition-all duration-700 group">
                            <div className="flex items-center gap-5 mb-6 text-[#6C5CE7]">
                                <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/5 flex items-center justify-center border border-[#6C5CE7]/10 shadow-inner">
                                    <ThumbsUp size={20} />
                                </div>
                                <h3 className="font-black text-white uppercase tracking-[0.3em] italic text-[12px]">CONSENT</h3>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.12em] italic leading-relaxed opacity-80 group-hover:text-white transition-colors">
                                By using EFOUR ELURU, you consent to our policy. You can withdraw your consent at any time.
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { icon: UserCog, title: "USER RIGHTS", desc: "You can access, correct, or request deletion of your data.", color: "#6C5CE7" },
                            { icon: Cookie, title: "COOKIES", desc: "Used to enhance your experience. Accept or decline via settings.", color: "#FF7A00" },
                            { icon: Share2, title: "DATA SHARING", desc: "Shared with trusted providers only. No marketing sharing without consent.", color: "#slate-600" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/[0.01] p-6 rounded-[1.5rem] border border-white/5 shadow-4xl hover:bg-white/[0.03] transition-all duration-700 group">
                                <item.icon size={24} className="mb-4 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: item.color }} />
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-3 italic leading-none">{item.title}</h4>
                                <p className="text-[10px] text-slate-800 font-bold uppercase tracking-[0.08em] leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-4xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6C5CE7]/10 to-transparent rounded-bl-full blur-[60px] opacity-40" />
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-inner text-[#6C5CE7]">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em] mb-1 italic opacity-40 leading-none">IDENTITY</h4>
                                <h3 className="text-white font-black text-xl uppercase tracking-tighter italic transform -skew-x-12 leading-none">EFOUR ELURU HQ</h3>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full sm:w-auto relative z-10">
                            <div className="flex items-center gap-3 text-[10px] font-black text-white italic bg-black/40 px-6 py-3 rounded-xl border border-white/5 backdrop-blur-4xl shadow- inner group/mail">
                                <Mail size={14} className="text-[#6C5CE7] group-hover:rotate-12 transition-transform" />
                                CEO@EFOUR-ELURU.COM
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black text-white italic bg-black/40 px-6 py-3 rounded-xl border border-white/5 backdrop-blur-4xl shadow- inner group/phone">
                                <Phone size={14} className="text-[#FF7A00] group-hover:rotate-12 transition-transform" />
                                +91 70369 23456
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="px-8 py-6 bg-white/[0.03] border-t border-white/5 relative z-10">
                    <button
                        onClick={onClose}
                        className="btn-premium w-full py-6 rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-4xl hover:-translate-y-1 transition-all duration-700 italic flex items-center justify-center gap-4"
                    >
                        I UNDERSTAND <Zap size={18} className="group-hover:scale-125 transition-transform" />
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
            `}} />
        </div>
    );
};

export default Privacy;
