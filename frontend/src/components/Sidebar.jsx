import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role = 'admin' }) => {
    const location = useLocation();

    const adminLinks = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'Rooms',
            path: '/admin/rooms',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            name: 'Students',
            path: '/admin/students',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        }
    ];

    const studentLinks = [
        {
            name: 'Dashboard',
            path: '/student/dashboard',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'Profile',
            path: '/student/profile',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            name: 'My Room',
            path: '/student/room',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        }
    ];

    const links = role === 'admin' ? adminLinks : studentLinks;
    const gradientClass = role === 'admin'
        ? 'from-indigo-500 to-purple-600'
        : 'from-emerald-500 to-teal-600';

    return (
        <div className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen flex flex-col">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 bg-gradient-to-br ${gradientClass} rounded-lg flex items-center justify-center`}>
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Hostel MS</h1>
                        <p className="text-xs text-slate-400 capitalize">{role} Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg`
                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                }`}
                        >
                            <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}>
                                {link.icon}
                            </span>
                            <span className="font-medium">{link.name}</span>
                            {isActive && (
                                <div className="ml-auto">
                                    <div className="h-2 w-2 bg-white rounded-full"></div>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
                <div className="text-xs text-slate-500 text-center">
                    <p>Hostel Management System</p>
                    <p className="mt-1">v1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
