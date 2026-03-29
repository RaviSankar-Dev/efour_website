import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Maximize, Scan, CheckCircle2, AlertCircle, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import useStore from '../store/useStore';

const Scanner = ({ isEmbedded = false }) => {
    const navigate = useNavigate();
    const { showToast } = useStore();
    const [result, setResult] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [hasCameraError, setHasCameraError] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const scannerRef = useRef(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const stopScanner = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
                setIsScanning(false);
            } catch (err) {
                console.error("Failed to stop scanner", err);
            }
        }
    };

    const startScanner = async () => {
        setHasCameraError(false);
        setIsConfirmed(false);
        setResult('');

        try {
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode("qr-camera-element");
            }

            if (scannerRef.current.isScanning) {
                await scannerRef.current.stop();
            }

            const config = {
                qrbox: (viewWidth, viewHeight) => {
                    const size = Math.min(viewWidth, viewHeight) * 0.75;
                    return { width: size, height: size };
                },
                showTorchButtonIfSupported: true
            };

            // Simplified request to bypass ID discovery issues
            await scannerRef.current.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    setResult(decodedText);
                    stopScanner(); 
                },
                (errorMessage) => {
                    // Normal skip
                }
            );
            setIsScanning(true);
        } catch (err) {
            console.error("Hardware synchronization failed:", err);
            setHasCameraError(true);
            setIsScanning(false);
        }
    };

    const handleSystemReload = () => {
        window.location.reload();
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            startScanner();
        }, 500);

        return () => {
            clearTimeout(timer);
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(err => console.warn("Resource cleanup error:", err));
            }
        };
    }, []);

    const handleConfirm = () => {
        setIsConfirmed(true);
        showToast("Access Identity Verified Successfully!");
        // Here you would typically send the result to your backend
    };

    const handleReset = () => {
        setResult('');
        setIsConfirmed(false);
        startScanner();
    };

    return (
        <div className={isEmbedded ? "flex flex-col items-center justify-center font-sans text-white relative h-full" : "min-h-screen bg-[#070B14] flex flex-col items-center justify-center font-sans text-white p-6 relative overflow-hidden selection:bg-[#FF7A18]/30"}>
            {/* Background Architecture */}
            {!isEmbedded && (
                <>
                    <div className="absolute inset-0 matrix-grid opacity-5 pointer-events-none" />
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF7A18]/5 rounded-full blur-[150px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#5B8CFF]/5 rounded-full blur-[150px] pointer-events-none" />
                </>
            )}

            {/* Terminal Header */}
            {!isEmbedded && (
                <header className="fixed top-0 w-full p-6 flex justify-between items-center z-50 bg-[#070B14]/80 backdrop-blur-2xl border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Scan className="text-[#FF7A18]" size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-[0.4em] text-white leading-none mb-1">E4 Scanner</h1>
                            <p className="text-[8px] font-black text-[#AAB2C5]/40 uppercase tracking-widest">Protocol Ver: 2.026</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10 transition-all font-black uppercase tracking-widest text-[9px] ">
                        <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> EXIT TERMINAL
                    </button>
                </header>
            )}

            {/* Scan Interface Module */}
            <div className={`${isEmbedded ? 'mt-0' : 'mt-20'} w-full max-w-md relative z-10`}>
                <div className={`${isEmbedded ? 'bg-transparent border-none' : 'bg-[#0F172A]/40 border border-white/10'} backdrop-blur-3xl rounded-[3.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative`}>
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF7A18]/10 to-transparent blur-2xl" />

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-[#F8FAFC] mb-2">Ticket Scanner</h2>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A18] animate-pulse" />
                            <p className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em]">Operational Status: Active</p>
                        </div>
                    </div>
                    
                    {/* Camera Viewport Module */}
                    <div className="relative w-full aspect-square border-2 border-dashed border-[#AAB2C5]/20 rounded-[2.5rem] flex items-center justify-center overflow-hidden ring-offset-4 ring-offset-[#070B14] group transition-all bg-slate-900 shadow-inner">
                        
                        {/* Scanning Overlay Grid */}
                        {isScanning && !result && (
                            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#FF7A18]/0 via-[#FF7A18]/10 to-[#FF7A18]/0 animate-scan-line h-1/2" />
                                <div className="absolute inset-0 opacity-10 matrix-grid" />
                            </div>
                        )}

                        {!isScanning && !result && !hasCameraError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/40 backdrop-blur-md transition-all duration-700">
                                <div className="w-12 h-12 border-4 border-[#FF7A18] border-t-transparent rounded-full animate-spin mb-6" />
                                <p className="text-[#AAB2C5] text-[9px] font-black tracking-[0.4em] uppercase animate-pulse">Initializing Data Stream...</p>
                            </div>
                        )}
                        
                        {hasCameraError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-red-500/10 backdrop-blur-md p-8 text-center">
                                <AlertCircle className="text-red-500 mb-4" size={48} />
                                <p className="text-white text-xs font-black tracking-widest uppercase mb-2">Optical System Error</p>
                                <p className="text-[#AAB2C5]/60 text-[8px] uppercase mb-6 leading-relaxed max-w-[200px]">
                                    Camera access restricted. Ensure the connection is SECURE (HTTPS) and permissions are granted in browser settings.
                                </p>
                                <button onClick={handleSystemReload} className="px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FF7A18] hover:text-white transition-all">Relink Data Stream</button>
                            </div>
                        )}

                        {/* Result Confirmation View */}
                        {result && (
                            <div className={`absolute inset-0 z-30 flex flex-col items-center justify-center p-8 transition-all duration-500 ${isConfirmed ? 'bg-emerald-500/90' : 'bg-[#0F172A]/95'}`}>
                                {isConfirmed ? (
                                    <div className="text-center animate-in fade-in zoom-in duration-500">
                                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                            <CheckCircle2 className="text-emerald-500" size={48} />
                                        </div>
                                        <h3 className="text-white text-2xl font-black uppercase tracking-widest mb-2">Identity Verified</h3>
                                        <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Access Granted Successfully</p>
                                        <button onClick={handleReset} className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest transition-all">Next Subject</button>
                                    </div>
                                ) : (
                                    <div className="w-full text-center">
                                        <div className="w-20 h-20 bg-[#FF7A18]/10 border border-[#FF7A18]/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                            <ShieldCheck className="text-[#FF7A18]" size={32} />
                                        </div>
                                        <h3 className="text-white text-lg font-black uppercase tracking-[0.2em] mb-2">Subject Detected</h3>
                                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-8 break-all">
                                            <p className="text-[10px] font-black text-[#AAB2C5] tracking-widest uppercase mb-1">Payload Data:</p>
                                            <p className="text-xs font-mono text-[#FF7A18] font-bold">{result}</p>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <button 
                                                onClick={handleConfirm}
                                                className="w-full py-5 bg-white text-black hover:bg-[#FF7A18] hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-white/5 "
                                            >
                                                Confirm Scan
                                            </button>
                                            <button 
                                                onClick={handleReset}
                                                className="w-full py-4 text-[#AAB2C5] hover:text-white transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                            >
                                                <RefreshCcw size={14} /> Scan Again
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Camera Element */}
                        <div id="qr-camera-element" className="absolute inset-0 z-0 [&>video]:!object-cover [&>video]:!w-full [&>video]:!h-full border-none"></div>
                    </div>

                    <div className="mt-10 px-4">
                        <p className="text-[10px] text-[#AAB2C5]/40 leading-relaxed text-center font-black uppercase tracking-[0.2em] ">
                            System is searching for encrypted QR sequences. Keep subject stable within optical bounds.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scanner;

