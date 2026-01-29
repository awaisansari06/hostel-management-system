import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && user?.role !== role) {
        // Redirect to appropriate dashboard if wrong role
        if (user?.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/student/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
