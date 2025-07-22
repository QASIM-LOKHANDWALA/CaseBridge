import React from "react";
import {
    MapPin,
    Star,
    Users,
    MessageCircle,
    ArrowRight,
    CheckCircle,
    Award,
    Clock,
} from "lucide-react";

const getStatusColor = (status) => {
    switch (status) {
        case "pending":
            return "bg-yellow-500 text-yellow-100";
        case "completed":
            return "bg-green-500 text-green-100";
        case "refunded":
            return "bg-blue-500 text-blue-100";
        case "failed":
            return "bg-red-500 text-red-100";
        default:
            return "bg-gray-600 text-gray-200";
    }
};

const LawyerCard = ({
    lawyer,
    getSpecializationLabel,
    handleSendRequest,
    hireStatus,
}) => {
    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-600/50 transition-all duration-300 hover:transform hover:scale-105 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {lawyer.lawyer_profile.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {lawyer.lawyer_profile.full_name}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-400">
                                {getSpecializationLabel(
                                    lawyer.lawyer_profile.specialization
                                )}
                            </span>
                            {lawyer.lawyer_profile.is_verified && (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-white">
                            {lawyer.lawyer_profile.rating}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{lawyer.lawyer_profile.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{lawyer.lawyer_profile.experience_years} exp</span>
                </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {lawyer.lawyer_profile.bio}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-green-400" />
                        <div>
                            <div className="text-xs text-gray-400">
                                Serving Cases
                            </div>
                            <div className="text-sm font-semibold text-white">
                                {lawyer.number_of_cases}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <div>
                            <div className="text-xs text-gray-400">
                                Serving Clients
                            </div>
                            <div className="text-sm font-semibold text-white">
                                {lawyer.number_of_clients}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex space-x-2">
                {hireStatus === "none" ? (
                    <button
                        onClick={() =>
                            handleSendRequest(lawyer.lawyer_profile.id)
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send Request</span>
                    </button>
                ) : (
                    <div
                        className={`flex-1 py-3 px-4 rounded-lg font-medium text-center text-sm ${getStatusColor(
                            hireStatus
                        )}`}
                    >
                        {hireStatus.charAt(0).toUpperCase() +
                            hireStatus.slice(1)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LawyerCard;
