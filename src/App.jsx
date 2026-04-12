import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SlotsPage from "./pages/SlotsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSlots from "./pages/AdminSlots";
import AdminBookings from "./pages/AdminBookings";
import AdminUsers from "./pages/AdminUsers";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/Layout";
import VisaServicesPage from "./pages/VisaServicesPage";
import MyVisaRequestsPage from "./pages/MyVisaRequestsPage";
import AdminVisaRequests from "./pages/AdminVisaRequests";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/slots" replace />;
  return children;
};

const DashboardRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return children;
};

const Spinner = () => (
  <div className="w-8 h-8 border-4 border-crimson-500 border-t-transparent rounded-full animate-spin" />
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route
          path="dashboard"
          element={
            <DashboardRoute>
              <UserDashboard />
            </DashboardRoute>
          }
        />
        <Route
          path="slots"
          element={
            <PrivateRoute>
              <SlotsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="my-bookings"
          element={
            <PrivateRoute>
              <MyBookingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="visa-services"
          element={
            <PrivateRoute>
              <VisaServicesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="my-visa-requests"
          element={
            <PrivateRoute>
              <MyVisaRequestsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/visa-requests"
          element={
            <AdminRoute>
              <AdminVisaRequests />
            </AdminRoute>
          }
        />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="admin/slots"
          element={
            <AdminRoute>
              <AdminSlots />
            </AdminRoute>
          }
        />
        <Route
          path="admin/bookings"
          element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#16A34A", secondary: "#fff" },
              style: {
                border: "1px solid #BBF7D0",
                background: "#F0FDF4",
                color: "#166534",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
