import React, { useState, useEffect } from "react";
import { Search, Filter, Shield } from "lucide-react";
import LawyerCard from "../components/clientHome/LawyerCard";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import ClientNavbar from "../components/clientHome/ClientNavbar";

const ClientHome = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [experienceFilter, setExperienceFilter] = useState("");
    const [specializationFilter, setSpecializationFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [lawyers, setLawyers] = useState([]);
    const { token } = useAuth();

    const indianCities = [
        "Mumbai",
        "Delhi",
        "Bengaluru",
        "Hyderabad",
        "Ahmedabad",
        "Chennai",
        "Kolkata",
        "Pune",
        "Jaipur",
        "Surat",
        "Lucknow",
        "Kanpur",
        "Nagpur",
        "Indore",
        "Bhopal",
        "Patna",
        "Ludhiana",
        "Agra",
        "Nashik",
        "Vadodara",
        "Faridabad",
        "Ghaziabad",
        "Rajkot",
        "Meerut",
        "Amritsar",
        "Varanasi",
    ];

    const specializations = [
        { value: "criminal", label: "Criminal Law" },
        { value: "civil", label: "Civil Law" },
        { value: "corporate", label: "Corporate Law" },
        { value: "family", label: "Family Law" },
        { value: "intellectual_property", label: "Intellectual Property Law" },
        { value: "general", label: "General Practice" },
    ];

    const experienceRanges = [
        { value: "0-2", label: "0-2 years" },
        { value: "3-5", label: "3-5 years" },
        { value: "6-10", label: "6-10 years" },
        { value: "11-15", label: "11-15 years" },
        { value: "16+", label: "16+ years" },
    ];

    const fetchLawyers = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/lawyers/list/",
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            console.log(`Fetch Lawyers Response : `, response.data);

            if (response.status === 200) {
                setLawyers(response.data);
            }
        } catch (error) {
            console.log(`Error fetching lawyers: ${error}`);
        }
    };

    useEffect(() => {
        fetchLawyers();
    }, []);

    const filteredLawyers = lawyers.filter((lawyer) => {
        const matchesSearch =
            lawyer.lawyer_profile.full_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            lawyer.lawyer_profile.bio
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesLocation =
            !locationFilter ||
            lawyer.lawyer_profile.location === locationFilter;
        const matchesExperience =
            !experienceFilter ||
            lawyer.lawyer_profile.experience_years === experienceFilter;
        const matchesSpecialization =
            !specializationFilter ||
            lawyer.lawyer_profile.specialization === specializationFilter;

        return (
            matchesSearch &&
            matchesLocation &&
            matchesExperience &&
            matchesSpecialization
        );
    });

    const getSpecializationLabel = (value) => {
        const spec = specializations.find((s) => s.value === value);
        return spec ? spec.label : value;
    };

    const clearFilters = () => {
        setLocationFilter("");
        setExperienceFilter("");
        setSpecializationFilter("");
        setSearchTerm("");
    };

    const activeFiltersCount = [
        locationFilter,
        experienceFilter,
        specializationFilter,
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <ClientNavbar />

            <div className="pt-20 bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold">
                            Find Your Perfect{" "}
                            <span className="text-blue-400">Legal Partner</span>
                        </h1>
                        <div className="flex items-center space-x-2 bg-blue-600/20 border border-blue-600/30 rounded-full px-4 py-2 text-sm text-blue-300">
                            <Shield className="w-4 h-4" />
                            <span>
                                {filteredLawyers.length} Verified Lawyers
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search lawyers by name or expertise..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg transition-colors border border-gray-600"
                        >
                            <Filter className="w-5 h-5" />
                            <span>Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Location
                                    </label>
                                    <select
                                        value={locationFilter}
                                        onChange={(e) =>
                                            setLocationFilter(e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Locations</option>
                                        {indianCities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Experience
                                    </label>
                                    <select
                                        value={experienceFilter}
                                        onChange={(e) =>
                                            setExperienceFilter(e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            All Experience Levels
                                        </option>
                                        {experienceRanges.map((range) => (
                                            <option
                                                key={range.value}
                                                value={range.value}
                                            >
                                                {range.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Specialization
                                    </label>
                                    <select
                                        value={specializationFilter}
                                        onChange={(e) =>
                                            setSpecializationFilter(
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            All Specializations
                                        </option>
                                        {specializations.map((spec) => (
                                            <option
                                                key={spec.value}
                                                value={spec.value}
                                            >
                                                {spec.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {activeFiltersCount > 0 && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={clearFilters}
                                        className="text-blue-400 hover:text-blue-300 text-sm"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold">
                        {filteredLawyers.length} Lawyers Found
                    </h2>
                    <div className="text-sm text-gray-400">
                        Showing verified legal professionals
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredLawyers.map((lawyer) => (
                        <LawyerCard
                            key={lawyer.id}
                            lawyer={lawyer}
                            getSpecializationLabel={getSpecializationLabel}
                        />
                    ))}
                </div>

                {filteredLawyers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            No lawyers found
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Try adjusting your search criteria or filters to
                            find more results.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientHome;
