import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, LogOut, RefreshCw, Gamepad2, Power, Utensils, IndianRupee,
    Download, Monitor, Smartphone, Tablet, CheckCircle2, XCircle,
    ChevronUp, ChevronDown, TrendingUp, BarChart2, Clock, Calendar,
    Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA — replace with real API calls when endpoints are ready
───────────────────────────────────────────────────────────────────────────── */
const MOCK = {
    today: {
        revenue: 0,
        paid: 1,
        totalOrders: 2,
        date: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
    },
    chart14Days: [
        { label: '05', val: 0 }, { label: '06', val: 0 }, { label: '07', val: 0 },
        { label: '08', val: 1208 }, { label: '09', val: 850 }, { label: '10', val: 0 },
        { label: '11', val: 600 }, { label: '12', val: 900 }, { label: '13', val: 0 },
        { label: '14', val: 1500 }, { label: '15', val: 780 }, { label: '16', val: 0 },
        { label: '17', val: 545 }, { label: 'Today', val: 0 },
    ],
    todayOrders: [
        { id: '872590', time: '10:53 am', items: '1x Free Ride Ticket (Reward)', amount: 0, status: 'success' },
        { id: '813872', time: '10:46 am', items: '1x Mega combo, 1x Trample Zone', amount: 708.5, status: 'placed' },
    ],
    stats: {
        totalRides: 29,
        ridesActive: 29,
        dineItems: 20,
        e3Revenue: 6540,
    },
    platform: {
        web: 3,
        mobile: 2,
        total: 0,
        webPct: 60,
        mobilePct: 40,
    },
    rideStatus: {
        online: 29,
        offline: 0,
        total: 29,
    },
    bookings: [
        { id: '872590', date: '3/18/2026', items: '1x Free Ride Ticket (Reward)', amount: 0, status: 'confirmed' },
        { id: '411599', date: '3/17/2026', items: '1x Dining Dome', amount: 545, status: 'confirmed' },
        { id: '439050', date: '3/17/2026', items: '1x Event Booking (Celebration Zone)', amount: 1090, status: 'confirmed' },
        { id: '377802', date: '3/17/2026', items: '1x Dining Dome', amount: 545, status: 'confirmed' },
        { id: '294011', date: '3/16/2026', items: '1x Bull Ride, 1x Mini Wheel', amount: 390, status: 'confirmed' },
        { id: '183902', date: '3/15/2026', items: '1x Trampoline Zone', amount: 300, status: 'confirmed' },
    ],
};

/* ─── Tiny helper ─── */
const fmt = (n) => Number(n).toLocaleString('en-IN');

/* ─── Status badge ─── */
const Badge = ({ status }) => {
    const map = {
        success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        placed: 'bg-amber-500/15  text-amber-400  border-amber-500/30',
        pending: 'bg-amber-500/15  text-amber-400  border-amber-500/30',
        cancelled: 'bg-red-500/15    text-red-400    border-red-500/30',
    };
    return (
        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${map[status] || 'bg-white/10 text-white/60 border-white/10'}`}>
            {status}
        </span>
    );
};

/* ─── Mini chart bar ─── */
const ChartBar = ({ val, max, label, isToday }) => {
    const pct = max > 0 ? (val / max) * 100 : 0;
    return (
        <div className="flex flex-col items-center gap-1 flex-1 group">
            <div className="w-full flex items-end justify-center" style={{ height: 80 }}>
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(pct, 3)}%` }}
                    transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                    className={`w-[60%] rounded-t-sm ${isToday ? 'bg-[#FF7A18]' : 'bg-[#FF7A18]/30'} group-hover:bg-[#FF7A18]/70 transition-colors`}
                    style={{ minHeight: 3 }}
                />
            </div>
            <span className={`text-[8px] font-semibold ${isToday ? 'text-[#FF7A18]' : 'text-white/30'}`}>{label}</span>
        </div>
    );
};

