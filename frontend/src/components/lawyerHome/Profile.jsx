import React from "react";
import {
    User,
    Shield,
    Edit,
    Phone,
    Mail,
    MapPin,
    Star,
    Award,
    Calendar,
    Users,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
    const { user } = useAuth();

    const getExperienceText = (experienceYears) => {
        const experienceMap = {
            "0-2": "0-2 years",
            "3-5": "3-5 years",
            "6-10": "6-10 years",
            "11-15": "11-15 years",
            "16+": "16+ years",
        };
        return experienceMap[experienceYears] || experienceYears;
    };

    const getSpecializationText = (specialization) => {
        const specializationMap = {
            criminal: "Criminal Law",
            civil: "Civil Law",
            corporate: "Corporate Law",
            family: "Family Law",
            intellectual_property: "Intellectual Property Law",
            general: "General Practice",
        };
        return specializationMap[specialization] || specialization;
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">
                        Profile Information
                    </h3>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                                {user.lawyer_profile.profile_picture ? (
                                    <img
                                        src={
                                            user.lawyer_profile.profile_picture
                                        }
                                        alt={user.lawyer_profile.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-white">
                                    {user.lawyer_profile.full_name}
                                </h4>
                                <div className="flex items-center space-x-2">
                                    <Shield
                                        className={`w-4 h-4 ${
                                            user.lawyer_profile.is_verified
                                                ? "text-green-400"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    <span
                                        className={`text-sm ${
                                            user.lawyer_profile.is_verified
                                                ? "text-green-400"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {user.lawyer_profile.is_verified
                                            ? "Verified by Bar Council"
                                            : "Verification Pending"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">
                                    {user?.email || "Email not available"}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">
                                    {user.lawyer_profile.location}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">
                                    Member since{" "}
                                    {new Date(
                                        user.lawyer_profile.created_at
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h5 className="font-medium text-white mb-2">
                                Professional Details
                            </h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Bar Registration:
                                    </span>
                                    <span className="text-gray-300">
                                        {
                                            user.lawyer_profile
                                                .bar_registration_number
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Specialization:
                                    </span>
                                    <span className="text-gray-300">
                                        {getSpecializationText(
                                            user.lawyer_profile.specialization
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Experience:
                                    </span>
                                    <span className="text-gray-300">
                                        {getExperienceText(
                                            user.lawyer_profile.experience_years
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        User Role:
                                    </span>
                                    <span className="text-blue-400 capitalize">
                                        {user?.role || "Lawyer"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {user.lawyer_profile.bio && (
                            <div>
                                <h5 className="font-medium text-white mb-2">
                                    About
                                </h5>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {user.lawyer_profile.bio}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                        {user.lawyer_profile.rating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${
                                    i < Math.floor(user.lawyer_profile.rating)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-400"
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-400">Client Rating</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                        {user.lawyer_profile.cases_won}
                    </div>
                    <div className="flex items-center justify-center mb-1">
                        <Award className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-sm text-gray-400">Cases Won</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                        {user.lawyer_profile.clients_served}
                    </div>
                    <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-400">Clients Served</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
