import React, { useEffect, useState, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   SplashScreen – Pure-CSS animated intro for Efour
   Shows a ride-themed scene for up to 15 s while the real site loads.
   Disappears as soon as the app signals it is ready (via onFinish).
───────────────────────────────────────────────────────────────────────────── */

const SplashScreen = ({ onFinish }) => {
    const [phase, setPhase] = useState('enter'); // 'enter' | 'show' | 'exit'
    const MAX_WAIT = 15000; // max 15 seconds
    const finishedRef = useRef(false);

    const triggerExit = () => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        setPhase('exit');
        setTimeout(onFinish, 900); // wait for fade-out transition
    };

    useEffect(() => {
        // Hard cap: hide after MAX_WAIT no matter what
        const hardCap = setTimeout(triggerExit, MAX_WAIT);
        return () => clearTimeout(hardCap);
    }, []);

    // Allow parent to call done() early
    useEffect(() => {
        window.__splashDone = triggerExit;
        return () => { delete window.__splashDone; };
    }, []);

    return (
        <>
            <style>{`
                /* ─── Splash root ─── */
                .spl-root {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    background: #070B14;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    transition: opacity 0.9s ease, transform 0.9s ease;
                }
                .spl-root.exit {
                    opacity: 0;
                    transform: scale(1.04);
                    pointer-events: none;
                }

                /* ─── Stars ─── */
                .spl-stars {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse at 50% 0%, rgba(91,140,255,0.12) 0%, transparent 60%),
                                radial-gradient(ellipse at 80% 80%, rgba(255,122,24,0.08) 0%, transparent 50%);
                }
                .star {
                    position: absolute;
                    border-radius: 50%;
                    background: white;
                    animation: twinkle var(--dur, 3s) ease-in-out infinite;
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.15; transform: scale(1); }
                    50%       { opacity: 1;    transform: scale(1.6); }
                }

                /* ─── Ground ─── */
                .spl-ground {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 22%;
                    background: linear-gradient(to top, #0d1420 0%, #0a1019 60%, transparent 100%);
                    border-top: 2px solid rgba(255,122,24,0.15);
                }
                .spl-road {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 90px;
                    background: #111827;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                .road-line {
                    height: 6px;
                    width: 80px;
                    background: rgba(255,122,24,0.5);
                    border-radius: 3px;
                    flex-shrink: 0;
                    margin-right: 60px;
                    animation: roadScroll 1.1s linear infinite;
                }
                @keyframes roadScroll {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-140px); }
                }

                /* ─── Bumper Car ─── */
                .car-wrap {
                    position: absolute;
                    bottom: 90px;
                    animation: carDrive var(--speed, 6s) linear infinite;
                }
                @keyframes carDrive {
                    from { transform: translateX(-220px); }
                    to   { transform: translateX(calc(100vw + 220px)); }
                }
                .car {
                    width: 160px;
                    height: 72px;
                    position: relative;
                }
                /* Body */
                .car-body {
                    position: absolute;
                    bottom: 18px;
                    left: 8px;
                    right: 8px;
                    height: 46px;
                    background: var(--car-color, #FF7A18);
                    border-radius: 28px 28px 12px 12px;
                    box-shadow: 0 0 24px var(--car-glow, rgba(255,122,24,0.6)),
                                inset 0 -4px 8px rgba(0,0,0,0.3);
                }
                /* Cabin top */
                .car-top {
                    position: absolute;
                    bottom: 52px;
                    left: 26px;
                    width: 92px;
                    height: 30px;
                    background: rgba(255,255,255,0.10);
                    border-radius: 20px 20px 0 0;
                    border: 1.5px solid rgba(255,255,255,0.18);
                    backdrop-filter: blur(4px);
                }
                /* Windshield sparkle */
                .car-top::after {
                    content: '';
                    position: absolute;
                    top: 5px;
                    left: 8px;
                    width: 30px;
                    height: 14px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.4), transparent);
                    border-radius: 8px;
                }
                /* Wheels */
                .wheel {
                    position: absolute;
                    bottom: 4px;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: #1e293b;
                    border: 3px solid #374151;
                    animation: spin 0.5s linear infinite;
                }
                .wheel::after {
                    content: '';
                    position: absolute;
                    inset: 4px;
                    border-radius: 50%;
                    background: #4b5563;
                }
                .wheel.left  { left: 12px; }
                .wheel.right { right: 12px; }
                @keyframes spin {
                    from { transform: rotate(0); }
                    to   { transform: rotate(360deg); }
                }
                /* Headlight */
                .headlight {
                    position: absolute;
                    right: 6px;
                    bottom: 28px;
                    width: 12px;
                    height: 10px;
                    background: #FBBF24;
                    border-radius: 50%;
                    box-shadow: 0 0 20px 10px rgba(251,191,36,0.35);
                }
                /* Exhaust puff */
                .puff {
                    position: absolute;
                    left: -10px;
                    bottom: 28px;
                    width: 14px;
                    height: 14px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 50%;
                    animation: puff var(--pd, 0.6s) ease-out infinite;
                }
                @keyframes puff {
                    0%   { transform: scale(0.5) translateX(0);   opacity: 0.8; }
                    100% { transform: scale(2)   translateX(-20px); opacity: 0; }
                }

                /* ─── Ferris Wheel ─── */
                .ferris-wrap {
                    position: absolute;
                    right: 8%;
                    bottom: 80px;
                }
                .ferris-wheel {
                    width: 200px;
                    height: 200px;
                    position: relative;
                    animation: ferrisSpin 8s linear infinite;
                }
                @keyframes ferrisSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .fw-rim {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 3px solid rgba(255,122,24,0.6);
                    box-shadow: 0 0 20px rgba(255,122,24,0.3);
                }
                .fw-spoke {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 50%;
                    height: 2px;
                    background: rgba(255,122,24,0.35);
                    transform-origin: left center;
                }
                .fw-gondola {
                    position: absolute;
                    width: 22px;
                    height: 26px;
                    background: var(--g-color, #FF7A18);
                    border-radius: 6px 6px 10px 10px;
                    top: 50%;
                    left: 50%;
                    transform-origin: center top;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    animation: gondolaSwing 8s linear infinite;
                    /* Counter-rotate to stay upright */
                }
                @keyframes gondolaSwing {
                    from { transform: rotate(0deg)   translateY(-96px) rotate(0deg); }
                    to   { transform: rotate(-360deg) translateY(-96px) rotate(360deg); }
                }
                .fw-hub {
                    position: absolute;
                    inset: 44%;
                    border-radius: 50%;
                    background: radial-gradient(circle, #FF7A18, #FF3D3D);
                    box-shadow: 0 0 20px rgba(255,122,24,0.8);
                }
                .fw-pole {
                    position: absolute;
                    bottom: -80px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 10px;
                    height: 80px;
                    background: #374151;
                    border-radius: 4px;
                }

                /* ─── Small Moon Ride (Columbus ride lookalike) ─── */
                .moon-wrap {
                    position: absolute;
                    left: 9%;
                    bottom: 80px;
                }
                .moon-pole {
                    width: 8px;
                    height: 130px;
                    background: #374151;
                    border-radius: 4px;
                    margin: 0 auto;
                    position: relative;
                }
                .moon-arm {
                    position: absolute;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100px;
                    height: 5px;
                    background: rgba(91,140,255,0.7);
                    border-radius: 3px;
                    transform-origin: center center;
                    animation: moonSwing 3s ease-in-out infinite;
                }
                @keyframes moonSwing {
                    0%   { transform: translateX(-50%) rotate(-40deg); }
                    50%  { transform: translateX(-50%) rotate(40deg); }
                    100% { transform: translateX(-50%) rotate(-40deg); }
                }
                .moon-seat {
                    position: absolute;
                    right: -14px;
                    top: -14px;
                    width: 28px;
                    height: 28px;
                    background: radial-gradient(circle, #FBBF24, #F97316);
                    border-radius: 50%;
                    box-shadow: 0 0 16px rgba(251,191,36,0.6);
                }
                .moon-seat::after {
                    content: '😄';
                    font-size: 14px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
                .moon-seat-left {
                    position: absolute;
                    left: -14px;
                    top: -14px;
                    width: 28px;
                    height: 28px;
                    background: radial-gradient(circle, #60A5FA, #3B82F6);
                    border-radius: 50%;
                    box-shadow: 0 0 16px rgba(96,165,250,0.6);
                }
                .moon-seat-left::after {
                    content: '🤩';
                    font-size: 14px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }

                /* ─── Floating balloons ─── */
                .balloon {
                    position: absolute;
                    animation: floatUp var(--fb, 7s) ease-in-out infinite var(--fd, 0s);
                }
                @keyframes floatUp {
                    0%   { transform: translateY(0)    rotate(-5deg); opacity: 1; }
                    50%  { transform: translateY(-30px) rotate(5deg);  opacity: 1; }
                    100% { transform: translateY(-60px) rotate(-5deg); opacity: 0; }
                }
                .balloon-body {
                    width: var(--bs, 36px);
                    height: calc(var(--bs, 36px) * 1.2);
                    background: var(--bc, #FF4B91);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    position: relative;
                    box-shadow: inset -6px -6px 12px rgba(0,0,0,0.2),
                                0 0 20px var(--bc-glow, rgba(255,75,145,0.4));
                }
                .balloon-body::after {
                    content: '';
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    border-top: 8px solid var(--bc, #FF4B91);
                }
                .balloon-string {
                    width: 1px;
                    height: 40px;
                    background: rgba(255,255,255,0.3);
                    margin: 0 auto;
                }

                /* ─── Logo / Brand center ─── */
                .spl-brand {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 10%;
                    animation: brandPulse 2.5s ease-in-out infinite;
                }
                @keyframes brandPulse {
                    0%, 100% { transform: scale(1); }
                    50%      { transform: scale(1.02); }
                }
                .spl-logo-ring {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    background: linear-gradient(#070B14, #070B14) padding-box,
                                linear-gradient(135deg, #FF7A18, #FF3D3D, #5B8CFF) border-box;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 40px rgba(255,122,24,0.35);
                    animation: ringRotate 4s linear infinite;
                    position: relative;
                }
                @keyframes ringRotate {
                    from { box-shadow: 0 0 40px rgba(255,122,24,0.35); }
                    50%  { box-shadow: 0 0 60px rgba(255,122,24,0.55), 0 0 80px rgba(91,140,255,0.2); }
                    to   { box-shadow: 0 0 40px rgba(255,122,24,0.35); }
                }
                .spl-logo-img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    object-fit: contain;
                    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .spl-tagline {
                    font-family: 'Outfit', sans-serif;
                    font-size: clamp(10px, 2vw, 13px);
                    font-weight: 900;
                    letter-spacing: 0.45em;
                    text-transform: uppercase;
                    color: #AAB2C5;
                    margin-top: 16px;
                    animation: fadeSlide 1s ease forwards 0.3s;
                    opacity: 0;
                }
                .spl-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: clamp(28px, 7vw, 56px);
                    font-weight: 900;
                    font-style: ;
                    letter-spacing: -0.03em;
                    background: linear-gradient(135deg, #FFFFFF 0%, #FF7A18 50%, #FF3D3D 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-top: 8px;
                    animation: fadeSlide 1s ease forwards 0.1s;
                    opacity: 0;
                }
                @keyframes fadeSlide {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ─── Progress bar ─── */
                .spl-progress-wrap {
                    position: relative;
                    z-index: 10;
                    width: min(340px, 80vw);
                    margin-bottom: 32px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .spl-progress-track {
                    width: 100%;
                    height: 4px;
                    background: rgba(255,255,255,0.07);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .spl-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #FF7A18, #FF3D3D);
                    border-radius: 4px;
                    box-shadow: 0 0 10px rgba(255,122,24,0.6);
                    animation: progressGrow 5.5s ease-out forwards;
                }
                @keyframes progressGrow {
                    0%   { width: 0%; }
                    30%  { width: 45%; }
                    60%  { width: 70%; }
                    85%  { width: 88%; }
                    100% { width: 96%; }
                }
                .spl-hint {
                    font-family: 'Outfit', sans-serif;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.35em;
                    text-transform: uppercase;
                    color: rgba(170,178,197,0.55);
                    animation: hintCycle 4s ease-in-out infinite;
                }
                @keyframes hintCycle {
                    0%, 100% { opacity: 0.55; }
                    50% { opacity: 1; }
                }

                /* ─── Ambient orbs ─── */
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    animation: orbPulse var(--op, 6s) ease-in-out infinite var(--od, 0s);
                    pointer-events: none;
                }
                @keyframes orbPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50%      { opacity: 0.6; transform: scale(1.2); }
                }

                /* ─── Neon light stripes on ground ─── */
                .neon-stripe {
                    position: absolute;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(255,122,24,0.5), transparent);
                    animation: neonPulse 2s ease-in-out infinite;
                }
                @keyframes neonPulse {
                    0%, 100% { opacity: 0.4; }
                    50%      { opacity: 1; }
                }
            `}</style>

            <div className={`spl-root${phase === 'exit' ? ' exit' : ''}`}>

                {/* ── Ambient orbs ── */}
                <div className="orb" style={{ width: 600, height: 600, background: 'rgba(255,122,24,0.07)', top: '-15%', left: '-10%', '--op': '7s', '--od': '0s' }} />
                <div className="orb" style={{ width: 500, height: 500, background: 'rgba(91,140,255,0.07)', bottom: '10%', right: '-10%', '--op': '9s', '--od': '2s' }} />

                {/* ── Stars ── */}
                <div className="spl-stars" />
                {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="star" style={{
                        width: Math.random() * 3 + 1,
                        height: Math.random() * 3 + 1,
                        top: `${Math.random() * 70}%`,
                        left: `${Math.random() * 100}%`,
                        '--dur': `${Math.random() * 3 + 2}s`,
                        animationDelay: `${Math.random() * 4}s`,
                    }} />
                ))}

                {/* ── Balloons ── */}
                {[
                    { bc: '#FF4B91', bcGlow: 'rgba(255,75,145,0.4)', bs: '38px', left: '12%', bottom: '35%', fd: '0s', fb: '7s' },
                    { bc: '#FF7A18', bcGlow: 'rgba(255,122,24,0.5)', bs: '32px', left: '20%', bottom: '40%', fd: '1.5s', fb: '8s' },
                    { bc: '#5B8CFF', bcGlow: 'rgba(91,140,255,0.45)', bs: '40px', left: '55%', bottom: '38%', fd: '0.8s', fb: '6s' },
                    { bc: '#22C55E', bcGlow: 'rgba(34,197,94,0.45)', bs: '28px', left: '65%', bottom: '42%', fd: '2s', fb: '9s' },
                    { bc: '#FBBF24', bcGlow: 'rgba(251,191,36,0.45)', bs: '34px', left: '78%', bottom: '36%', fd: '1s', fb: '7.5s' },
                ].map((b, i) => (
                    <div key={i} className="balloon" style={{ left: b.left, bottom: b.bottom, '--fb': b.fb, '--fd': b.fd }}>
                        <div className="balloon-body" style={{ '--bc': b.bc, '--bc-glow': b.bcGlow, '--bs': b.bs }} />
                        <div className="balloon-string" />
                    </div>
                ))}

                {/* ── Moon / Columbus ride ── */}
                <div className="moon-wrap">
                    <div className="moon-pole">
                        <div className="moon-arm">
                            <div className="moon-seat" />
                            <div className="moon-seat-left" />
                        </div>
                    </div>
                </div>

                {/* ── Ferris Wheel ── */}
                <div className="ferris-wrap">
                    <div className="ferris-wheel">
                        <div className="fw-rim" />
                        {/* 6 spokes */}
                        {[0, 30, 60, 90, 120, 150].map(deg => (
                            <div key={deg} className="fw-spoke" style={{ transform: `translateY(-50%) rotate(${deg}deg)` }} />
                        ))}
                        {/* 6 gondolas */}
                        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                            const colors = ['#FF7A18', '#5B8CFF', '#FF4B91', '#22C55E', '#FBBF24', '#FF3D3D'];
                            return (
                                <div key={deg} className="fw-gondola" style={{
                                    '--g-color': colors[i],
                                    animation: `gondolaSwing 8s linear infinite`,
                                    transform: `rotate(${deg}deg) translateY(-96px) rotate(${-deg}deg)`,
                                }} />
                            );
                        })}
                        <div className="fw-hub" />
                    </div>
                    <div className="fw-pole" />
                </div>

                {/* ── Center brand ── */}
                <div className="spl-brand">
                    <div className="spl-logo-ring">
                        <img src="/E4LOGOr.png" alt="Efour Logo" className="spl-logo-img" />
                    </div>
                    <div className="spl-title">EFOUR</div>
                    <div className="spl-tagline">Eat · Enjoy · Entertain</div>
                </div>

                {/* ── Progress bar ── */}
                <div className="spl-progress-wrap">
                    <div className="spl-progress-track">
                        <div className="spl-progress-fill" />
                    </div>
                    <div className="spl-hint">Gearing up your experience…</div>
                </div>

                {/* ── Ground ── */}
                <div className="spl-ground">
                    {/* neon stripes */}
                    <div className="neon-stripe" style={{ top: 0, left: 0, right: 0 }} />
                    <div className="neon-stripe" style={{ top: 8, left: '10%', right: '10%', animationDelay: '1s', opacity: 0.5 }} />

                    {/* Road */}
                    <div className="spl-road">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="road-line" style={{ animationDelay: `${i * -0.07}s` }} />
                        ))}
                    </div>
                </div>

                {/* ── Bumper Cars ── */}
                {[
                    { speed: '7s', delay: '0s', color: '#FF7A18', glow: 'rgba(255,122,24,0.6)', bottom: 92 },
                    { speed: '5s', delay: '-2.5s', color: '#5B8CFF', glow: 'rgba(91,140,255,0.6)', bottom: 92 },
                    { speed: '9s', delay: '-4s', color: '#FF4B91', glow: 'rgba(255,75,145,0.6)', bottom: 92 },
                ].map((c, i) => (
                    <div key={i} className="car-wrap" style={{
                        '--speed': c.speed,
                        animationDelay: c.delay,
                        bottom: c.bottom,
                    }}>
                        <div className="car">
                            <div className="car-body" style={{ '--car-color': c.color, '--car-glow': c.glow }} />
                            <div className="car-top" />
                            <div className="headlight" />
                            <div className="puff" style={{ '--pd': '0.7s' }} />
                            <div className="puff" style={{ '--pd': '1.1s', animationDelay: '0.35s' }} />
                            <div className="wheel left" />
                            <div className="wheel right" />
                        </div>
                    </div>
                ))}

            </div>
        </>
    );
};

export default SplashScreen;

