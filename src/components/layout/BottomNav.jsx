import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, User, Ticket, Phone } from 'lucide-react';
import useStore from '../../store/useStore';

const BottomNav = () => {
    const { user } = useStore();

    return (
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-[#0F172A]/90 backdrop-blur-xl border border-white/5 z-50 pb-safe rounded-[2rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex justify-around items-center h-16 px-6">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-400'}`}
                >
                    <Home size={20} strokeWidth={2.5} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
                </NavLink>

                <NavLink
                    to="/dine"
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-400'}`}
                >
                    <div className="relative">
                        <Utensils size={20} strokeWidth={2.5} />
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                        </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Dine</span>
                </NavLink>

                <NavLink
                    to="/login"
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-400'}`}
                >
                    <User size={20} strokeWidth={2.5} />
                    <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-[60px]">{user ? (user.name?.split(' ')[0] || 'User') : 'Profile'}</span>
                </NavLink>

                <NavLink
                    to="/contact"
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-400'}`}
                >
                    <Phone size={20} strokeWidth={2.5} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Contact</span>
                </NavLink>

                {user && (
                    <NavLink
                        to="/tickets"
                        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-400'}`}
                    >
                        <Ticket size={20} strokeWidth={2.5} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Pass</span>
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default BottomNav;

