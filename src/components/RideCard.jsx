import React, { memo } from 'react';
import useStore from '../store/useStore';
import OptimizedImage from './common/OptimizedImage';
import { ShoppingBag, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const RideCard = ({ ride, priority = false }) => {
    const addToCart = useStore(state => state.addToCart);
    const openCart = useStore(state => state.openCart);
    const showToast = useStore(state => state.showToast);

    const handleAddToCart = (e) => {
        if (e) e.stopPropagation();
        const cartItem = {
            id: `play-${ride.id}`,
            name: ride.title,
            price: typeof ride.price === 'number' ? ride.price : (parseFloat(ride.price) || 0),
            image: ride.image,
            stall: ride.category || 'Ride',
            quantity: 1
        };
        addToCart(cartItem, 1);
        showToast(`${ride.title} added to cart!`);
    };

    const handleBookNow = (e) => {
        if (e) e.stopPropagation();
        const cartItem = {
            id: `play-${ride.id}`,
            name: ride.title,
            price: typeof ride.price === 'number' ? ride.price : (parseFloat(ride.price) || 0),
            image: ride.image,
            stall: ride.category || 'Ride',
            quantity: 1
        };
        addToCart(cartItem, 1);
        openCart();
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="glass-card rounded-[2rem] group w-full flex flex-col h-full overflow-hidden relative border border-white/5 hover:border-[#6C5CE7]/30"
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {/* Image Section */}
            <div className="w-full relative h-40 sm:h-44 overflow-hidden">
                <OptimizedImage
                    src={ride.image}
                    alt={ride.title}
                    priority={priority}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] brightness-90 group-hover:brightness-105"
                />

                {/* Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#6C5CE7] rounded-full animate-pulse" />
                    <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">{ride.ageGroup || 'All Ages'}</span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent opacity-60" />
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-6 flex flex-col flex-grow justify-between gap-4 sm:gap-5 relative z-10">
                <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-white font-black text-lg leading-tight tracking-tight group-hover:text-[#6C5CE7] transition-all duration-300">
                            {ride.title}
                        </h3>
                            <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-[0.2em]">Fun Ride</span>
                    </div>

                    <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2">
                        {ride.desc || 'Have fun with our great rides for everyone.'}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-end justify-between border-t border-white/5 pt-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Price</span>
                            <p className="text-xl sm:text-2xl font-black text-white tracking-tighter">
                                {typeof ride.price === 'number' ? `₹${ride.price}` : ride.price}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 relative z-20">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="flex-1 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 text-[10px] font-black uppercase tracking-widest py-3.5 rounded-2xl transition-all border border-white/5 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={14} />
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={handleBookNow}
                            className="btn-premium flex-[1.5] text-[10px] py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95"
                        >
                            <Zap size={14} className="fill-current" />
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Accent Line */}
            <div className="absolute top-0 left-0 w-[2px] h-0 group-hover:h-full bg-gradient-to-b from-[#6C5CE7] to-transparent transition-all duration-700 ease-in-out" />
        </motion.div>
    );
};

export default memo(RideCard);
