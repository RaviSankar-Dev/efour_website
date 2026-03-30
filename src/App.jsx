import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import SplashScreen from './components/common/SplashScreen';

// Eager load all pages for instant navigation
import Home from './pages/Home';
import Dine from './pages/Dine';
import Login from './pages/Login';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import YourTickets from './pages/YourTickets';
import Scanner from './pages/Scanner';
import Success from './pages/Success';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Analytics from './pages/Analytics';
import Failed from './pages/Failed';
import Dome from './pages/Dome';


import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import useStore from './store/useStore';

/* ─────────────────────────────────────────────────────────────────────────────
   App-level splash logic
   ─────────────────────────────────────────────────────────────────────────────
   Strategy:
   1. Show <SplashScreen> immediately (blocks the uncanny blank flash).
   2. In parallel, the full React tree mounts and begins loading data.
   3. We fire "ready" when BOTH:
        a) the page has fired its `load` event (or 2 s have passed), AND
        b) at least 2 s have elapsed since mount (min branding time).
   4. SplashScreen fades out; the real site slides in seamlessly.
   5. Hard cap of 15 s is enforced inside <SplashScreen> itself.
───────────────────────────────────────────────────────────────────────────── */

const MIN_SPLASH_MS = 5000;   // Always show splash at least this long
const READY_WAIT_MS = 8000;   // If page load event fires, wait up to this long total before triggering done

function useSplashControl() {
    const [showSplash, setShowSplash] = useState(true);
    const mountTime = useRef(Date.now());
    const doneCalledRef = useRef(false);

    const triggerDone = () => {
        if (doneCalledRef.current) return;
        const elapsed = Date.now() - mountTime.current;
        const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
        setTimeout(() => {
            doneCalledRef.current = true;
            // Use the exposed global so SplashScreen can run its own exit anim
            if (window.__splashDone) window.__splashDone();
        }, remaining);
    };

    useEffect(() => {
        // Option A: window.onload (covers images, fonts, etc.)
        const handleLoad = () => {
            // After load, give a moment for React painting to settle
            setTimeout(triggerDone, 300);
        };

        if (document.readyState === 'complete') {
            // Already loaded (e.g. HMR re-render)
            setTimeout(triggerDone, 300);
        } else {
            window.addEventListener('load', handleLoad);
        }

        // Option B: fallback if load never fires quickly
        const fallback = setTimeout(triggerDone, READY_WAIT_MS);

        return () => {
            window.removeEventListener('load', handleLoad);
            clearTimeout(fallback);
        };
    }, []);

    const handleSplashFinish = () => setShowSplash(false);

    return { showSplash, handleSplashFinish };
}

function App() {
    const { showSplash, handleSplashFinish } = useSplashControl();
    const { refreshUser } = useStore();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            refreshUser();
        }
    }, [refreshUser]);

    return (
        <>
            {/* Splash is rendered ABOVE the app so it covers the loading state */}
            {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

            {/* The real app always mounts so data fetching starts immediately */}
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ScrollToTop />
                <React.Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        {/* Public Layout Routes */}
                        <Route element={<Layout><Outlet /></Layout>}>
                            <Route path="/" element={<Home />} />
                            <Route path="/dine" element={<Dine />} />
                            <Route path="/dome" element={<Dome />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/tickets" element={<YourTickets />} />
                            <Route path="/success" element={<Success />} />
                            <Route path="/failed" element={<Failed />} />
                            <Route path="/about" element={<About />} />

                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/terms" element={<Terms />} />
                        </Route>

                        {/* Admin Routes - Without public Layout to fix Navbar overlapping */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Dedicated Analytics Route */}
                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute role="admin">
                                    <Analytics />
                                </ProtectedRoute>
                            }
                        />

                        {/* Employee Scanner Route */}
                        <Route
                            path="/scanner"
                            element={
                                <ProtectedRoute role="employee">
                                    <Scanner />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </React.Suspense>
            </Router>
        </>
    );
}

export default App;

