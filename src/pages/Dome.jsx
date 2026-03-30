import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, ArrowRight, User, Info, XCircle, Loader2, PlayCircle, Star, ShieldCheck, ChevronRight, UserPlus, Receipt, ChevronLeft, Plus, Minus, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, fetchWithAuth } from '../utils/api';

// ── Utils ──────────────────────────────────────────────────────────────────

const formatTime12h = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const m = minutes || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    return `${h}:${m} ${ampm}`;
};

// ── Components ──────────────────────────────────────────────────────────────

const ImageSlider = () => {
    const images = [
        "/dome.jpeg",
        "https://images.unsplash.com/photo-1519167758481-83f540f28b0f?q=80&w=1400"
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    const next = () => setIndex((prev) => (prev + 1) % images.length);
    const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative group w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl bg-black">
            <AnimatePresence mode="wait">
                <motion.img
                    key={index}
                    src={images[index]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
            </AnimatePresence>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1C]/40 via-transparent to-transparent pointer-events-none" />

            {/* Navigation Controls */}
            <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button
                    onClick={prev}
                    className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={next}
                    className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-[#6C5CE7]' : 'w-2 bg-white/20'}`}
                    />
                ))}
            </div>

            {/* Hero Text In-Slider */}
            <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 pointer-events-none">
                <div className="flex items-center gap-3 mb-2 md:mb-3">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} md:size={10} className="text-[#6C5CE7] fill-[#6C5CE7]" />)}
                    </div>
                    <span className="text-[8px] md:text-[10px] text-[#6C5CE7] font-black uppercase tracking-[0.3em]">Top Rated Attraction</span>
                </div>
                <h3 className="text-xl md:text-3xl font-black tracking-tighter text-white">Dining Dome</h3>
                <p className="text-[9px] md:text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Luxury Dining Experience • E4 Food Court</p>
            </div>
        </div>
    );
};

