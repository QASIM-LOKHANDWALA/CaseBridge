import React from "react";
import {
    User,
    Calendar,
    Users,
    MessageCircle,
    Shield,
    Search,
    Bell,
    Settings,
    LogOut,
    Clock,
    Plus,
    Edit,
    Eye,
    Phone,
    Mail,
    MapPin,
    Award,
    Briefcase,
    Filter,
    Video,
    Star,
    TrendingUp,
    IndianRupee,
    Home,
} from "lucide-react";

const Clients = ({ clients }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">My Clients</h3>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {clients.map((client) => (
                    <div
                        key={client.id}
                        className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">
                                        {client.name}
                                    </h4>
                                </div>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full text-xs ${
                                    client.status === "Active"
                                        ? "bg-green-600/20 text-green-400"
                                        : "bg-gray-600/20 text-gray-400"
                                }`}
                            >
                                {client.status}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">
                                    Phone
                                </p>
                                <p className="text-sm text-gray-300">
                                    {client.phone}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">
                                    Email
                                </p>
                                <p className="text-sm text-gray-300">
                                    {client.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">
                                    Active Cases
                                </p>
                                <p className="text-sm text-blue-400">
                                    {client.activeCases}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">
                                    Total Cases
                                </p>
                                <p className="text-sm text-gray-300">
                                    {client.totalCases}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <button className="text-blue-400 hover:text-blue-300 p-1">
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button className="text-blue-400 hover:text-blue-300 p-1">
                                    <Mail className="w-4 h-4" />
                                </button>
                                <button className="text-blue-400 hover:text-blue-300 p-1">
                                    <MessageCircle className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="text-blue-400 hover:text-blue-300 p-1">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-blue-400 hover:text-blue-300 p-1">
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Clients;
