import React, { useState } from "react";
import {
    Plus,
    X,
    Calendar,
    User,
    Building,
    Hash,
    FileText,
    AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

const Cases = ({ cases, onCaseAdded, clients }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        client_id: "",
        court: "",
        case_number: "",
        next_hearing: "",
        status: "active",
        priority: "medium",
    });
    const { token } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Input changed: ${name} = ${value}`);

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        const requiredFields = [
            "title",
            "client_id",
            "court",
            "case_number",
            "next_hearing",
        ];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setError(`${field.replace("_", " ")} is required`);
                setIsLoading(false);
                return;
            }
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/lawyers/cases/",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                setIsModalOpen(false);
                setFormData({
                    title: "",
                    client_id: "",
                    court: "",
                    case_number: "",
                    next_hearing: "",
                    status: "active",
                    priority: "medium",
                });

                onCaseAdded(response.data.case);
            } else {
                setError(response.data.error || "Failed to create case");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            console.error("Error creating case:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
        setFormData({
            title: "",
            client_id: "",
            court: "",
            case_number: "",
            next_hearing: "",
            status: "active",
            priority: "medium",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">My Cases</h3>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Case</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {cases.map((case_) => (
                    <div
                        key={case_.id}
                        className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">
                                    {case_.title}
                                </h4>
                                <p className="text-sm text-gray-400">
                                    Case No: {case_.case_number}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`px-3 py-1 rounded-full text-xs ${
                                        case_.status === "Active"
                                            ? "bg-green-600/20 text-green-400"
                                            : case_.status === "In Progress"
                                            ? "bg-yellow-600/20 text-yellow-400"
                                            : "bg-gray-600/20 text-gray-400"
                                    }`}
                                >
                                    {case_.status}
                                </div>
                                <div
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        case_.priority === "High"
                                            ? "bg-red-600/20 text-red-400"
                                            : case_.priority === "Medium"
                                            ? "bg-yellow-600/20 text-yellow-400"
                                            : "bg-green-600/20 text-green-400"
                                    }`}
                                >
                                    {case_.priority}
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">
                                    Client
                                </p>
                                <p className="text-sm text-gray-300">
                                    {case_.client}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">
                                    Court
                                </p>
                                <p className="text-sm text-gray-300">
                                    {case_.court}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">
                                    Next Hearing
                                </p>
                                <p className="text-sm text-blue-400">
                                    {case_.next_hearing}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">
                                Add New Case
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3 flex items-center space-x-2">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <span className="text-red-400 text-sm">
                                        {error}
                                    </span>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <FileText className="w-4 h-4 inline mr-1" />
                                        Case Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter case title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Client *
                                    </label>
                                    <select
                                        name="client_id"
                                        value={formData.client_id}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            -- Select Client --
                                        </option>
                                        {clients.map((client) => (
                                            <option
                                                key={client.id}
                                                value={client.id}
                                            >
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <Building className="w-4 h-4 inline mr-1" />
                                        Court *
                                    </label>
                                    <input
                                        type="text"
                                        name="court"
                                        value={formData.court}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter court name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <Hash className="w-4 h-4 inline mr-1" />
                                        Case Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="case_number"
                                        value={formData.case_number}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter case number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Next Hearing *
                                </label>
                                <input
                                    type="date"
                                    name="next_hearing"
                                    value={formData.next_hearing}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="in_progress">
                                            In Progress
                                        </option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            <span>Create Case</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cases;
