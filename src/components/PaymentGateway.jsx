import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Building, ShieldCheck, CheckCircle2, Lock, Cpu, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const PaymentGateway = ({ amount, isOpen, onClose }) => {
    const [method, setMethod] = useState('upi'); // upi, card, netbanking
    const [isPaying, setIsPaying] = useState(false);
    const navigate = useNavigate();

    const { user, cart, addTicket, closeCart } = useStore();

    if (!isOpen) return null;

    const handlePay = () => {
        setIsPaying(true);
        setTimeout(() => {
            const orderId = `EF-${Math.floor(1000 + Math.random() * 9000)}`;
            const newTicket = {
                id: orderId,
                date: new Date().toISOString(),
                items: cart,
                total: amount,
                userMobile: user?.mobile
            };

            addTicket(newTicket);
            closeCart(); // Close the cart sidebar
            navigate(`/success?orderId=${orderId}`, { state: { mobile: user?.mobile, bookedItems: cart } });
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 selection:bg-[#FF7A18] selection:text-white">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#070B14]/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[#0F172A] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] w-full max-w-md relative z-10 border border-white/10"
            >
                {/* Protocol Header */}
                <div className="bg-gradient-to-br from-[#1D2B44] to-[#0F172A] p-10 border-b border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
                    <div className="flex justify-between items-center relative z-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[#FF7A18]">
                                <Globe size={14} className="animate-pulse" />
                                <span className="text-[10px] font-black tracking-[0.4em] uppercase italic opacity-60">NETWORK_PAY_v4.2</span>
                            </div>
                            <h2 className="text-3xl font-black text-[#F8FAFC] tracking-tighter uppercase italic transform -skew-x-12 leading-none">
                                EFOUR <span className="text-[#FF7A18]">ELURU</span>
                            </h2>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] font-black text-[#AAB2C5] uppercase tracking-[0.3em] block mb-1 opacity-40 italic">CREDIT_SYNC_REQUIRED</span>
                            <span className="text-3xl font-black text-white italic transform -skew-x-12">₹{amount}</span>
                        </div>
                    </div>
                </div>

                <div className="p-10 relative">
                    <div className="absolute inset-0 matrix-grid opacity-5 pointer-events-none" />

                    {isPaying ? (
                        <div className="py-16 text-center space-y-8 relative z-10">
                            <div className="relative inline-block">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="w-24 h-24 border-2 border-[#FF7A18]/20 border-t-[#FF7A18] rounded-[2rem] mx-auto"
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-[#FF7A18]">
                                    <Cpu size={32} className="animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="font-black text-[#F8FAFC] uppercase tracking-widest italic text-xl transform -skew-x-12">SYNCHRONIZING_ASSETS</p>
                                <p className="text-[#AAB2C5] text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">PLEASE MAINTAIN CONNECTION INTEGRITY</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-4 mb-10 relative z-10">
                                {[
                                    { id: 'upi', icon: <Smartphone size={20} />, label: 'UPI' },
                                    { id: 'card', icon: <CreditCard size={20} />, label: 'CARD' },
                                    { id: 'netbanking', icon: <Building size={20} />, label: 'BANK' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setMethod(item.id)}
                                        className={`p-5 rounded-3xl flex flex-col items-center gap-3 border transition-all duration-500 group ${method === item.id
                                            ? 'border-[#FF7A18] bg-[#FF7A18]/10 text-[#FF7A18] shadow-[0_0_30px_rgba(255,122,24,0.1)]'
                                            : 'border-white/5 bg-white/[0.02] text-[#AAB2C5]/40 hover:border-white/20 hover:text-[#F8FAFC]'}`}
                                    >
                                        <div className={`transition-transform duration-500 ${method === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            {item.icon}
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4 mb-10 relative z-10">
                                {method === 'upi' && (
                                    <div className="space-y-3">
                                        {['PhonePe', 'Google Pay'].map((gateway) => (
                                            <div
                                                key={gateway}
                                                onClick={handlePay}
                                                className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between hover:border-[#FF7A18]/50 cursor-pointer transition-all active:scale-95 group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2 h-2 rounded-full bg-[#FF7A18]/20 group-hover:bg-[#FF7A18] transition-colors" />
                                                    <span className="font-black text-[#F8FAFC] uppercase tracking-widest italic text-sm">{gateway}</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[#AAB2C5]/20 group-hover:text-[#FF7A18] group-hover:border-[#FF7A18]/20">
                                                    <Zap size={14} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {method === 'card' && (
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <input type="text" placeholder="CARD_SERIAL_IDENTIFIER" className="w-full p-5 bg-white/[0.02] border border-white/5 rounded-2xl outline-none focus:border-[#FF7A18]/50 text-[#F8FAFC] font-black uppercase tracking-widest italic text-xs placeholder-[#AAB2C5]/10" />
                                        </div>
                                        <div className="flex gap-4">
                                            <input type="text" placeholder="EXP_CYCLE" className="w-1/2 p-5 bg-white/[0.02] border border-white/5 rounded-2xl outline-none focus:border-[#FF7A18]/50 text-[#F8FAFC] font-black uppercase tracking-widest italic text-xs placeholder-[#AAB2C5]/10" />
                                            <input type="password" placeholder="SEC_TOKEN" className="w-1/2 p-5 bg-white/[0.02] border border-white/5 rounded-2xl outline-none focus:border-[#FF7A18]/50 text-[#F8FAFC] font-black uppercase tracking-widest italic text-xs placeholder-[#AAB2C5]/10" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePay}
                                className="btn-premium w-full py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_60px_rgba(255,122,24,0.3)] relative overflow-hidden group/btn italic"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                    EXECUTE_CREDIT_SYNC <ShieldCheck size={18} />
                                </span>
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-4 text-[#AAB2C5] text-[9px] font-black tracking-[0.3em] uppercase opacity-30 italic">
                                <div className="flex items-center gap-2"><Lock size={12} /> <span>AES_256_ENC</span></div>
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                <div className="flex items-center gap-2"><Globe size={12} /> <span>ELURU_SECURED</span></div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentGateway;
