import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Star, Wind, ShieldCheck, Map, ArrowRight, Zap, Target, Globe } from 'lucide-react'
import OptimizedImage from './common/OptimizedImage'

const About = () => {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -150])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 150])

    const cardShadow = "0 10px 30px rgba(0,0,0,0.4), 0 20px 60px rgba(0,0,0,0.25)";
    const hoverShadow = "0 30px 60px rgba(0,0,0,0.6), 0 40px 100px rgba(0,0,0,0.4)";

    return (
        <section id="philosophy" ref={containerRef} className="py-16 md:py-24 container mx-auto px-6 overflow-hidden bg-[#02040a] relative">
            {/* Ambient Background Depth */}
            <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#6C5CE7]/5 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#FF7A00]/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="grid grid-cols-12 gap-12 xl:gap-24 relative z-10">
                {/* Typographic Column */}
                <div className="col-span-12 xl:col-span-5 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                        className="space-y-12"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-[#6C5CE7] border border-white/10 shadow-xl">
                                <Globe size={20} />
                            </div>
                            <span className="text-[#6C5CE7] font-black tracking-[0.6em] uppercase text-xs ">
                                ABOUT US
                            </span>
                        </div>

                        <h2 className="text-4xl xs:text-5xl md:text-8xl font-black leading-none tracking-tighter uppercase transform text-white">
                            <span className="text-gradient-primary">OUR VISION.</span>
                        </h2>

                        <p className="text-[#94A3B8] text-xl font-bold uppercase tracking-widest leading-relaxed opacity-40 border-l border-[#6C5CE7]/30 pl-10 max-w-lg">
                            We are building the best place in Eluru for great food and fun rides for families.
                        </p>

                        <motion.button
                            onClick={() => document.getElementById('rides')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn-premium px-8 md:px-12 py-4 md:py-6 rounded-2xl shadow-2xl"
                        >
                            <span className="flex items-center gap-4 text-xs md:text-sm">
                                BOOK YOUR RIDE <ArrowRight size={18} />
                            </span>
                        </motion.button>
                    </motion.div>
                </div>

                {/* Visual Column */}
                <div className="col-span-12 xl:col-span-7 relative">
                    <div className="relative aspect-video xl:aspect-square">
                        {/* Matrix Grid Decoration */}
                        <div className="absolute inset-[-10%] noise-overlay opacity-5 pointer-events-none" />

                        {/* Card 1: Main Perspective */}
                        <motion.div
                            style={{
                                y: y1,
                                boxShadow: cardShadow
                            }}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: hoverShadow,
                                transition: { duration: 0.4, ease: "easeOut" }
                            }}
                            className="w-full h-full rounded-[3.5rem] md:rounded-[5.5rem] overflow-hidden border border-white/10 p-3 bg-white/[0.02] backdrop-blur-[12px] relative z-20 group/main transition-all duration-700"
                        >
                            <div className="w-full h-full rounded-[2.8rem] md:rounded-[4.8rem] overflow-hidden relative">
                                <OptimizedImage
                                    src="/horizon picture.png"
                                    alt="Experience Efour"
                                    className="w-full h-full object-cover group-hover/main:scale-105 transition-all duration-[1s]"
                                />
                                {/* Bottom Image Gradient */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent opacity-30 z-10" />
                            </div>
                        </motion.div>

                        {/* Card 2: Intentional Overlap Highlight */}
                        <motion.div
                            style={{ y: y2 }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: hoverShadow,
                                transition: { duration: 0.4, ease: "easeOut" }
                            }}
                            className="absolute -bottom-[15%] -right-[10%] w-[70%] aspect-[4/3] rounded-[4.5rem] overflow-hidden border border-white/[0.08] p-3 bg-white/[0.01] backdrop-blur-[14px] shadow-3xl z-30 hidden xl:block group/preview transition-all duration-700"
                        >
                            <div className="w-full h-full rounded-[3.8rem] overflow-hidden relative shadow-inner">
                                <OptimizedImage
                                    src="/horizon picture.png"
                                    alt="Thrill Seekers"
                                    className="w-full h-full object-cover brightness-[1.1] group-hover/preview:brightness-[1.2] group-hover/preview:scale-105 transition-all duration-[1s]"
                                />
                                {/* Soft Accent Gradient */}
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                            </div>
                        </motion.div>

                        {/* Text Decor Background */}
                        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none select-none hidden md:block opacity-[0.03]">
                            <h3 className="text-[12vw] font-black text-white whitespace-nowrap leading-none rotate-90 uppercase tracking-tighter">
                                EFOUR
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About

