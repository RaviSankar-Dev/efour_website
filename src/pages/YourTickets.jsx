import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Clock, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, History, LayoutDashboard, QrCode, Receipt, Calendar, Lock, Cpu, Zap, Activity, Check } from 'lucide-react';
import useStore from '../store/useStore';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { fetchWithAuth, getMyTickets, getOrderDetails } from '../utils/api';

// Constants for expiry logic
const EXPIRY_HOURS = 24; // 24 hours

const CircularProgress = ({ pct, color }) => {
    const r = 14;
    const circ = 2 * Math.PI * r;
    const strokePct = ((100 - pct) * circ) / 100;

    return (
        <svg width="36" height="36" className="rotate-[-90deg]">
            <circle
                r={r}
                cx="22"
                cy="22"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={circ}
                strokeDashoffset="0"
                className="text-white/5"
            />
            <circle
                r={r}
                cx="22"
                cy="22"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={circ}
                strokeDashoffset={strokePct}
                strokeLinecap="round"
                className={`${color} transition-all duration-1000 ease-linear`}
            />
        </svg>
    );
};

const safeDate = (dateVal) => {
    if (!dateVal) return new Date();
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? new Date() : d;
};

const TicketCard = memo(({ ticket, item, onRefresh }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, pct: 100 });
    const [status, setStatus] = useState('active'); // active, expiring, expired

    useEffect(() => {
        const calculateTime = () => {
            const purchaseDate = safeDate(ticket.date || ticket.createdAt || ticket.created_at || ticket.purchaseDate);
            const expiryDate = new Date(purchaseDate.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);
            const now = new Date();
            const diff = expiryDate - now;

            if (diff <= 0) {
                setTimeLeft({ h: 0, m: 0, s: 0, pct: 0 });
                setStatus('expired');
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            const pct = (diff / (EXPIRY_HOURS * 60 * 60 * 1000)) * 100;

            setTimeLeft({ h, m, s, pct });
            setStatus('active');
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [ticket.date, ticket.createdAt, ticket.created_at, ticket.purchaseDate]);

    const getStatusConfig = () => {
        return { label: 'READY', color: 'text-[#6C5CE7]', bg: 'bg-[#6C5CE7]/10', border: 'border-[#6C5CE7]/30', glow: 'shadow-[0_0_20px_rgba(108,92,231,0.3)]' };
    };


    const config = getStatusConfig();
    const qrData = `${ticket.id || ticket._id || ticket.code || 'ID'}-${item.ticketId || item.id || 'ITEM'}`;

    return (
        <div className="relative h-[280px] w-full perspective-3000 group">
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 1.2, type: 'spring', damping: 20, stiffness: 80 }}
                className="relative w-full h-full preserve-3d cursor-pointer"
                onClick={() => status !== 'expired' && setIsFlipped(!isFlipped)}
            >
                <div className="absolute inset-0 backface-hidden">
                    <div className={`h-full w-full rounded-[2rem] bg-white/[0.02] backdrop-blur-4xl border border-white/10 p-4 flex flex-col justify-between overflow-hidden shadow-4xl transition-all duration-1000 hover:border-[#6C5CE7]/40 group/card ${status === 'expiring' ? 'animate-pulse-subtle ring-1 ring-[#FF7A00]/30' : ''}`}>
                        {/* Background Ambient Glow */}
                        <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2 transition-colors duration-1000 ${status === 'expired' ? 'bg-red-500' : (status === 'expiring' ? 'bg-[#FF7A00]' : 'bg-[#6C5CE7]')}`} />
                        <div className="absolute inset-0 noise-overlay opacity-[0.02] pointer-events-none" />

                        <div className="flex justify-between items-start relative z-10 mb-1">
                            <div className={`px-2 py-1 rounded-lg ${config.bg} border ${config.border} flex items-center gap-1.5 backdrop-blur-3xl`}>
                                <div className={`w-1 h-1 rounded-full ${config.color.replace('text', 'bg')} ${status === 'expiring' ? 'animate-pulse' : ''} shadow-[0_0_8px_currentColor]`} />
                                <span className={`text-[6px] font-black uppercase tracking-[0.3em] ${config.color}`}>{config.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black text-sm md:text-base tracking-tight shadow-sm">₹{Number(item.price * item.quantity).toFixed(0)}</span>
                                <div className="bg-white/[0.05] p-1.5 rounded-lg border border-white/10 opacity-60">
                                    <QrCode className="text-white shadow-lg" size={10} />
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-2 relative z-10 flex-grow">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="text-[#6C5CE7]">
                                        <Cpu size={12} />
                                    </div>
                                    <span className="text-slate-600 text-[6.5px] font-black tracking-[0.3em] uppercase opacity-50">E4 PASS</span>
                                </div>
                                <h3 className="text-white font-black text-sm md:text-base tracking-tighter uppercase leading-tight line-clamp-2">
                                    {item.name}
                                </h3>
                            </div>

                            <div className="mt-auto flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/5 backdrop-blur-3xl shadow-inner">
                                <div className="relative shrink-0">
                                    <CircularProgress pct={timeLeft.pct} color={status === 'expired' ? 'text-red-500' : (status === 'expiring' ? 'text-[#FF7A00]' : 'text-[#6C5CE7]')} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Clock className="text-white/10" size={12} />
                                    </div>
                                </div>
                                <div className="space-y-0 text-left">
                                    <span className="text-[6.5px] font-black uppercase tracking-[0.2em] text-slate-700 opacity-40 block">EXPIRES</span>
                                    <span className={`text-sm font-mono font-black tabular-nums ${config.color} tracking-[0.1em]`}>
                                        {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between relative z-10">
                            <div className="space-y-0 text-left">
                                <span className="text-slate-800 text-[6px] font-black uppercase tracking-[0.1em] block opacity-40">DATE</span>
                                <span className="text-white/70 font-black text-[7.5px] uppercase tracking-normal">{safeDate(ticket.date || ticket.createdAt || ticket.created_at || ticket.purchaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            </div>

                            <button
                                className={`px-4 py-2 rounded-lg font-black text-[7px] uppercase tracking-[0.2em] transition-all duration-700 flex items-center gap-2 transform ${status === 'expired' ? 'bg-red-500/5 text-red-500/30 cursor-not-allowed border border-red-500/10' : 'bg-white/[0.04] text-white border border-white/5 hover:bg-[#6C5CE7] hover:border-[#6C5CE7] active:scale-95'}`}
                            >
                                {status === 'expired' ? 'EXPIRED' : 'SHOW PASS'}
                                {status !== 'expired' && <ArrowRight size={10} />}
                            </button>
                        </div>

                        {/* Expired state handled by hiding the card entirely in the parent */}
                    </div>
                </div>

                {/* Back Side (QR) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="h-full w-full rounded-[2.5rem] bg-[#02040a] p-5 flex flex-col items-center justify-between shadow-4xl border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
                        
                        {/* Background Light */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-[#6C5CE7] rounded-full blur-[120px]" />
                        </div>

                        <div className="w-full flex justify-between items-center relative z-10">
                            <div className="bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl backdrop-blur-3xl">
                                <span className="text-slate-600 text-[7px] font-black uppercase tracking-[0.4em] opacity-60">PASS VERIFICATION</span>
                            </div>
                            <img src="/E4LOGOr.png" className="w-10 h-10 rounded-xl border border-white/10 brightness-150" alt="E4" />
                        </div>

                        <div className="flex-grow flex flex-col items-center justify-center space-y-3 relative z-10">
                            <div className="relative group/qr">
                                <div className="absolute -inset-6 bg-gradient-to-tr from-[#6C5CE7]/30 to-[#FF7A00]/30 rounded-[3rem] blur-[40px] opacity-40 group-hover:opacity-80 transition-opacity duration-1000" />
                                <div className="p-3 bg-white rounded-[1.5rem] relative z-10 group-hover:scale-105 transition-transform duration-1000">
                                    <QRCode value={qrData} size={110} fgColor="#02040a" />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <span className="text-slate-800 text-[7px] font-black uppercase tracking-[0.3em] block opacity-40">TICKET KEY</span>
                                <code className="bg-white/[0.02] px-4 py-1.5 rounded-xl text-white font-mono text-[9px] border border-white/5 backdrop-blur-3xl tracking-widest uppercase">{String(ticket.id || ticket._id || ticket.code || '').slice(0, 12)}</code>
                            </div>
                        </div>

                        <div className="w-full bg-white/[0.02] border border-white/5 p-3 rounded-[1.25rem] space-y-2 backdrop-blur-4xl relative z-10">
                            <div className="flex items-center gap-3 text-slate-500">
                                <div className="w-6 h-6 rounded-lg bg-[#6C5CE7]/10 flex items-center justify-center text-[#6C5CE7] border border-[#6C5CE7]/20">
                                    <ShieldCheck size={12} />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] ">SECURE</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                                <div className="w-6 h-6 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] border border-[#FF7A00]/20">
                                    <Zap size={12} />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] ">VALID</span>
                            </div>
                        </div>

                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onRefresh && onRefresh();
                            }}
                            className="text-slate-800 text-[9px] font-black uppercase tracking-[0.4em] mt-4 hover:text-white transition-all transform hover:scale-110 active:scale-90"
                        >
                            REFRESH
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

const StatsCard = ({ icon: Icon, label, value, color, gradient }) => (
    <div className="glass-card border border-white/10 p-10 rounded-[3.5rem] flex items-center gap-8 transition-all duration-1000 hover:scale-[1.05] hover:border-[#6C5CE7]/40 group overflow-hidden relative shadow-4xl">
        <div className={`absolute -right-8 -bottom-8 w-32 h-32 blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity rounded-full bg-gradient-to-br ${gradient}`} />
        <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-4xl border border-white/10 transform group-hover:rotate-12 transition-transform duration-1000`}>
            <Icon size={32} />
        </div>
        <div>
            <span className="text-slate-800 text-[11px] font-black uppercase tracking-[0.5em] block mb-3 opacity-40 ">{label}</span>
            <span className="text-white font-black text-5xl tabular-nums leading-none tracking-tighter transform ">{value}</span>
        </div>
    </div>
);

