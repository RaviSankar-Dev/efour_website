import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, ArrowRight, User, Info, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from '../components/common/OptimizedImage';

const Dome = () => {
    const { addToCart, toggleCart, showToast } = useStore();
    const navigate = useNavigate();

    const domeData = {
        id: 'glass-dome',
        name: 'GLASS DOME',
        capacity: '4-6',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80'
    };

    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    const [selectedSlotHour, setSelectedSlotHour] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [expectedGuests, setExpectedGuests] = useState('');
    const [booked, setBooked] = useState(false);

    const hourlyPrice = 500;

    // Generate slots from 12 PM to 11 PM
    const slots = [
        { hour: 12, label: '12:00 PM', status: 'available' },
        { hour: 13, label: '01:00 PM', status: 'available' },
        { hour: 14, label: '02:00 PM', status: 'available' },
        { hour: 15, label: '03:00 PM', status: 'available' },
        { hour: 16, label: '04:00 PM', status: 'available' },
        { hour: 17, label: '05:00 PM', status: 'available' },
        { hour: 18, label: '06:00 PM', status: 'available' },
        { hour: 19, label: '07:00 PM', status: 'available' },
        { hour: 20, label: '08:00 PM', status: 'available' },
        { hour: 21, label: '09:00 PM', status: 'available' },
        { hour: 22, label: '10:00 PM', status: 'available' },
        { hour: 23, label: '11:00 PM', status: 'available' },
    ];

    const handleBook = (e) => {
        e.preventDefault();
        const slot = slots.find(s => s.hour.toString() === selectedSlotHour.toString());

        if (!slot) return;

        addToCart({
            id: `dome-booking-${selectedDate}-${slot.hour}`,
            name: `Glass Dome Booking (${slot.label})`,
            price: hourlyPrice,
            image: domeData.image,
            stall: 'Dome Booking',
            details: {
                date: selectedDate,
                time: slot.label,
                hour: slot.hour,
                customerName,
                expectedGuests,
                domeName: domeData.name
            }
        });

        setBooked(true);
        showToast("Dome booking added to cart!");

        setTimeout(() => {
            setBooked(false);
            setCustomerName('');
            setExpectedGuests('');
            setSelectedSlotHour('');
            toggleCart();
        }, 1500);
    };



    return (
        <div className="bg-[#02040a] min-h-screen pt-16 md:pt-24 pb-20 selection:bg-[#FF7A00]/30 overflow-hidden relative">
            {/* Cinematic Background Architecture */}
            <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-[#FF7A00]/5 blur-[160px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-[#6C5CE7]/5 blur-[140px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />
            <div className="absolute inset-0 noise-overlay opacity-[0.02]" />

            <div className="container mx-auto px-6 relative z-10">
                {/* --- Header Section --- */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-16 border-b border-white/5 pb-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2 }}
                        >
                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-[#FF7A00] font-black uppercase tracking-[0.6em] text-xs ">PRIVATE CABANAS</span>
                                <div className="w-12 h-[1px] bg-white/10" />
                            </div>
                            <h1 className="text-4xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] transform mb-10 uppercase">
                                THE <br />
                                <span className="text-gradient-primary">DOMES.</span>
                            </h1>
                            <p className="text-[#94A3B8] text-xl font-bold opacity-40 max-w-lg border-l border-[#FF7A00]/30 pl-10">
                                Experience ultimate privacy and premium dining in our climate-controlled glass domes.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* --- LEFT PANEL: VENUE & CALENDAR --- */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Dome Hero Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2 }}
                            className="glass-card p-10 md:p-12 rounded-[5rem] overflow-hidden group"
                        >


                            <div className="w-full h-[500px] rounded-[3.5rem] overflow-hidden mb-12 relative shadow-inner">
                                <OptimizedImage
                                    src={domeData.image}
                                    alt={domeData.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out brightness-75 group-hover:brightness-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent opacity-80" />
                            </div>

                            <div className="flex items-center justify-between mb-10 px-4">
                                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none transform group-hover:text-[#6C5CE7] transition-colors duration-1000">
                                    {domeData.name}
                                </h2>
                                <div className="w-24 h-[1px] bg-white/10" />
                            </div>

                            <div className="flex flex-wrap gap-6 mb-12 px-4">
                                <div className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-3xl text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 shadow-inner">
                                    <User size={18} className="text-[#FF7A00]" /> {domeData.capacity} GUESTS
                                </div>
                                <div className="flex items-center gap-4 bg-[#FF7A00]/10 text-[#FF7A00] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-[#FF7A00]/20">
                                    <ShieldCheck size={18} /> CLIMATE CONTROLLED
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] flex gap-8 text-slate-500 text-sm font-bold backdrop-blur-3xl relative overflow-hidden group/policy">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF7A00] opacity-20 group-hover/policy:opacity-100 transition-opacity" />
                                <Info size={24} className="flex-shrink-0 mt-1 text-[#FF7A00]" />
                                <p className="opacity-40 group-hover:opacity-100 transition-opacity duration-1000 leading-relaxed">
                                    <strong className="text-white font-black uppercase tracking-widest mr-4">DOME RULES:</strong>
                                    Mandatory ₹500/hour charge in addition to food orders. Max capacity 6 guests.
                                </p>
                            </div>
                        </motion.div>

                        {/* Date Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.2 }}
                            className="glass-card p-12 md:p-16 rounded-[4rem] border border-white/10 shadow-3xl"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
                                <h3 className="text-4xl font-black text-white uppercase tracking-tighter transform ">SELECT TIME</h3>
                                <div className="relative group/input">
                                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FF7A00] group-hover/input:scale-110 transition-transform" size={20} />
                                    <input
                                        type="date"
                                        className="pl-16 pr-10 py-6 bg-white/[0.03] border border-white/10 rounded-2xl font-black uppercase tracking-widest text-white text-xs outline-none focus:border-[#FF7A00]/50 shadow-inner w-full lg:w-auto transition-all appearance-none"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setSelectedSlotHour('');
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {slots.map(slot => {
                                    const isSelected = selectedSlotHour === slot.hour;
                                    const isAvailable = true; // For now, handle availability via state if needed

                                    let cardClass = "relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all duration-700 group/btn transform ";

                                    if (isSelected) {
                                        cardClass += "bg-[#6C5CE7] border-[#6C5CE7] text-white shadow-3xl scale-105 z-10 -translate-y-2";
                                    } else {
                                        cardClass += "bg-white/[0.03] border-white/5 text-slate-400 hover:border-[#FF7A00]/30 hover:bg-white/[0.06] shadow-2xl cursor-pointer hover:-translate-y-2";
                                    }

                                    return (
                                        <motion.button
                                            key={slot.hour}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedSlotHour(slot.hour)}
                                            className={cardClass}
                                        >
                                            <span className="font-black text-2xl uppercase tracking-tighter mb-2 leading-none">{slot.label}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isSelected ? 'text-white' : 'text-[#FF7A00]'}`}>
                                                ₹{hourlyPrice} / HR
                                            </span>

                                            {isAvailable && (
                                                <div className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#FF7A00]'} animate-pulse shadow-[0_0_10px_currentColor]`} />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* --- RIGHT PANEL: BOOKING ENGINE --- */}
                    <div className="lg:col-span-5 sticky top-32">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, delay: 0.4 }}
                            className="bg-white/[0.02] backdrop-blur-3xl p-12 md:p-16 rounded-[5rem] shadow-4xl relative overflow-hidden border border-white/5 group"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF7A00]/5 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none group-hover:bg-[#FF7A00]/10 transition-colors duration-1000" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center text-[#FF7A00] border border-white/5 shadow-inner">
                                        <Zap size={24} />
                                    </div>
                                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase transform leading-none">BOOK DOME.</h2>
                                </div>

                                <form onSubmit={handleBook} className="space-y-12">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={selectedSlotHour || 'none'}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`w-full border rounded-[3rem] p-10 text-center transition-all duration-1000 backdrop-blur-3xl shadow-3xl ${selectedSlotHour ? 'bg-[#6C5CE7]/5 border-[#6C5CE7]/30' : 'bg-white/[0.02] border-white/5'}`}
                                        >
                                            {selectedSlotHour ? (
                                                <div className="flex flex-col gap-4 items-center">
                                                    <span className="text-2xl font-black text-[#6C5CE7] uppercase tracking-tighter leading-none">
                                                        {new Date(selectedDate).toLocaleDateString('en-GB')}<br />
                                                        <span className="text-4xl text-white mt-2 block">{slots.find(s => s.hour === selectedSlotHour)?.label}</span>
                                                    </span>
                                                    <div className="h-[1px] w-12 bg-white/10" />
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] leading-none">DOME ALLOTMENT PENDING</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-6 py-4">
                                                    <div className="w-1 px-8 rounded-full bg-white/5 animate-pulse" />
                                                    <span className="text-xs text-slate-700 font-black uppercase tracking-widest leading-relaxed max-w-[200px]">
                                                        PLEASE PICK A DATE AND TIME ABOVE.
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    <div className="space-y-10">
                                        <div className="group/field">
                                            <label className="text-xs uppercase tracking-[0.5em] font-black text-slate-600 mb-5 block group-focus-within/field:text-[#FF7A00] transition-colors">YOUR NAME</label>
                                            <div className="relative">
                                                <User className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within/field:text-[#FF7A00] transition-colors" size={24} />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="FULL NAME"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-20 pr-10 py-7 text-white placeholder-slate-900 text-xs font-black uppercase tracking-widest outline-none focus:border-[#FF7A00]/40 transition-all shadow-inner"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="group/field">
                                            <label className="text-xs uppercase tracking-[0.5em] font-black text-slate-600 mb-5 block group-focus-within/field:text-[#FF7A00] transition-colors">GUEST COUNT</label>
                                            <div className="relative">
                                                <Zap className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within/field:text-[#FF7A00] transition-colors" size={24} />
                                                <input
                                                    type="number"
                                                    required
                                                    placeholder="GUESTS"
                                                    min="1"
                                                    max="6"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-20 pr-10 py-7 text-white placeholder-slate-900 text-xs font-black uppercase tracking-widest outline-none focus:border-[#FF7A00]/40 transition-all shadow-inner"
                                                    value={expectedGuests}
                                                    onChange={(e) => setExpectedGuests(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Valuation Engine */}
                                    <div className="flex justify-between items-end py-12 border-t border-white/5 mt-12">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 mb-2">CHARGE</span>
                                            <span className="text-slate-900 font-black text-xs uppercase ">PER HOUR</span>
                                        </div>
                                        {selectedSlotHour ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none group-hover:text-[#6C5CE7] transition-colors duration-700">
                                                    ₹{hourlyPrice.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-5xl font-black text-slate-900 tracking-tighter opacity-20">&mdash;</span>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!selectedSlotHour || booked}
                                        className={`w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-xs flex items-center justify-center gap-6 transition-all duration-1000 shadow-3xl transform active:scale-95 ${selectedSlotHour
                                            ? 'btn-premium hover:-translate-y-3'
                                            : 'bg-white/[0.02] text-slate-800 cursor-not-allowed border border-white/5'
                                            }`}
                                    >
                                        {booked ? (
                                            <span className="text-[#FBBF24] flex items-center gap-4 animate-pulse"><CheckCircle2 size={24} /> BOOKED!</span>
                                        ) : selectedSlotHour ? (
                                            <>ADD TO CART <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" /></>
                                        ) : (
                                            <>SELECTION REQUIRED</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dome;

