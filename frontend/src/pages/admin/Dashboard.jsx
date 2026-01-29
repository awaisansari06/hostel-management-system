import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';
import { getAllRooms, getAllStudents } from '../../services/adminService';

const AdminDashboard = () => {
    const { addToast } = useToast();
    const [stats, setStats] = useState({
        totalRooms: 0,
        totalStudents: 0,
        availableRooms: 0,
        loading: true
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const [roomsData, studentsData] = await Promise.all([
                getAllRooms(),
                getAllStudents()
            ]);

            setStats({
                totalRooms: roomsData.count || 0,
                totalStudents: studentsData.count || 0,
                availableRooms: roomsData.stats?.availableRooms || 0,
                loading: false
            });
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            addToast('Failed to load dashboard statistics', 'error');
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="p-6 space-y-8 animate-fadeIn">
                {/* Welcome Section */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
                    <p className="text-slate-400">Here's what's happening with your hostel today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Rooms */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-all duration-200 shadow-lg transform hover:scale-[1.02] hover:shadow-indigo-500/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                                <svg className="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">Rooms</span>
                        </div>
                        <div className="mb-1">
                            {stats.loading ? (
                                <Skeleton variant="text" width="60px" height="2.25rem" className="bg-slate-700/50" />
                            ) : (
                                <h3 className="text-3xl font-bold text-white">{stats.totalRooms}</h3>
                            )}
                        </div>
                        <p className="text-sm text-slate-400">Total Rooms</p>
                    </div>

                    {/* Total Students */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-200 shadow-lg transform hover:scale-[1.02] hover:shadow-emerald-500/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Students</span>
                        </div>
                        <div className="mb-1">
                            {stats.loading ? (
                                <Skeleton variant="text" width="60px" height="2.25rem" className="bg-slate-700/50" />
                            ) : (
                                <h3 className="text-3xl font-bold text-white">{stats.totalStudents}</h3>
                            )}
                        </div>
                        <p className="text-sm text-slate-400">Total Students</p>
                    </div>

                    {/* Available Rooms */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all duration-200 shadow-lg transform hover:scale-[1.02] hover:shadow-purple-500/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded">Available</span>
                        </div>
                        <div className="mb-1">
                            {stats.loading ? (
                                <Skeleton variant="text" width="60px" height="2.25rem" className="bg-slate-700/50" />
                            ) : (
                                <h3 className="text-3xl font-bold text-white">{stats.availableRooms}</h3>
                            )}
                        </div>
                        <p className="text-sm text-slate-400">Available Rooms</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            to="/admin/rooms"
                            className="group bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/30 rounded-lg p-4 transition-all duration-200 transform hover:scale-[1.01] hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-white font-semibold mb-1 group-hover:text-indigo-300 transition-colors">Manage Rooms</h4>
                                    <p className="text-sm text-slate-400">View and manage all rooms</p>
                                </div>
                                <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                                    <svg className="h-5 w-5 text-indigo-400 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                        <Link
                            to="/admin/students"
                            className="group bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 rounded-lg p-4 transition-all duration-200 transform hover:scale-[1.01] hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-white font-semibold mb-1 group-hover:text-emerald-300 transition-colors">Manage Students</h4>
                                    <p className="text-sm text-slate-400">View and manage students</p>
                                </div>
                                <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                                    <svg className="h-5 w-5 text-emerald-400 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
