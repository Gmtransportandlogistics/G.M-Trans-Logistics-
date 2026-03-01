import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OrderForm from "./pages/OrderForm";
import OrderHistory from "./pages/OrderHistory";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/order" element={<PrivateRoute><OrderForm /></PrivateRoute>} />
                        <Route path="/history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
                <ToastContainer position="bottom-center" autoClose={3000} />
            </AuthProvider>
        </Router>
    );
}

function PrivateRoute({ children }) {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/login" />;
}

export default App;