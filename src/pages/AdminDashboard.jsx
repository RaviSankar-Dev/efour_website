import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { supabase } from '../supabaseClient';
import {
    LayoutDashboard, ShoppingCart, Calendar, Users, Package, Power,
    Plus, Trash2, Edit2, X, Check, Utensils, Gamepad2, Download,
    Monitor, Smartphone, Ticket, Menu, Search, Filter, ChevronDown,
    Bell, Settings, MoreVertical, ArrowUpRight, ArrowDownRight, IndianRupee, MapPin,
    BarChart2, RefreshCw, Upload, Home
} from 'lucide-react';
import { BASE_URL, fetchWithAuth } from '../utils/api';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import Scanner from './Scanner';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [headerDropdown, setHeaderDropdown] = useState(null); // 'notifications' | 'user' | null
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'on', 'off'
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [products, setProducts] = useState([]);
    const [employeesList, setEmployeesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchRides = useStore(state => state.fetchRides);

    // Dome Management States
    const [domeCapacity, setDomeCapacity] = useState(6);
    const [isDomeBookingOn, setIsDomeBookingOn] = useState(true);

    // Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '', category: '', price: '', description: '', image: '', stall: '', type: '', status: 'on', cuisine: 'General', contactNumber: '', menuImages: []
    });

    // Pagination States
    const [recentTxPage, setRecentTxPage] = useState(1);
    const [bookingsPage, setBookingsPage] = useState(1);
    const [domeBookingsPage, setDomeBookingsPage] = useState(1);
    const [liveOrdersPage, setLiveOrdersPage] = useState(1);
    const [analyticsBookingTab, setAnalyticsBookingTab] = useState('all'); // 'all' | 'rides' | 'events'

    const [analyticsData, setAnalyticsData] = useState(null);
    const [platformStats, setPlatformStats] = useState({ web: null, mobile: null });
    const [trendsData, setTrendsData] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsError, setAnalyticsError] = useState(null);

    const token = localStorage.getItem('token');

    // --- Data Fetching ---
    const fetchData = async () => {
        try {
            const currentToken = localStorage.getItem('token');
            const headers = { 'x-auth-token': currentToken, 'Authorization': `Bearer ${currentToken}` };
            // In dev: use Vite proxy (`/api` -> backend) to avoid CORS.
            // In prod: use configured backend URL (or fallback to the deployed backend).

            // Parallel Fetch – E4 orders, rides, dine, and employees
            const [ridesRes, dineRes, empRes, ordersRes, bookingsRes] = await Promise.all([
                fetchWithAuth(`/api/e4/rides?all=true`),
                fetchWithAuth(`/api/e4/dine?all=true`),
                fetchWithAuth(`/api/employees/e4`).catch(() => ({ ok: false })),
                fetchWithAuth(`/api/orders/e4/all`).catch(() => ({ ok: false })),
                fetchWithAuth(`/api/bookings/e4`).catch(() => ({ ok: false }))
            ]);

            // Process Rides
            let rideProducts = [];
            if (ridesRes.ok) {
                const data = await ridesRes.json();
                rideProducts = Array.isArray(data) ? data.filter(Boolean).map(item => ({
                    ...item,
                    id: item._id || item.id,
                    image: item.image ? decodeURIComponent(item.image) : '',
                    description: item.desc || item.description
                })) : [];
            }

            // Process Dine Items
            let dineProducts = [];
            if (dineRes.ok) {
                const data = await dineRes.json();
                dineProducts = Array.isArray(data)
                    ? data.filter(Boolean).map(item => ({
                        ...item,
                        id: item._id || item.id,
                        image: item.image ? decodeURIComponent(item.image) : '',
                        category: item.category || 'food',
                        description: item.desc || item.description
                    }))
                    : [];
            }

            setProducts((rideProducts || []).concat(dineProducts || []).filter(Boolean));

            // Fetch employees if endpoint is valid
            if (empRes && empRes.ok) {
                try {
                    const empData = await empRes.json();
                    setEmployeesList(Array.isArray(empData) ? empData : []);
                } catch (e) {
                    console.error('Employee parse error', e);
                }
            }

            // Sync Orders and Bookings for Analytics
            if (ordersRes && ordersRes.ok) {
                try {
                    const ordersData = await ordersRes.json();
                    setOrders(Array.isArray(ordersData) ? ordersData : (ordersData.orders || []));
                } catch (e) { console.error('Orders parse error', e); }
            }

            if (bookingsRes && bookingsRes.ok) {
                try {
                    const bData = await bookingsRes.json();
                    setBookings(Array.isArray(bData) ? bData : (bData.bookings || []));
                } catch (e) { console.error('Bookings parse error', e); }
            }


        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // --- Analytics endpoint fetch ---
    const ANALYTICS_URL = '/api/analytics/e4/dashboard';

    const fetchAnalytics = async () => {
        setAnalyticsLoading(true);
        setAnalyticsError(null);
        try {
            const [res, statsRes, trendsRes] = await Promise.all([
                fetchWithAuth(ANALYTICS_URL),
                fetchWithAuth(`/api/analytics/e4/stats`).catch(() => null),
                fetchWithAuth(`/api/analytics/trends`).catch(() => null)
            ]);

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setAnalyticsData(json);

            if (statsRes && statsRes.ok) {
                const statsJson = await statsRes.json();
                setPlatformStats({
                    web: typeof statsJson.web === 'number' ? statsJson.web : null,
                    mobile: typeof statsJson.mobile === 'number' ? statsJson.mobile : null
                });
            }

            if (trendsRes && trendsRes.ok) {
                const trendsJson = await trendsRes.json();
                setTrendsData(trendsJson);
            }
        } catch (err) {
            console.error('Analytics fetch error:', err);
            setAnalyticsError(err.message);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchAnalytics(); // fetch analytics on mount
    }, []);

    // --- Search Filtering ---
    const allMergedBookings = [...(bookings || []), ...(orders || [])]
        .filter(b => b && (b.category === 'play' || b.category === 'event' || b.facility || (b.items && JSON.stringify(b.items).toLowerCase().includes('ride'))))
        .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));

    const domeBookings = [...(bookings || []), ...(orders || [])]
        .filter(b => {
             const itemsStr = JSON.stringify(b.items || b.facility || '').toLowerCase();
             return itemsStr.includes('dome');
        })
        .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));

    const filteredOrders = (allMergedBookings || []).filter(o =>
        o && (
            (o.userDetails?.name || o.name || o.userId || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.id || o._id || '').toString().includes(searchQuery)
        )
    );
    const filteredBookings = (allMergedBookings || []).filter(b =>
        b && (
            (b.userDetails?.name || b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (b._id || b.id || '').toString().includes(searchQuery)
        )
    );

    const filteredDomeBookings = (domeBookings || []).filter(b =>
        b && (
            (b.userDetails?.name || b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (b._id || b.id || '').toString().includes(searchQuery)
        )
    );
    const filteredProducts = (products || []).filter(p => {
        if (!p) return false;
        const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const itemStatus = (p.status || (p.open === false ? 'off' : 'on')).toLowerCase();
        const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });


    // --- CRUD Operations ---
    const handleDelete = async (id, type) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            if (type === 'product') {
                const currentToken = localStorage.getItem('token');
                if (!currentToken) {
                    alert('Admin token missing. Please login again.');
                    window.location.href = '/login';
                    return;
                }

                const item = products.find(p => p.id === id || p._id === id);
                const category = (item?.category || '').toLowerCase();
                const isRide = category === 'play';
                const isEvent = category === 'event';
                const endpoint = isRide ? `/api/e4/rides/${id}` : isEvent ? `/api/events/${id}` : `/api/e4/dine/${id}`;

                const res = await fetchWithAuth(endpoint, { method: 'DELETE' });
                if (res.status === 401) {
                    alert('Session expired or invalid token. Please log in again.');
                    localStorage.clear();
                    window.location.href = '/login';
                    return;
                }
                if (res.ok) {
                    setProducts(prev => prev.filter(p => p.id !== id && p._id !== id));
                } else {
                    console.error('Delete failed:', await res.text());
                    alert('Failed to delete item.');
                }
            } else if (type === 'booking' || type === 'order') {
                const endpoint = type === 'booking' ? `/api/bookings/${id}` : `/api/orders/${id}`;
                const res = await fetchWithAuth(endpoint, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    if (type === 'booking') setBookings(prev => prev.filter(b => b._id !== id && b.id !== id));
                    setOrders(prev => prev.filter(o => o._id !== id && o.id !== id));
                }
            }
        } catch (err) { console.error(err); alert('Failed to delete'); }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const currentToken = localStorage.getItem('token');
            if (!currentToken) {
                alert('Admin token missing. Please login again.');
                window.location.href = '/login';
                return;
            }

            const isRide = (formData.category || '').toLowerCase() === 'play';
            const isEvent = (formData.category || '').toLowerCase() === 'event';
            const editId = editingItem?._id || editingItem?.id;

            if (isRide) {
                const payload = {
                    id: editId,
                    name: formData.name,
                    price: typeof formData.price === 'string' ? Number(formData.price) : formData.price,
                    image: formData.image,
                    images: formData.image ? [formData.image] : [],
                    desc: formData.description || '',
                    status: (formData.status || 'on').toString().toLowerCase(),
                    category: 'play',
                    ageGroup: formData.ageGroup || editingItem?.ageGroup || 'All',
                    type: formData.type || 'thrill',
                };

                const res = await fetchWithAuth(editId ? `/api/e4/rides/${editId}` : `/api/e4/rides`, {
                    method: editId ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload),
                });

                if (res.status === 401) {
                    return; // fetchWithAuth already handles 401 redirect/dispatch
                }
                if (!res.ok) {
                    const text = await res.text();
                    console.error('Ride save failed:', text);
                    try {
                        const errData = JSON.parse(text);
                        if (isRide && errData.message && errData.message.includes('column') && errData.message.includes('does not exist')) {
                            alert(`CRITICAL BACKEND ERROR:\nThe backend code running on Local Server is trying to update a column named "id" which doesn't exist in Supabase (it uses "_id").\n\nPlease ask your backend developer to edit the Node.js API code, changing ".eq('id', req.params.id)" to ".eq('_id', req.params.id)" inside the PUT route.`);
                        } else {
                            alert(`Failed to save. (${res.status}): ${errData.message || 'Unknown error'}`);
                        }
                    } catch (e) {
                        alert(`Network error. Status: ${res.status}. Please check backend logs.`);
                    }
                    return;
                }
            } else if (isEvent) {
                const payload = {
                    id: editId,
                    name: formData.name,
                    price: typeof formData.price === 'string' ? Number(formData.price) : formData.price,
                    image: formData.image,
                    capacity: formData.capacity || '10-20 People',
                    start_time: formData.start_time ? new Date(formData.start_time).toISOString() : new Date().toISOString(),
                    end_time: formData.end_time ? new Date(formData.end_time).toISOString() : new Date(Date.now() + 86400000).toISOString(),
                    location: 'E4',
                    status: formData.status || 'active',
                };

                const res = await fetchWithAuth(editId ? `/api/events/${editId}` : `/api/events`, {
                    method: editId ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload),
                });

                if (res.status === 401) return;
                if (!res.ok) {
                    console.error('Event save failed:', await res.text());
                    alert('Failed to save event. Check API + token.');
                    return;
                }
            } else {
                // Dine item (best-effort wiring; backend expects /api/e4/dine)
                const payload = {
                    ...(editId ? { id: editId } : {}),
                    name: formData.name || '',
                    price: typeof formData.price === 'string' ? Number(formData.price) : formData.price || 0,
                    image: formData.image || '',
                    menuImages: formData.menuImages || [],
                    category: (formData.category?.toLowerCase() === 'food' || !formData.category) ? 'dine' : formData.category.toLowerCase(),
                    cuisine: formData.cuisine || 'General',
                    contactNumber: formData.contactNumber || '',
                    stall: formData.stall || '',
                    open: typeof formData.open === 'boolean' ? formData.open : true,
                    status: formData.status === 'off' ? 'off' : 'on'
                };

                console.log('Sending Verified Dine Payload:', JSON.stringify(payload, null, 2));

                const res = await fetchWithAuth(editId ? `/api/e4/dine/${editId}` : `/api/e4/dine`, {
                    method: editId ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload),
                });

                if (res.status === 401) return;
                if (!res.ok) {
                    console.error('Dine save failed:', await res.text());
                    alert('Failed to save dine item. Check API + token.');
                    return;
                }
            }

            await fetchData();
            // Force refresh the global store so main site sees changes immediately
            fetchRides(true);
            
            setIsModalOpen(false);
            setEditingItem(null);
            setFormData({ name: '', category: '', price: '', description: '', image: '', stall: '', type: '' });
        } catch (err) { alert(err.message); }
    };

    // Image Upload Handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File too large. Max 5MB allowed.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMenuImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                if (file.size > 5 * 1024 * 1024) {
                    reject(new Error(`File ${file.name} is too large. Max 5MB.`));
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(uploadPromises)
            .then(base64Images => {
                setFormData(prev => ({
                    ...prev,
                    menuImages: [...(prev.menuImages || []), ...base64Images]
                }));
            })
            .catch(err => alert(err.message));
    };

    const removeMenuImage = (index) => {
        setFormData(prev => ({
            ...prev,
            menuImages: prev.menuImages.filter((_, i) => i !== index)
        }));
    };


    // --- Helpers (match backend API: orders use amount, bookings use totalPrice) ---
    // Only count paid/confirmed orders in total revenue
    const isPaid = (o) => ['success', 'confirmed', 'paid', 'captured'].includes((o.status || o.orderStatus || '').toLowerCase());
    const totalRevenue = orders.filter(isPaid).reduce((acc, curr) => acc + Number(curr.amount ?? curr.totalAmount ?? 0), 0) + 
                         bookings.filter(isPaid).reduce((acc, curr) => acc + Number(curr.totalPrice ?? 0), 0);
    const activeRidesCount = products.filter(p => p.category === 'play' && (p.status || 'on').toLowerCase() === 'on').length;
    const tabs = [
        { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
        { id: 'domes', label: 'Domes', icon: MapPin }, // Added Domes Tab
        { id: 'orders', label: 'Transactions', icon: ShoppingCart },
        { id: 'rides', label: 'Rides', icon: Gamepad2 },
        { id: 'dine', label: 'Dining', icon: Utensils },
        { id: 'employees', label: 'Employees', icon: Users },
    ];

    const handleEmployeeSubmit = async (e) => {
        e.preventDefault();
        try {
            const currentToken = localStorage.getItem('token');
            const isEditing = editingItem != null;
            const empId = isEditing ? (editingItem._id || editingItem.id) : null;
            const endpoint = isEditing ? `/api/employees/e4/${empId}` : `/api/employees/e4`;

            const res = await fetchWithAuth(endpoint, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: formData.name, mobile: formData.category })
            });

            if (!res.ok) throw new Error(await res.text());
            await fetchData();
            setIsModalOpen(false);
            setFormData({ name: '', category: '', price: '', description: '', image: '', stall: '', type: '', status: 'on' });
        } catch (err) {
            alert('Failed to save employee: ' + err.message);
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm("Delete this employee?")) return;
        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetchWithAuth(`/api/employees/e4/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setEmployeesList(prev => prev.filter(e => e._id !== id && e.id !== id));
            } else throw new Error(await res.text());
        } catch (err) {
            alert("Failed to delete employee: " + err.message);
        }
    };

    const handleToggleStatus = async (item) => {
        const currentToken = localStorage.getItem('token');
        if (!currentToken) {
            alert('Please log in again (admin token missing).');
            window.location.href = '/login';
            return;
        }
        try {
            const id = (item._id || item.id || '').toString();
            if (!id) return;

            const isRide = (item.category || '').toLowerCase() === 'play';
            const currentStatus = (item.status || (item.open === false ? 'off' : 'on')).toLowerCase();
            const newStatus = currentStatus === 'on' ? 'off' : 'on';

            let payload;
            let endpoint;

            if (isRide) {
                payload = {
                    name: item.name || '',
                    price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
                    image: item.image || '',
                    desc: (item.description || item.desc || '').toString(),
                    status: newStatus,
                    category: 'play',
                    ageGroup: (item.ageGroup || 'All').toString(),
                };
                endpoint = `/api/e4/rides/${id}`;
            } else {
                payload = {
                    name: item.name || '',
                    price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
                    image: item.image || '',
                    category: item.category || 'food',
                    stall: item.stall || '',
                    status: newStatus === 'on' ? 'active' : 'inactive',
                    open: newStatus === 'on',
                    menuImages: item.menuImages || [],
                };
                endpoint = `/api/e4/dine/${id}`;
            }

            const res = await fetchWithAuth(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                alert('Session expired or invalid token. Please log out and log in again.');
                localStorage.clear();
                window.location.href = '/login';
                return;
            }

            const text = await res.text();
            if (!res.ok) {
                console.error('Status update failed', res.status, text);
                try {
                    const errData = JSON.parse(text);
                    if (errData.message && errData.message.includes('column') && errData.message.includes('does not exist')) {
                        alert(`CRITICAL BACKEND ERROR:\nThe backend code seems to have an issue with the database columns.\n\nPlease ask your backend developer to verify the PUT route for ${isRide ? 'rides' : 'dine'}.`);
                    } else {
                        alert(`Could not update status (${res.status}). Server message: ${errData.message || 'Unknown error'}`);
                    }
                } catch (e) {
                    alert(`Network error. Status: ${res.status}. Please check backend logs.`);
                }
                return;
            }

            setProducts(prev =>
                prev.map(p => {
                    if (!p) return p;
                    const pId = (p._id || p.id || '').toString();
                    return (pId === id)
                        ? { ...p, status: newStatus, open: newStatus === 'on' }
                        : p;
                })
            );
            
            // Sync with global store
            fetchRides(true);
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Network error. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#070B14] font-sans text-[#F8FAFC] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[#FF7A18]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#5B8CFF]/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[35] md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* --- SIDEBAR --- */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0F172A]/80 backdrop-blur-2xl border-r border-white/10 transform transition-all duration-500 ease-in-out md:translate-x-0 md:sticky md:top-0 h-screen shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-5 p-8 h-28 border-b border-white/5">
                        <img src="/E4LOGOr.png" alt="Logo" className="w-full h-full object-contain brightness-110 group-hover:scale-110 transition-transform duration-500" />
                    <div>
                        <p className="text-[10px] font-black text-[#FF7A18] uppercase tracking-[0.4em] leading-none mb-1">Admin Panel</p>

                    </div>
                </div>

                <nav className="p-6 space-y-3 overflow-y-auto h-[calc(100vh-180px)]">
                    <p className="px-4 py-3 text-[10px] font-black text-[#AAB2C5]/30 uppercase tracking-[0.3em] mb-2 ">Main Sections</p>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group ${activeTab === tab.id
                                ? 'bg-white/10 text-white border border-white/20 shadow-xl'
                                : 'text-[#AAB2C5] hover:bg-white/5 hover:text-white border border-transparent'
                                }`}
                        >
                            <div className="w-10 flex items-center justify-start">
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-[#FF7A18]' : 'text-[#AAB2C5] group-hover:text-white transition-colors'} />
                            </div>
                            <span className="flex-grow text-left">{tab.label}</span>
                            {activeTab === tab.id && <motion.div layout className="w-1.5 h-1.5 rounded-full bg-[#FF7A18] shadow-[0_0_8px_#FF7A18]" />}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-6 right-6 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                        className="flex items-center justify-center gap-3 w-full py-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.3em] "
                    >
                        <Power size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* TOP BAR */}
                <header className="h-20 md:h-24 px-6 md:px-8 flex items-center justify-between z-20 sticky top-0 bg-[#070B14]/90 backdrop-blur-xl border-b border-white/5 w-full">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-3 text-[#AAB2C5] hover:bg-white/5 rounded-2xl transition-all">
                        <Menu size={24} />
                    </button>

                    <div className="hidden md:flex items-center bg-white/5 rounded-2xl px-6 py-3.5 w-[500px] border border-white/10 focus-within:border-[#FF7A18]/50 focus-within:bg-white/10 transition-all shadow-inner group">
                        <Search size={18} className="text-[#AAB2C5] group-focus-within:text-[#FF7A18] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search everything..."
                            className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest ml-4 w-full placeholder-[#AAB2C5]/30 text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-6 relative">
                        <Link
                            to="/"
                            className="flex items-center gap-3 px-5 py-3.5 text-[#AAB2C5] hover:bg-white/5 hover:text-white rounded-2xl transition-all border border-white/5 bg-white/2 group"
                        >
                            <Home size={18} className="group-hover:text-[#FF7A18] transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden lg:block ">Go to Site</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setHeaderDropdown(prev => prev === 'notifications' ? null : 'notifications')}
                            className="relative p-3.5 text-[#AAB2C5] hover:bg-white/5 hover:text-white rounded-2xl transition-all border border-white/5"
                        >
                            <Bell size={20} />
                            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#FF7A18] rounded-full border border-[#070B14] shadow-[0_0_8px_#FF7A18]" />
                        </button>
                        {headerDropdown === 'notifications' && (
                            <div className="glass-card absolute right-0 top-full mt-4 w-80 rounded-[2rem] border border-white/10 shadow-3xl py-4 z-50 overflow-hidden">
                                <p className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#AAB2C5]/40 ">No Notifications</p>
                            </div>
                        )}

                        <div className="relative flex items-center gap-4 pl-6 border-l border-white/10">
                            <button
                                type="button"
                                onClick={() => setHeaderDropdown(prev => prev === 'user' ? null : 'user')}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF7A18]/20 to-[#5B8CFF]/10 text-white flex items-center justify-center font-black text-xs border border-white/10 group-hover:border-[#FF7A18]/50 transition-all ">AD</div>
                                <div className="hidden md:block text-left">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F8FAFC] ">Eluru Admin</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-[#AAB2C5]/50">Admin Account</p>
                                </div>
                                <ChevronDown size={16} className={`text-[#AAB2C5] hidden md:block transition-transform duration-500 ${headerDropdown === 'user' ? 'rotate-180 text-white' : ''}`} />
                            </button>
                            {headerDropdown === 'user' && (
                                <div className="glass-card absolute right-0 top-full mt-4 w-56 rounded-[1.5rem] border border-white/10 shadow-3xl py-2 z-50">
                                    <button
                                        type="button"
                                        onClick={() => { setHeaderDropdown(null); localStorage.clear(); window.location.href = '/'; }}
                                        className="flex items-center gap-3 w-full px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-white/5 transition-all "
                                    >
                                        <Power size={18} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {headerDropdown && (
                        <div
                            className="fixed inset-0 z-[45]"
                            aria-hidden="true"
                            onClick={() => setHeaderDropdown(null)}
                        />
                    )}
                </header>

                {/* DASHBOARD CONTENT */}
                <div className="flex-1 p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-7xl mx-auto"
                        >
                            {/* Header Section */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-[#FF7A18]">
                                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl animate-pulse-subtle">
                                            {React.createElement(tabs.find(t => t.id === activeTab)?.icon || LayoutDashboard, { size: 24 })}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] ">Admin Panel</span>
                                    </div>
                                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none transform ">
                                        {activeTab}
                                    </h2>
                                    <p className="text-[#AAB2C5] text-xs font-black uppercase tracking-widest max-w-lg opacity-70">
                                        Manage your {activeTab} here. All data is safe.
                                    </p>

                                    {(activeTab === 'rides' || activeTab === 'dine') && (
                                        <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-xl w-fit mt-8">
                                            {['all', 'on', 'off'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setStatusFilter(s)}
                                                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${statusFilter === s ? 'text-white' : 'text-[#AAB2C5] hover:text-[#F8FAFC]'}`}
                                                >
                                                    {statusFilter === s && (
                                                        <motion.div
                                                            layout
                                                            className="absolute inset-0 bg-white/10 border border-white/10 rounded-2xl shadow-xl"
                                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}
                                                    <span className="relative z-10">{s === 'all' ? 'All' : s === 'on' ? 'Open' : 'Closed'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => fetchData()}
                                        className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center bg-white/5 border border-white/10 text-[#AAB2C5] hover:text-[#FF7A18] hover:bg-white/10 transition-all group/refresh shadow-xl"
                                        title="Refresh Data"
                                    >
                                        <RefreshCw size={20} className="group-hover/refresh:rotate-180 transition-transform duration-700" />
                                    </button>
                                    {(activeTab === 'rides' || activeTab === 'dine') && (
                                        <button
                                            onClick={() => {
                                                setEditingItem(null);
                                                setFormData({
                                                    name: '', category: activeTab === 'rides' ? 'play' : 'Dine',
                                                    price: '', description: '', image: '', stall: '', type: '', status: 'on', capacity: '', start_time: '', end_time: '', 
                                                    cuisine: 'General', contactNumber: '', menuImages: []
                                                });
                                                setIsModalOpen(true);
                                            }}
                                            className="btn-premium px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl flex items-center gap-4 group/add "
                                        >
                                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                                            {activeTab === 'rides' ? 'Add Ride' : 'Add Dine'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* ═══════════════════════════════════════════════
                                ANALYTICS VIEW — redesigned to match screenshot
                            ═══════════════════════════════════════════════ */}
                            {activeTab === 'analytics' && (() => {
                                /* ═══════════════════════════════════════════════════════
                                   Pull data from the real analytics endpoint.
                                   API shape (expected):
                                   {
                                     today: { revenue, totalOrders, paidOrders, date },
                                     last14Days: [{ date, revenue }],
                                     stats: { totalRides, ridesActive, ridesOffline, dineItems, totalRevenue },
                                     platform: { web, mobile, total },
                                     rideStatus: { online, offline, total },
                                     todayOrders: [...],
                                     recentBookings: [...]
                                   }
                                   Falls back to locally-fetched state when API is loading/failed.
                                ═══════════════════════════════════════════════════════ */
                                const ad = analyticsData; // shorthand

                                /* ── TODAY ── */
                                const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true });
                                const todayObj = new Date();
                                const todayLocalOrders = [...(orders || []), ...(bookings || [])].filter(o => o && new Date(o.createdAt || o.date || 0).toDateString() === todayObj.toDateString());
                                
                                const todayRevenue = ad?.today?.revenue ?? ad?.dailySales?.todayRevenue ?? ad?.todayRevenue ?? 
                                    todayLocalOrders.filter(o => isPaid(o)).reduce((s, o) => s + Number(o.amount ?? o.totalAmount ?? o.totalPrice ?? 0), 0);
                                
                                const todayPaid = ad?.today?.paidOrders ?? ad?.dailySales?.paidOrders ?? ad?.paidOrders ?? 
                                    todayLocalOrders.filter(o => isPaid(o)).length;
                                
                                const todayOrderCount = ad?.today?.totalOrders ?? ad?.dailySales?.totalOrders ?? ad?.totalOrders ?? 
                                    todayLocalOrders.length;

                                /* ── 14-DAY CHART ──
                                   Try API-provided array first; fall back to computing from local orders */
                                let last14 = [];
                                const rawChart = trendsData ?? ad?.last14Days ?? ad?.salesChart ?? ad?.chart14Days ?? ad?.revenueByDay ?? null;
                                if (Array.isArray(rawChart) && rawChart.length > 0) {
                                    last14 = rawChart.map((d, i) => ({
                                        label: d.label || (i === rawChart.length - 1 ? 'Today' : (d.date ? new Date(d.date).getDate().toString().padStart(2, '0') : String(i + 1))),
                                        val: d.revenue ?? d.amount ?? d.total ?? d.value ?? 0,
                                    }));
                                } else {
                                    /* local fallback */
                                    const allLocal = [...orders, ...bookings].filter(Boolean);
                                    last14 = Array.from({ length: 14 }, (_, i) => {
                                        const d = new Date(); d.setDate(d.getDate() - (13 - i));
                                        const label = i === 13 ? 'Today' : d.getDate().toString().padStart(2, '0');
                                        const val = allLocal
                                            .filter(o => new Date(o.createdAt || o.date || 0).toDateString() === d.toDateString())
                                            .filter(o => ['success', 'confirmed', 'paid', 'captured'].includes((o.status || o.orderStatus || '').toLowerCase()))
                                            .reduce((s, o) => s + (o.amount ?? o.totalAmount ?? o.totalPrice ?? 0), 0);
                                        return { label, val };
                                    });
                                }
                                const chartMax = Math.max(...last14.map(d => d.val), 1);

                                /* ── STATS ── */
                                const totalRidesCount = ad?.stats?.totalRides ?? ad?.rideStats?.total ?? products.filter(p => p.category === 'play').length;
                                const ridesOnCount = ad?.stats?.ridesActive ?? ad?.rideStats?.online ?? products.filter(p => p.category === 'play' && (p.status || 'on').toLowerCase() === 'on').length;
                                const ridesOffCount = ad?.stats?.ridesOffline ?? ad?.rideStats?.offline ?? (totalRidesCount - ridesOnCount);
                                const dineCount = ad?.stats?.dineItems ?? products.filter(p => p.category !== 'play').length;
                                const e4Revenue = Number(ad?.stats?.totalRevenue ?? ad?.totalRevenue ?? totalRevenue);

                                /* ── PLATFORM ── */
                                const webSessions = platformStats.web !== null ? platformStats.web : (ad?.platform?.web ?? ad?.sessions?.web ?? 0);
                                const mobileSessions = platformStats.mobile !== null ? platformStats.mobile : (ad?.platform?.mobile ?? ad?.sessions?.mobile ?? 0);
                                const totalSessions = webSessions + mobileSessions || ad?.platform?.total || ad?.sessions?.total || 0;
                                const webPct = totalSessions > 0 ? Math.round((webSessions / totalSessions) * 100) : 0;
                                const mobilePct = totalSessions > 0 ? 100 - webPct : 0;

                                /* ── TODAY'S ORDERS TABLE ── */
                                const todayOrdersArr = (() => {
                                    if (Array.isArray(ad?.todayOrders) && ad.todayOrders.length > 0) return ad.todayOrders;
                                    if (Array.isArray(ad?.orders?.today)) return ad.orders.today;
                                    /* local fallback */
                                    const today = new Date();
                                    return orders.filter(o => new Date(o.createdAt || o.date || 0).toDateString() === today.toDateString());
                                })();

                                /* ── BOOKINGS TABLE ── */
                                const allBookings = (() => {
                                    if (Array.isArray(ad?.recentBookings) && ad.recentBookings.length > 0) return ad.recentBookings;
                                    if (Array.isArray(ad?.bookings)) return ad.bookings;
                                    /* local fallback */
                                    return [...orders, ...bookings]
                                        .filter(Boolean)
                                        .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
                                })();
                                const bookingRevTotal = Number(ad?.stats?.totalRevenue ?? allBookings.reduce((s, b) => s + Number(b.amount ?? b.totalAmount ?? b.totalPrice ?? 0), 0));

                                /* ── CSV EXPORT ── */
                                const handleExportCSV = () => {
                                    const rows = [['Order ID', 'Date', 'Items', 'Amount', 'Status'],
                                    ...allBookings.map(b => [
                                        `#${(b._id || b.id || '').toString().slice(-6)}`,
                                        new Date(b.createdAt || b.date || 0).toLocaleDateString(),
                                        b.items?.map(i => `${i.quantity || 1}x ${i.name}`).join(', ') || b.facility || '',
                                        b.amount ?? b.totalAmount ?? b.totalPrice ?? 0,
                                        b.status || b.orderStatus || 'confirmed'
                                    ])
                                    ];
                                    const csv = rows.map(r => r.join(',')).join('\n');
                                    const a = document.createElement('a');
                                    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
                                    a.download = 'efour_analytics.csv'; a.click();
                                };

                                return (
                                    <div className="space-y-6">

                                        {/* ── LOADING / ERROR banner ── */}
                                        {analyticsLoading && (
                                            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#FF7A18]/10 border border-[#FF7A18]/20 text-sm font-semibold text-[#FF7A18]">
                                                <RefreshCw size={14} className="animate-spin" /> Loading sales data...
                                            </div>
                                        )}
                                        {analyticsError && !analyticsLoading && (
                                            <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-semibold text-red-400">
                                                <span>Could not load data — showing old data.</span>
                                                <button onClick={fetchAnalytics} className="text-xs underline">Retry</button>
                                            </div>
                                        )}

                                        {/* ── DAILY SALES ── */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={18} className="text-[#FF7A18]" />
                                                        <h3 className="text-lg font-black text-white">Today's Sales</h3>
                                                    </div>
                                                    <p className="text-xs text-white/40 mt-0.5">Today's performance &amp; 14-day history</p>
                                                </div>
                                                <button
                                                    onClick={() => { fetchData(); fetchAnalytics(); }}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all"
                                                >
                                                    <RefreshCw size={13} className={analyticsLoading ? 'animate-spin' : ''} /> Refresh
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
                                                {/* Revenue card */}
                                                <div className="rounded-2xl p-6 relative overflow-hidden"
                                                    style={{ background: 'linear-gradient(135deg,#0d7a5f,#0a5f4b)' }}>
                                                    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 10%, rgba(255,255,255,0.07) 0%, transparent 60%)' }} />
                                                    <p className="text-[9px] font-black uppercase tracking-[0.45em] text-emerald-200/60 mb-2">Today's Revenue</p>
                                                    <p className="text-4xl font-black text-white">₹{todayRevenue.toLocaleString('en-IN')}</p>
                                                    <div className="flex items-center gap-4 mt-3 text-sm font-semibold text-emerald-100">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="w-3.5 h-3.5 rounded flex items-center justify-center bg-emerald-400 text-white text-[7px]">✓</span>
                                                            {todayPaid} paid
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="w-3 h-3 rounded bg-red-400 inline-block" />
                                                            {todayOrderCount} total orders
                                                        </span>
                                                    </div>
                                                    <p className="mt-3 text-xs text-emerald-200/50">{todayStr}</p>
                                                </div>

                                                {/* 14-day bar chart */}
                                                <div className="rounded-2xl p-5"
                                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25 mb-3">Last 14 Days</p>
                                                    <div className="flex items-end gap-0.5" style={{ height: 88 }}>
                                                        {last14.map((d, i) => {
                                                            const pct = chartMax > 0 ? (d.val / chartMax) * 100 : 0;
                                                            const isToday = d.label === 'Today';
                                                            return (
                                                                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                                                    <div className="w-full flex items-end justify-center" style={{ height: 72 }}>
                                                                        <div
                                                                            className={`w-[65%] rounded-t-sm transition-all ${isToday ? 'bg-[#FF7A18]' : 'bg-[#FF7A18]/25 hover:bg-[#FF7A18]/50'}`}
                                                                            style={{ height: `${Math.max(pct, 3)}%`, minHeight: 3 }}
                                                                        />
                                                                    </div>
                                                                    <span className={`text-[7px] font-semibold ${isToday ? 'text-[#FF7A18]' : 'text-white/25'}`}>{d.label}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── TODAY'S ORDERS ── */}
                                        <div className="rounded-2xl overflow-hidden"
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                                <h3 className="font-black text-base text-white">Today's Orders</h3>
                                                <span className="text-xs text-white/35 font-medium">{todayOrdersArr.length} orders</span>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full whitespace-nowrap">
                                                    <thead>
                                                        <tr className="border-b border-white/5">
                                                            {['Order ID', 'Time', 'Items', 'Amount', 'Status'].map(h => (
                                                                <th key={h} className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-[0.3em] text-white/25">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {todayOrdersArr.length === 0 ? (
                                                            <tr><td colSpan={5} className="px-5 py-8 text-center text-white/20 text-sm">No orders today</td></tr>
                                                        ) : todayOrdersArr.map((o, i) => {
                                                            const itemLabel = o.items?.map(it => `${it.quantity || 1}x ${it.name}`).join(', ') || o.facility || '—';
                                                            const t = new Date(o.createdAt || o.date || 0);
                                                            const timeStr = t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
                                                            const amt = o.amount ?? o.totalAmount ?? o.totalPrice ?? 0;
                                                            const st = (o.status || o.orderStatus || 'placed').toLowerCase();
                                                            return (
                                                                <tr key={o._id || o.id || i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                                                    <td className="px-5 py-3.5 font-mono text-sm font-bold text-white/60">#{(o._id || o.id || '').toString().slice(-6)}</td>
                                                                    <td className="px-5 py-3.5 text-sm text-white/50">{timeStr}</td>
                                                                    <td className="px-5 py-3.5 text-sm text-white/80 max-w-xs truncate">{itemLabel}</td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className={`text-sm font-bold ${amt === 0 ? 'text-emerald-400' : 'text-[#FF7A18]'}`}>₹{amt}</span>
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <StatusBadge status={st} />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* ── STATS ROW ── */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { icon: Gamepad2, color: '#FF7A18', bg: 'rgba(255,122,24,0.1)', label: 'Total Rides', val: totalRidesCount },
                                                { icon: Power, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', label: 'Rides Active', val: `${ridesOnCount}/${totalRidesCount}` },
                                                { icon: Utensils, color: '#5B8CFF', bg: 'rgba(91,140,255,0.1)', label: 'Dine Items', val: dineCount },
                                                { icon: IndianRupee, color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', label: 'E4 Revenue', val: `₹${e4Revenue.toLocaleString('en-IN')}` },
                                            ].map(({ icon: Icon, color, bg, label, val }) => (
                                                <div key={label} className="rounded-2xl p-4 flex items-center gap-3"
                                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                                                        <Icon size={20} style={{ color }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">{label}</p>
                                                        <p className="text-xl font-black text-white mt-0.5">{val}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* ── PLATFORM USAGE + RIDE STATUS ── */}
                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

                                            {/* Platform Usage */}
                                            <div className="rounded-2xl p-5"
                                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                <div className="flex items-center justify-between mb-5">
                                                    <h3 className="font-black text-base text-white">E4 Platform Usage</h3>
                                                    <span className="text-[9px] text-white/25 font-medium">via /api/analytics/e4/stats</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3 mb-5">
                                                    {[
                                                        { icon: Monitor, color: '#5B8CFF', val: webSessions, label: 'WEB' },
                                                        { icon: Smartphone, color: '#A855F7', val: mobileSessions, label: 'MOBILE' },
                                                        { icon: Ticket, color: '#22C55E', val: totalSessions, label: 'TOTAL' },
                                                    ].map(({ icon: Icon, color, val, label }) => (
                                                        <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                                                                <Icon size={18} style={{ color }} />
                                                            </div>
                                                            <span className="text-xl font-black text-white">{val}</span>
                                                            <span className="text-[8px] font-black tracking-[0.35em] text-white/25 uppercase">{label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                        <div className="h-full" style={{ width: `${webPct}%`, background: '#5B8CFF', transition: 'width 1s ease' }} />
                                                        <div className="h-full" style={{ width: `${mobilePct}%`, background: '#A855F7', transition: 'width 1s ease 0.3s' }} />
                                                    </div>
                                                    <div className="flex justify-between text-[9px] font-semibold">
                                                        <span className="flex items-center gap-1 text-[#5B8CFF]"><span className="w-2 h-2 rounded-full bg-[#5B8CFF]" />Web: {webPct}%</span>
                                                        <span className="flex items-center gap-1 text-[#A855F7]"><span className="w-2 h-2 rounded-full bg-[#A855F7]" />Mobile: {mobilePct}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ride Status */}
                                            <div className="rounded-2xl p-5"
                                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                <h3 className="font-black text-base text-white mb-5">Ride Status</h3>
                                                <div className="space-y-4">
                                                    {[
                                                        { label: `Online (${ridesOnCount})`, count: ridesOnCount, color: '#4ade80', glow: '#4ade80' },
                                                        { label: `Offline (${ridesOffCount})`, count: ridesOffCount, color: '#f87171', glow: '#f87171' },
                                                    ].map(({ label, count, color, glow }) => {
                                                        const pct = totalRidesCount > 0 ? Math.round((count / totalRidesCount) * 100) : 0;
                                                        return (
                                                            <div key={label}>
                                                                <div className="flex items-center justify-between mb-1.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${glow}` }} />
                                                                        <span className="text-sm font-semibold text-white">{label}</span>
                                                                    </div>
                                                                    <span className="text-sm font-bold text-white/50">{pct}%</span>
                                                                </div>
                                                                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: 'width 1s ease' }} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    <p className="text-center text-[9px] text-white/20 pt-1">{totalRidesCount} E4 rides total</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── RIDE & EVENT BOOKINGS ── */}
                                        <div className="rounded-2xl overflow-hidden"
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-black text-base text-white">Ride &amp; Event Bookings</h3>
                                                    <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                        {['All', 'Rides', 'Events'].map(t => (
                                                            <button key={t}
                                                                onClick={() => setAnalyticsBookingTab(t.toLowerCase())}
                                                                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${analyticsBookingTab === t.toLowerCase()
                                                                    ? 'bg-[#0a6350] text-white'
                                                                    : 'text-white/35 hover:text-white/60'
                                                                    }`}
                                                            >{t}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[8px] font-black uppercase tracking-[0.35em] text-white/25">Total Revenue</p>
                                                        <p className="text-lg font-black text-[#FF7A18]">₹{bookingRevTotal.toLocaleString('en-IN')}</p>
                                                    </div>
                                                    <button onClick={handleExportCSV}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-80 transition-all"
                                                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                                                        <Download size={13} /> Export Data
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full whitespace-nowrap">
                                                    <thead>
                                                        <tr className="border-b border-white/5">
                                                            {['Order ID', 'Date', 'Items', 'Amount', 'Status'].map(h => (
                                                                <th key={h} className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-[0.3em] text-white/25">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {allBookings.filter(b => {
                                                            if (analyticsBookingTab === 'all') return true;
                                                            const items = b.items?.map(i => i.name || '').join(' ').toLowerCase() || b.facility?.toLowerCase() || '';
                                                            if (analyticsBookingTab === 'events') return items.includes('event') || items.includes('celebration') || items.includes('dine');
                                                            return !items.includes('event') && !items.includes('celebration');
                                                        }).slice(0, 10).map((b, i) => {
                                                            const itemLabel = b.items?.map(it => `${it.quantity || 1}x ${it.name}`).join(', ') || b.facility || '—';
                                                            const dateStr = new Date(b.createdAt || b.date || 0).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true });
                                                            const amt = b.amount ?? b.totalAmount ?? b.totalPrice ?? 0;
                                                            const st = (b.status || b.orderStatus || 'pending').toLowerCase();
                                                            return (
                                                                <tr key={b._id || b.id || i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                                                    <td className="px-5 py-3.5 font-mono text-sm font-bold text-white/60">#{(b._id || b.id || '').toString().slice(-6)}</td>
                                                                    <td className="px-5 py-3.5 text-sm text-white/45">{dateStr}</td>
                                                                    <td className="px-5 py-3.5 text-sm text-white/75 max-w-[240px] truncate">{itemLabel}</td>
                                                                    <td className="px-5 py-3.5"><span className={`text-sm font-bold ${amt === 0 ? 'text-emerald-400' : 'text-[#FF7A18]'}`}>₹{amt}</span></td>
                                                                    <td className="px-5 py-3.5"><StatusBadge status={st} /></td>
                                                                </tr>
                                                            );
                                                        })}
                                                        {allBookings.length === 0 && (
                                                            <tr><td colSpan={5} className="px-5 py-10 text-center text-white/20 text-sm">No bookings yet</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })()}

                            {/* RIDES & DINE GRID */}
                            {(activeTab === 'rides' || activeTab === 'dine') && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
                                    {filteredProducts.filter(p => {
                                        if (activeTab === 'rides') {
                                            return p.category === 'play' || p.category === 'ride';
                                        } else {
                                            return p.category === 'food' || p.category === 'dine';
                                        }
                                    }).map(item => {
                                        const isOpen = (item.status === 'on' || item.status === 'active' || (item.open !== false && !item.status));
                                        
                                        return (
                                            <motion.div
                                                layout
                                                key={item.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group relative bg-[#0F172A]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden hover:border-[#FF7A18]/50 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[#FF7A18]/10 hover:-translate-y-3"
                                                style={{ willChange: "transform, opacity" }}
                                            >
                                                {/* Image Section with Advanced Overlay */}
                                                <div className="relative h-48 overflow-hidden">
                                                    <img 
                                                        src={item.image || '/placeholder.jpg'} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] brightness-90 group-hover:brightness-110" 
                                                    />
                                                    
                                                    {/* Cinematic Gradient Overlays */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />
                                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0F172A] to-transparent" />
                                                    
                                                    {/* Price Tag - Floating Badge */}
                                                    {activeTab !== 'dine' && (
                                                        <div className="absolute top-5 right-5 z-20">
                                                            <div className="bg-[#FF7A18] px-5 py-2 rounded-2xl text-[10px] font-black text-white shadow-[0_10px_20px_rgba(255,122,24,0.3)] tracking-[0.2em] uppercase border border-white/20 backdrop-blur-md">
                                                                ₹{item.price}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Category / ID Badge */}
                                                    {activeTab !== 'dine' && (
                                                        <div className="absolute top-5 left-5 z-20">
                                                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl text-[8px] font-black text-[#AAB2C5] tracking-[0.3em] uppercase ">
                                                                ID: <span className="text-white font-mono">{String(item.id || '').padStart(3, '0')}</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Quick Actions - Bottom Slide Up */}
                                                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30 flex gap-3">
                                                        <button 
                                                            onClick={() => {
                                                                setEditingItem(item);
                                                                setFormData({
                                                                    ...item,
                                                                    start_time: item.start_time ? new Date(item.start_time).toISOString().slice(0, 16) : '',
                                                                    end_time: item.end_time ? new Date(item.end_time).toISOString().slice(0, 16) : ''
                                                                });
                                                                setIsModalOpen(true);
                                                            }} 
                                                            className="flex-1 py-3 bg-white/10 hover:bg-[#FF7A18] rounded-xl text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all group/btn shadow-xl"
                                                        >
                                                            <Edit2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                            <span className="ml-2 text-[9px] font-black uppercase tracking-widest ">MOD</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(item.id, 'product')} 
                                                            className="w-12 h-12 bg-white/5 hover:bg-red-500 rounded-xl text-[#AAB2C5] hover:text-white backdrop-blur-xl border border-white/10 hover:border-transparent flex items-center justify-center transition-all shadow-xl"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Content Section */}
                                                <div className="p-7 space-y-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                                            <p className="text-[8px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.4em] ">
                                                                {activeTab === 'dine' ? 'Cuisine: ' : 'Class: '} <span className="text-white/60">{item.cuisine || item.category || 'General'}</span>
                                                            </p>
                                                        </div>
                                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-[#FF7A18] transition-colors line-clamp-1 transform ">
                                                            {item.name}
                                                        </h3>
                                                    </div>

                                                    {/* Status & Control Row */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                        <div className="space-y-1">
                                                            <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                {activeTab === 'dine' ? (isOpen ? 'Terminal Open' : 'Terminal Closed') : (isOpen ? 'Protocol Active' : 'Protocol Locked')}
                                                            </div>
                                                            <div className="text-[8px] font-black text-[#AAB2C5]/30 uppercase tracking-widest flex items-center gap-1.5">
                                                                <MapPin size={8} /> {item.stall || 'Sector E4'}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* High-Tech Toggle */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleStatus(item)}
                                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-700 ${isOpen ? 'bg-[#FF7A18] shadow-[0_0_20px_rgba(255,122,24,0.4)]' : 'bg-white/5 border border-white/10'}`}
                                                        >
                                                            <div className={`absolute left-1.5 text-[6px] font-black text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>ON</div>
                                                            <div className={`absolute right-1.5 text-[6px] font-black text-[#AAB2C5] transition-opacity duration-300 ${!isOpen ? 'opacity-100' : 'opacity-0'}`}>OFF</div>
                                                            <span
                                                                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'translate-x-7' : 'translate-x-1'}`}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Decorative Holographic Border (Top) */}
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* EMPLOYEES TAB */}
                            {activeTab === 'employees' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-[#0F172A]/40 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
                                        <div>
                                            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] ">Employees</h2>
                                            <p className="text-[#AAB2C5]/50 text-xs font-bold uppercase tracking-widest mt-1">Manage EFOUR ELURU operations</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => fetchData()}
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 text-[#AAB2C5] hover:text-[#FF7A18] hover:bg-white/10 transition-all group/refresh shadow-xl"
                                                title="Refresh Employees"
                                            >
                                                <RefreshCw size={20} className="group-hover/refresh:rotate-180 transition-transform duration-700" />
                                            </button>
                                            <button onClick={() => {
                                                setFormData({ name: '', category: '', price: '', description: '', image: '', stall: '', type: '', status: 'on' });
                                                setEditingItem(null);
                                                setIsModalOpen('employee');
                                            }} className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                                <Users size={18} /> Add New Employee
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-[#0F172A]/40 backdrop-blur-3xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] ">Authorized Employees List</h3>
                                            <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-bold text-[#AAB2C5] uppercase tracking-widest">{employeesList.length} Employees</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full whitespace-nowrap">
                                                <thead className="bg-white/5 border-b border-white/5">
                                                    <tr>
                                                        <th className="px-8 py-5 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em]">Name</th>
                                                        <th className="px-8 py-5 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em]">Mobile Number</th>
                                                        <th className="px-8 py-5 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em]">Role</th>
                                                        <th className="px-8 py-5 text-right text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em]">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {employeesList.map((emp) => (
                                                        <tr key={emp._id || emp.id} className="hover:bg-white/5 transition-colors group">
                                                            <td className="px-8 py-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center font-black text-emerald-400 border border-emerald-500/20 ">
                                                                        {emp.name ? emp.name.charAt(0).toUpperCase() : 'E'}
                                                                    </div>
                                                                    <span className="text-sm font-black text-white uppercase ">{emp.name || 'Unnamed Employee'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-6 text-sm font-mono font-bold text-[#AAB2C5]">
                                                                {emp.mobilenumber || emp.mobile || emp.phone || 'N/A'}
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] inline-flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                                    EMPLOYEE
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-6 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button onClick={() => {
                                                                        setEditingItem(emp);
                                                                        setFormData({ name: emp.name || '', category: emp.mobilenumber || emp.mobile || emp.phone || '', price: '', description: '', image: '', stall: '', type: '', status: 'on' });
                                                                        setIsModalOpen('employee');
                                                                    }} className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-[#5B8CFF]/10 text-[#5B8CFF] border border-[#5B8CFF]/20 hover:bg-[#5B8CFF] hover:text-white hover:border-transparent transition-all shadow-[0_0_15px_rgba(91,140,255,0.1)]">
                                                                        <Edit2 size={16} />
                                                                    </button>
                                                                    <button onClick={() => handleDeleteEmployee(emp._id || emp.id)} className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-transparent transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {employeesList.length === 0 && (
                                                        <tr>
                                                            <td colSpan={4} className="px-8 py-16 text-center text-[#AAB2C5]/30 text-[10px] font-black uppercase tracking-[0.4em] ">
                                                                No employees found in the matrix
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                            </div>
                        )}

                        {/* --- DOMES MANAGEMENT SECTION --- */}
                        {activeTab === 'domes' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                {/* DOME HEADER & CONTROLS */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Dome Bookings</h2>
                                        <p className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.4em] leading-none">Manage private immersive dome sessions and attendance.</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-3xl border border-white/10 backdrop-blur-xl">
                                        <div className="flex items-center gap-3 px-4 py-2 border-r border-white/10">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${isDomeBookingOn ? 'text-emerald-400' : 'text-red-400'}`}>
                                                BOOKING: {isDomeBookingOn ? 'ON' : 'OFF'}
                                            </span>
                                            <button 
                                                onClick={() => setIsDomeBookingOn(!isDomeBookingOn)}
                                                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isDomeBookingOn ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${isDomeBookingOn ? 'right-1 bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'left-1 bg-red-400'}`} />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 px-4 py-2 border-r border-white/10">
                                            <span className="text-[9px] font-black text-[#AAB2C5]/40 uppercase tracking-widest">DOMES CAPACITY</span>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setDomeCapacity(Math.max(1, domeCapacity - 1))} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all font-bold group">
                                                    <X size={14} className="group-hover:text-red-400" />
                                                </button>
                                                <span className="text-xl font-black text-white w-4 text-center">{domeCapacity}</span>
                                                <button onClick={() => setDomeCapacity(domeCapacity + 1)} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all font-bold group">
                                                    <Plus size={14} className="group-hover:text-emerald-400" />
                                                </button>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={fetchData}
                                            className="px-6 py-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#AAB2C5] hover:text-white transition-all group"
                                        >
                                            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                                            Refresh Sessions
                                        </button>
                                    </div>
                                </div>

                                {/* DOMES TABLE */}
                                <div className="glass-card rounded-[3rem] border border-white/5 shadow-3xl overflow-hidden bg-[#0F172A]/40 backdrop-blur-3xl">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-separate border-spacing-0 whitespace-nowrap">
                                            <thead>
                                                <tr className="bg-white/2">
                                                    {['Session ID', 'Customer', 'Date & Time', 'Guests'].map(h => (
                                                        <th key={h} className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-[#AAB2C5]/30 first:rounded-tl-[3rem] last:rounded-tr-[3rem]">
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredDomeBookings.slice((domeBookingsPage - 1) * 10, domeBookingsPage * 10).map((b, i) => {
                                                    const date = new Date(b.date || b.createdAt || 0);
                                                    const guests = b.items?.find(it => it.name.toLowerCase().includes('dome'))?.quantity || 1;
                                                    
                                                    return (
                                                        <motion.tr 
                                                            key={b._id || b.id} 
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="group border-b border-white/5 hover:bg-white/[0.02] transition-all"
                                                        >
                                                            <td className="px-10 py-8">
                                                                <span className="text-xs font-black text-white/40 tracking-widest group-hover:text-[#FF7A18] transition-colors leading-none">
                                                                    #{(b._id || b.id || '').toString().slice(-6)}
                                                                </span>
                                                            </td>
                                                            <td className="px-10 py-8">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-sm font-black text-white uppercase tracking-wider leading-none">
                                                                        {b.userDetails?.name || b.name || 'Anonymous'}
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-[#AAB2C5]/40 leading-none">
                                                                        +{b.userDetails?.phone || b.mobile || '6303407430'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8">
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-xs font-black text-white/80 uppercase tracking-widest leading-none">
                                                                        {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                                    </span>
                                                                    <div className="w-px h-4 bg-white/10" />
                                                                    <span className="text-xs font-black text-emerald-400 tracking-widest leading-none">
                                                                        {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8">
                                                                <div className="inline-flex items-center px-5 py-2.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">
                                                                    {guests === 1 ? '1 PERS' : `${guests} PERS`}
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })}
                                                {filteredDomeBookings.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-10 py-32 text-center">
                                                            <div className="flex flex-col items-center gap-6 opacity-20">
                                                                <Calendar size={60} />
                                                                <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Dome sessions booked yet</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                {/* Pagination (Domes) */}
                                {filteredDomeBookings.length > 10 && (
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => setDomeBookingsPage(Math.max(1, domeBookingsPage - 1))} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[#AAB2C5] hover:text-white">
                                            <RefreshCw size={18} className="rotate-90" />
                                        </button>
                                        <div className="flex items-center gap-2 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Page {domeBookingsPage}</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AAB2C5]/30 ">of {Math.ceil(filteredDomeBookings.length / 10)}</span>
                                        </div>
                                        <button onClick={() => setDomeBookingsPage(Math.min(Math.ceil(filteredDomeBookings.length / 10), domeBookingsPage + 1))} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[#AAB2C5] hover:text-white">
                                            <RefreshCw size={18} className="-rotate-90" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TABLES (BOOKINGS & ORDERS) */}
                            {activeTab === 'orders' && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full whitespace-nowrap">
                                            <thead className="bg-white/2 border-b border-white/5">
                                                <tr>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Id Ride</th>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Customer Core</th>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Payload Details</th>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Timestamp</th>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Value</th>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">State</th>
                                                    <th className="px-10 py-6 text-right text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Operations</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {(() => {
                                                    const isBookingsTab = activeTab === 'bookings';
                                                    const list = isBookingsTab ? filteredBookings : filteredOrders;
                                                    const currentPage = isBookingsTab ? bookingsPage : liveOrdersPage;
                                                    const setPage = isBookingsTab ? setBookingsPage : setLiveOrdersPage;
                                                    const totalPages = Math.ceil(list.length / 10);
                                                    const displayList = list.slice((currentPage - 1) * 10, currentPage * 10);

                                                    return (
                                                        <>
                                                            {displayList.filter(Boolean).map((item, idx) => (
                                                                <tr key={item._id || item.id || idx} className="hover:bg-white/5 transition-all group">
                                                                    <td className="px-10 py-8 text-[12px] font-black text-[#AAB2C5] font-mono ">
                                                                        <span className="text-[#FF7A18]">#</span>{String(item._id || item.id || '').slice(-6).toUpperCase()}
                                                                    </td>
                                                                    <td className="px-10 py-8">
                                                                        <div className="text-sm font-black text-[#F8FAFC] uppercase tracking-tighter ">{item.userDetails?.name || item.name || 'Guest'}</div>
                                                                        <div className="text-[10px] font-black text-[#AAB2C5]/30 uppercase tracking-widest mt-1">{item.userDetails?.phone || item.phone}</div>
                                                                    </td>
                                                                    <td className="px-10 py-8 text-[10px] font-black text-[#AAB2C5] uppercase tracking-widest max-w-xs truncate">
                                                                        {item.facility || (item.items && Array.isArray(item.items) ? item.items.map(i => `${i.name} [${i.quantity || 1}]`).join(', ') : 'Order Details')}
                                                                    </td>
                                                                    <td className="px-10 py-8 text-[10px] font-black text-[#AAB2C5] uppercase tracking-widest ">
                                                                        {new Date(item.date || item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })}
                                                                    </td>
                                                                    <td className="px-10 py-8 text-sm font-black text-white tracking-tighter">
                                                                        ₹{item.amount ?? item.totalAmount ?? item.totalPrice ?? 0}
                                                                    </td>
                                                                    <td className="px-10 py-8">
                                                                        <StatusBadge status={item.status || item.orderStatus || 'pending'} />
                                                                    </td>
                                                                    <td className="px-10 py-8 text-right">
                                                                        <button
                                                                            onClick={() => handleDelete(item._id || item.id, isBookingsTab ? 'booking' : 'order')}
                                                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#AAB2C5] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                                                                        >
                                                                            <Trash2 size={18} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {list.length > 10 && (
                                                                <tr>
                                                                    <td colSpan="7" className="px-10 py-8 border-t border-white/5">
                                                                        <div className="flex items-center justify-between">
                                                                            <button disabled={currentPage === 1} onClick={() => setPage(prev => prev - 1)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-20 ">Decouple</button>
                                                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#AAB2C5]/30 ">Eluru Index {currentPage} / {totalPages}</span>
                                                                            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setPage(prev => prev + 1)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-20 ">Recouple</button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </tbody>
                                        </table>
                                        {(activeTab === 'bookings' ? filteredBookings : filteredOrders).length === 0 && (
                                            <div className="p-12 text-center text-gray-400">
                                                <Search size={48} className="mx-auto mb-4 opacity-20" />
                                                <p className="font-medium">No results found for "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* --- MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070B14]/80 backdrop-blur-2xl p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 40, opacity: 0 }}
                            className="glass-card rounded-[3rem] shadow-3xl w-full max-w-2xl overflow-hidden border border-white/10"
                        >
                            <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF7A18] block mb-2">Protocol Override</span>
                                    <h3 className="text-3xl font-black tracking-tighter uppercase transform ">
                                        {isModalOpen === 'employee' ? (editingItem ? 'Edit Employee' : 'Add Employee') : editingItem ? 'Edit Metadata' : (activeTab === 'rides' ? 'Add New Ride' : 'Add New Dine')}
                                    </h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#AAB2C5] hover:text-white hover:bg-white/10 transition-all border border-white/10"><X size={24} /></button>
                            </div>
                            <form onSubmit={isModalOpen === 'employee' ? handleEmployeeSubmit : handleFormSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {isModalOpen === 'employee' ? (
                                    <>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Employee Name</label>
                                            <input required type="text" className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all font-black text-sm uppercase tracking-widest text-white shadow-inner"
                                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter Name" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Mobile Number</label>
                                            <input required type="tel" className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all font-black text-sm uppercase tracking-widest text-[#AAB2C5] font-mono shadow-inner"
                                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="10 Digits" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">{activeTab === 'rides' ? 'Ride Name' : 'Dine Name'}</label>
                                        <input required type="text" className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all font-black text-sm uppercase tracking-widest text-white shadow-inner"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter Designation" />
                                    </div>
                                )}
                                {isModalOpen !== 'employee' && (
                                    <div className="grid grid-cols-2 gap-8">
                                        {activeTab !== 'dine' && (
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">{activeTab === 'rides' ? 'Value Core [₹]' : 'Unit Price [₹]'}</label>
                                                <input required type="number" className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all font-black text-sm uppercase tracking-widest text-white shadow-inner"
                                                    value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0" />
                                            </div>
                                        )}
                                        <div className="space-y-3">
                                            {/* Advanced metadata kept in state but removed from UI for cleaner experience as requested */}
                                            </div>
                                        </div>
                                    )}
                                {isModalOpen !== 'employee' && false && (
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Station ID</label>
                                            <input required type="text" className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#5B8CFF]/50 outline-none transition-all font-black text-[10px] uppercase tracking-widest text-white shadow-inner"
                                                value={formData.stall} onChange={e => setFormData({ ...formData, stall: e.target.value })} placeholder="e.g. ST-01 ELURU" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Cuisine Specialty</label>
                                            <input required type="text" className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all font-black text-[10px] uppercase tracking-widest text-white shadow-inner"
                                                value={formData.cuisine || ''} onChange={e => setFormData({ ...formData, cuisine: e.target.value })} placeholder="Enter Cuisine" />
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'dine' && false && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Contact Number</label>
                                        <input required type="tel" className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all font-black text-sm uppercase tracking-widest text-[#AAB2C5] font-mono shadow-inner"
                                            value={formData.contactNumber || ''} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} placeholder="Enter Phone Number" />
                                    </div>
                                )}
                                {isModalOpen !== 'employee' && (
                                    <>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-8 p-6 bg-white/2 rounded-3xl border border-white/5 shadow-inner">
                                                <div className="relative w-24 h-24 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl group/img">
                                                    {formData.image ? (
                                                        <>
                                                            <img src={formData.image} className="w-full h-full object-cover brightness-110" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, image: '' })}
                                                                className="absolute inset-0 bg-red-500/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#AAB2C5]/20 text-[10px] font-black text-center px-4">NO DATA</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Item Image</label>
                                                    <div className="flex gap-4">
                                                        <label className="flex-1 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF7A18]/50 px-5 py-4 rounded-xl cursor-pointer transition-all group/upload relative overflow-hidden">
                                                            <Upload size={18} className="text-[#AAB2C5] group-hover/upload:text-[#FF7A18] transition-colors relative z-10" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#AAB2C5] group-hover/upload:text-white relative z-10">Upload Image</span>
                                                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A18]/0 via-[#FF7A18]/5 to-[#FF7A18]/0 translate-x-[-100%] group-hover/upload:translate-x-[100%] transition-transform duration-1000" />
                                                        </label>
                                                    </div>
                                                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest opacity-50">Upload complete.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Description</label>
                                            <textarea className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all font-black text-xs uppercase tracking-widest text-white shadow-inner leading-relaxed resize-none "
                                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="4" placeholder="Enter Description..."></textarea>
                                        </div>

                                        {activeTab === 'dine' && (
                                            <div className="space-y-6 pt-4 border-t border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] ">Menu Images / Add Menu</label>
                                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Optional</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-4 gap-4">
                                                    {formData.menuImages?.map((img, idx) => (
                                                        <div key={idx} className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10 group/menu-img">
                                                            <img src={img} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMenuImage(idx)}
                                                                className="absolute inset-0 bg-red-500/60 opacity-0 group-hover/menu-img:opacity-100 transition-opacity flex items-center justify-center text-white"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <label className="aspect-square bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-[#FF7A18]/50 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group/add-menu border-2">
                                                        <Menu size={20} className="text-[#AAB2C5] group-hover/add-menu:text-[#FF7A18] transition-colors" />
                                                        <span className="text-[8px] font-black uppercase text-[#AAB2C5] tracking-[0.2em] px-4 text-center">Add Multiple Images</span>
                                                        <input type="file" multiple className="hidden" onChange={handleMenuImagesChange} accept="image/*" />
                                                    </label>
                                                </div>
                                                <p className="text-[8px] font-black text-[#AAB2C5]/20 uppercase tracking-[0.3em] ">Upload scans or photos of your physical menu items.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                                <button type="submit" className="btn-premium w-full py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-3xl mt-6 group flex items-center justify-center gap-4">
                                    {isModalOpen === 'employee' ? (editingItem ? 'Update Employee' : 'Add Employee') : editingItem ? 'Save Changes' : (activeTab === 'rides' ? 'Add Ride' : 'Add Item')}
                                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

// --- Subcomponents ---

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="glass-card p-10 rounded-[3rem] border border-white/5 shadow-3xl relative overflow-hidden group hover:border-[#FF7A18]/30 transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex justify-between items-start mb-8">
            <div className={`w-16 h-16 rounded-2xl ${bg} ${color} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                <Icon size={28} />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-[#AAB2C5]/30 uppercase tracking-[0.4em] mb-1">Status</span>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest ">Online</span>
                </div>
            </div>
        </div>
        <div>
            <h3 className="text-5xl font-black tracking-tighter text-white mb-2 transform ">{value}</h3>
            <p className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.5em] leading-none">{title}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        captured: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        placed: 'bg-[#5B8CFF]/10 text-[#5B8CFF] border-[#5B8CFF]/20',
        pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        cancelled: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${styles[status] || 'bg-white/5 text-[#AAB2C5] border-white/10'}`}>
            {status}
        </span>
    );
};

export default AdminDashboard;

