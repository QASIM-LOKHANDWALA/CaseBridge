import React from "react";
import { Plus } from "lucide-react";

const Cases = ({ cases }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">My Cases</h3>
                <div className="flex items-center space-x-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
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
                                    Case No: {case_.caseNumber}
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
                                    {case_.nextHearing}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cases;
