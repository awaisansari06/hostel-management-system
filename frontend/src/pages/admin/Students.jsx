import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';
import { getAllStudents, getAllRooms, addStudent, assignStudentToRoom, removeStudentFromRoom } from '../../services/adminService';

const AdminStudents = () => {
    const { addToast } = useToast();
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, assigned, unassigned

    // Form and Action States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // id of student being acted upon

    // Modal States
    const [removeModal, setRemoveModal] = useState({ show: false, studentId: null, studentName: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [studentsResponse, roomsResponse] = await Promise.all([
                getAllStudents(),
                getAllRooms()
            ]);
            setStudents(studentsResponse.data.students || []);
            setRooms(roomsResponse.data.rooms || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            addToast(err.response?.data?.message || 'Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Derived State: Filtered Students
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch =
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filterStatus === 'all' ? true :
                    filterStatus === 'assigned' ? student.roomNumber :
                        filterStatus === 'unassigned' ? !student.roomNumber : true;

            return matchesSearch && matchesFilter;
        });
    }, [students, searchTerm, filterStatus]);

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
            await addStudent(formData);
            addToast(`Student ${formData.name} added successfully!`, 'success');
            setFormData({ name: '', email: '', password: '' });
            setShowForm(false);
            fetchData();
        } catch (err) {
            console.error('Error adding student:', err);
            addToast(err.response?.data?.message || 'Failed to add student', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAssignRoom = async (studentId, roomId) => {
        if (!roomId) return;

        setActionLoading(studentId);

        try {
            await assignStudentToRoom(studentId, roomId);
            addToast('Student assigned to room successfully!', 'success');
            fetchData();
        } catch (err) {
            console.error('Error assigning room:', err);
            addToast(err.response?.data?.message || 'Failed to assign room', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const initiateRemoveStudent = (student) => {
        setRemoveModal({
            show: true,
            studentId: student._id,
            studentName: student.name
        });
    };

    const confirmRemoveStudent = async () => {
        const studentId = removeModal.studentId;
        setRemoveModal({ show: false, studentId: null, studentName: '' });
        setActionLoading(studentId);

        try {
            await removeStudentFromRoom(studentId);
            addToast('Student removed from room successfully!', 'success');
            fetchData();
        } catch (err) {
            console.error('Error removing from room:', err);
            addToast(err.response?.data?.message || 'Failed to remove student from room', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const availableRooms = rooms.filter(room => !room.isFull);

    return (
        <DashboardLayout role="admin">
            <div className="p-6 space-y-6">
                <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
                    {/* Header with Title and Add Button */}
                    <div className="p-6 border-b border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Student Management</h2>
                                <p className="text-sm text-slate-400">Manage student accounts and room assignments</p>
                            </div>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${showForm
                                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/30'
                                    }`}
                            >
                                <svg className={`h-5 w-5 transition-transform duration-200 ${showForm ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>{showForm ? 'Cancel' : 'Add Student'}</span>
                            </button>
                        </div>

                        {/* Search and Filters Toolbar */}
                        <div className="mt-6 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="flex gap-2">
                                {['all', 'assigned', 'unassigned'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${filterStatus === status
                                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                                                : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                                            }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Add Student Form */}
                    {showForm && (
                        <div className="p-6 border-b border-slate-700 bg-slate-700/30 animate-slideDown">
                            <h3 className="text-lg font-semibold text-white mb-4">Add New Student</h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-xs font-medium text-slate-400">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-xs font-medium text-slate-400">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="student@example.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="password" className="text-xs font-medium text-slate-400">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        minLength="6"
                                        required
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                                    >
                                        {submitting ? 'Adding...' : 'Add Student'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Student List Table */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} variant="rect" height="64px" className="w-full" />
                                ))}
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="max-w-md mx-auto">
                                    <div className="h-16 w-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="h-8 w-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">No Students Found</h3>
                                    <p className="text-slate-400 text-sm">
                                        {searchTerm || filterStatus !== 'all'
                                            ? 'Try adjusting your search or filters.'
                                            : 'Get started by adding a new student.'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-800 border-b border-slate-700">
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400">Student</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400">Email</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400">Room Status</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-slate-700/20 transition-colors duration-150">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-slate-200 font-medium">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-400 text-sm">{student.email}</td>
                                            <td className="py-4 px-6">
                                                {student.roomNumber ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                                                        Room {student.roomNumber}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                {student.roomNumber ? (
                                                    <button
                                                        onClick={() => initiateRemoveStudent(student)}
                                                        disabled={actionLoading === student._id}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-md transition-all duration-200 disabled:opacity-50"
                                                    >
                                                        {actionLoading === student._id ? (
                                                            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent mr-1"></span>
                                                        ) : (
                                                            <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        )}
                                                        Remove
                                                    </button>
                                                ) : (
                                                    <div className="relative inline-block text-left w-48">
                                                        <select
                                                            onChange={(e) => handleAssignRoom(student._id, e.target.value)}
                                                            disabled={actionLoading === student._id || availableRooms.length === 0}
                                                            defaultValue=""
                                                            className="block w-full pl-3 pr-8 py-1.5 text-xs text-slate-200 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 appearance-none cursor-pointer hover:bg-slate-600 transition-colors"
                                                        >
                                                            <option value="" disabled> Assign to Room... </option>
                                                            {availableRooms.map((room) => (
                                                                <option key={room._id} value={room._id}>
                                                                    Room {room.roomNumber} ({room.availableBeds} beds)
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={removeModal.show}
                onClose={() => setRemoveModal({ show: false, studentId: null, studentName: '' })}
                title="Remove Student from Room"
                type="danger"
                footer={
                    <>
                        <button
                            onClick={() => setRemoveModal({ show: false, studentId: null, studentName: '' })}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmRemoveStudent}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg shadow-red-500/30"
                        >
                            Confirm Removal
                        </button>
                    </>
                }
            >
                <p className="text-slate-300">
                    Are you sure you want to remove <span className="font-bold text-white">{removeModal.studentName}</span> from their room?
                </p>
                <p className="mt-2 text-sm text-slate-400">
                    This action will free up a bed in the room. The student will become unassigned.
                </p>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminStudents;
