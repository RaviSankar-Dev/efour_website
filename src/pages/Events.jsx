import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, ArrowRight, User, Info, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from '../components/common/OptimizedImage';
import { BASE_URL } from '../utils/api';

const Events = () => {
    const { addToCart, toggleCart, showToast } = useStore();
    const navigate = useNavigate();
    const [eventsList, setEventsList] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlotHour, setSelectedSlotHour] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [expectedGuests, setExpectedGuests] = useState('');
    const [booked, setBooked] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/events?location=E4`);
                if (res.ok) {
                    const data = await res.json();
                    const eventsArr = (Array.isArray(data) ? data : []).filter(Boolean);
                    setEventsList(eventsArr);
                    if (eventsArr.length > 0 && !selectedRoom) {
                        setSelectedRoom(eventsArr[0].name);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch events", err);
            } finally {
                setLoadingEvents(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDate) {
                setSlots([]);
                return;
            }
            setLoadingSlots(true);
            try {
                const res = await fetch(`${BASE_URL}/api/bookings/slots?location=e4&date=${selectedDate}`);
                if (res.ok) {
                    const data = await res.json();
                    setSlots(data.slots || []);
                } else {
                    setSlots([]);
                }
            } catch (err) {
                console.error("Failed to fetch slots", err);
                setSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [selectedDate]);

    const handleBook = (e) => {
        e.preventDefault();
        const room = eventsList.find(r => r.name === selectedRoom);
        if (!room) return;
        const slot = slots.find(s => s.hour.toString() === selectedSlotHour.toString());

        const price = slot?.price || room.price;
        const timeLabel = slot ? slot.label : '';

        addToCart({
            id: `event-${room.id || room._id}-${slot?.hour || Date.now()}`,
            name: `${room.name} Booking${timeLabel ? ` (${timeLabel})` : ''}`,
            price: price,
            image: room.image,
            stall: 'Events',
            details: { date: selectedDate, time: timeLabel, hour: slot?.hour, customerName, expectedGuests }
        });

        setBooked(true);
        showToast("Booking added to cart!");

        setTimeout(() => {
            setBooked(false);
            setCustomerName('');
            setExpectedGuests('');
            setSelectedSlotHour('');
            toggleCart();
        }, 1500);
    };

    const room = eventsList.find(r => r.name === selectedRoom);
    const availableCount = slots.filter(s => s.status === 'available').length;
    const bookedCount = slots.filter(s => s.status === 'booked').length;

    return (
        <div className="bg-[#02040a] min-h-screen pt-48 pb-40 selection:bg-[#6C5CE7]/30 overflow-hidden relative">
            {/* Cinematic Background Architecture */}
            <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-[#6C5CE7]/5 blur-[160px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-[#FF7A00]/5 blur-[140px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />
            <div className="absolute inset-0 noise-overlay opacity-[0.02]" />

            <div className="container mx-auto px-6 relative z-10">
                {/* --- Header Section --- */}
                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-16 border-b border-white/5 pb-20">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2 }}
                        >
                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-[#6C5CE7] font-black uppercase tracking-[0.6em] text-xs ">SPECIAL EVENTS</span>
                                <div className="w-12 h-[1px] bg-white/10" />
                            </div>
                            <h1 className="text-4xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] transform mb-10 uppercase">
                                CELEBRATE <br />
                                <span className="text-gradient-primary">WITH US.</span>
                            </h1>
                            <p className="text-[#94A3B8] text-xl font-bold opacity-40 max-w-lg border-l border-[#6C5CE7]/30 pl-10">
                                Beautiful spaces for your parties. Private, premium, and perfect for your special day.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* --- LEFT PANEL: VENUE & CALENDAR --- */}
                    <div className="lg:col-span-7 space-y-16">
                        {loadingEvents ? (
                            <div className="p-32 text-center bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] border border-white/5 shadow-3xl">
                                <div className="w-16 h-16 border-[3px] border-[#6C5CE7]/20 border-t-[#6C5CE7] rounded-full animate-spin mx-auto mb-8" />
                                <p className="text-[#6C5CE7] font-black uppercase tracking-[0.6em] text-[10px] animate-pulse ">Loading...</p>
                            </div>
                        ) : !room ? (
                            <div className="p-32 text-center bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] border border-white/5 shadow-3xl">
                                <Info size={48} className="text-slate-800 mx-auto mb-8" />
                                <p className="text-white font-black uppercase tracking-widest opacity-20">NO ROOMS AVAILABLE RIGHT NOW</p>
                            </div>
                        ) : (
                            <>
                                {/* Venue Hero Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.2 }}
                                    className="glass-card p-10 md:p-12 rounded-[5rem] overflow-hidden group"
                                >
                                    <div className="absolute top-12 right-12 z-20">
                                        <div className="relative group/select">
                                            <select
                                                value={selectedRoom}
                                                onChange={(e) => { setSelectedRoom(e.target.value); setSelectedSlotHour(''); }}
                                                className="bg-[#050810] text-white border border-white/10 rounded-2xl px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] shadow-3xl focus:border-[#6C5CE7]/50 outline-none appearance-none cursor-pointer transition-all pr-16 transform "
                                            >
                                                {eventsList.map(r => <option key={r.id || r._id || r.name} value={r.name} className="bg-black">{r.name}</option>)}
                                            </select>
                                            <Zap size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#6C5CE7] pointer-events-none group-hover/select:scale-125 transition-transform" />
                                        </div>
                                    </div>

                                    <div className="w-full h-[500px] rounded-[3.5rem] overflow-hidden mb-12 relative shadow-inner">
                                        <OptimizedImage
                                            src={room.image || 'https://images.unsplash.com/photo-1519167758481-83f540f28b0f?q=80&w=1400'}
                                            alt={room.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out brightness-75 group-hover:brightness-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent opacity-80" />
                                    </div>

                                    <div className="flex items-center justify-between mb-10 px-4">
                                        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none transform group-hover:text-[#FF7A00] transition-colors duration-1000">
                                            {room.name}
                                        </h2>
                                        <div className="w-24 h-[1px] bg-white/10" />
                                    </div>

                                    <div className="flex flex-wrap gap-6 mb-12 px-4">
                                        <div className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-3xl text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 shadow-inner">
                                            <User size={18} className="text-[#6C5CE7]" /> {room.capacity || '20-50'} GUESTS
                                        </div>
                                        <div className="flex items-center gap-4 bg-[#6C5CE7]/10 text-[#6C5CE7] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-[#6C5CE7]/20">
                                            <ShieldCheck size={18} /> GREAT SERVICE
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] flex gap-8 text-slate-500 text-sm font-bold backdrop-blur-3xl relative overflow-hidden group/policy">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[#6C5CE7] opacity-20 group-hover/policy:opacity-100 transition-opacity" />
                                        <Info size={24} className="flex-shrink-0 mt-1 text-[#6C5CE7]" />
                                        <p className="opacity-40 group-hover:opacity-100 transition-opacity duration-1000 leading-relaxed">
                                            <strong className="text-white font-black uppercase tracking-widest mr-4">ROOM RULES:</strong>
                                            We provide the room. You can bring your own decorations and arrangements for your event.
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
                                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter transform ">PICK A TIME</h3>
                                        <div className="relative group/input">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6C5CE7] group-hover/input:scale-110 transition-transform" size={20} />
                                            <input
                                                type="date"
                                                className="pl-16 pr-10 py-6 bg-white/[0.03] border border-white/10 rounded-2xl font-black uppercase tracking-widest text-white text-xs outline-none focus:border-[#6C5CE7]/50 shadow-inner w-full lg:w-auto transition-all appearance-none"
                                                value={selectedDate}
                                                onChange={(e) => {
                                                    setSelectedDate(e.target.value);
                                                    setSelectedSlotHour('');
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 mb-16 border-b border-white/5 pb-12 ">
                                        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#6C5CE7]/20 border border-[#6C5CE7] shadow-[0_0_10px_#6C5CE7]" /> AVAILABLE</div>
                                        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-slate-800/30 border border-slate-700" /> RESERVED</div>
                                        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#FF7A00] shadow-[0_0_15px_#FF7A00]" /> SELECTED</div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                        {loadingSlots ? (
                                            <div className="col-span-full py-20 text-center">
                                                <div className="w-10 h-10 border-2 border-white/5 border-t-[#6C5CE7] rounded-full animate-spin mx-auto mb-6" />
                                                <p className="text-slate-800 font-black uppercase tracking-widest text-[9px] ">UPDATING TIMES</p>
                                            </div>
                                        ) : slots.length === 0 ? (
                                            <div className="col-span-full py-24 text-center bg-white/[0.02] rounded-[3rem] border border-white/5">
                                                <Calendar size={40} className="text-slate-900 mx-auto mb-6" />
                                                <p className="text-slate-800 font-black uppercase tracking-widest text-[10px] ">NO TIMES AVAILABLE FOR {selectedDate}</p>
                                            </div>
                                        ) : (
                                            slots.map(slot => {
                                                const isSelected = selectedSlotHour === slot.hour;
                                                const isAvailable = slot.status === 'available';
                                                
                                                let cardClass = "relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all duration-700 group/btn transform ";

                                                if (isSelected) {
                                                    cardClass += "bg-[#FF7A00] border-[#FF7A00] text-white shadow-3xl scale-105 z-10 -translate-y-2";
                                                } else if (isAvailable) {
                                                    cardClass += "bg-white/[0.03] border-white/5 text-slate-400 hover:border-[#6C5CE7]/30 hover:bg-white/[0.06] shadow-2xl cursor-pointer hover:-translate-y-2";
                                                } else {
                                                    cardClass += "bg-white/[0.01] border-white/5 text-slate-900 opacity-40 cursor-not-allowed";
                                                }

                                                return (
                                                    <motion.button
                                                        key={slot.hour}
                                                        whileTap={isAvailable ? { scale: 0.95 } : {}}
                                                        disabled={!isAvailable}
                                                        onClick={() => setSelectedSlotHour(slot.hour)}
                                                        className={cardClass}
                                                    >
                                                        <span className="font-black text-2xl uppercase tracking-tighter mb-2 leading-none">{slot.label}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isSelected ? 'text-white' : isAvailable ? 'text-[#6C5CE7]' : 'text-current'}`}>
                                                            {isAvailable ? `₹${(slot.price || room.price || 0).toLocaleString('en-IN')}` : 'RESERVED'}
                                                        </span>

                                                        {isAvailable && (
                                                            <div className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#6C5CE7]'} animate-pulse shadow-[0_0_10px_currentColor]`} />
                                                        )}
                                                    </motion.button>
                                                );
                                            })
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* --- RIGHT PANEL: BOOKING ENGINE --- */}
                    <div className="lg:col-span-5 sticky top-32">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, delay: 0.4 }}
                            className="bg-white/[0.02] backdrop-blur-3xl p-12 md:p-16 rounded-[5rem] shadow-4xl relative overflow-hidden border border-white/5 group"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#6C5CE7]/5 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none group-hover:bg-[#6C5CE7]/10 transition-colors duration-1000" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center text-[#6C5CE7] border border-white/5 shadow-inner">
                                        <Zap size={24} />
                                    </div>
                                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase transform leading-none">RESERVE.</h2>
                                </div>

                                <form onSubmit={handleBook} className="space-y-12">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={selectedSlotHour || 'none'}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`w-full border rounded-[3rem] p-10 text-center transition-all duration-1000 backdrop-blur-3xl shadow-3xl ${selectedSlotHour ? 'bg-[#FF7A00]/5 border-[#FF7A00]/30' : 'bg-white/[0.02] border-white/5'}`}
                                        >
                                            {selectedSlotHour ? (
                                                <div className="flex flex-col gap-4 items-center">
                                                    <span className="text-2xl font-black text-[#FF7A00] uppercase tracking-tighter leading-none">
                                                        {new Date(selectedDate).toLocaleDateString('en-GB')}<br />
                                                        <span className="text-4xl text-white mt-2 block">{slots.find(s => s.hour === selectedSlotHour)?.label}</span>
                                                    </span>
                                                    <div className="h-[1px] w-12 bg-white/10" />
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] leading-none">CHOSEN TIME</span>
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
                                            <label className="text-xs uppercase tracking-[0.5em] font-black text-slate-600 mb-5 block group-focus-within/field:text-[#6C5CE7] transition-colors">YOUR NAME</label>
                                            <div className="relative">
                                                <User className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within/field:text-[#6C5CE7] transition-colors" size={24} />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="FULL NAME"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-20 pr-10 py-7 text-white placeholder-slate-900 text-xs font-black uppercase tracking-widest outline-none focus:border-[#6C5CE7]/40 transition-all shadow-inner"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="group/field">
                                            <label className="text-xs uppercase tracking-[0.5em] font-black text-slate-600 mb-5 block group-focus-within/field:text-[#6C5CE7] transition-colors">GUEST COUNT</label>
                                            <div className="relative">
                                                <Zap className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within/field:text-[#6C5CE7] transition-colors" size={24} />
                                                <input
                                                    type="number"
                                                    required
                                                    placeholder="GUESTS"
                                                    min="1"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-20 pr-10 py-7 text-white placeholder-slate-900 text-xs font-black uppercase tracking-widest outline-none focus:border-[#6C5CE7]/40 transition-all shadow-inner"
                                                    value={expectedGuests}
                                                    onChange={(e) => setExpectedGuests(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Valuation Engine */}
                                    <div className="flex justify-between items-end py-12 border-t border-white/5 mt-12">
                                        <div className="flex flex-col">
                                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 mb-2">PRICE</span>
                                            <span className="text-slate-900 font-black text-xs uppercase ">TOTAL ORDER</span>
                                        </div>
                                        {selectedSlotHour ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none group-hover:text-[#FF7A00] transition-colors duration-700">
                                                    ₹{(slots.find(s => s.hour === selectedSlotHour)?.price || room?.price || 0).toLocaleString('en-IN')}
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
                                            <span className="text-[#FF7A00] flex items-center gap-4 animate-pulse"><CheckCircle2 size={24} /> BOOKED!</span>
                                        ) : selectedSlotHour ? (
                                            <>ADD TO CART <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" /></>
                                        ) : (
                                            <>SELECTION REQUIRED</>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-20 flex items-center justify-between border-t border-white/5 pt-16">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase text-slate-800 font-black tracking-[0.5em] mb-2 ">SUPPORT</span>
                                        <span className="text-xs font-black text-white/40 tracking-widest">+91 70369 23456</span>
                                    </div>
                                    <div className="w-[1px] h-12 bg-white/5" />
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] uppercase text-slate-800 font-black tracking-[0.5em] mb-2 ">EMAIL</span>
                                        <span className="text-xs font-black text-white/40 tracking-widest group-hover:text-[#6C5CE7] transition-colors">efoureluru@gmail.com</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Events;


