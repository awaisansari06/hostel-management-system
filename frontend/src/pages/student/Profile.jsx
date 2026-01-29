import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateProfile } from '../../services/studentService';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import Skeleton from '../../components/Skeleton';

const StudentProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        phone: ''
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getMyProfile();
            setProfile(response.data.student);
            setEditFormData({
                name: response.data.student.name || '',
                phone: response.data.student.phone || ''
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');
        setSuccess('');

        try {
            await updateProfile(editFormData);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            fetchProfile(); // Refresh data

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fadeIn">
                    <div className="flex justify-between items-center mb-8">
                        <div className="space-y-2">
                            <Skeleton variant="text" width="200px" height="2rem" />
                            <Skeleton variant="text" width="250px" />
                        </div>
                        <Skeleton variant="rect" width="120px" height="40px" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Skeleton variant="rect" height="300px" className="md:col-span-1" />
                        <div className="md:col-span-2 space-y-6">
                            <Skeleton variant="rect" height="180px" />
                            <Skeleton variant="rect" height="120px" />
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">My Profile</h1>
                        <p className="text-slate-400">Manage your personal information</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>Edit Profile</span>
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 animate-slideDown">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-red-200">{error}</span>
                        </div>
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-4 animate-slideDown">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-emerald-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-emerald-200">{success}</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ID Card Column */}
                    <div className="md:col-span-1">
                        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden relative group hover:shadow-emerald-500/10 transition-shadow">
                            <div className="h-24 bg-gradient-to-br from-emerald-500 to-teal-600"></div>
                            <div className="px-6 pb-6 text-center -mt-12 relative z-10">
                                <div className="h-24 w-24 bg-slate-900 rounded-full p-1 mx-auto mb-3">
                                    <div className="h-full w-full bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-slate-700">
                                        {profile?.name?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{profile?.name}</h3>
                                <p className="text-sm text-slate-400 mb-4">{profile?.email}</p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                                    Student
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Information Column */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Info */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Student ID</label>
                                    <p className="text-slate-200 font-mono bg-slate-900/50 px-3 py-2 rounded border border-slate-700/50">
                                        {profile?.studentId || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
                                    <p className="text-slate-200">{profile?.phone || 'Not provided'}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                                    <p className="text-slate-200 flex items-center">
                                        {profile?.email}
                                        <svg className="h-4 w-4 ml-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Room Info */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="h-5 w-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Room Assignment
                            </h3>
                            {profile?.roomNumber ? (
                                <div className="flex items-center p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg group hover:bg-indigo-500/20 transition-colors">
                                    <div className="bg-indigo-500 rounded-lg p-3 mr-4 group-hover:scale-110 transition-transform">
                                        <span className="text-white font-bold text-xl">{profile.roomNumber}</span>
                                    </div>
                                    <div>
                                        <p className="text-indigo-200 font-medium">Assigned Room</p>
                                        <p className="text-xs text-indigo-300/70">You are currently assigned to this room.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg group hover:bg-amber-500/20 transition-colors">
                                    <div className="bg-amber-500/20 rounded-lg p-3 mr-4 text-amber-500 group-hover:scale-110 transition-transform">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-amber-200 font-medium">Not Assigned</p>
                                        <p className="text-xs text-amber-300/70">Please contact the administrator for room allocation.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                title="Edit Profile"
                type="default"
                footer={
                    <>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={updating}
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-50"
                        >
                            {updating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            >
                <form id="edit-profile-form" onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            placeholder="Your full name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={editFormData.phone}
                            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            placeholder="+1 234 567 8900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                disabled
                                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
                                value="********"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Password updates restricted. Contact admin to reset.
                            </p>
                        </div>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default StudentProfile;
