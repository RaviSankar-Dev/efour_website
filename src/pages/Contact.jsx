import React from 'react';
import { MapPin, Phone, Mail, Clock, Bus, Info, Send, Shield, Globe, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import OptimizedImage from '../components/common/OptimizedImage';

const Contact = () => {
    return (
        <div className="bg-[#02040a] min-h-screen pt-24 md:pt-40 pb-32 relative overflow-hidden selection:bg-[#6C5CE7]/30">
            {/* Immersive Background Architecture */}
            <div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[60rem] bg-gradient-to-b from-[#6C5CE7]/5 to-transparent pointer-events-none" />
            <div className="absolute top-[10%] left-[-10%] w-[60rem] h-[60rem] bg-[#6C5CE7]/5 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50rem] h-[50rem] bg-[#FF7A00]/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="mb-32 text-center max-w-5xl mx-auto space-y-12"
                >
                    <div className="flex flex-col items-center gap-6">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-12 h-[1px] bg-[#6C5CE7]" 
                        />
                        <h1 className="text-3xl xs:text-5xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-[0.85] transform -skew-x-12">
                            CONTACT <br /><span className="text-gradient-primary">US.</span>
                        </h1>
                        <p className="max-w-2xl text-[#94A3B8] text-xs font-black uppercase tracking-[0.6em] italic opacity-40 leading-relaxed border-l-2 border-[#6C5CE7]/30 pl-10 mx-auto">
                            Located in the heart of Eluru, Efour is your main spot for world-class entertainment and great food.
                        </p>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12 mb-32">
                    {/* Information Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-card p-12 rounded-[4rem] h-full relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#6C5CE7]/10 to-transparent blur-[80px] opacity-50" />

                            <h3 className="text-2xl font-black mb-16 flex items-center gap-6 text-white uppercase tracking-tighter italic transform -skew-x-12">
                                <Activity className="text-[#6C5CE7] animate-pulse" size={28} />
                                CONTACT INFO
                            </h3>

                            <div className="space-y-16">
                                <div className="space-y-6 group/item">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#94A3B8] group-hover/item:text-[#6C5CE7] group-hover/item:scale-110 group-hover/item:bg-[#6C5CE7]/10 transition-all duration-500 shadow-xl">
                                            <MapPin size={24} />
                                        </div>
                                        <p className="text-xs font-black text-[#6C5CE7] uppercase tracking-[0.4em] italic">LOCATION</p>
                                    </div>
                                    <p className="font-bold text-white text-lg leading-relaxed italic transform group-hover/item:translate-x-4 transition-all duration-500 opacity-60 group-hover:opacity-100">
                                        Opp: New RTC Main Bus Stand,<br />
                                        NR Peta, ELURU - 534 006
                                    </p>
                                </div>

                                <div className="space-y-6 group/item">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#94A3B8] group-hover/item:text-[#6C5CE7] group-hover/item:scale-110 group-hover/item:bg-[#6C5CE7]/10 transition-all duration-500 shadow-xl">
                                            <Phone size={24} />
                                        </div>
                                        <p className="text-xs font-black text-[#6C5CE7] uppercase tracking-[0.4em] italic">DIRECT LINE</p>
                                    </div>
                                    <p className="font-black text-white text-3xl tracking-tighter italic transform group-hover/item:translate-x-4 transition-all duration-500 group-hover:text-[#FF7A00]">
                                        +91 70369 23456
                                    </p>
                                </div>

                                <div className="space-y-6 group/item pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#94A3B8] group-hover/item:text-[#6C5CE7] group-hover/item:scale-110 group-hover/item:bg-[#6C5CE7]/10 transition-all duration-500 shadow-xl">
                                            <Clock size={24} />
                                        </div>
                                        <p className="text-xs font-black text-[#6C5CE7] uppercase tracking-[0.4em] italic">OPENING HOURS</p>
                                    </div>
                                    <p className="font-black text-white text-2xl tracking-tighter italic transform group-hover/item:translate-x-4 transition-all duration-500">
                                        9:00 AM - 11:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Interactive Map Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <div className="glass-card rounded-[5rem] overflow-hidden shadow-2xl h-[520px] relative group/map">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
                                className="w-full h-full object-cover opacity-20 grayscale group-hover/map:opacity-50 group-hover/map:grayscale-0 group-hover/map:scale-110 transition-all duration-[2000ms]"
                                alt="Eluru Map"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-[#02040a]/60" />
                            <div className="absolute inset-0 noise-overlay opacity-[0.05]" />

                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    className="bg-[#050810]/90 backdrop-blur-3xl p-12 rounded-[4rem] shadow-3xl border border-white/10 flex flex-col md:flex-row items-center gap-12 max-w-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5CE7]/10 blur-[60px] rounded-full" />
                                    <div className="relative z-10 p-8 bg-white/[0.03] rounded-[3rem] border border-white/10 shadow-2xl transform hover:rotate-6 transition-transform duration-700">
                                        <img src="/E4LOGO.jpeg" alt="E4 Logo" className="h-24 w-auto object-contain brightness-125 transition-all duration-700 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                                    </div>
                                    <div className="relative z-10 text-center md:text-left space-y-8">
                                        <div>
                                            <h4 className="font-black text-4xl text-white tracking-tighter uppercase italic transform -skew-x-12 mb-2">EFOUR ELURU</h4>
                                            <p className="text-xs text-[#94A3B8] font-black tracking-[0.4em] uppercase opacity-30 italic">OUR LOCATION</p>
                                        </div>
                                        <a
                                            href="https://www.google.com/maps/place/EFOUR/@16.7089355,81.0863275,17z/data=!3m1!4b1!4m6!3m5!1s0x3a36131a0e74054d:0x366c34d3c0b4589c!8m2!3d16.7089304!4d81.0889024!16s%2Fg%2F11wnjn71fc?entry=ttu"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-premium px-12 py-5 rounded-2xl shadow-xl shadow-[#6C5CE7]/30 inline-block"
                                        >
                                            OPEN NAVIGATION
                                        </a>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Contact Form Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card rounded-[3rem] md:rounded-[5rem] p-6 xs:p-12 md:p-24 relative overflow-hidden shadow-3xl"
                >
                    <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#6C5CE7]/5 rounded-full blur-[160px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[#FF7A00]/5 rounded-full blur-[140px] pointer-events-none" />

                    <div className="relative z-10 grid xl:grid-cols-2 gap-16 md:gap-32 items-center">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-[#6C5CE7]">
                                    <Shield size={20} className="animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-[0.8em] italic opacity-40">COMMUNICATIONS</span>
                                </div>
                                <h2 className="text-4xl xs:text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] transform -skew-x-12 text-white">
                                    GET IN <br /><span className="text-gradient-primary">TOUCH.</span>
                                </h2>
                            </div>

                            <p className="text-lg text-[#94A3B8] font-bold uppercase tracking-[0.3em] italic opacity-40 leading-relaxed border-l-2 border-[#6C5CE7]/30 pl-10">
                                Our support team is here to help 24/7. Send us your message and we will get back to you as soon as possible.
                            </p>

                            <div className="pt-8">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10 text-2xl font-black text-white tracking-tighter italic uppercase group cursor-pointer">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#6C5CE7] group-hover:scale-110 group-hover:bg-[#6C5CE7] group-hover:text-white transition-all duration-700 shadow-2xl shrink-0">
                                        <Mail size={28} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-[#94A3B8] tracking-[0.4em] uppercase opacity-30">EMAIL US</p>
                                        <span className="group-hover:text-[#6C5CE7] transition-all break-all text-base xs:text-lg md:text-2xl block normal-case">efoureluru@gmail.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="bg-white/[0.02] backdrop-blur-3xl p-6 xs:p-10 md:p-20 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 shadow-3xl space-y-12 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6C5CE7]/40 to-transparent" />

                            <div className="space-y-10">
                                {[
                                    { label: 'YOUR NAME', type: 'text', placeholder: 'ENTER YOUR FULL NAME' },
                                    { label: 'YOUR EMAIL', type: 'email', placeholder: 'EMAIL@DOMAIN.COM' }
                                ].map((field, i) => (
                                    <div key={i} className="space-y-4">
                                        <label className="text-xs font-black text-[#6C5CE7] uppercase tracking-[0.4em] italic ml-6 opacity-60">{field.label}</label>
                                        <input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 md:px-10 py-4 md:py-6 text-white outline-none focus:border-[#6C5CE7]/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700 text-sm font-bold tracking-widest italic"
                                        />
                                    </div>
                                ))}
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-[#6C5CE7] uppercase tracking-[0.4em] italic ml-6 opacity-60">YOUR MESSAGE</label>
                                    <textarea
                                        placeholder="TYPE YOUR MESSAGE HERE..."
                                        rows="4"
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 md:px-10 py-4 md:py-6 text-white outline-none focus:border-[#6C5CE7]/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700 text-sm font-bold tracking-widest italic resize-none"
                                    />
                                </div>
                            </div>

                            <a
                                href="https://wa.me/917036923456"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-premium w-full py-7 rounded-[2rem] font-black uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-6 group/btn shadow-3xl hover:-translate-y-2 transition-all duration-500"
                            >
                                SEND MESSAGE <Send size={24} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform" />
                            </a>
                        </form>
                    </div>
                </motion.section>
            </div>

            {/* Global Perspective Fix for 3D */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .matrix-grid {
                    background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}} />
        </div>
    );
};

export default Contact;
