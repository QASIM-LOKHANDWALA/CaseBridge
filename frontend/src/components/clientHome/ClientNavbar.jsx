import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, MessageCircle, LogOut, Menu, X, User, Bell } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const ClientNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const navItems = [
        {
            name: "Home",
            path: "/home",
            icon: Home,
        },
        {
            name: "Messages",
            path: "/chat",
            icon: MessageCircle,
        },
    ];

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-800">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="text-2xl font-bold text-white">
                            Case<span className="text-blue-400">Bridge</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                                        isActivePath(item.path)
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                                    }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-3 px-3 py-2 bg-gray-800 rounded-lg">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                                {user?.profile_picture ? (
                                    <img
                                        src={user.profile_picture}
                                        alt={user.full_name || "User"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-medium text-white">
                                    {user?.full_name || "Client"}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-lg font-medium transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>

                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
                        <div className="flex flex-col space-y-2 pt-4">
                            <div className="flex items-center space-x-3 px-3 py-3 bg-gray-800 rounded-lg mb-4">
                                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                                    {user?.profile_picture ? (
                                        <img
                                            src={user.profile_picture}
                                            alt={user.full_name || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white">
                                        {user?.full_name || "Client"}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            {navItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-colors ${
                                            isActivePath(item.path)
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                                        }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}

                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-lg font-medium transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default ClientNavbar;
