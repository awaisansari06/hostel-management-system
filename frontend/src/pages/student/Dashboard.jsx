import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Skeleton from '../../components/Skeleton';
import { getMyProfile, getMyRoom } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const profileData = await getMyProfile();
            setProfile(profileData.data.student);

            if (profileData.data.student.roomNumber) {
                try {
                    const roomData = await getMyRoom();
                    setRoom(roomData.data.room);
                } catch (roomErr) {
                    console.log('No room data available');
                }
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className="p-6 space-y-8">
                    {/* Welcome Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-3">
                            <Skeleton variant="text" width="250px" height="2.5rem" />
                            <Skeleton variant="text" width="180px" />
                        </div>
                        <Skeleton variant="rect" width="160px" height="40px" className="rounded-full" />
                    </div>

                    {/* Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton variant="rect" height="240px" />
                        <Skeleton variant="rect" height="240px" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="p-6 space-y-8 animate-fadeIn">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{profile?.name.split(' ')[0]}</span>! 👋
                        </h1>
                        <p className="text-slate-400">Here's your hostel status overview.</p>
                    </div>
                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-4 py-2 rounded-full border ${profile?.roomNumber
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${profile?.roomNumber ? 'bg-emerald-400' : 'bg-amber-400/80 animate-pulse'
                            }`}></span>
                        <span className="font-medium">
                            {profile?.roomNumber ? 'Room Assigned' : 'Awaiting Assignment'}
                        </span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 animate-slideDown">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-red-200">{error}</span>
                        </div>
                    </div>
                )}

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Card */}
                    <div className="group bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white">My Profile</h3>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                                <p className="text-xs text-slate-400 mb-1">Full Name</p>
                                <p className="text-white font-medium">{profile?.name}</p>
                            </div>
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                                <p className="text-xs text-slate-400 mb-1">Email</p>
                                <p className="text-white font-medium">{profile?.email}</p>
                            </div>
                        </div>

                        <Link
                            to="/student/profile"
                            className="flex items-center justify-center w-full px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors group-hover:bg-slate-600/80"
                        >
                            <span>Manage Profile</span>
                            <svg className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Room Card */}
                    <div className="group bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white">My Room</h3>
                            </div>
                        </div>

                        {profile?.roomNumber ? (
                            <>
                                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-center mb-6 shadow-lg shadow-indigo-500/20">
                                    <p className="text-indigo-100 text-sm mb-1 font-medium">Room Number</p>
                                    <p className="text-5xl font-bold text-white tracking-tight">{profile.roomNumber}</p>
                                    {room && (
                                        <div className="mt-4 flex justify-center gap-6 text-sm text-indigo-100/80 border-t border-white/10 pt-4">
                                            <div className="text-center">
                                                <span className="block font-bold text-white text-lg">{room.capacity}</span>
                                                <span className="text-xs uppercase tracking-wide">Capacity</span>
                                            </div>
                                            <div className="h-auto w-px bg-white/20"></div>
                                            <div className="text-center">
                                                <span className="block font-bold text-white text-lg">{room.occupied}</span>
                                                <span className="text-xs uppercase tracking-wide">Occupied</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Link
                                    to="/student/room"
                                    className="flex items-center justify-center w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    <span>View Room Details</span>
                                    <svg className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="h-20 w-20 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600 border-dashed animate-pulse-slow">
                                    <svg className="h-10 w-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <h4 className="text-white font-medium mb-2">No Room Assigned</h4>
                                <p className="text-slate-400 text-sm mb-6">
                                    You haven't been assigned to a room yet. Please contact your hostel administrator for assignment.
                                </p>
                                <div className="inline-flex items-center px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg text-sm border border-amber-500/20">
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Status: Pending
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