/* ───────────────────────────────────────────────────────────────────────────── */
const Analytics = () => {
    const navigate = useNavigate();
    const [bookingTab, setBookingTab] = useState('all'); // 'all' | 'rides' | 'events'
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [data, setData] = useState(MOCK);

    const chartMax = Math.max(...data.chart14Days.map(d => d.val), 1);

    const fetchAnalytics = async () => {
        try {
            const res = await fetchWithAuth('/api/analytics/e4/dashboard');
            if (res.ok) {
                const result = await res.json();
                // Merge real data with mock defaults to ensure fallback structure
                setData(prev => ({ ...prev, ...result }));
            } else {
                console.error('Failed to fetch analytics data');
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // Simulate refresh with actual api call
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchAnalytics();
        setIsRefreshing(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // Filter bookings
    const visibleBookings = data.bookings.filter(b => {
        if (bookingTab === 'all') return true;
        if (bookingTab === 'rides') return !b.items.toLowerCase().includes('event') && !b.items.toLowerCase().includes('dine');
        if (bookingTab === 'events') return b.items.toLowerCase().includes('event') || b.items.toLowerCase().includes('dine');
        return true;
    });

    const totalBookingsRevenue = data.bookings.reduce((s, b) => s + b.amount, 0);

    // Export CSV
    const handleExport = () => {
        const rows = [['Order ID', 'Date', 'Items', 'Amount', 'Status'],
        ...visibleBookings.map(b => [`#${b.id}`, b.date, b.items, `₹${b.amount}`, b.status])];
        const csv = rows.map(r => r.join(',')).join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = 'efour_bookings.csv';
        a.click();
    };

    return (
        <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] font-sans">

            {/* ──── AMBIENT BACKGROUND ──── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#FF7A18]/5 rounded-full blur-[200px]" />
                <div className="absolute bottom-[0%] left-[-10%] w-[50%] h-[50%] bg-[#3B82F6]/5 rounded-full blur-[180px]" />
                <div className="absolute inset-0 matrix-grid opacity-20" />
            </div>

            {/* ──── TOPBAR ──── */}
            <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 bg-[#070B14]/80 backdrop-blur-xl sticky top-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin')}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                    >
                        ✕
                    </button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white">Analytics</h1>
                        <p className="text-xs text-white/40 font-medium">Manage your Efour Food Court operations.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white hover:border-[#FF7A18]/40 hover:bg-[#FF7A18]/5 transition-all"
                    >
                        <Home size={15} /> Home Page
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            </header>

            {/* ──── PAGE BODY ──── */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">

                {/* ────────────────── DAILY SALES ────────────────── */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Calendar size={20} className="text-[#FF7A18]" />
                                <h2 className="text-xl font-black text-white">Daily Sales</h2>
                            </div>
                            <p className="text-xs text-white/40 font-medium mt-0.5">Today's performance &amp; 14-day history</p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm font-semibold text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
                        >
                            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
                        {/* Today's Revenue card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl p-7 text-white relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #0d7a5f 0%, #0a6350 100%)' }}
                        >
                            <div className="absolute inset-0 pointer-events-none" style={{
                                backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)'
                            }} />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-200/70 mb-2">Today's Revenue</p>
                            <div className="flex items-end gap-1 mb-4">
                                <span className="text-4xl font-black">₹{fmt(data.today.revenue)}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-semibold">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-4 h-4 rounded flex items-center justify-center bg-emerald-400 text-white text-[8px]">✓</span>
                                    {data.today.paid} paid
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-4 h-4 rounded inline-block" style={{ background: '#e55' }} />
                                    {data.today.totalOrders} total orders
                                </span>
                            </div>
                            <p className="mt-4 text-xs text-emerald-200/60 font-medium">{data.today.date}</p>
                        </motion.div>

                        {/* 14-day chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/30 mb-4">Last 14 Days</p>
                            <div className="flex items-end gap-0.5 h-[100px]">
                                {data.chart14Days.map((d, i) => (
                                    <ChartBar
                                        key={i}
                                        val={d.val}
                                        max={chartMax}
                                        label={d.label}
                                        isToday={d.label === 'Today'}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ────────────────── TODAY'S ORDERS ────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                        <h3 className="font-black text-lg text-white">Today's Orders</h3>
                        <span className="text-sm text-white/40 font-medium">{data.todayOrders.length} orders</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-white/5">
                                    {['Order ID', 'Time', 'Items', 'Amount', 'Status'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.todayOrders.map((o, i) => (
                                    <motion.tr
                                        key={o.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 + i * 0.05 }}
                                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-sm font-bold text-white/70">#{o.id}</td>
                                        <td className="px-6 py-4 text-sm text-white/60 font-medium">{o.time}</td>
                                        <td className="px-6 py-4 text-sm text-white/80 font-medium">{o.items}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${o.amount === 0 ? 'text-emerald-400' : 'text-[#FF7A18]'}`}>
                                                ₹{o.amount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={o.status} />
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.section>

                {/* ────────────────── STATS ROW ────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Gamepad2, color: '#FF7A18', bg: 'rgba(255,122,24,0.1)', label: 'Total Rides', val: data.stats.totalRides },
                        { icon: Power, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', label: 'Rides Active', val: `${data.stats.ridesActive}/${data.stats.totalRides}` },
                        { icon: Utensils, color: '#5B8CFF', bg: 'rgba(91,140,255,0.1)', label: 'Dine Items', val: data.stats.dineItems },
                        { icon: IndianRupee, color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', label: 'E3 Revenue', val: `₹${fmt(data.stats.e3Revenue)}` },
                    ].map(({ icon: Icon, color, bg, label, val }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            className="rounded-2xl p-5 flex items-center gap-4"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                                <Icon size={22} style={{ color }} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{label}</p>
                                <p className="text-2xl font-black text-white mt-0.5">{val}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ────────────────── PLATFORM USAGE + RIDE STATUS ────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

                    {/* E3 Platform Usage */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="rounded-2xl p-6"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-base text-white">E3 Platform Usage</h3>
                            <span className="text-[10px] font-semibold text-white/30">via /analytics/e3/stats</span>
                        </div>

                        {/* Three metrics */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[
                                { icon: Monitor, color: '#5B8CFF', val: data.platform.web, label: 'WEB' },
                                { icon: Smartphone, color: '#A855F7', val: data.platform.mobile, label: 'MOBILE' },
                                { icon: Tablet, color: '#22C55E', val: data.platform.total, label: 'TOTAL' },
                            ].map(({ icon: Icon, color, val, label }) => (
                                <div key={label} className="flex flex-col items-center gap-2 py-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                                        <Icon size={20} style={{ color }} />
                                    </div>
                                    <span className="text-2xl font-black text-white">{val}</span>
                                    <span className="text-[9px] font-black tracking-[0.35em] text-white/30 uppercase">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2">
                            <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${data.platform.webPct}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full rounded-l-full"
                                    style={{ background: '#5B8CFF' }}
                                />
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${data.platform.mobilePct}%` }}
                                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                                    className="h-full rounded-r-full"
                                    style={{ background: '#A855F7' }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-semibold">
                                <span className="flex items-center gap-1.5 text-[#5B8CFF]">
                                    <span className="w-2 h-2 rounded-full bg-[#5B8CFF]" />
                                    Web: {data.platform.webPct}%
                                </span>
                                <span className="flex items-center gap-1.5 text-[#A855F7]">
                                    <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                                    Mobile: {data.platform.mobilePct}%
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Ride Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl p-6"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <h3 className="font-black text-base text-white mb-6">Ride Status</h3>

                        <div className="space-y-4">
                            {/* Online */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
                                        <span className="text-sm font-semibold text-white">
                                            Online ({data.rideStatus.online})
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-white/60">
                                        {data.rideStatus.total > 0 ? Math.round((data.rideStatus.online / data.rideStatus.total) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${data.rideStatus.total > 0 ? (data.rideStatus.online / data.rideStatus.total) * 100 : 0}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full rounded-full bg-emerald-400"
                                    />
                                </div>
                            </div>

                            {/* Offline */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                                        <span className="text-sm font-semibold text-white">
                                            Offline ({data.rideStatus.offline})
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-white/60">
                                        {data.rideStatus.total > 0 ? Math.round((data.rideStatus.offline / data.rideStatus.total) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${data.rideStatus.total > 0 ? (data.rideStatus.offline / data.rideStatus.total) * 100 : 0}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full rounded-full bg-red-500"
                                    />
                                </div>
                            </div>

                            <p className="text-center text-[10px] text-white/20 font-medium pt-2">
                                {data.rideStatus.total} E3 rides total
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* ────────────────── RIDE & EVENT BOOKINGS ────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                    {/* Table header row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <h3 className="font-black text-lg text-white">Ride &amp; Event Bookings</h3>

                            {/* Tab filter */}
                            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'rides', label: 'Rides' },
                                    { id: 'events', label: 'Events' },
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setBookingTab(t.id)}
                                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${bookingTab === t.id
                                            ? 'bg-[#0d7a5f] text-white shadow'
                                            : 'text-white/40 hover:text-white/70'
                                            }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30">Total Revenue</p>
                                <p className="text-xl font-black text-[#FF7A18]">₹{fmt(totalBookingsRevenue)}</p>
                            </div>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                                style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)' }}
                            >
                                <Download size={14} />
                                Export Data
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-white/5">
                                    {['Order ID', 'Date', 'Items', 'Amount', 'Status'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.3em] text-white/25">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <AnimatePresence>
                                <tbody>
                                    {visibleBookings.map((b, i) => (
                                        <motion.tr
                                            key={b.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="border-b border-white/5 hover:bg-white/3 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-mono text-sm font-bold text-white/60">#{b.id}</td>
                                            <td className="px-6 py-4 text-sm text-white/50 font-medium">{b.date}</td>
                                            <td className="px-6 py-4 text-sm text-white/80 font-medium">{b.items}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-bold ${b.amount === 0 ? 'text-emerald-400' : 'text-[#FF7A18]'}`}>
                                                    ₹{b.amount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge status={b.status} />
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {visibleBookings.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <p className="text-white/20 font-medium">No bookings found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </AnimatePresence>
                        </table>
                    </div>
                </motion.section>

            </main>
        </div>
    );
};

export default Analytics;