const OrderCard = ({ order, onViewTickets }) => {
    if (!order) return null;
    const items = order.items || [];
    const mainItem = items[0] || {};
    const formattedDate = new Date(order.date || order.createdAt || order.purchaseDate || order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = new Date(order.date || order.createdAt || order.purchaseDate || order.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const totalAmount = order.totalAmount || order.amount || 0;

    return (
        <div className="bg-white rounded-[1.5rem] p-6 mb-6 shadow-sm border border-slate-100 font-sans group hover:shadow-md transition-all duration-500 overflow-hidden relative">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[1rem] bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                        <img src="/E4LOGOr.png" alt="Logo" className="w-12 h-12 object-contain" />
                    </div>
                    <div>
                        <h3 className="text-[#1E293B] font-black text-lg tracking-tight uppercase">ETHREE FOOD COURT</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Vijayawada</p>
                    </div>
                </div>
                <div className="px-3 py-1 flex items-center gap-2 bg-[#F1FDF6] border border-[#DCFCE7] rounded-full">
                    <span className="text-[#10B981] text-[10px] font-black tracking-widest uppercase">PAID</span>
                    <div className="w-3.5 h-3.5 bg-[#10B981] rounded-full flex items-center justify-center">
                        <Check size={9} className="text-white" />
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-50 pt-5 space-y-3">
                {items.filter(it => it.id !== 'tax-gst-9').map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-3">
                            <span className="text-[#0D9488] font-black text-sm">{item.quantity} x</span>
                            <span className="text-[#334155] font-bold text-sm">{item.item_name || item.name || 'Pass'}</span>
                        </div>
                        <span className="text-[#1E293B] font-black text-sm">₹{Number(item.price || item.item_price || item.total).toFixed(0)}</span>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-5 border-t border-slate-50 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={13} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase">{formattedDate}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <div className="flex items-center gap-1.5">
                        <Clock size={13} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase">{formattedTime}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[9px] font-black tracking-[0.05em] uppercase">TOTAL AMOUNT INCLUDING TAXES</span>
                    <span className="text-[#1E293B] font-black text-sm">₹{Number(totalAmount).toFixed(0)}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <button className="py-4 rounded-xl border-2 border-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95">
                    VIEW INVOICE
                </button>
                <button 
                    onClick={() => onViewTickets(order.id || order._id || 'ETH-332725')}
                    className="py-4 rounded-xl bg-[#0D9488] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-lg shadow-[#0D9488]/10 active:scale-95"
                >
                    VIEW TICKETS
                </button>
            </div>
        </div>
    );
};

const YourTickets = () => {
    const { user } = useStore();
    const [loading, setLoading] = useState(true);
    const [rawTickets, setRawTickets] = useState([]);
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const fetchOrders = async (isManual = false) => {
        if (!isManual) setLoading(true);
        try {
            const res = await getMyTickets();
            if (res.ok) {
                const data = await res.json();
                const ticketsList = Array.isArray(data) ? data : (data.data || data.tickets || (typeof data === 'object' ? [data] : []));
                setRawTickets(ticketsList);
            }
        } catch (err) {
            console.warn('Failed to fetch orders', err);
        }
        setLoading(false);
    };

    const handleViewTickets = async (orderId) => {
        setIsTransitioning(true);
        setActiveOrderId(orderId);
        try {
            const res = await getOrderDetails(orderId);
            if (res.ok) {
                const data = await res.json();
                setSelectedOrderDetails(data);
            }
        } catch (err) {
            console.warn('Failed to load order details', err);
        }
        setIsTransitioning(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const tickets = useMemo(() => {
        const source = (activeOrderId && selectedOrderDetails) ? (Array.isArray(selectedOrderDetails) ? selectedOrderDetails : [selectedOrderDetails]) : rawTickets;
        if (!source || source.length === 0) return [];
        
        const validStatuses = ['success', 'confirmed', 'paid', 'captured', 'active', 'unused', 'completed'];
        return source
            .filter(Boolean)
            .flatMap(ticket => {
                const items = ticket.items || [];
                if (items.length > 0) {
                    const status = (ticket.status || ticket.orderStatus || '').toLowerCase();
                    if (!validStatuses.includes(status) && status !== '') return [];

                    return items.filter(item => item.id !== 'tax-gst-9').map(item => ({
                        ...item,
                        price: item.price || item.item_price || ticket.amount || (ticket.totalAmount / items.length) || 0,
                        quantity: Number(item.quantity) || 1,
                        ticketId: ticket.id || ticket._id || ticket.orderId,
                        purchaseDate: ticket.date || ticket.createdAt || ticket.purchaseDate,
                        originalTicket: ticket
                    }));
                } else {
                    return [{
                        ...ticket,
                        name: ticket.item_name || ticket.name || ticket.title || ticket.item_title || 'E4 Ticket',
                        price: ticket.price || ticket.item_price || ticket.amount || 0,
                        quantity: Number(ticket.quantity) || 1,
                        ticketId: ticket.id || ticket._id || ticket.code || ticket.order_id || 'TKT-000',
                        purchaseDate: ticket.created_at || ticket.date || ticket.createdAt || ticket.purchaseDate || new Date(),
                        originalTicket: ticket
                    }];
                }
            });
    }, [rawTickets, activeOrderId, selectedOrderDetails]);

    const filteredTickets = useMemo(() => {
        const now = new Date();
        return tickets.filter(t => {
            const pDate = t.purchaseDate ? new Date(t.purchaseDate) : now;
            const validPDate = isNaN(pDate.getTime()) ? now : pDate;
            const expiry = new Date(validPDate.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);
            const remaining = (expiry - now) / (1000 * 60 * 60);

            return remaining > 0;
        });
    }, [tickets]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-12 overflow-x-hidden">
            {/* Header Area */}
            <div className="bg-[#02040a] pt-44 md:pt-52 pb-16 px-6 relative overflow-hidden text-center">
                <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="white-glow-section text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-none">Your Terminal</h1>
                    <p className="text-[#94A3B8] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] max-w-xl mx-auto leading-relaxed">
                        {!activeOrderId ? 'Accessing Secure Commerce Ledgers' : `Viewing Order: ${activeOrderId}`}
                    </p>
                    
                    {activeOrderId && (
                        <button 
                            onClick={() => { setActiveOrderId(null); setSelectedOrderDetails(null); }}
                            className="mt-8 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 mx-auto"
                        >
                            <ArrowLeft size={14} /> Back to Orders
                        </button>
                    )}
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-6 -mt-10 mb-12 relative z-20">
                {isTransitioning || (loading && rawTickets.length === 0) ? (
                    <div className="py-20 flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-[#0D9488]/20 border-t-[#0D9488] rounded-full animate-spin mb-4" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Syncing Ledgers...</p>
                    </div>
                ) : !activeOrderId ? (
                    /* Order List View */
                    <div className="space-y-6">
                        {rawTickets.map((order, idx) => (
                            <OrderCard key={idx} order={order} onViewTickets={handleViewTickets} />
                        ))}

                        {rawTickets.length === 0 && (
                            <div className="bg-white rounded-[2rem] p-20 text-center shadow-lg border border-slate-100">
                                <Activity className="text-slate-200 mx-auto mb-6" size={48} />
                                <h3 className="text-[#1E293B] font-black text-xl mb-2">NO RECORDS FOUND</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">You haven't made any purchases yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Individual Ticket Cards View */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {tickets.map((t, idx) => (
                            <TicketCard key={idx} item={t} ticket={t.originalTicket} />
                        ))}

                        {tickets.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No valid tickets found in this protocol.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Global Perspective Fix for 3D */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .perspective-3000 { perspective: 3000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.85; transform: scale(0.98); }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(200%) skewX(-15deg); }
                }
                .animate-shimmer {
                    animation: shimmer 3s infinite linear;
                }
                .backdrop-blur-4xl { backdrop-filter: blur(80px); }
                .shadow-4xl { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8); }
            `}} />
        </div>
    );
};

export default YourTickets;

