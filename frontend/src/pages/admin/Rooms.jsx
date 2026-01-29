import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';
import { getAllRooms, createRoom } from '../../services/adminService';

const AdminRooms = () => {
    const { addToast } = useToast();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        roomNumber: '',
        capacity: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await getAllRooms();
            setRooms(response.data.rooms || []);
        } catch (err) {
            console.error('Error fetching rooms:', err);
            addToast(err.response?.data?.message || 'Failed to load rooms', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await createRoom({
                roomNumber: formData.roomNumber,
                capacity: parseInt(formData.capacity)
            });

            addToast(`Room ${formData.roomNumber} created successfully!`, 'success');
            setFormData({ roomNumber: '', capacity: '' });
            setShowForm(false);
            fetchRooms(); // Refresh the list
        } catch (err) {
            console.error('Error creating room:', err);
            addToast(err.response?.data?.message || 'Failed to create room', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="p-6 space-y-6">
                <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Room Management</h2>
                                <p className="text-sm text-slate-400">Manage all hostel rooms and their assignments</p>
                            </div>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${showForm
                                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/30'
                                    }`}
                            >
                                <svg className={`h-5 w-5 transition-transform duration-200 ${showForm ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>{showForm ? 'Cancel' : 'Add Room'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Create Room Form */}
                    {showForm && (
                        <div className="p-6 border-b border-slate-700 bg-slate-700/30 animate-slideDown">
                            <h3 className="text-lg font-semibold text-white mb-4">Create New Room</h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="roomNumber" className="block text-sm font-medium text-slate-300 mb-2">
                                        Room Number
                                    </label>
                                    <input
                                        type="text"
                                        id="roomNumber"
                                        name="roomNumber"
                                        value={formData.roomNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="e.g., 101, A-205"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="capacity" className="block text-sm font-medium text-slate-300 mb-2">
                                        Capacity
                                    </label>
                                    <input
                                        type="number"
                                        id="capacity"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="e.g., 2, 4"
                                        min="1"
                                        max="10"
                                        required
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                                    >
                                        {submitting ? 'Creating...' : 'Create Room'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Room List */}
                    <div className="p-6">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} variant="rect" height="200px" />
                                ))}
                            </div>
                        ) : rooms.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <div className="h-20 w-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="h-10 w-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">No Rooms Yet</h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        Room list will be displayed here once you add rooms to the system.
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Click "Add Room" to create your first room
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rooms.map((room) => (
                                    <div
                                        key={room._id}
                                        className="bg-slate-700/30 border border-slate-600 rounded-lg p-5 hover:border-indigo-500/50 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl flex flex-col"
                                    >
                                        {/* Card Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-white">Room {room.roomNumber}</h4>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {room.isFull ? (
                                                        <span className="flex items-center text-red-400">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400 mr-1.5"></span>
                                                            Full Capacity
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center text-emerald-400">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                                                            {room.availableBeds} beds available
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${room.isFull
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                : room.occupancyRate > 50
                                                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                }`}>
                                                {room.occupancyRate}%
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ease-out rounded-full ${room.isFull
                                                        ? 'bg-red-500'
                                                        : room.occupancyRate > 50
                                                            ? 'bg-yellow-500'
                                                            : 'bg-emerald-500'
                                                        }`}
                                                    style={{ width: `${room.occupancyRate}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50 text-center">
                                                <span className="block text-xs text-slate-500 uppercase tracking-wider">Capacity</span>
                                                <span className="block text-lg font-semibold text-white">{room.capacity}</span>
                                            </div>
                                            <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50 text-center">
                                                <span className="block text-xs text-slate-500 uppercase tracking-wider">Occupied</span>
                                                <span className="block text-lg font-semibold text-white">{room.occupied}</span>
                                            </div>
                                        </div>

                                        {/* Student List */}
                                        <div className="flex-1">
                                            {room.students && room.students.length > 0 ? (
                                                <div className="mb-4">
                                                    <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Residents</p>
                                                    <div className="space-y-2">
                                                        {room.students.map((student) => (
                                                            <div key={student._id} className="flex items-center space-x-2 text-sm bg-slate-800/30 p-2 rounded border border-slate-700/50">
                                                                <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-bold">
                                                                    {student.name.charAt(0)}
                                                                </div>
                                                                <span className="text-slate-300 truncate">{student.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mb-4 flex items-center justify-center h-20 bg-slate-800/20 rounded border border-slate-700/30 border-dashed">
                                                    <span className="text-xs text-slate-500 italic">No residents assigned</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-4 pt-4 border-t border-slate-600/50 grid grid-cols-2 gap-2">
                                            <Link
                                                to="/admin/students"
                                                className="px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded text-center transition-colors flex items-center justify-center space-x-1"
                                            >
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <span>Assign</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
                                                        alert('Delete functionality coming soon!');
                                                    }
                                                }}
                                                className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-center transition-colors flex items-center justify-center space-x-1"
                                            >
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminRooms;
