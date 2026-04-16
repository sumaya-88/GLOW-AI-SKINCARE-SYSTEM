import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Analyze from "@/pages/Analyze";
import Results from "@/pages/Results";
import Routine from "@/pages/Routine";
import Products from "@/pages/Products";
import ChatPage from "@/pages/ChatPage";
import VerifyOtp from "@/pages/Verifyotp";
import Profile from "@/pages/Profile";
import ChatWidget from "@/components/ChatWidget";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  // Don't show floating widget on the full chat page or auth pages if desired, but definitely not on chat page
  const showFloatingWidget = !['/chat', '/ask-ai', '/login', '/register', '/verify-otp'].includes(location.pathname);

  return (
    <>
      {showFloatingWidget && <ChatWidget />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Protected Routes */}
        <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/routine" element={<ProtectedRoute><Routine /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/ask-ai" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
