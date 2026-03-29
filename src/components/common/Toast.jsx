import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import useStore from '../../store/useStore';

const Toast = () => {
    const { toast, hideToast } = useStore();

    return (
        <AnimatePresence>
            {toast.isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", damping: 20, stiffness: 150 }}
                    className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[1000] flex items-center gap-5 bg-[#0F172A]/80 backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/5 min-w-[320px] max-w-md"
                >
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {toast.type === 'success' ? (
                            <CheckCircle size={20} strokeWidth={2.5} />
                        ) : (
                            <AlertCircle size={20} strokeWidth={2.5} />
                        )}
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Notification</span>
                        <h4 className="font-bold text-sm text-slate-200 leading-tight">
                            {toast.message}
                        </h4>
                    </div>

                    <button
                        onClick={hideToast}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5"
                    >
                        <X size={16} />
                    </button>

                    {/* Progress Bar Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden rounded-b-2xl">
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 4, ease: "linear" }}
                            className={`h-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;

