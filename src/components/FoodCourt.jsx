import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ShoppingBag, ArrowRight, Star, Heart } from 'lucide-react'

import useStore from '../store/useStore'
import OptimizedImage from './common/OptimizedImage'

const STALLS = [
    { id: 'all', name: 'All Stalls' },
]

const MENU_ITEMS = [];

const FoodCourt = () => {
    const [activeCategory, setActiveCategory] = useState('all')
    const { addToCart } = useStore()

    const filteredItems = activeCategory === 'all'
        ? MENU_ITEMS
        : MENU_ITEMS.filter(item => item.category === activeCategory)

    return (
        <section id="cuisine" className="section-spacing">
            <div className="container">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
                    <div className="max-w-2xl">
                        <span className="text-primary font-black tracking-[0.5em] uppercase text-[10px] mb-8 block">FOOD SELECTION</span>
                        <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">THE <span className="serif text-primary">Table.</span></h2>
                        <p className="text-text-secondary text-lg font-light max-w-lg">
                            Discover a symphony of flavors curated from the most prestigious stalls in the region.
                        </p>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {STALLS.map(stall => (
                            <button
                                key={stall.id}
                                onClick={() => setActiveCategory(stall.id)}
                                className={`px-10 py-4 rounded-full whitespace-nowrap transition-all uppercase text-[10px] tracking-widest font-black border ${activeCategory === stall.id
                                    ? 'bg-white border-white text-bg-deep'
                                    : 'border-white/10 hover:border-primary text-text-secondary'
                                    }`}
                            >
                                {stall.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="elite-grid gap-y-16">
                    <AnimatePresence mode="popLayout">
                        <div className="col-span-12 flex flex-col items-center justify-center py-20 text-center">
                            <h2 className="text-4xl font-heading font-bold text-white/20 mb-4 uppercase tracking-widest">Coming Soon</h2>
                            <p className="text-white/40 max-w-md">Our food selection is preparing something special. The table will be set soon.</p>
                        </div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default FoodCourt
