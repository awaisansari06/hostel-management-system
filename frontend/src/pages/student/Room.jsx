import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyRoom } from '../../services/studentService';

const StudentRoom = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [roommates, setRoommates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRoomData();
    }, []);

    const fetchRoomData = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getMyRoom();
            console.log('Room API Response:', response.data); // Debug log
            setRoom(response.data.room);
            setRoommates(response.data.roommates || []); // Store roommates separately
        } catch (err) {
            console.error('Error fetching room data:', err);
            if (err.response?.status === 404) {
                setError('No room assigned yet');
            } else {
                setError('Failed to load room details');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
                    <p className="mt-4 text-slate-400">Loading room details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Navigation */}
            <nav className="bg-slate-800 border-b border-slate-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link to="/student/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                                <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-lg font-semibold text-white">Student Portal</span>
                            </Link>
                            <span className="text-slate-600">/</span>
                            <span className="text-slate-300 font-medium">My Room</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && !room ? (
                    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-12 text-center">
                        <div className="h-20 w-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="h-10 w-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Room Assigned</h3>
                        <p className="text-slate-400 mb-6">You haven't been assigned to a room yet.</p>
                        <p className="text-sm text-slate-500">Please contact the administrator for room assignment.</p>
                    </div>
                ) : room ? (
                    <div className="space-y-6">
                        {/* Room Header */}
                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-8 text-center">
                            <h2 className="text-sm font-medium text-slate-400 mb-2">Your Room</h2>
                            <h1 className="text-5xl font-bold text-white mb-4">Room {room.roomNumber}</h1>
                            <div className="flex items-center justify-center space-x-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${room.isFull
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    }`}>
                                    {room.isFull ? 'Full Capacity' : `${room.availableBeds} Beds Available`}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                                    {room.occupancyRate}% Occupied
                                </span>
                            </div>
                        </div>

                        {/* Room Details */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
                            <div className="p-6 border-b border-slate-700">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Room Information
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-400">Total Capacity</span>
                                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{room.capacity}</p>
                                        <p className="text-xs text-slate-500 mt-1">beds total</p>
                                    </div>

                                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-400">Currently Occupied</span>
                                            <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{room.occupied}</p>
                                        <p className="text-xs text-slate-500 mt-1">students</p>
                                    </div>

                                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-400">Available Beds</span>
                                            <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{room.availableBeds}</p>
                                        <p className="text-xs text-slate-500 mt-1">beds free</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Roommates */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
                            <div className="p-6 border-b border-slate-700">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Roommates ({roommates.length})
                                </h3>
                            </div>
                            <div className="p-6">
                                {roommates && roommates.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {roommates.map((student) => (
                                            <div
                                                key={student._id}
                                                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-emerald-500/50 transition-all duration-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white text-lg font-bold">
                                                            {student.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-white truncate">{student.name}</p>
                                                        <p className="text-xs text-slate-400 truncate">{student.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="h-16 w-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="h-8 w-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-400 text-sm">No roommates yet</p>
                                        <p className="text-xs text-slate-500 mt-2">You're the only one in this room</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default StudentRoom;
