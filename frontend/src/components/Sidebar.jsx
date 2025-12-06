import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    UserPlus,
    Users,
    Search,
    LogOut,
    Activity,
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/add-patient', icon: UserPlus, label: 'Add Patient' },
        { path: '/manage-patients', icon: Users, label: 'Manage Patients' },
        { path: '/search-patients', icon: Search, label: 'Search Patients' },
    ];

    return (
        <div className="h-screen w-64 bg-card border-r border-border flex flex-col">
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                    <Activity className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-xl font-bold">MediCare</h1>
                        <p className="text-xs text-muted-foreground">Patient Management</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