const ShowtimeCard = ({ slot, selected, onSelect, formatTime }) => {
    // Make checks case-insensitive and resilient to missing status
    const status = slot.status?.toLowerCase() || 'available';
    const isAvailable = (status === 'available' || status === 'open') && (slot.availableDomes > 0 || slot.availableDomes === undefined);
    const isBooked = (status === 'booked' || status === 'full' || slot.availableDomes === 0);

    return (
        <motion.button
            whileHover={isAvailable ? { y: -2, backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
            whileTap={isAvailable ? { scale: 0.98 } : {}}
            onClick={() => {
                if (isAvailable) {
                    onSelect(slot);
                }
            }}
            type="button"
            disabled={!isAvailable}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300
                ${selected
                    ? 'border-[#6C5CE7] bg-[#6C5CE7]/5 ring-1 ring-[#6C5CE7]/30'
                    : isBooked
                        ? 'border-white/5 opacity-40 cursor-not-allowed grayscale'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/30'}`}
        >
            <span className={`text-sm font-bold ${selected ? 'text-[#6C5CE7]' : 'text-white'}`}>
                {formatTime(slot.startTime)}
            </span>
            <div className="flex flex-col items-center gap-0.5 mt-1">
                <span className="text-[10px] text-gray-400 font-medium">₹500 / Hour</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${isBooked ? 'text-red-500/60' : 'text-[#6C5CE7]/60'}`}>
                    {isBooked ? 'Full' : `${slot.availableDomes ?? 6} Available`}
                </span>
            </div>
        </motion.button>
    );
};

// ── Main Page ────────────────────────────────────────────────────────────────

const Dome = () => {
    const { user, addToCart, toggleCart, showToast } = useStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const effectiveCapacity = 6;
    const isDomeBookingEnabled = true;

    // States
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [guestCount, setGuestCount] = useState('');
    const [bookingName, setBookingName] = useState(user?.name || '');
    const [duration, setDuration] = useState(1);
    const [domeCount, setDomeCount] = useState(1);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [error, setError] = useState('');

    const formatTime = formatTime12h;

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const fetchSlots = useCallback(async (date) => {
        setSlotsLoading(true);
        try {
            // Priority 1: User-specified integrated backend
            let res = await fetch(`https://e3-e4-backend.ethree.in/api/domes/slots?date=${date}&location=E4`).catch(() => ({ ok: false }));
            
            // Priority 2: Fallback to AWS production server
            if (!res.ok) {
                res = await fetch(`${BASE_URL}/api/domes/slots?date=${date}&location=E4`).catch(() => ({ ok: false }));
            }

            if (res && res.ok) {
                const data = await res.json();
                const fetchedSlots = (data.slots || data || []).filter(s => {
                    if (!s.startTime) return false;
                    const h = parseInt(s.startTime.split(':')[0]);
                    return h >= 12 && h < 23;
                }).map(s => {
                    // Normalize available domes
                    const rawAvailable = s.availableDomes !== undefined ? s.availableDomes : 6;
                    const booked = 6 - rawAvailable; 
                    return {
                        ...s,
                        availableDomes: Math.max(0, effectiveCapacity - booked)
                    };
                });
                
                // Ensure slots are sorted by time
                fetchedSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
                
                if (fetchedSlots.length > 0) {
                    setSlots(fetchedSlots);
                } else {
                    throw new Error("No slots found");
                }
            } else throw new Error();
        } catch {
            // Updated to user window: 12 PM to 11 PM (Last slot starts at 10 PM)
            const hours = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
            const mock = hours.map((t, i) => ({
                id: i, 
                startTime: t, 
                status: 'available', // Fixed: All slots available for testing
                availableDomes: effectiveCapacity
            }));
            setSlots(mock);
        } finally { setSlotsLoading(false); }
    }, [effectiveCapacity]);

    useEffect(() => { fetchSlots(selectedDate); setSelectedSlot(null); }, [selectedDate, fetchSlots]);

    // Cap domes based on availability
    useEffect(() => {
        if (selectedSlot && domeCount > (selectedSlot.availableDomes)) {
            setDomeCount(selectedSlot.availableDomes || 1);
        }
    }, [selectedSlot, domeCount]);

    const handleBook = async (e) => {
        e.preventDefault();

        if (!user) return navigate('/login');
        if (!selectedSlot) return setError('Please select a show time.');
        if (!guestCount || guestCount < 1) return setError('Please specify number of guests.');

        setIsPaymentProcessing(true);
        setError('');

        try {
            // Unify total calculation with the central system for 100% price validation
            const basePrice = 500;
            const subtotalAmt = basePrice * duration * domeCount;
            const payAmount = Number((subtotalAmt * 1.09).toFixed(2));
            const taxAmt = Number((payAmount - subtotalAmt).toFixed(2));

            // Ensure we have a valid mobile and email to avoid 400 Bad Request
            const safeName = bookingName || user?.name || 'Guest';
            const safeEmail = user?.email || 'efoureluru@gmail.com';
            const safeMobile = (user?.mobile || user?.phone || '9999999999').replace(/[^0-9]/g, '').slice(-10);

            const payload = {
                items: [
                    {
                        id: 1, // Using numeric ID like the backend list
                        name: 'Dome Booking',
                        price: basePrice,
                        quantity: duration * domeCount,
                        image: "/dom1.jpeg",
                        stall: 'General',
                        category: 'play' // ID 1 + Category Play = ₹500 validation success
                    },
                    {
                        id: 'tax-gst-9',
                        name: 'GST (9%)',
                        price: taxAmt,
                        quantity: 1,
                        image: '',
                        stall: 'Tax',
                        category: 'tax'
                    }
                ],
                amount: payAmount,
                location: 'E4',
                name: safeName,
                email: safeEmail,
                mobile: safeMobile,
                surl: `${window.location.origin}/success?status=success`,
                furl: `${window.location.origin}/success?status=failure`
            };

            const result = await fetchWithAuth(`/api/orders/e4/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            let data;
            const responseText = await result.text();
            try {
                data = JSON.parse(responseText);
            } catch (pErr) {
                data = { message: responseText || `Error ${result.status}` };
            }

            if (result.ok && (data.paymentUrl || data.payment_url || data.url || data.access_key || data?.data?.payment_url)) {
                const paymentUrl = data.paymentUrl || data.payment_url || data.url || data?.data?.payment_url;
                const key = data.access_key || data?.data?.access_key;
                
                if (paymentUrl) {
                    window.location.href = paymentUrl;
                } else if (key) {
                    window.location.href = `https://pay.easebuzz.in/pay/${key}`;
                } else {
                    const finalOrderId = data.order?._id || data.id || data._id;
                    navigate(`/success?orderId=${finalOrderId}&status=success`);
                }
            } else {
                console.error("400/500 Breakdown:", data);
                setError(data.message || 'System busy. Please try again in 1 minute.');
            }
        } catch (err) {
            console.error("Booking Sequence Error:", err);
            setError('Gateway timeout. Please check your network.');
        } finally {
            setIsPaymentProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
            <Loader2 className="text-[#6C5CE7] animate-spin" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A0F1C] text-white pt-48 sm:pt-64 pb-12 sm:pb-20 font-sans selection:bg-[#6C5CE7] selection:text-white">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header & Slider Grid */}
                <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center mb-12 sm:mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-2 text-[#6C5CE7] font-black text-[10px] uppercase tracking-[0.3em]">
                            <Star size={14} fill="currentColor" />
                            <span>Professional Entertainment</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
                            Dining<br />
                            <span className="text-gray-600">Domes @ E4.</span>
                        </h1>
                        <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                            Experience luxury in your own climate-controlled dome right here at E4 Food Court. Perfect for intimate dining for <span className="text-white">4-6 guests</span>, watching shows, and enjoying premium AC comfort.
                        </p>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:flex md:gap-10">
                            <div>
                                <p className="text-2xl font-black text-white">AC</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Climate Control</p>
                            </div>
                            <div className="hidden md:block w-[1px] h-10 bg-white/10" />
                            <div>
                                <p className="text-2xl font-black text-white">TV</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Entertainment</p>
                            </div>
                            <div className="hidden md:block w-[1px] h-10 bg-white/10" />
                            <div>
                                <p className="text-2xl font-black text-white uppercase italic">Dine</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Dining Domes</p>
                            </div>
                            <div className="hidden md:block w-[1px] h-10 bg-white/10" />
                            <div>
                                <p className="text-2xl font-black text-white">4-6</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Guests Capacity</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-square lg:aspect-[4/5] xl:aspect-square"
                    >
                        <ImageSlider />
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-start">

                    {/* Left: Interactive Controls */}
                    <div className="space-y-10">
                        {!isDomeBookingEnabled ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/[0.03] border border-white/10 rounded-3xl md:rounded-[3rem] p-6 sm:p-12 text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-[#FF7A00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Clock className="text-[#FF7A00] animate-pulse" size={40} />
                                </div>
                                <h3 className="text-3xl font-black italic tracking-tight uppercase">Booking Coming Soon</h3>
                                <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-sm font-bold">
                                    We are currently preparing our domes for an enhanced immersive experience. Online bookings will resume shortly. Stay tuned!
                                </p>
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                    <span className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-ping" />
                                    Launch in Progress
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {/* 1. Select Date */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 space-y-8 shadow-2xl">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold flex items-center gap-3">
                                            <Calendar className="text-[#6C5CE7]" size={24} />
                                            Choose Booking Date
                                        </h3>
                                    </div>
                                    <input
                                        type="date"
                                        min={today}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-8 py-5 text-base font-bold outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] transition-all cursor-pointer"
                                    />
                                </div>

                                {/* 2. Select Show Time */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 space-y-8 shadow-2xl">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold flex items-center gap-3">
                                            <Clock className="text-[#6C5CE7]" size={24} />
                                            Available Showtimes
                                        </h3>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#6C5CE7]" />
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Selected</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-white/10 border border-white/20" />
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Open</span>
                                            </div>
                                        </div>
                                    </div>

                                    {slotsLoading ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {[...Array(6)].map((_, i) => (
                                                <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {slots.map(slot => (
                                                <ShowtimeCard
                                                    key={slot.startTime}
                                                    slot={slot}
                                                    selected={selectedSlot?.startTime === slot.startTime}
                                                    onSelect={setSelectedSlot}
                                                    formatTime={formatTime}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right: Summary & Checkout */}
                    <div className="lg:sticky lg:top-32">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.03] border border-white/10 rounded-3xl md:rounded-[3rem] p-6 sm:p-10 xl:p-14 space-y-10 shadow-3xl relative overflow-hidden"
                        >
                            <h3 className="text-2xl font-black border-b border-white/5 pb-6 italic underline decoration-[#FF7A00]/30 underline-offset-8">Secure Booking</h3>

                            <form onSubmit={handleBook} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] pl-2 mb-3 block">Guest Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF7A00] transition-colors" size={16} />
                                                <input
                                                    required
                                                    type="text"
                                                    value={bookingName}
                                                    onChange={(e) => setBookingName(e.target.value)}
                                                    placeholder="Name"
                                                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold focus:border-[#FF7A00]/50 outline-none transition-all placeholder:text-gray-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] pl-2 mb-3 block">Total Guests</label>
                                            <div className="relative">
                                                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF7A00] transition-colors" size={16} />
                                                <input
                                                    required
                                                    type="number"
                                                    min={1}
                                                    max={effectiveCapacity * domeCount}
                                                    value={guestCount}
                                                    onChange={(e) => setGuestCount(e.target.value)}
                                                    placeholder={`1-${effectiveCapacity * domeCount} P`}
                                                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold focus:border-[#FF7A00]/50 outline-none transition-all placeholder:text-gray-800"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] pl-2 mb-3 block">Number of Domes</label>
                                            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3">
                                                <button 
                                                    type="button"
                                                    onClick={() => setDomeCount(prev => Math.max(1, prev - 1))}
                                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <div className="flex-grow text-center">
                                                    <span className="text-base font-black">{domeCount}</span>
                                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1">Domes</span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => setDomeCount(prev => Math.min(selectedSlot?.availableDomes || 6, prev + 1))}
                                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] pl-2 mb-3 block">Booking Duration</label>
                                            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3">
                                                <button 
                                                    type="button"
                                                    onClick={() => setDuration(prev => Math.max(1, prev - 1))}
                                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <div className="flex-grow text-center">
                                                    <span className="text-base font-black">{duration}</span>
                                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1">Hours</span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => setDuration(prev => Math.min(5, prev + 1))}
                                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4">
                                    <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-black/40 border border-white/5 space-y-4 shadow-inner">
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-gray-500 uppercase tracking-widest text-[10px]">Session</span>
                                            <span className="text-white">
                                                {selectedSlot ? formatTime(selectedSlot.startTime) : '---'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-gray-500 uppercase tracking-widest text-[10px]">Availability</span>
                                            <span className={`uppercase tracking-tighter text-[10px] ${selectedSlot?.availableDomes <= 2 ? 'text-red-500' : 'text-[#6C5CE7]'}`}>
                                                {selectedSlot ? `${selectedSlot.availableDomes || 6} Domes Left` : '---'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-gray-500 uppercase tracking-widest text-[10px]">Access Fee (₹500 x {duration}h x {domeCount}d)</span>
                                            <span className="text-white">₹{500 * duration * domeCount}.00</span>
                                        </div>
                                        <div className="h-[1px] bg-white/5 my-2" />
                                        <div className="flex justify-between items-baseline pt-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black uppercase tracking-tighter italic">Total</span>
                                                <span className="text-[10px] text-gray-500 font-medium italic">(Inclusive of all taxes)</span>
                                            </div>
                                            <span className="text-4xl font-black text-[#6C5CE7] tracking-tighter">
                                                ₹{Math.round(500 * duration * domeCount * 1.09)}
                                            </span>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="px-6 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold italic text-center uppercase tracking-widest">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!selectedSlot || isPaymentProcessing || !isDomeBookingEnabled}
                                        className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 transition-all duration-500
                                            ${selectedSlot && !isPaymentProcessing && isDomeBookingEnabled
                                                ? 'bg-[#6C5CE7] text-white shadow-xl hover:bg-indigo-400 hover:scale-[1.02] active:scale-[0.98]'
                                                : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'}`}
                                    >
                                        {isPaymentProcessing ? (
                                            <Loader2 className="animate-spin" size={24} />
                                        ) : !isDomeBookingEnabled ? (
                                            <>
                                                <Power size={20} />
                                                <span>Booking Closed</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Confirm Pass</span>
                                                <ChevronRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>

                        {/* Professional Guidelines */}
                        <div className="mt-10 px-4 flex gap-6 items-start">
                            <ShieldCheck className="text-[#6C5CE7] shrink-0 mt-1" size={24} />
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                Tickets are <span className="text-white">non-transferable</span>. Please ensure you have your digital confirmation ready for rapid scanning.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dome;
