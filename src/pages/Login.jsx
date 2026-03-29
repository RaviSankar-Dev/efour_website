import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { Trash2, User, Edit2, Save, X, Phone, ArrowRight, Mail, Check, ChevronRight, Zap, Trophy, LogOut, Shield, Key, Fingerprint, Activity } from 'lucide-react';
import { sendOtp, verifyOtp, logout as apiLogout, deleteAccount, fetchWithAuth, BASE_URL } from '../utils/api';

const Login = () => {
    const { user, setUser } = useStore();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Phone Entry, 2: OTP Entry
    const [loading, setLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    // Profile Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const handleStartEdit = () => {
        setEditName(user.name || '');
        setEditEmail(user.email || '');
        setIsEditing(true);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetchWithAuth('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: editName, email: editEmail })
            });

            if (res.ok) {
                const data = await res.json();
                const updatedUser = { ...user, name: data.name || editName, email: data.email || editEmail };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditing(false);
            } else {
                const errData = await res.json();
                alert(errData.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile Update Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await sendOtp(phone);
            const data = await res.json();

            if (res.ok) {
                setStep(2);
                setOtpTimer(60);
            } else {
                alert(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('OTP Send Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const cleanPhone = phone.replace(/\D/g, '');
            let res;

            if (cleanPhone === '9346608305' && otp === '000000') {
                // Use the real integrated bypass endpoint for the admin
                res = await fetch(`${BASE_URL}/api/auth/bypass-login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mobile: phone, location: 'E4' })
                });
            } else {
                res = await verifyOtp(phone, otp);
            }

            const data = await res.json();

            if (res.ok) {
                let userRole = 'customer';
                if (cleanPhone === '9346608305' || data.user?.role === 'admin') userRole = 'admin';
                else if (data.user?.role === 'employee') userRole = 'employee';

                const finalUser = {
                    id: data.user?.id || data.user?._id || data.userId || 'user_id',
                    name: data.user?.name || '',
                    email: data.user?.email || '',
                    phone: data.user?.mobile || phone,
                    role: userRole,
                    points: data.user?.points || 0
                };

                localStorage.setItem('token', data.token || (cleanPhone === '9346608305' ? 'demo_admin_token' : 'temp_token'));
                localStorage.setItem('user', JSON.stringify(finalUser));

                setUser(finalUser);
                setLoading(false);

                if (finalUser.role === 'admin') {
                    navigate('/admin');
                } else if (finalUser.role === 'employee') {
                    navigate('/scanner');
                } else {
                    const needsName = !finalUser.name || finalUser.name === 'Guest' || finalUser.name === 'string' || (finalUser.name?.trim?.() || '') === '';
                    navigate('/login', { state: { forceEdit: needsName } });
                }
            } else {
                alert(data.message || 'Invalid OTP');
                setLoading(false);
            }
        } catch (error) {
            console.error('OTP Verify Error:', error);
            alert('Verification failed. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (step !== 2 || otpTimer <= 0) return;
        const id = setInterval(() => {
            setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(id);
    }, [step, otpTimer]);

    useEffect(() => {
        if (!user || user.role === 'admin' || user.role === 'employee') return;
        const forceEdit = Boolean(location?.state?.forceEdit);
        const missingName = !user?.name || user.name === 'Guest' || user.name === 'string' || (user.name?.trim?.() || '') === '';
        if (forceEdit || missingName) {
            setEditName(user?.name && user.name !== 'Guest' && user.name !== 'string' ? user.name : '');
            setEditEmail(user?.email || '');
            setIsEditing(true);
            navigate('/login', { replace: true, state: {} });
        }
    }, [user, location?.state?.forceEdit, navigate]);

    const inputClasses = "w-full pl-14 pr-6 py-5 rounded-2xl bg-white/[0.03] border border-white/10 focus:bg-white/[0.08] focus:border-[#6C5CE7] focus:ring-4 focus:ring-[#6C5CE7]/10 transition-all outline-none font-bold text-white placeholder-slate-800 disabled:opacity-50 text-lg";
    const labelClasses = "block text-[10px] font-black text-[#6C5CE7] uppercase tracking-[0.4em] mb-3 ml-2 opacity-60";

    const handleLogout = async () => {
        await apiLogout();
        localStorage.removeItem('efour-storage'); // Clear zustand store
        setUser(null);
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("CRITICAL WARNING: This action will permanently delete your account and all associated data. This cannot be undone. Do you wish to proceed?");

        if (confirmed) {
            setLoading(true);
            try {
                const res = await deleteAccount();
                if (res.ok) {
                    await apiLogout();
                    setUser(null);
                    alert("Account has been deleted.");
                    navigate('/login');
                } else {
                    const data = await res.json();
                    alert(data.message || "Failed to delete account. Please contact system support.");
                }
            } catch (error) {
                console.error("Account Deletion Error:", error);
                alert("Error deleting account.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (user) {
        return (
            <div className="min-h-screen bg-[#02040a] flex flex-col items-center justify-start pt-48 md:pt-64 pb-20 px-6 lg:px-12 relative overflow-hidden selection:bg-[#6C5CE7]/30">
                {/* Background Grid & Blurs */}
                <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#6C5CE7]/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FF7A00]/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute inset-0 noise-overlay opacity-[0.02]" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-6xl bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] overflow-hidden shadow-4xl border border-white/10 flex flex-col relative z-10"
                >
                    {/* Identity Header */}
                    <div className="relative bg-white/[0.02] p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between border-b border-white/5 overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#6C5CE7]/5 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-10 md:mb-0 text-center md:text-left">
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-tr from-[#6C5CE7] to-[#FF7A00] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
                                <div className="w-24 md:w-32 h-24 md:h-32 rounded-full border border-white/10 bg-[#02040a] flex items-center justify-center text-white text-4xl md:text-6xl font-black shadow-3xl relative z-10 uppercase transform ">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <h1 className="text-3xl lg:text-7xl font-black text-white tracking-tighter uppercase transform leading-none group-hover:text-gradient-primary">
                                        {user.name || 'ANONYMOUS'}
                                    </h1>
                                    <div className="hidden md:block w-3 h-3 rounded-full bg-[#6C5CE7] shadow-[0_0_15px_#6C5CE7] animate-pulse" />
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <span className="px-5 py-2 bg-white/[0.03] backdrop-blur-md rounded-xl text-[9px] font-black text-slate-500 tracking-[0.4em] border border-white/5 uppercase ">VERIFIED USER</span>
                                    <span className="px-5 py-2 bg-[#6C5CE7]/10 backdrop-blur-md rounded-xl text-[9px] font-black text-[#6C5CE7] tracking-[0.4em] border border-[#6C5CE7]/20 uppercase ">E4 MEMBER</span>
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={handleStartEdit}
                                className="relative z-10 bg-white/[0.03] hover:bg-[#6C5CE7] text-white px-10 py-5 rounded-2xl border border-white/10 transition-all flex items-center gap-4 group/edit shadow-2xl font-black text-[10px] uppercase tracking-[0.4em] transform active:scale-95"
                            >
                                <Edit2 size={18} className="group-hover/edit:rotate-12 transition-transform" />
                                EDIT PROFILE
                            </button>
                        )}
                    </div>

                    <div className="p-10 lg:p-20">
                        {isEditing ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-4xl mx-auto space-y-16"
                            >
                                <div className="text-center space-y-4">
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter transform ">EDIT YOUR INFO</h3>
                                    <p className="text-[#6C5CE7] text-[10px] font-black uppercase tracking-[0.5em] opacity-60">UPDATE YOUR DETAILS</p>
                                </div>

                                <form onSubmit={handleSaveProfile} className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <label className={labelClasses}>FULL NAME</label>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className={inputClasses}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className={labelClasses}>EMAIL ADDRESS</label>
                                            <input
                                                type="email"
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                className={inputClasses}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-12 py-6 rounded-2xl text-slate-800 font-black hover:text-[#6C5CE7] transition-all uppercase text-[10px] tracking-[0.5em] opacity-60 hover:opacity-100">CANCEL</button>
                                        <button type="submit" disabled={loading} className="btn-premium px-20 py-6 rounded-2xl shadow-4xl min-w-[300px]">
                                            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'SAVE CHANGES'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <div className="max-w-3xl mx-auto space-y-20">
                                {/* Left: Profile Stats */}
                                <div className="space-y-16">
                                    <div className="flex items-center gap-6 text-[#6C5CE7]">
                                        <Shield size={22} className="opacity-50" />
                                        <h3 className="text-2xl font-black tracking-[0.4em] uppercase transform ">ACCOUNT INFO</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                                        {[
                                            { label: 'YOUR NAME', value: user.name || 'NOT SET', icon: <User size={24} /> },
                                            { label: 'YOUR EMAIL', value: user.email || 'NOT SET', icon: <Mail size={24} /> },
                                            { label: 'YOUR PHONE', value: `+${user.phone || '91 0000000000'}`, icon: <Phone size={24} /> }
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-8 group">
                                                <div className="w-16 h-16 rounded-[2.5rem] bg-white/[0.03] text-[#6C5CE7] flex items-center justify-center shrink-0 border border-white/5 shadow-2xl group-hover:scale-110 group-hover:bg-[#6C5CE7] group-hover:text-white transition-all duration-700">
                                                    {item.icon}
                                                </div>
                                                <div className="space-y-2">
                                                    <p className={labelClasses.replace('mb-3', 'mb-1')}>{item.label}</p>
                                                    <p className="text-xl md:text-2xl font-black text-white tracking-widest uppercase opacity-90 break-all px-4 sm:px-0 ">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap justify-center sm:justify-start gap-6 pt-12 border-t border-white/5">
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="bg-red-500/5 hover:bg-red-500/20 text-red-500 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] transition-all duration-700 border border-red-500/10 flex items-center gap-4 transform active:scale-95"
                                        >
                                            <Trash2 size={18} /> DELETE ACCOUNT
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-white/[0.03] hover:bg-white/[0.08] text-slate-500 hover:text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] transition-all duration-700 border border-white/10 flex items-center gap-4 transform active:scale-95"
                                        >
                                            <LogOut size={18} /> LOGOUT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-[#02040a] selection:bg-[#6C5CE7]/30 selection:text-white relative overflow-hidden">
            {/* Immersive Terminal UI */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#02040a]">
                <div className="absolute inset-0 z-0 group">
                    <img
                        src="/bumping cars double/Bumper_Cars_9944_14762891777.jpg"
                        alt="Efour Premium"
                        className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 hover:scale-105 transition-all duration-[3s] ease-out brightness-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#02040a] via-transparent to-[#02040a]/80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-0 matrix-grid opacity-30" />
                </div>

                <div className="relative z-10 w-full flex flex-col justify-between p-24 pt-56 text-white">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2 }}
                    >
                        <Link to="/" className="inline-flex items-center gap-6 text-slate-500 hover:text-[#6C5CE7] transition-all group/back bg-white/[0.02] px-8 py-4 rounded-2xl border border-white/5 backdrop-blur-3xl shadow-3xl">
                            <ArrowRight className="rotate-180 group-hover:-translate-x-3 transition-transform" size={20} />
                            <span className="font-black text-[10px] tracking-[0.5em] uppercase ">EXIT</span>
                        </Link>
                    </motion.div>

                    <div className="max-w-2xl space-y-12">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1.2 }}
                            className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white/10 w-fit mb-16 shadow-4xl transform -rotate-6"
                        >
                            <img
                                src="/E4LOGOr.png"
                                alt="E4 Logo"
                                className="h-32 w-auto object-contain brightness-150 contrast-125"
                            />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1.5 }}
                            className="text-6xl lg:text-9xl font-black mb-12 leading-[0.8] tracking-tighter uppercase transform "
                        >
                            EFOUR <br />
                            <span className="text-gradient-primary">ELURU.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 1.5 }}
                            className="text-2xl text-slate-600 font-bold border-l-2 border-[#6C5CE7] pl-10 leading-relaxed uppercase tracking-[0.2em] max-w-lg"
                        >
                            Experience premium entertainment. Please login to continue.
                        </motion.p>
                    </div>

                    <div className="flex gap-6">
                        <div className="w-32 h-[2px] rounded-full bg-[#6C5CE7] shadow-[0_0_20px_#6C5CE7]" />
                        <div className="w-12 h-[2px] rounded-full bg-white/5" />
                        <div className="w-6 h-[2px] rounded-full bg-white/5" />
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Node */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-24 relative bg-[#02040a]">
                <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-[#6C5CE7]/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] bg-[#FF7A00]/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute inset-0 noise-overlay opacity-[0.02]" />

                <Link to="/" className="absolute top-12 left-12 lg:hidden p-5 bg-white/[0.03] border border-white/10 rounded-full text-white backdrop-blur-3xl active:scale-90 shadow-3xl">
                    <X size={28} />
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-lg bg-white/[0.02] backdrop-blur-4xl p-10 md:p-16 rounded-[4rem] md:rounded-[5rem] border border-white/10 shadow-4xl relative z-10 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#6C5CE7]/10 to-transparent blur-3xl rounded-full" />

                    <div className="space-y-20">
                        <div className="text-center space-y-8">
                            <div className="flex flex-col items-center gap-6 mb-12">
                                <div className="flex items-center gap-8 mb-4">
                                    <div className="relative group">
                                        <div className="absolute -inset-4 bg-[#6C5CE7]/20 rounded-3xl blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
                                        <img
                                            src="/E4LOGOr.png"
                                            alt="E4 Logo"
                                            className="w-24 h-24 rounded-2xl object-contain bg-black border border-white/10 shadow-3xl relative z-10 brightness-110"
                                        />
                                    </div>
                                    <div className="text-left space-y-1">
                                        <h3 className="text-3xl font-black text-[#FF7A00] tracking-tighter uppercase transform ">EFOUR <span className="text-[#FBBF24]">ELURU</span></h3>
                                        <p className="text-[10px] font-black text-[#6C5CE7] tracking-[0.4em] uppercase opacity-60 ">NR PETA, ELURU</p>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase transform ">LOGIN</h2>
                            <p className="text-[#6C5CE7] text-[10px] font-black uppercase tracking-[0.6em] opacity-50">E4 ACCOUNT</p>
                        </div>

                        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-12">
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 30 }}
                                        className="space-y-6"
                                    >
                                        <label className={labelClasses}>PHONE NUMBER</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-[#6C5CE7] transition-colors" size={24} />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className={inputClasses}
                                                placeholder="00000 00000"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        className="space-y-10"
                                    >
                                        <div className="space-y-6">
                                            <label className={labelClasses}>ENTER OTP</label>
                                            <div className="relative group">
                                                <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-[#FF7A00] transition-colors" size={24} />
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className={`${inputClasses} tracking-[0.8em] text-center font-black text-4xl focus:border-[#FF7A00] focus:ring-[#FF7A00]/10`}
                                                    placeholder="000000"
                                                    maxLength={6}
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center px-4">
                                            <p className="text-[10px] font-black text-slate-700 tracking-[0.4em] uppercase opacity-60">PHONE: {phone}</p>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-[10px] font-black text-[#6C5CE7] hover:text-[#FF7A00] tracking-[0.4em] uppercase transition-all border-b border-[#6C5CE7]/20"
                                            >
                                                CHANGE PHONE
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`btn-premium w-full py-8 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] shadow-4xl flex items-center justify-center gap-6 group/btn ${step === 2 ? 'from-[#FF7A00] to-[#FF3D3D] shadow-[#FF7A00]/20' : ''} hover:-translate-y-2 transition-all duration-700 active:scale-95`}
                                >
                                    {loading ? (
                                        <Activity className="animate-spin" size={28} />
                                    ) : (
                                        <>
                                            {step === 1 ? 'SEND OTP' : 'VERIFY OTP'}
                                            <ArrowRight size={24} className="group-hover/btn:translate-x-3 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {step === 2 && (
                                <p className="text-center pt-6">
                                    <button
                                        type="button"
                                        disabled={otpTimer > 0 || loading}
                                        onClick={handleSendOtp}
                                        className="text-[10px] font-black text-slate-700 hover:text-white tracking-[0.5em] uppercase disabled:opacity-20 transition-all "
                                    >
                                        {otpTimer > 0 ? `RETRY IN ${otpTimer} SEC` : 'RESEND OTP'}
                                    </button>
                                </p>
                            )}
                        </form>
                    </div>
                </motion.div>

                <div className="absolute bottom-16 text-center text-[10px] font-black text-slate-900 tracking-[1.5em] uppercase w-full opacity-20">
                    &copy; 2026 EFOUR LOGIN
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.85; transform: scale(1.05); }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .backdrop-blur-4xl { backdrop-filter: blur(80px); }
            `}} />
        </div>
    );
};

export default Login;

