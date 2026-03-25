import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, User, X, ShieldCheck, Zap, Cpu, Sparkles, Activity } from 'lucide-react';
import { BASE_URL } from '../utils/api';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import OptimizedImage from '../components/common/OptimizedImage';

const Success = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const orderId = searchParams.get('orderId');
    const { clearCart } = useStore();

    const status = searchParams.get('status');
    const isSuccess = status === 'success';

    const [orderDetails, setOrderDetails] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`${BASE_URL}/api/payment/status/${orderId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrderDetails(data.order || data);
                }
            } catch (err) {
                console.error('Failed to fetch order status', err);
            } finally {
                setLoading(false);
            }
        };

        if (isSuccess) {
            clearCart();
        }
        fetchOrder();
    }, [isSuccess, clearCart, orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#02040a] flex flex-col items-center justify-center p-8 pt-24 space-y-12 relative overflow-hidden">
                <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
                <div className="relative">
                    <div className="absolute inset-0 bg-[#6C5CE7]/20 rounded-full blur-3xl animate-pulse" />
                    <div className="animate-spin rounded-[2.5rem] h-24 w-24 border-t-2 border-b-2 border-[#6C5CE7] relative z-10 shadow-4xl"></div>
                </div>
                <p className="text-slate-600 font-black uppercase tracking-[0.6em] text-[12px] animate-pulse italic">SYNCING QUANTUM STREAM...</p>
            </div>
        );
    }

    if (!isSuccess && status) {
        return (
            <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-8 pt-32 relative overflow-hidden">
                <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white/[0.02] backdrop-blur-4xl p-16 md:p-24 rounded-[4rem] border border-red-500/20 max-w-2xl w-full text-center shadow-4xl relative z-10 overflow-hidden"
                >
                    <div className="absolute inset-0 noise-overlay opacity-[0.02]" />
                    <div className="w-32 h-32 bg-red-500/5 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 border border-red-500/20 shadow-4xl group">
                        <X size={64} className="group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <h1 className="text-6xl font-black text-white mb-8 tracking-tighter uppercase italic transform -skew-x-12 leading-none">
                        TELEMETRY <br /><span className="text-red-500">ABORTED</span>
                    </h1>
                    <p className="text-slate-600 mb-16 font-black uppercase tracking-[0.5em] text-[11px] italic opacity-60 leading-relaxed border-l-2 border-red-500/20 pl-10 mx-auto text-left max-w-md">The synchronization cycle was terminated by the host. <br />Handshake sequence failed.</p>

                    <div className="space-y-8">
                        <Link to="/" className="w-full btn-premium py-8 rounded-[2.5rem] shadow-4xl bg-gradient-to-r from-red-600 to-rose-700 group flex items-center justify-center gap-6">
                            RE-INITIATE <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-700" />
                        </Link>
                        <Link to="/contact" className="block text-[11px] text-slate-800 font-black uppercase tracking-[0.6em] hover:text-white transition-all italic underline underline-offset-8">
                            UPLINK SUPPORT
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-8 md:p-12 py-40 relative overflow-hidden selection:bg-[#6C5CE7]/30">
            {/* Background Effects */}
            <div className="absolute inset-0 matrix-grid opacity-[0.05] pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#6C5CE7]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#FF7A00]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute inset-0 noise-overlay opacity-[0.02]" />

            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/[0.02] backdrop-blur-4xl p-10 md:p-20 rounded-[4rem] md:rounded-[5rem] border border-white/10 max-w-3xl w-full text-center shadow-4xl relative z-10 overflow-hidden"
            >
                {/* Status Header */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#6C5CE7]/40 to-transparent" />

                <div className="relative mb-16">
                    <div className="absolute inset-0 bg-[#6C5CE7]/20 rounded-full blur-3xl opacity-40 animate-pulse" />
                    <div className="w-32 h-32 bg-[#6C5CE7]/10 text-[#6C5CE7] rounded-[3rem] flex items-center justify-center mx-auto mb-10 border border-[#6C5CE7]/20 shadow-4xl transform -rotate-12 hover:rotate-0 transition-transform duration-1000 group">
                        <ShieldCheck size={64} className="group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                </div>

                <div className="space-y-6 mb-20">
                    <div className="flex items-center justify-center gap-6 text-[#6C5CE7]">
                        <div className="w-16 h-[2px] bg-[#6C5CE7]/30 shadow-[0_0_10px_#6C5CE7]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.8em] italic opacity-80">ENCRYPTION VERIFIED</span>
                        <div className="w-16 h-[2px] bg-[#6C5CE7]/30 shadow-[0_0_10px_#6C5CE7]" />
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] transform -skew-x-12">
                        VAULT KEY <br /><span className="text-gradient-primary">ISSUED</span>
                    </h1>
                </div>

                <div className="flex justify-center mb-20 group">
                    <div className="relative">
                        <div className="absolute -inset-10 bg-gradient-to-tr from-[#6C5CE7]/20 to-[#FF7A00]/20 rounded-[4rem] blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1500" />
                        <div className="p-8 md:p-10 bg-white rounded-[3.5rem] md:rounded-[4rem] shadow-4xl border-[6px] border-white/5 relative z-10 transform group-hover:scale-105 transition-transform duration-1000">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${orderId || 'ETH-782'}`}
                                alt="Order QR Code"
                                className="rounded-2xl w-40 md:w-64 h-40 md:h-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Tickets Section: Digital Access Tokens */}
                <div className="space-y-12 mb-20 text-left">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#6C5CE7] shadow-inner">
                            <Cpu size={22} />
                        </div>
                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.5em] italic opacity-40">AUTHORIZED MODULES</h2>
                    </div>

                    <div className="space-y-6">
                        {(orderDetails?.items || []).filter(item => item.id !== 'tax-gst-9').map((item, idx) => (
                            <motion.div
                                key={item.id || item._id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + idx * 0.1, duration: 0.8 }}
                                className="bg-black/40 backdrop-blur-4xl border border-white/5 rounded-[3.5rem] p-8 shadow-4xl flex items-center justify-between gap-8 relative overflow-hidden group hover:border-[#6C5CE7]/30 transition-all duration-700"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-[#6C5CE7] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-[1px]" />
                                <div className="flex items-center gap-8">
                                    <div className="relative shrink-0">
                                        <div className="absolute -inset-2 bg-[#6C5CE7]/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <OptimizedImage
                                            src={item.image ? decodeURIComponent(item.image) : ''}
                                            alt={item.name}
                                            priority={idx < 4}
                                            className="w-24 h-24 rounded-[2rem] object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-1000 relative z-10 border border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-black text-white text-2xl uppercase tracking-tighter italic transform -skew-x-12 leading-none group-hover:text-gradient-primary transition-all duration-700">{item.name}</h3>
                                        <div className="flex items-center gap-5">
                                            <span className="text-[10px] text-slate-800 font-black uppercase tracking-widest italic opacity-60">QTY: {item.quantity}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                            <span className="text-[10px] text-[#6C5CE7] font-black uppercase tracking-widest italic tracking-[0.2em]">₹{item.price * item.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                                            <span className="text-[9px] uppercase font-black text-emerald-400 tracking-[0.4em] italic leading-none">ACTIVE SYNC</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex flex-col items-center border-l border-white/5 pl-10 space-y-4">
                                    <div className="p-3 bg-white rounded-2xl shadow-4xl transform group-hover:rotate-6 transition-transform duration-700">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ETH-${orderId || '782'}-${item.id || item._id}`}
                                            alt="QR"
                                            className="w-16 h-16 pointer-events-none"
                                        />
                                    </div>
                                    <span className="text-[8px] font-black text-slate-800 tracking-[0.5em] uppercase opacity-40 italic leading-none">ALPHA-KEY</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-8">
                    <Link to="/login" className="flex-1 btn-premium py-8 rounded-[2.5rem] shadow-4xl group/btn flex items-center justify-center gap-4 italic h-full">
                        PROFILE HUB <User size={22} className="group-hover/btn:scale-110 transition-transform duration-700" />
                    </Link>
                    <Link to="/dine" className="flex-1 glass-card border border-white/10 hover:border-[#6C5CE7]/40 py-8 rounded-[2.5rem] flex items-center justify-center gap-4 text-white font-black uppercase tracking-[0.5em] text-[12px] italic transition-all duration-1000 group/dine shadow-4xl bg-white/[0.03] backdrop-blur-4xl h-full">
                        DINE MODULE <ArrowRight size={22} className="group-hover/dine:translate-x-3 transition-transform duration-700" />
                    </Link>
                </div>

                {/* Protocol Guidelines */}
                <div className="mt-24 p-12 bg-black/40 rounded-[4rem] text-left border border-white/5 backdrop-blur-4xl relative overflow-hidden group hover:border-[#6C5CE7]/20 transition-all duration-1000">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#6C5CE7]/5 blur-[60px] rounded-full translate-x-20 -translate-y-20 transition-opacity duration-1000 opacity-60" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start gap-10">
                        <div className="w-20 h-20 rounded-[2rem] bg-[#6C5CE7]/5 flex items-center justify-center text-[#6C5CE7] shrink-0 border border-[#6C5CE7]/20 shadow-4xl group-hover:scale-110 transition-transform duration-1000">
                            <Activity size={36} />
                        </div>
                        <div className="space-y-8 flex-grow">
                            <div className="flex items-center gap-4">
                                <h3 className="font-black text-white tracking-[0.6em] uppercase text-[11px] italic opacity-40 leading-none">DIRECTIVE OMNI-01</h3>
                                <div className="h-[1px] flex-grow bg-white/5" />
                            </div>
                            <ul className="grid md:grid-cols-2 gap-x-16 gap-y-6 text-[12px] text-slate-500 font-bold uppercase tracking-[0.15em] italic opacity-90 leading-relaxed">
                                <li className="flex gap-5"><Zap size={18} className="text-[#6C5CE7] shrink-0" /> Synchronize digital keys at designated kiosks for instant verification.</li>
                                <li className="flex gap-5"><Zap size={18} className="text-[#6C5CE7] shrink-0" /> Real-time telemetry monitoring enabled via profile uplink.</li>
                                <li className="flex gap-5"><Zap size={18} className="text-[#6C5CE7] shrink-0" /> Access tokens are unique to this holographic session.</li>
                                <li className="flex gap-5"><Zap size={18} className="text-[#6C5CE7] shrink-0" /> Protocol execution successful. Welcome to Efour Quantum.</li>
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
            `}} />
        </div>
    );
};

export default Success;
