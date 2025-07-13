import React, { useState } from "react";
import {
    User,
    Calendar,
    Users,
    MessageCircle,
    Shield,
    Bell,
    LogOut,
    Briefcase,
    Home,
} from "lucide-react";
import Profile from "../components/lawyerHome/Profile";

const LawyerHome = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [showNotifications, setShowNotifications] = useState(false);

    const lawyer = {
        id: 1,
        full_name: "Adv. Priya Sharma",
        bar_registration_number: "MH/2015/045231",
        specialization: "criminal",
        experience_years: "6-10",
        location: "Mumbai, Maharashtra",
        bio: "Experienced criminal defense attorney with a proven track record of successful cases. Specializing in white-collar crimes, cybercrime, and complex litigation matters. Committed to providing comprehensive legal representation with a client-focused approach.",
        is_verified: true,
        profile_picture: null,
        rating: 4.7,
        cases_won: 89,
        clients_served: 156,
        created_at: "2020-03-15T10:30:00Z",
        user: {
            id: 1,
            email: "priya.sharma@lawfirm.com",
            role: "lawyer",
            is_active: true,
            date_joined: "2020-03-15T10:30:00Z",
        },
    };

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <Profile lawyer={lawyer} />;
            case "dashboard":
                return null;
            case "cases":
                return null;
            case "clients":
                return null;
            case "messages":
                return null;
            default:
                return null;
        }
    };

    const notifications = [
        {
            id: 1,
            type: "hearing",
            title: "Hearing Reminder",
            message: "Property Dispute case hearing tomorrow at 10:30 AM",
            time: "2 hours ago",
            read: false,
        },
        {
            id: 2,
            type: "document",
            title: "Document Uploaded",
            message: "Client uploaded new evidence documents",
            time: "4 hours ago",
            read: false,
        },
        {
            id: 3,
            type: "payment",
            title: "Payment Received",
            message: "₹25,000 received from Mr. Arvind Sharma",
            time: "1 day ago",
            read: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-white">
                            Case<span className="text-blue-400">Bridge</span>
                        </div>
                        <div className="hidden md:block text-sm text-gray-400">
                            Lawyer Dashboard
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowNotifications(!showNotifications)
                                }
                                className="text-gray-400 hover:text-white p-2 relative"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                                    {
                                        notifications.filter((n) => !n.read)
                                            .length
                                    }
                                </span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                                    <div className="p-4 border-b border-gray-700">
                                        <h4 className="font-semibold text-white">
                                            Notifications
                                        </h4>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className="p-3 border-b border-gray-700 hover:bg-gray-700"
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div
                                                        className={`w-2 h-2 rounded-full mt-2 ${
                                                            notification.read
                                                                ? "bg-gray-400"
                                                                : "bg-blue-400"
                                                        }`}
                                                    ></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-white">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-white">
                                    {lawyer.full_name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Advocate
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                <nav className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
                    <div className="p-4">
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === "dashboard"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                                }`}
                            >
                                <Home className="w-5 h-5" />
                                <span>Dashboard</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === "profile"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                                }`}
                            >
                                <User className="w-5 h-5" />
                                <span>Profile</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("cases")}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === "cases"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                                }`}
                            >
                                <Briefcase className="w-5 h-5" />
                                <span>My Cases</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("clients")}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === "clients"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                                }`}
                            >
                                <Users className="w-5 h-5" />
                                <span>Clients</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("calendar")}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === "calendar"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                                }`}
                            >
                                <Calendar className="w-5 h-5" />
                                <span>Calendar</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("messages")}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === "messages"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                                }`}
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>Messages</span>
                            </button>

                            <div className="border-t border-gray-700 pt-4 mt-4">
                                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-1 p-6">{renderContent()}</main>
            </div>
        </div>
    );
};

export default LawyerHome;
