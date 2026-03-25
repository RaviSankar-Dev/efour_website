import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';
import useStore from '../../store/useStore';

const ActivityCard = memo(({ activity }) => {
    const { addToCart } = useStore();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }} // Faster transition
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-50 flex flex-col hover:shadow-xl transition-shadow group"
        >
            <div className="h-24 overflow-hidden relative">
                <OptimizedImage
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-md font-black text-eluru-teal text-[10px]">
                    {typeof activity.price === 'number' ? `₹${activity.price}` : activity.price}
                </div>
            </div>
            <div className="p-2 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sunset-orange font-bold uppercase text-[8px] tracking-widest">{activity.category || 'Fun'}</span>
                    <span className="text-gray-400 text-[8px] font-bold">{activity.ageGroup}</span>
                </div>
                <h3 className="text-xs font-bold mb-2 truncate" title={activity.title}>{activity.title}</h3>
                <div className="mt-auto"> {/* Push button to bottom */}
                    <button
                        onClick={() => {
                            addToCart({
                                id: `play-${activity.id}`,
                                name: activity.title,
                                price: typeof activity.price === 'number' ? activity.price : 0,
                                image: activity.image,
                                stall: activity.category
                            });
                            useStore.getState().openCart();
                        }}
                        className="flex items-center justify-center gap-2 w-full bg-sunset-orange text-white hover:bg-sunset-orange/90 text-[10px] py-1.5 px-2 rounded-md font-bold transition-colors"
                    >
                        Book <Ticket size={12} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
});

export default ActivityCard;
