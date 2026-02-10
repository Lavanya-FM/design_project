import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

// Lazy load pages for performance
const Collections = lazy(() => import('./pages/Collections'));
const Consultation = lazy(() => import('./pages/Consultation'));
const Customizer = lazy(() => import('./pages/Customizer'));
const MeasurementCapture = lazy(() => import('./pages/MeasurementCapture'));
const ReviewOrder = lazy(() => import('./pages/ReviewOrder'));
const Payment = lazy(() => import('./pages/Payment'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DesignerPortal = lazy(() => import('./pages/DesignerPortal'));
const TailorDashboard = lazy(() => import('./pages/TailorDashboard'));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));

// 🔐 AUTH SUITE
const RoleSelection = lazy(() => import('./pages/auth/RoleSelection'));
const CustomerLogin = lazy(() => import('./pages/auth/customer/CustomerLogin'));
const CustomerSignup = lazy(() => import('./pages/auth/customer/CustomerSignup'));
const DesignerLogin = lazy(() => import('./pages/auth/designer/DesignerLogin'));
const DesignerSignup = lazy(() => import('./pages/auth/designer/DesignerSignup'));
const TailorLogin = lazy(() => import('./pages/auth/tailor/TailorLogin'));
const VendorLogin = lazy(() => import('./pages/auth/vendor/VendorLogin'));
const VendorSignup = lazy(() => import('./pages/auth/vendor/VendorSignup'));
const AdminLogin = lazy(() => import('./pages/auth/admin/AdminLogin'));

// Premium Loading Fallback
const LoadingFallback = () => (
    <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FDF8F0',
        gap: '16px'
    }}>
        <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #FFE4EC',
            borderTop: '3px solid #D02F44',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
        }}></div>
        <span style={{
            color: '#D02F44',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.2rem',
            fontWeight: 600,
            letterSpacing: '1px'
        }}>
            Fit & Flare Studio
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/consultation" element={<Consultation />} />

                    {/* 🔐 Authentication Flows */}
                    <Route path="/auth/role-selection" element={<RoleSelection />} />
                    <Route path="/login" element={<Navigate to="/auth/role-selection" replace />} />

                    {/* Customer Auth */}
                    <Route path="/auth/customer/login" element={<CustomerLogin />} />
                    <Route path="/auth/customer/signup" element={<CustomerSignup />} />

                    {/* Designer Auth */}
                    <Route path="/auth/designer/login" element={<DesignerLogin />} />
                    <Route path="/auth/designer/signup" element={<DesignerSignup />} />

                    {/* Tailor Auth */}
                    <Route path="/auth/tailor/login" element={<TailorLogin />} />

                    {/* Vendor Auth */}
                    <Route path="/auth/vendor/login" element={<VendorLogin />} />
                    <Route path="/auth/vendor/signup" element={<VendorSignup />} />

                    {/* Admin Auth */}
                    <Route path="/auth/admin/login" element={<AdminLogin />} />

                    {/* Customer Flow */}
                    <Route path="/customizer" element={<Customizer />} />
                    <Route path="/measurements" element={<MeasurementCapture />} />
                    <Route path="/checkout/review" element={<ReviewOrder />} />
                    <Route path="/checkout/payment" element={<Payment />} />

                    {/* Customer Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/order/:id" element={<OrderTracking />} />
                    <Route path="/order/success" element={<OrderSuccess />} />

                    {/* Role-Based Dashboards */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/designer" element={<DesignerPortal />} />
                    <Route path="/tailor" element={<TailorDashboard />} />
                    <Route path="/vendor" element={<VendorDashboard />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
