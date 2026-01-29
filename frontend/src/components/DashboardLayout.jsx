import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, role = 'admin' }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-900">
            {/* Sidebar */}
            <Sidebar role={role} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Navigation Bar */}
                <nav className="bg-slate-800 border-b border-slate-700 shadow-lg">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold text-white capitalize">{role} Portal</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-white">{user?.name}</p>
                                    <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30 flex items-center space-x-2"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
