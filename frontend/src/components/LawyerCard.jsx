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

const LawyerCard = ({ lawyer, getSpecializationLabel }) => {
    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-600/50 transition-all duration-300 hover:transform hover:scale-105 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {lawyer.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {lawyer.full_name}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-400">
                                {getSpecializationLabel(lawyer.specialization)}
                            </span>
                            {lawyer.is_verified && (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">
                            {lawyer.rating}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{lawyer.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{lawyer.experience_years} exp</span>
                </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {lawyer.bio}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-green-400" />
                        <div>
                            <div className="text-xs text-gray-400">
                                Cases Won
                            </div>
                            <div className="text-sm font-semibold">
                                {lawyer.cases_won}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <div>
                            <div className="text-xs text-gray-400">
                                Clients Served
                            </div>
                            <div className="text-sm font-semibold">
                                {lawyer.clients_served}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Consult Now</span>
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default LawyerCard;
