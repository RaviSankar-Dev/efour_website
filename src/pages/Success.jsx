import React, { useEffect, useState, memo, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Zap, ArrowRight, X, Clock, Cpu, QrCode } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import OptimizedImage from '../components/common/OptimizedImage';
import QRCode from 'react-qr-code';

// Replicating Professional TicketCard from YourTickets for consistency
const EXPIRY_HOURS = 24;

const CircularProgress = ({ pct, color }) => {
    const r = 14;
    const circ = 2 * Math.PI * r;
    const strokePct = ((100 - pct) * circ) / 100;
    return (
        <svg width="36" height="36" className="rotate-[-90deg]">
            <circle r={r} cx="22" cy="22" fill="transparent" stroke="currentColor" strokeWidth="3" strokeDasharray={circ} strokeDashoffset="0" className="text-white/5" />
            <circle r={r} cx="22" cy="22" fill="transparent" stroke="currentColor" strokeWidth="3" strokeDasharray={circ} strokeDashoffset={strokePct} strokeLinecap="round" className={`${color} transition-all duration-1000 ease-linear`} />
        </svg>
    );
};

const TicketCard = memo(({ ticket, item }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ h: 24, m: 0, s: 0, pct: 100 });
    
    useEffect(() => {
        const purchaseDate = new Date(ticket.date || ticket.createdAt || Date.now());
        const expiryDate = new Date(purchaseDate.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);
        const calculateTime = () => {
            const now = new Date();
            const diff = expiryDate - now;
            if (diff <= 0) return setTimeLeft({ h: 0, m: 0, s: 0, pct: 0 });
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            const pct = (diff / (EXPIRY_HOURS * 60 * 60 * 1000)) * 100;
            setTimeLeft({ h, m, s, pct });
        };
        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [ticket]);

    const qrData = `${ticket.id || ticket._id || 'ID'}-${item.id || 'ITEM'}`;

    return (
        <div className="relative h-[280px] w-full perspective-3000 group">
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 1.2, type: 'spring', damping: 20, stiffness: 80 }}
                className="relative w-full h-full preserve-3d cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                    <div className="h-full w-full rounded-[2rem] bg-white/[0.04] backdrop-blur-4xl border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-4xl hover:border-[#6C5CE7]/40 transition-all duration-700">
                        <div className="flex justify-between items-start">
                            <div className="px-2 py-1 rounded-lg bg-[#6C5CE7]/10 border border-[#6C5CE7]/30 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-[#6C5CE7] shadow-[0_0_8px_#6C5CE7]" />
                                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-[#6C5CE7]">CONFIRMED</span>
                            </div>
                            <span className="text-white font-black text-base">₹{item.price * item.quantity}</span>
                        </div>
                        <div className="flex-grow flex flex-col justify-center gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Cpu size={12} className="text-[#6C5CE7]" />
                                    <span className="text-slate-500 text-[7px] font-black tracking-[0.3em] uppercase">E4 PASS</span>
                                </div>
                                <h3 className="text-white font-black text-lg tracking-tighter uppercase line-clamp-2 leading-tight">{item.name}</h3>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/5">
                                <div className="relative shrink-0">
                                    <CircularProgress pct={timeLeft.pct} color="text-[#6C5CE7]" />
                                    <div className="absolute inset-0 flex items-center justify-center"><Clock className="text-white/10" size={12} /></div>
                                </div>
                                <div className="text-left font-mono">
                                    <span className="text-[7px] font-black text-slate-700 block tracking-widest uppercase">Expires In</span>
                                    <span className="text-sm font-black text-[#6C5CE7]">{String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <div className="text-left">
                                <span className="text-[6px] font-black text-slate-800 block uppercase">Quantity</span>
                                <span className="text-white/70 font-black text-[10px] tracking-widest">X {item.quantity}</span>
                            </div>
                            <button className="px-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-[8px] font-black text-white uppercase tracking-widest hover:bg-[#6C5CE7] transition-all">Show Pass</button>
                        </div>
                    </div>
                </div>

                {/* Back Side (QR) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="h-full w-full rounded-[2rem] bg-[#02040a] p-6 flex flex-col items-center justify-between shadow-4xl border border-white/10">
                        <div className="w-full flex justify-between items-center">
                            <span className="text-slate-600 text-[8px] font-black uppercase tracking-[0.4em]">Pass Link</span>
                            <ShieldCheck size={16} className="text-[#6C5CE7]" />
                        </div>
                        <div className="p-3 bg-white rounded-3xl">
                            <QRCode value={qrData} size={120} fgColor="#02040a" />
                        </div>
                        <div className="text-center">
                            <span className="text-[8px] font-black text-slate-800 block mb-1 uppercase tracking-widest">Ticket Key</span>
                            <code className="text-white text-[10px] bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 font-mono tracking-widest">#{(ticket.id || '').toUpperCase().slice(-8)}</code>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

const Success = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    const isSuccess = status === 'success';
    const { clearCart, addPoints } = useStore();
    const navigate = useNavigate();
    const pointsAddedRef = useRef(false);

    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useStore(state => state.refreshUser);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return setLoading(false);
            try {
                const res = await fetchWithAuth(`/api/payment/status/${orderId}`);
                if (res.ok) {
                    const data = await res.json();
                    const orderObj = data.order || data;
                    setOrderDetails(orderObj);
                    
                    // Optimistic update for reward points (User Rule: 500 Bill = 10 Points)
                    if (!pointsAddedRef.current && Number(orderObj.amount) >= 500) {
                        const pts = Math.floor(Number(orderObj.amount) / 500) * 10;
                        addPoints(pts);
                        pointsAddedRef.current = true;
                    }

                    // Refresh user profile to sync with backend eventually
                    await refreshUser();
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (isSuccess) clearCart();
        fetchOrder();
    }, [isSuccess, orderId, clearCart, refreshUser, addPoints]);

    // Determine success based on either URL param OR backend state once loaded
    const isVerifiedSuccess = useMemo(() => {
        const urlStatus = status?.toLowerCase();
        const apiStatus = (orderDetails?.status || orderDetails?.orderStatus || '').toLowerCase();
        
        // If URL explicitly says success, trust it
        if (['success', 'paid', 'captured', 'confirmed'].includes(urlStatus)) return true;
        
        // If order details are loaded and say success, trust it
        if (orderDetails && ['success', 'paid', 'captured', 'confirmed'].includes(apiStatus)) return true;
        
        // Fallback: If we have order details and URL status is empty/missing, check if it's NOT explicitly failed
        if (orderDetails && !urlStatus && !['failed', 'cancelled', 'abort'].includes(apiStatus)) return true;

        return false;
    }, [status, orderDetails]);

    if (loading) return (
        <div className="min-h-screen bg-[#02040a] flex flex-col items-center justify-center space-y-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6C5CE7]"></div>
            <p className="text-[#AAB2C5] font-black uppercase tracking-[0.5em] text-[10px]">Verifying Protocol...</p>
        </div>
    );

    if (!isVerifiedSuccess && !loading) return (
        <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-8">
             <div className="bg-white/[0.02] p-16 rounded-[4rem] border border-red-500/20 max-w-xl text-center">
                <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20"><X size={48} /></div>
                <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Transaction Failed</h1>
                <p className="text-slate-600 mb-8 font-bold text-sm">Your payment sequence was interrupted. Please try again or contact support.</p>
                <Link to="/" className="btn-premium px-12 py-5 rounded-3xl block w-full">Return Home</Link>
             </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#02040a] py-20 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute inset-0 matrix-grid opacity-5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#6C5CE7]/5 blur-[200px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FF7A00]/5 blur-[200px] rounded-full" />
            </div>

            <main className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col items-center mb-16 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-[#6C5CE7]/10 text-[#6C5CE7] rounded-3xl flex items-center justify-center mb-8 border border-[#6C5CE7]/20 shadow-2xl"
                    >
                        <ShieldCheck size={40} />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4"
                    >
                        Tickets <span className="text-gradient-primary">Confirmed</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-600 font-black tracking-[0.4em] uppercase text-[10px] opacity-70"
                    >
                        Your Transaction [ #{String(orderId).slice(-8).toUpperCase()} ] was successful
                    </motion.p>
                </div>

                {/* ── REWARD POINTS SECTION ── */}
                {Number(orderDetails?.amount || 0) >= 500 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-md mx-auto mb-16 p-8 rounded-[3rem] bg-gradient-to-br from-[#6C5CE7]/20 to-transparent border border-[#6C5CE7]/30 backdrop-blur-3xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5CE7]/10 blur-[60px] -mr-16 -mt-16 group-hover:bg-[#6C5CE7]/20 transition-all duration-700" />
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-[#6C5CE7] flex items-center justify-center text-white shadow-[0_0_20px_rgba(108,92,231,0.5)] animate-pulse">
                                <Zap size={32} fill="white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-[0.4em] mb-1">Loyalty Protocol</p>
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                                    +{Math.floor(Number(orderDetails.amount) / 500) * 10} Points <span className="text-[#6C5CE7]">Earned</span>
                                </h2>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Added to your Profile Hub registry</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Ticket Grid - Using Professional Card UI */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {(orderDetails?.items || []).filter(i => i.id !== 'tax-gst-9').map((item, idx) => (
                        <motion.div
                            key={item.id || idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                        >
                            <TicketCard ticket={orderDetails} item={item} />
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link to="/login" className="flex-1 btn-premium py-6 rounded-3xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest shadow-2xl">
                           <User size={18} /> Profile Hub
                        </Link>
                        <Link to="/dine" className="flex-1 bg-white/[0.03] border border-white/10 hover:border-[#6C5CE7]/40 py-6 rounded-3xl flex items-center justify-center gap-4 text-white text-xs font-black uppercase tracking-widest transition-all">
                           Dine Module <ArrowRight size={18} />
                        </Link>
                    </div>
                    <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">
                        Tickets are automatically synced to your Profile Hub for offline access
                    </p>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                .matrix-grid { background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 40px 40px; }
                .backdrop-blur-4xl { backdrop-filter: blur(60px); }
                .shadow-4xl { box-shadow: 0 40px 80px -15px rgba(0,0,0,0.8); }
                .perspective-3000 { perspective: 3000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .text-gradient-primary { background: linear-gradient(to right, #6C5CE7, #A29BFE); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            ` }} />
        </div>
    );
};

export default Success;
