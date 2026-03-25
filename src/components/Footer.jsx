import React, { useState } from 'react'
import { Phone, MapPin, Instagram, Facebook, Youtube, Mail, ArrowUp, Shield, Activity, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = ({ onOpenTerms, onOpenAbout, onOpenPrivacy }) => {
    const [showDevOptions, setShowDevOptions] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const navLinkClasses = "text-[#94A3B8] hover:text-[#FF7A00] transition-all text-sm uppercase tracking-[0.3em] font-bold hover:translate-x-2 inline-block cursor-pointer text-left";
    const sectionTitleClasses = "font-black text-xs uppercase tracking-[0.4em] text-[#6C5CE7] mb-10 flex items-center gap-3";

    return (
        <footer className="bg-[#02040a] pt-32 pb-16 border-t border-white/5 relative overflow-hidden selection:bg-[#6C5CE7] selection:text-white">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-overlay" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6C5CE7]/30 to-transparent" />
            
            {/* Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#6C5CE7]/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#FF7A00]/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-32">
                    <div className="lg:col-span-2 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex items-center gap-8"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-[#6C5CE7]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <img
                                    src="/E4LOGO.jpeg"
                                    alt="E4 Logo"
                                    className="w-24 h-24 rounded-2xl object-contain bg-black border border-white/10 shadow-2xl relative z-10 transition-all duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-[#FF7A00] tracking-tighter uppercase italic transform -skew-x-12">EFOUR <span className="text-[#FBBF24]">ELURU</span></h3>
                                <p className="text-[10px] font-black text-[#6C5CE7] tracking-[0.4em] uppercase opacity-60 italic">NR PETA, ELURU</p>
                            </div>
                        </motion.div>

                        <p className="text-[#94A3B8] text-lg font-bold uppercase tracking-widest leading-relaxed max-w-lg italic opacity-40 border-l border-[#6C5CE7]/30 pl-8">
                            Redefining entertainment through world-class experiences, premium dining, and heart-pounding attractions.
                        </p>

                        <div className="flex gap-6 pt-4">
                            {[
                                { Icon: Instagram, href: 'https://www.instagram.com/efoureluru?igsh=MXkxOTA5djhzM2dpeA==', color: 'from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' },
                                { Icon: Facebook, href: 'https://www.facebook.com/share/1DHuqH8gAA/?mibextid=wwXIfr', color: 'from-[#1877F2] to-[#0a52be]' },
                                { Icon: Youtube, href: '#', color: 'from-[#FF0000] to-[#cc0000]' }
                            ].map(({ Icon, href, color }, i) => (
                                <motion.a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="group relative"
                                >
                                    <div className="w-14 h-14 bg-white/[0.03] backdrop-blur-3xl rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#6C5CE7]/50 transition-all duration-500 relative z-10">
                                        <div className={`absolute inset-0 bg-gradient-to-tr ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
                                        <Icon size={20} className="text-white group-hover:text-white transition-colors duration-500" />
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className={sectionTitleClasses}>
                            <Globe size={14} className="text-[#6C5CE7]" /> Exploration
                        </h4>
                        <ul className="space-y-5 flex flex-col items-start">
                            {[
                                { name: 'Your Tickets', path: '/login' },
                                { name: 'Dine', path: '/dine' },
                                { name: 'Contact', path: '/contact' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className={navLinkClasses}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className={sectionTitleClasses}>
                            <Shield size={14} className="text-[#6C5CE7]" /> Resources
                        </h4>
                        <ul className="space-y-5 flex flex-col items-start">
                            <li><Link to="/about" className={navLinkClasses}>About Us</Link></li>
                            <li><Link to="/privacy" className={navLinkClasses}>Privacy Policy</Link></li>
                            <li><Link to="/terms" className={navLinkClasses}>Terms of Use</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-16 border-t border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 text-[#FF7A00]">
                                <MapPin size={20} />
                            </div>
                            <span className="text-sm font-black uppercase tracking-[0.2em] italic text-[#94A3B8]">
                                Opp to RTC Main Bus Stand, NR Peta, Eluru
                            </span>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 text-[#6C5CE7]">
                                <Phone size={20} />
                            </div>
                            <span className="text-xl font-black tracking-widest text-white italic">
                                +91 70369 23456
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 items-start lg:items-end">
                        <p className="text-xs uppercase tracking-[0.3em] font-black italic">
                            <span className="text-[#94A3B8] opacity-40">© 2026 EFOUR ELURU. ALL RIGHTS RESERVED. BY</span> <span className="text-white">JAYANARAYANA KURETI</span>
                        </p>
                        
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setShowDevOptions(!showDevOptions)}
                                className="bg-white/[0.03] border border-white/10 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/[0.08] transition-all flex items-center gap-4 group relative"
                            >
                                STACKVIL TECHNOLOGIES
                                <Activity size={12} className={`transition-transform duration-500 text-[#6C5CE7] ${showDevOptions ? 'rotate-180' : ''}`} />
                                
                                {showDevOptions && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-full right-0 mb-4 min-w-[200px] bg-[#050810] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-3xl overflow-hidden z-50 p-2"
                                    >
                                        <a href="https://www.stackvil.com/" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-[10px] font-black text-[#94A3B8] hover:text-[#6C5CE7] hover:bg-white/5 rounded-xl uppercase tracking-widest transition-all">Official Portal</a>
                                        <a href="https://wa.me/918919079058" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-[10px] font-black text-emerald-500 hover:bg-white/5 rounded-xl uppercase tracking-widest transition-all">Support Line</a>
                                    </motion.div>
                                )}
                            </button>

                            <button
                                onClick={scrollToTop}
                                className="group flex items-center gap-6 text-sm uppercase tracking-[0.4em] font-black text-[#FF7A00] hover:text-white transition-all italic"
                            >
                                <span className="hidden sm:inline">Back to Top</span>
                                <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] group-hover:bg-[#FF7A00] group-hover:text-white transition-all duration-500">
                                    <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cinematic Background Typography */}
            <div className="absolute bottom-[-5%] left-0 w-full overflow-hidden pointer-events-none opacity-[0.02] select-none">
                <h2 className="text-[20vw] font-black leading-none whitespace-nowrap italic transform -skew-x-12 translate-y-1/2">
                    EFOUR ELURU
                </h2>
            </div>
        </footer>
    )
}


export default Footer
