import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Clock, ArrowRight, ShieldCheck, AlertCircle, History, LayoutDashboard, QrCode, Receipt, Calendar, Lock, Cpu, Zap } from 'lucide-react';
import useStore from '../store/useStore';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { fetchWithAuth } from '../utils/api';

// Constants for expiry logic
const EXPIRY_HOURS = 24; // 24 hours
const WARNING_HOURS = 4; // Warning starts 4h before expiry

const CircularProgress = ({ pct, color }) => {
    const r = 18;
    const circ = 2 * Math.PI * r;
    const strokePct = ((100 - pct) * circ) / 100;

    return (
        <svg width="44" height="44" className="rotate-[-90deg]">
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

const TicketCard = memo(({ ticket, item }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, pct: 100 });
    const [status, setStatus] = useState('active'); // active, expiring, expired

    useEffect(() => {
        const calculateTime = () => {
            const purchaseDate = safeDate(ticket.date || ticket.createdAt);
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
            setStatus(h < WARNING_HOURS ? 'expiring' : 'active');
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [ticket.date, ticket.createdAt]);

    const getStatusConfig = () => {
        switch (status) {
            case 'expiring':
                return { label: 'EXPIRING SOON', color: 'text-[#FF7A00]', bg: 'bg-[#FF7A00]/10', border: 'border-[#FF7A00]/30', glow: 'shadow-[0_0_20px_rgba(255,122,0,0.3)]' };
            case 'expired':
                return { label: 'EXPIRED', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', glow: '' };
            default:
                return { label: 'READY', color: 'text-[#6C5CE7]', bg: 'bg-[#6C5CE7]/10', border: 'border-[#6C5CE7]/30', glow: 'shadow-[0_0_20px_rgba(108,92,231,0.3)]' };
        }
    };

    const config = getStatusConfig();
    const qrData = `${ticket.id || ticket._id}-${item.id}`;

    return (
        <div className="relative h-[520px] w-full perspective-3000 group">
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 1.2, type: 'spring', damping: 20, stiffness: 80 }}
                className="relative w-full h-full preserve-3d cursor-pointer"
                onClick={() => status !== 'expired' && setIsFlipped(!isFlipped)}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                    <div className={`h-full w-full rounded-[3.5rem] bg-white/[0.02] backdrop-blur-4xl border border-white/10 p-10 flex flex-col justify-between overflow-hidden shadow-4xl transition-all duration-1000 hover:border-[#6C5CE7]/40 group/card ${status === 'expiring' ? 'animate-pulse-subtle ring-1 ring-[#FF7A00]/30' : ''}`}>
                        {/* Background Ambient Glow */}
                        <div className={`absolute top-0 right-0 w-48 h-48 blur-[100px] opacity-20 pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2 transition-colors duration-1000 ${status === 'expired' ? 'bg-red-500' : (status === 'expiring' ? 'bg-[#FF7A00]' : 'bg-[#6C5CE7]')}`} />
                        <div className="absolute inset-0 noise-overlay opacity-[0.02] pointer-events-none" />

                        {/* Status Header */}
                        <div className="flex justify-between items-start relative z-10">
                            <div className={`px-6 py-2.5 rounded-2xl ${config.bg} border ${config.border} flex items-center gap-3 backdrop-blur-3xl ${config.glow} transition-all duration-1000`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${config.color.replace('text', 'bg')} ${status === 'expiring' ? 'animate-pulse' : ''} shadow-[0_0_12px_currentColor]`} />
                                <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${config.color} italic transform -skew-x-12`}>{config.label}</span>
                            </div>
                            <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/10 opacity-40 group-hover/card:opacity-100 group-hover/card:scale-110 group-hover/card:bg-[#6C5CE7]/10 group-hover/card:border-[#6C5CE7]/30 transition-all duration-700">
                                <QrCode className="text-white" size={24} />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-10 relative z-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#6C5CE7] group-hover/card:bg-[#6C5CE7] group-hover/card:text-white transition-all duration-700 shadow-xl">
                                        <Cpu size={24} />
                                    </div>
                                    <span className="text-slate-600 text-[10px] font-black tracking-[0.5em] uppercase italic opacity-60">FOR RIDE/FOOD</span>
                                </div>
                                <h3 className="text-white font-black text-4xl md:text-5xl tracking-tighter uppercase italic transform -skew-x-12 leading-tight group-hover:text-gradient-primary transition-all duration-1000">
                                    {item.name}
                                </h3>
                                <p className="text-[#6C5CE7] text-[10px] font-black tracking-[0.5em] uppercase italic opacity-60">EFOUR ELURU</p>
                            </div>

                            <div className="flex items-center gap-8 bg-black/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-4xl shadow- inner group-hover/card:border-[#6C5CE7]/20 transition-all duration-1000">
                                <div className="relative shrink-0">
                                    <CircularProgress pct={timeLeft.pct} color={status === 'expired' ? 'text-red-500' : (status === 'expiring' ? 'text-[#FF7A00]' : 'text-[#6C5CE7]')} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Clock className="text-white/20" size={20} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-slate-800 text-[10px] font-black uppercase tracking-[0.3em] block italic opacity-40">EXPIRES IN</span>
                                    <span className={`text-3xl font-mono font-black tabular-nums transition-colors duration-1000 ${config.color} italic tracking-widest`}>
                                        {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="mt-6 pt-8 border-t border-white/5 space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <span className="text-slate-800 text-[10px] font-black uppercase tracking-[0.3em] block italic opacity-40">PRICE</span>
                                    <span className="text-white font-black text-3xl tracking-tighter transform -skew-x-12 italic">₹{item.price * item.quantity}</span>
                                </div>
                                <div className="text-right space-y-1.5">
                                    <span className="text-slate-800 text-[10px] font-black uppercase tracking-[0.3em] block italic opacity-40">DATE & TIME</span>
                                    <span className="text-white/80 font-black text-xs italic uppercase tracking-[0.1em]">{safeDate(ticket.date || ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                                </div>
                            </div>

                            <button
                                className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all duration-700 flex items-center justify-center gap-4 italic transform -skew-x-12 ${status === 'expired' ? 'bg-red-500/5 text-red-500/30 cursor-not-allowed border border-red-500/10' : 'bg-white/[0.03] text-white border border-white/10 hover:border-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white hover:shadow-4xl active:scale-95 group/btn'}`}
                            >
                                {status === 'expired' ? 'EXPIRED' : 'SHOW TICKET'}
                                {status !== 'expired' && <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform duration-500" />}
                            </button>
                        </div>

                        {/* Expired Overlay */}
                        {status === 'expired' && (
                            <div className="absolute inset-0 bg-[#02040a]/98 backdrop-blur-4xl z-20 flex flex-col items-center justify-center p-10 text-center rounded-[3.5rem]">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-red-500/5 flex items-center justify-center mb-8 border border-red-500/10 shadow-4xl group">
                                    <Lock className="text-red-500 group-hover:scale-110 transition-transform duration-700" size={40} />
                                </div>
                                <h4 className="text-white font-black text-4xl uppercase italic tracking-tighter mb-4 transform -skew-x-12 leading-none">TICKET <br /><span className="text-red-500">EXPIRED</span></h4>
                                <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">TIME IS UP</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back Side (QR) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="h-full w-full rounded-[3.5rem] bg-[#02040a] p-10 flex flex-col items-center justify-between shadow-4xl border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
                        
                        {/* Background Light */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                            <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-[#6C5CE7] rounded-full blur-[120px]" />
                        </div>

                        <div className="w-full flex justify-between items-center relative z-10">
                            <div className="bg-white/[0.03] border border-white/5 px-6 py-2.5 rounded-2xl backdrop-blur-3xl">
                                <span className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em] italic opacity-60">EFOUR TICKET</span>
                            </div>
                            <img src="/E4LOGO.jpeg" className="w-12 h-12 rounded-[1.25rem] border border-white/10 brightness-150 contrast-125 shadow-4xl" alt="E4" />
                        </div>

                        <div className="flex-grow flex flex-col items-center justify-center space-y-10 relative z-10">
                            <div className="relative group/qr">
                                <div className="absolute -inset-8 bg-gradient-to-tr from-[#6C5CE7]/30 to-[#FF7A00]/30 rounded-[4rem] blur-[60px] opacity-40 group-hover:opacity-80 transition-opacity duration-1000" />
                                <div className="p-8 bg-white rounded-[3.5rem] shadow-4xl border-[6px] border-white/5 relative z-10 group-hover:scale-105 transition-transform duration-1000">
                                    <QRCode value={qrData} size={220} fgColor="#02040a" />
                                </div>
                            </div>
                            <div className="text-center space-y-3">
                                <span className="text-slate-800 text-[10px] font-black uppercase tracking-[0.5em] block italic opacity-40">TICKET ID</span>
                                <code className="bg-white/[0.03] px-6 py-2.5 rounded-2xl text-white font-mono text-xs border border-white/5 backdrop-blur-3xl tracking-widest uppercase">{(ticket.id || ticket._id || '').slice(0, 16)}</code>
                            </div>
                        </div>

                        <div className="w-full bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] space-y-5 backdrop-blur-4xl relative z-10">
                            <div className="flex items-center gap-5 text-slate-500">
                                <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7]/10 flex items-center justify-center text-[#6C5CE7] border border-[#6C5CE7]/20 shadow-inner">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">VERIFIED</span>
                            </div>
                            <div className="flex items-center gap-5 text-slate-500">
                                <div className="w-10 h-10 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] border border-[#FF7A00]/20 shadow-inner">
                                    <Zap size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">FAST ACCESS</span>
                            </div>
                        </div>

                        <button className="text-slate-800 text-[11px] font-black uppercase tracking-[0.5em] mt-8 hover:text-white transition-all transform hover:scale-110 italic active:scale-90">
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
            <span className="text-slate-800 text-[11px] font-black uppercase tracking-[0.5em] block mb-3 opacity-40 italic">{label}</span>
            <span className="text-white font-black text-5xl tabular-nums leading-none tracking-tighter italic transform -skew-x-12">{value}</span>
        </div>
    </div>
);

const YourTickets = () => {
    const { user } = useStore();
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [rawTickets, setRawTickets] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await fetchWithAuth('/api/payment/my-orders');
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data)) {
                            setRawTickets(data);
                            setLoading(false);
                            return;
                        }
                    }
                }
            } catch (err) {
                console.warn('Failed to fetch from /api/payment/my-orders', err);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const tickets = useMemo(() => {
        if (!rawTickets || rawTickets.length === 0) return [];
        const validStatuses = ['success', 'confirmed', 'paid', 'captured'];
        return rawTickets
            .filter(Boolean)
            .filter(ticket => {
                const status = (ticket.status || ticket.orderStatus || '').toLowerCase();
                return validStatuses.includes(status);
            })
            .flatMap(ticket =>
                (ticket.items || []).filter(item => item.id !== 'tax-gst-9').map(item => ({
                    ...item,
                    ticketId: ticket.id || ticket._id,
                    purchaseDate: ticket.date || ticket.createdAt,
                    originalTicket: ticket
                }))
            );
    }, [rawTickets]);

    const filteredTickets = useMemo(() => {
        const now = new Date();
        return tickets.filter(t => {
            const pDate = t.purchaseDate ? new Date(t.purchaseDate) : now;
            const validPDate = isNaN(pDate.getTime()) ? now : pDate;
            const expiry = new Date(validPDate.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);
            const remaining = (expiry - now) / (1000 * 60 * 60);

            if (filter === 'active') return remaining > WARNING_HOURS;
            if (filter === 'expiring') return remaining <= WARNING_HOURS && remaining > 0;
            if (filter === 'expired') return remaining <= 0;
            return true;
        });
    }, [tickets, filter]);

    const stats = useMemo(() => {
        const now = new Date();
        const initial = { total: tickets.length, active: 0, expiring: 0, expired: 0 };
        return tickets.reduce((acc, t) => {
            const pDate = t.purchaseDate ? new Date(t.purchaseDate) : now;
            const validPDate = isNaN(pDate.getTime()) ? now : pDate;
            const expiry = new Date(validPDate.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);
            const remaining = (expiry - now) / (1000 * 60 * 60);

            if (remaining <= 0) acc.expired++;
            else if (remaining <= WARNING_HOURS) acc.expiring++;
            else acc.active++;
            return acc;
        }, initial);
    }, [tickets]);

    if (!user || (!loading && tickets.length === 0)) {
        return (
            <div className="min-h-screen bg-[#02040a] pt-52 md:pt-64 pb-12 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
                <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-[#6C5CE7]/5 rounded-full blur-[200px] pointer-events-none" />
                <div className="absolute inset-0 noise-overlay opacity-[0.02]" />

                <motion.div
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 15, duration: 1.2 }}
                    className="w-40 h-40 rounded-[3.5rem] bg-white/[0.02] flex items-center justify-center mb-12 border border-white/10 backdrop-blur-4xl shadow-4xl relative group"
                >
                    <div className="absolute inset-0 bg-[#6C5CE7]/10 rounded-[3.5rem] blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
                    <Ticket size={72} className="text-[#6C5CE7] drop-shadow-[0_0_20px_#6C5CE7] relative z-10" />
                </motion.div>
                <h2 className="text-6xl md:text-9xl font-black text-white mb-8 uppercase italic tracking-tighter transform -skew-x-12 leading-[0.85]">NO TICKETS <br /> <span className="text-gradient-primary">YET</span></h2>
                <p className="text-slate-600 mb-16 max-w-lg font-black uppercase tracking-[0.4em] text-[12px] italic opacity-60 leading-relaxed border-l-2 border-[#6C5CE7]/20 pl-10 mx-auto">You haven't bought any tickets yet. <br />Go to our food or rides to start booking.</p>
                <Link to="/" className="btn-premium px-20 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.6em] text-[12px] shadow-4xl hover:-translate-y-2 transition-all duration-700">
                    BOOK YOUR RIDE & FOOD
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#02040a] text-white pt-52 md:pt-64 pb-24 md:pb-48 selection:bg-[#6C5CE7]/30 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 matrix-grid opacity-[0.05] pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#6C5CE7]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF7A00]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute inset-0 noise-overlay opacity-[0.02]" />

            <div className="container mx-auto px-8 max-w-[1440px] relative z-10">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-20 mb-32">
                    <div className="space-y-10">
                        <div className="flex items-center gap-6 text-[#6C5CE7]">
                            <div className="w-16 h-[2px] bg-[#6C5CE7]/40" />
                            <span className="text-[11px] font-black uppercase tracking-[0.8em] italic">MY TICKETS</span>
                        </div>
                        <h1 className="text-6xl md:text-[10rem] font-black italic tracking-tighter uppercase leading-[0.8] transform -skew-x-12">
                            YOUR <br /> <span className="text-gradient-primary">TICKETS</span>
                        </h1>
                        <p className="text-slate-600 text-sm font-bold uppercase tracking-[0.4em] max-w-2xl italic opacity-80 leading-relaxed border-l-2 border-[#6C5CE7]/30 pl-10">
                            Manage all your tickets here. Each ticket is valid for 24 hours after purchase.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 bg-white/[0.02] p-4 rounded-[4rem] border border-white/5 backdrop-blur-4xl shadow-4xl">
                        {['all', 'active', 'expiring', 'expired'].map(btn => (
                            <button
                                key={btn}
                                onClick={() => setFilter(btn)}
                                className={`px-10 py-5 rounded-[2rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${filter === btn ? 'text-white' : 'text-slate-800 hover:text-white'}`}
                            >
                                {filter === btn && (
                                    <motion.div
                                        layout
                                        className="absolute inset-0 bg-[#6C5CE7] rounded-[2rem] shadow-4xl border border-white/10"
                                        transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
                                    />
                                )}
                                <span className="relative z-10 italic">{btn === 'all' ? 'ALL' : btn.toUpperCase()}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tickets Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[520px] rounded-[4rem] bg-white/[0.02] border border-white/10 animate-pulse relative overflow-hidden shadow-4xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shimmer" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 xl:gap-24"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredTickets.map((ticket, index) => (
                                <motion.div
                                    key={`${ticket.ticketId}-${ticket.id}`}
                                    layout
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, rotateX: -20 }}
                                    transition={{ duration: 1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <TicketCard ticket={ticket.originalTicket} item={ticket} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Empty State for Filter */}
                {!loading && filteredTickets.length === 0 && (
                    <div className="py-48 flex flex-col items-center text-center max-w-lg mx-auto">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-white/[0.02] flex items-center justify-center mb-12 shadow-4xl border border-white/5 group animate-pulse-subtle">
                            <Clock className="text-slate-900 group-hover:text-[#6C5CE7] transition-colors duration-700" size={48} />
                        </div>
                        <p className="text-slate-700 font-black uppercase tracking-[0.5em] text-xs italic leading-relaxed border-t border-white/5 pt-10">No operational modules found in the current wavelength.</p>
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
