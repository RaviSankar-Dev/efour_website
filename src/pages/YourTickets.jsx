import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Clock, ArrowRight, ShieldCheck, AlertCircle, History, LayoutDashboard, QrCode, Receipt, Calendar, Lock, Cpu, Zap } from 'lucide-react';
import useStore from '../store/useStore';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { fetchWithAuth, getMyTickets, getOrderDetails } from '../utils/api';
import { X, MapPin, ExternalLink, ArrowUpRight, CheckCircle2 } from 'lucide-react';

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

const OrderCard = ({ order, onViewTickets, onViewInvoice }) => {
    const items = order.items || [];
    const date = safeDate(order.date || order.created_at || order.createdAt || order.purchaseDate);

    // Aggressive price discovery
    const totalAmount = order.total_amount || order.amount_total || order.grand_total || order.total_price || order.amount || 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-[#0F111A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:border-white/10 group"
        >
            {/* Header: Identity */}
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-700">
                        <img src="/E4LOGOr.png" className="w-full h-full object-contain brightness-150" alt="E4" />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-tighter leading-none mb-1">EFOUR</h3>
                        <div className="flex items-center gap-1.5 opacity-40">
                            <MapPin size={10} className="text-[#6C5CE7]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Vijayawada Terminal</span>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">PAID</span>
                </div>
            </div>

            {/* Middle: Line Items */}
            <div className="p-6 md:p-8 space-y-4">
                {items.filter(i => i.id !== 'tax-gst-9').map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-3">
                            <span className="text-[#6C5CE7] font-black text-xs">{item.quantity} x</span>
                            <span className="text-white/80 font-bold text-sm uppercase tracking-tight group-hover/item:text-white transition-colors capitalize">{item.name}</span>
                        </div>
                        <span className="text-white font-black text-sm tabular-nums tracking-wide">₹{item.price}</span>
                    </div>
                ))}
            </div>

            {/* Bottom: Metrics & Actions */}
            <div className="p-6 md:p-8 bg-black/20 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6 opacity-40">
                        <div className="flex items-center gap-2">
                            <Calendar size={12} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={12} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</span>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">TOTAL (INC TAX)</span>
                        <span className="text-white font-black text-lg">₹{totalAmount}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onViewInvoice(order)}
                        className="py-4 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/5 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all"
                    >
                        VIEW INVOICE
                    </button>
                    <button
                        onClick={() => onViewTickets(order)}
                        className="py-4 bg-[#6C5CE7] hover:bg-[#5B4BCB] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#6C5CE7]/10 flex items-center justify-center gap-3 group/btn"
                    >
                        VIEW TICKETS <Zap size={12} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const YourTickets = () => {
    const { user, showToast } = useStore();
    const [loading, setLoading] = useState(true);
    const [rawTickets, setRawTickets] = useState([]);
    const [selectedOrderTickets, setSelectedOrderTickets] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isDrilling, setIsDrilling] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await getMyTickets();
            if (res.ok) {
                const data = await res.json();
                setRawTickets(Array.isArray(data) ? data : (data.orders || data.data || []));
            }
        } catch (err) {
            console.warn('Failed to fetch orders list', err);
        }
        setLoading(false);
    };

    const handleViewTickets = async (order) => {
        setIsDrilling(true);
        const orderId = order._id || order.id || order.orderId;
        try {
            const res = await getOrderDetails(orderId);
            if (res.ok) {
                const data = await res.json();
                setSelectedOrderTickets(data);
            } else {
                // Fallback to locally passed order items if API fails
                setSelectedOrderTickets(order.items || []);
            }
        } catch (err) {
            setSelectedOrderTickets(order.items || []);
        }
        setIsDrilling(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const tickets = useMemo(() => {
        if (!rawTickets || rawTickets.length === 0) return [];
        const validStatuses = ['success', 'confirmed', 'paid', 'captured', 'active', 'unused'];
        return rawTickets
            .filter(Boolean)
            .flatMap(ticket => {
                // Determine if this is an order with multiple items or a single ticket
                const items = ticket.items || [];

                if (items.length > 0) {
                    // It's an order document
                    const status = (ticket.status || ticket.orderStatus || '').toLowerCase();
                    if (!validStatuses.includes(status) && status !== '') return []; // Skip if invalid status

                    return items.filter(item => item.id !== 'tax-gst-9').map(item => {
                        // Look for price in the item FIRST, then the parent ticket (order)
                        const rawPrice = item.price || item.item_price || item.unit_price ||
                            item.product?.price || item.product?.unit_price ||
                            ticket.amount || ticket.total_amount || ticket.total_price ||
                            ticket.amount_total || ticket.total || 0;

                        const price = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) : (Number(rawPrice) || 0);
                        return {
                            ...item,
                            price,
                            quantity: Number(item.quantity) || 1,
                            ticketId: ticket.id || ticket._id,
                            purchaseDate: ticket.date || ticket.createdAt || ticket.purchaseDate,
                            originalTicket: ticket
                        };
                    });
                } else {
                    // It's already an individual ticket document (new API format)
                    const status = (ticket.status || '').toLowerCase();
                    // If flat tickets don't have a status or are valid, include them
                    if (status && !validStatuses.includes(status)) return [];

                    // Extract price - extremely aggressive search for potential price fields
                    const rawPrice = ticket.price || ticket.item_price || ticket.amount || ticket.unit_price ||
                        ticket.total_amount || ticket.amount_total || ticket.price_total ||
                        ticket.grand_total || ticket.cost || ticket.price_paid || 0;

                    const price = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) : (Number(rawPrice) || 0);

                    return [{
                        ...ticket,
                        name: ticket.item_name || ticket.name || ticket.title || ticket.item_title || 'E4 Ticket',
                        price: price,
                        quantity: Number(ticket.quantity) || 1,
                        ticketId: ticket.id || ticket._id || ticket.code || ticket.order_id || 'TKT-000',
                        purchaseDate: ticket.created_at || ticket.date || ticket.createdAt || ticket.purchaseDate || new Date(),
                        originalTicket: ticket
                    }];
                }
            });
    }, [rawTickets]);

    const filteredTickets = useMemo(() => {
        const now = new Date();
        return tickets.filter(t => {
            const pDate = t.purchaseDate ? new Date(t.purchaseDate) : now;
            const validPDate = isNaN(pDate.getTime()) ? now : pDate;
            const expiry = new Date(validPDate.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);
            const remaining = (expiry - now) / (1000 * 60 * 60);

            // Only show tickets that haven't expired (valid for 24 hours)
            return remaining > 0;
        });
    }, [tickets]);



    if (loading && rawTickets.length === 0) {
        return (
            <div className="min-h-screen bg-[#02040a] pt-52 md:pt-64 pb-12 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
                <div className="w-20 h-20 border-[3px] border-[#6C5CE7]/20 border-t-[#6C5CE7] rounded-full animate-spin mb-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#6C5CE7] animate-pulse">Loading Neural Interface...</p>
            </div>
        );
    }

    if (!user || rawTickets.length === 0) {
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
                <h2 className="text-6xl md:text-9xl font-black text-white mb-8 uppercase tracking-tighter transform leading-[0.85]">NO ORDERS <br /> <span className="text-gradient-primary">YET</span></h2>
                <p className="text-slate-600 mb-16 max-w-lg font-black uppercase tracking-[0.4em] text-[12px] opacity-60 leading-relaxed border-l-2 border-[#6C5CE7]/20 pl-10 mx-auto">You haven't placed any orders yet. <br />Go to our food or rides to start booking.</p>
                <Link to="/" className="btn-premium px-20 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.6em] text-[12px] shadow-4xl hover:-translate-y-2 transition-all duration-700">
                    BOOK YOUR RIDE & FOOD
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#02040a] text-white pt-40 md:pt-48 pb-24 md:pb-48 selection:bg-[#6C5CE7]/30 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 matrix-grid opacity-[0.05] pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#6C5CE7]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF7A00]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute inset-0 noise-overlay opacity-[0.02]" />            <div className={`container mx-auto px-8 max-w-[1440px] relative z-10 transition-all duration-700 ${(selectedOrderTickets || selectedInvoice) ? 'opacity-0 scale-95 pointer-events-none blur-2xl' : 'opacity-100 scale-100'}`}>
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 text-[#6C5CE7]">
                            <div className="w-16 h-[1.5px] bg-[#6C5CE7]/40" />
                            <span className="text-[10px] font-black uppercase tracking-[0.8em] ">MY TICKETS</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[1] transform mb-6">
                            YOUR <span className="text-gradient-primary">TICKETS</span>
                        </h1>
                        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] max-w-2xl opacity-60 leading-relaxed border-l border-white/5 pl-8">
                            Active bookings pass is valid for 24 hours.
                        </p>
                    </div>
                </div>

                {/* Orders Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[400px] rounded-[3rem] bg-white/[0.02] border border-white/10 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                        {rawTickets.map((order, index) => (
                            <OrderCard
                                key={index}
                                order={order}
                                onViewTickets={handleViewTickets}
                                onViewInvoice={(o) => setSelectedInvoice(o)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Drill-down Modal for Tickets */}
            <AnimatePresence>
                {/* Drill-down Modal for Tickets */}
                {selectedOrderTickets && (() => {
                    const baseItems = Array.isArray(selectedOrderTickets) ? selectedOrderTickets : (selectedOrderTickets.tickets || selectedOrderTickets.items || selectedOrderTickets.data || (typeof selectedOrderTickets === 'object' ? Object.values(selectedOrderTickets).find(v => Array.isArray(v)) : []) || []);
                    const filteredItems = baseItems.filter(i => i.id !== 'tax-gst-9' && i.item_name !== 'GST' && i.name !== 'GST' && i.category !== 'tax');
                    const itemsToRender = filteredItems.flatMap(item => {
                        const qty = Number(item.quantity) || 1;
                        return Array.from({ length: qty }, () => item);
                    });
                    const isSingle = itemsToRender.length === 1;

                    return (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedOrderTickets(null)}
                                className="absolute inset-0 bg-[#02040a] backdrop-blur-[200px]"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                className={`w-[95%] ${isSingle ? 'max-w-md' : 'max-w-[90vw]'} max-h-[90vh] bg-[#0A0C14] border border-white/10 rounded-[3rem] p-8 md:p-12 relative z-10 overflow-hidden flex flex-col shadow-4xl my-auto animate-in fade-in zoom-in duration-500`}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6C5CE7] to-transparent opacity-30" />

                                <div className="flex justify-between items-center mb-12">
                                    <div>
                                        <h2 className={`font-black uppercase tracking-tighter text-white font-outfit ${isSingle ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl'}`}>ACTIVE <span className="text-gradient-primary">PASSES</span></h2>
                                        <p className="text-[#AAB2C5]/40 text-[10px] font-black uppercase tracking-widest mt-2">
                                            {Array.isArray(selectedOrderTickets) ? `ORDER ${selectedOrderTickets[0]?.orderId || 'DETAILS'}` : (selectedOrderTickets.id || selectedOrderTickets._id)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrderTickets(null)}
                                        className={`${isSingle ? 'w-12 h-12' : 'w-16 h-16'} rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:rotate-90 duration-500`}
                                    >
                                        <X size={isSingle ? 18 : 24} />
                                    </button>
                                </div>

                                <div className="flex-grow overflow-y-auto px-4 pb-10 no-scrollbar">
                                    {isSingle ? (
                                        <div className="flex justify-center py-6">
                                            {itemsToRender.map((item, idx) => {
                                                const passId = item.code || item.id || item._id || 'PASS';
                                                return (
                                                    <div key={idx} className="w-full max-w-[320px] bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center gap-6 shadow-4xl group hover:border-[#6C5CE7]/30 transition-all duration-700">
                                                        {/* <div className="w-full flex justify-between items-center mb-2">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/10 flex items-center justify-center text-[#6C5CE7]">
                                                                        <Zap size={14} />
                                                                    </div>
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#AAB2C5]/60">ACTIVE SCAN</span>
                                                                </div>
                                                                <span className="text-white font-black text-sm uppercase">₹{item.price || 0}</span>
                                                            </div> */}
                                                        <div className="relative group/qr">
                                                            <div className="absolute -inset-8 bg-[#6C5CE7]/20 rounded-full blur-3xl opacity-0 group-hover/qr:opacity-100 transition-opacity" />
                                                            <div className="bg-white p-4 rounded-[1.5rem] relative z-10 shadow-4xl group-hover/qr:scale-[1.05] transition-transform duration-700">
                                                                <QRCode value={passId} size={150} fgColor="#02040a" />
                                                            </div>
                                                        </div>
                                                        <div className="text-center space-y-2">
                                                            <h3 className="text-white font-black text-base md:text-lg uppercase tracking-tight">{item.name || item.item_name || 'E4 Ticket'}</h3>
                                                            <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] opacity-30">
                                                                <span>ID: {String(passId).slice(-8)}</span>
                                                                {/* <div className="w-1 h-1 rounded-full bg-white" /> */}
                                                                {/* <span>UNIT PRICE: ₹{item.price || item.unit_price || item.amount || 0}</span> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                                            {itemsToRender.map((item, idx) => {
                                                const passId = item.code || item.id || item._id || 'PASS';
                                                return (
                                                    <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center gap-6 shadow-4xl group hover:border-[#6C5CE7]/30 transition-all duration-700">
                                                        {/* <div className="w-full flex justify-between items-center mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/10 flex items-center justify-center text-[#6C5CE7]">
                                                                    <Zap size={14} />
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#AAB2C5]/60">ACTIVE SCAN</span>
                                                            </div>
                                                            <span className="text-white font-black text-sm uppercase">₹{item.price || 0}</span>
                                                        </div> */}
                                                        <div className="relative group/qr">
                                                            <div className="absolute -inset-8 bg-[#6C5CE7]/20 rounded-full blur-3xl opacity-0 group-hover/qr:opacity-100 transition-opacity" />
                                                            <div className="bg-white p-4 rounded-[1.5rem] relative z-10 shadow-4xl group-hover/qr:scale-[1.05] transition-transform duration-700">
                                                                <QRCode value={passId} size={150} fgColor="#02040a" />
                                                            </div>
                                                        </div>
                                                        <div className="text-center space-y-2">
                                                            <h3 className="text-white font-black text-lg uppercase tracking-tight">{item.name || item.item_name || 'E4 Ticket'}</h3>
                                                            <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] opacity-30">
                                                                <span>ID: {String(passId).slice(-8)}</span>
                                                                {/* <div className="w-1 h-1 rounded-full bg-white" /> */}
                                                                {/* <span>UNIT PRICE: ₹{item.price || item.unit_price || item.amount || 0}</span> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    );
                })()}

                {/* Invoice Modal matching the reference screenshot */}
                {selectedInvoice && (() => {
                    const order = selectedInvoice;
                    const date = safeDate(order.date || order.created_at || order.createdAt || order.purchaseDate);
                    const items = (order.items || []).filter(i => i.id !== 'tax-gst-9');
                    const total = order.total_amount || order.amount_total || order.grand_total || order.total_price || order.amount || 0;
                    const taxItem = (order.items || []).find(i => i.id === 'tax-gst-9' || i.name === 'GST' || i.item_name === 'GST');
                    const realTax = taxItem ? (taxItem.price || taxItem.amount || 0) : Math.round(total * (0.09 / 1.09));
                    const invoiceNo = order.id || order._id || 'ETH-705072';

                    return (
                        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedInvoice(null)}
                                className="absolute inset-0 bg-[#02040a] backdrop-blur-[200px]"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                className="w-[90%] max-w-[400px] bg-white rounded-[2rem] overflow-hidden relative z-10 flex flex-col shadow-4xl animate-in fade-in zoom-in duration-500"
                            >
                                {/* Compact Header */}
                                <div className="bg-[#1F2937] p-6 text-white relative">
                                    <button
                                        onClick={() => setSelectedInvoice(null)}
                                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-20"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex justify-between items-center pr-8">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shrink-0 shadow-lg">
                                                <img src="/E4LOGOr.png" className="w-full h-full object-contain" alt="E4" />
                                            </div>
                                            <div className="space-y-0">
                                                <h2 className="font-black text-sm tracking-tight uppercase">EFOUR</h2>
                                                <p className="text-[7px] text-white/40 font-bold uppercase tracking-widest">Receipt</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h1 className="text-xl font-black tracking-tighter uppercase">INVOICE</h1>
                                        </div>
                                    </div>
                                </div>

                                {/* High-Density Body */}
                                <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto no-scrollbar">
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-0.5">
                                            <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest"># NO.</p>
                                            <p className="text-gray-900 font-black text-[10px] truncate">{invoiceNo}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-0.5">
                                            <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">📅 DATE</p>
                                            <p className="text-gray-900 font-black text-[10px]">{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden text-[10px]">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="grid grid-cols-12 gap-3 p-3 border-b border-gray-50 items-center last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <div className="col-span-8 text-gray-900 font-black uppercase truncate">{item.name}</div>
                                                <div className="col-span-1 text-gray-400 font-bold text-center text-[8px]">x{item.quantity}</div>
                                                <div className="col-span-3 text-gray-900 font-black text-right">₹{item.price * item.quantity}</div>
                                            </div>
                                        ))}
                                        <div className="bg-[#1F2937] p-4 flex justify-between items-center text-white mt-2">
                                            <div className="space-y-0.5">
                                                <p className="text-[6px] text-white/40 font-bold uppercase tracking-widest">Tax Included (9%)</p>
                                                <p className="text-[8px] font-bold">GST: ₹{realTax}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[7px] text-white/40 font-bold uppercase tracking-widest">GRAND TOTAL</p>
                                                <p className="text-2xl font-black tracking-tighter leading-none">₹{total}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 opacity-30 mt-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[7px] font-black uppercase tracking-[0.4em]">VERIFIED TRANSACTION</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedInvoice(null)}
                                    className="m-5 md:m-6 py-4 bg-[#1F2937] text-white rounded-xl font-black uppercase tracking-[0.3em] text-[9px] shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                                >
                                    CLOSE
                                </button>
                            </motion.div>
                        </div>
                    );
                })()}
            </AnimatePresence>

            {/* Empty State for Filter */}
            {!loading && rawTickets.length === 0 && (
                <div className={`py-48 flex flex-col items-center text-center max-w-lg mx-auto relative z-10 transition-all duration-700 ${(selectedOrderTickets || selectedInvoice) ? 'opacity-0 scale-95 blur-2xl' : 'opacity-100 scale-100'}`}>
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white/[0.02] flex items-center justify-center mb-12 shadow-4xl border border-white/5 group animate-pulse-subtle">
                        <Clock className="text-slate-900 group-hover:text-[#6C5CE7] transition-colors duration-700" size={48} />
                    </div>
                    <p className="text-slate-700 font-black uppercase tracking-[0.5em] text-xs leading-relaxed border-t border-white/5 pt-10">No operational orders found.</p>
                </div>
            )}

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

