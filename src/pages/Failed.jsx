import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X, Zap, Activity } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const Failed = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const location = searchParams.get('location');

    return (
        <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-8 pt-32 relative overflow-hidden selection:bg-red-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-red-500/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-rose-500/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute inset-0 noise-overlay opacity-[0.02]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/[0.02] backdrop-blur-4xl p-12 md:p-24 rounded-[4rem] border border-red-500/20 max-w-2xl w-full text-center shadow-4xl relative z-10 overflow-hidden"
            >
                <div className="absolute inset-0 noise-overlay opacity-[0.02]" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl opacity-40 animate-pulse" />
                    <div className="w-32 h-32 bg-red-500/5 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto border border-red-500/20 shadow-4xl group">
                        <X size={64} className="group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>

                <div className="space-y-6 mb-16">
                    <div className="flex items-center justify-center gap-6 text-red-500">
                        <div className="w-16 h-[2px] bg-red-500/30 shadow-[0_0_10px_#ef4444]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.8em] italic opacity-80">TRANSACTION ABORTED</span>
                        <div className="w-16 h-[2px] bg-red-500/30 shadow-[0_0_10px_#ef4444]" />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] transform -skew-x-12">
                        TELEMETRY <br /><span className="text-red-500">FAILED</span>
                    </h1>
                </div>

                <div className="space-y-4 mb-20">
                    <p className="text-slate-600 font-black uppercase tracking-[0.5em] text-[11px] italic opacity-60 leading-relaxed border-l-2 border-red-500/20 pl-10 mx-auto text-left max-w-md">
                        The synchronization cycle was terminated by the host. Handshake sequence failed or user cancelled the process.
                    </p>
                    {orderId && (
                        <div className="text-[10px] text-red-500/60 font-black uppercase tracking-[0.4em] italic text-left max-w-md mx-auto pl-10">
                            REF-ID: {orderId} • LOC: {location || 'UNKNOWN'}
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <Link to="/dine" className="w-full btn-premium py-8 rounded-[2.5rem] shadow-4xl bg-gradient-to-r from-red-600 to-rose-700 group flex items-center justify-center gap-6 text-white font-black uppercase tracking-[0.5em] text-[14px] italic">
                        RE-INITIATE <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-700" />
                    </Link>
                    <Link to="/contact" className="block text-[11px] text-slate-800 font-black uppercase tracking-[0.6em] hover:text-white transition-all italic underline underline-offset-8">
                        UPLINK SUPPORT
                    </Link>
                </div>

                {/* Protocol Guidelines */}
                <div className="mt-16 p-8 bg-black/40 rounded-[3rem] text-left border border-white/5 backdrop-blur-4xl relative overflow-hidden group hover:border-red-500/20 transition-all duration-1000">
                    <div className="relative z-10 flex items-start gap-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-red-500/5 flex items-center justify-center text-red-500 shrink-0 border border-red-500/20 shadow-4xl">
                            <Activity size={28} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-black text-white tracking-[0.6em] uppercase text-[10px] italic opacity-40 leading-none">ERROR LOG OMNI-02</h3>
                            <ul className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.1em] italic opacity-90 leading-relaxed space-y-2">
                                <li className="flex gap-4"><Zap size={14} className="text-red-500 shrink-0" /> Connection timeout or insufficient credits detected.</li>
                                <li className="flex gap-4"><Zap size={14} className="text-red-500 shrink-0" /> Quantum handshake rejected by encryption layer.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Global Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .matrix-grid {
                    background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
                .backdrop-blur-4xl { backdrop-filter: blur(80px); }
                .shadow-4xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.9); }
                .btn-premium {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-premium::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.2),
                        transparent
                    );
                    transition: 0.5s;
                }
                .btn-premium:hover::before {
                    left: 100%;
                }
            `}} />
        </div>
    );
};

export default Failed;
