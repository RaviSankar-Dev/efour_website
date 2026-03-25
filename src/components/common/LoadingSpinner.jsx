import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
            <style>
                {`
                    @keyframes spin-linear {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes pulse-core {
                        0%, 100% { transform: scale(0.8); opacity: 0.3; }
                        50% { transform: scale(1.1); opacity: 0.6; }
                    }
                    @keyframes blink-text {
                        0%, 100% { opacity: 0.2; }
                        50% { opacity: 0.5; }
                    }
                    .animate-spin-custom {
                        animation: spin-linear 2s linear infinite;
                    }
                    .animate-pulse-custom {
                        animation: pulse-core 2s ease-in-out infinite;
                    }
                    .animate-blink-custom {
                        animation: blink-text 2s ease-in-out infinite;
                    }
                `}
            </style>
            
            <div className="relative w-24 h-24">
                {/* Outer Cinematic Ring */}
                <div className="absolute inset-0 border-2 border-white/5 border-t-[#FF7A18] rounded-full shadow-[0_0_15px_rgba(255,122,24,0.3)] animate-spin-custom" />

                {/* Inner Pulsing Core */}
                <div className="absolute inset-4 bg-gradient-to-br from-[#FF7A18] to-[#FF4D00] rounded-full blur-md animate-pulse-custom" />

                {/* Center Symbol */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-1 h-8 bg-white rounded-full transform rotate-45" />
                    <div className="w-1 h-8 bg-white rounded-full transform -rotate-45" />
                </div>
            </div>

            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-[#AAB2C5] italic animate-blink-custom">
                Synchronizing Eluru...
            </p>
        </div>
    );
};

export default LoadingSpinner;
