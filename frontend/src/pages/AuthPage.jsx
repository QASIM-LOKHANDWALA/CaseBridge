import React, { useState } from "react";
import axios from "axios";

const AuthPage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "general",
        full_name: "",
        phone_number: "",
        address: "",
    });

    const [message, setMessage] = useState("");

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setFormData({
            email: "",
            password: "",
            role: "general",
            full_name: "",
            phone_number: "",
            address: "",
        });
        setMessage("");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-8 rounded-xl border border-gray-700 max-w-lg w-full"
            >
                <h2 className="text-white text-3xl font-bold mb-6 text-center">
                    {isSignup ? "Create Account" : "Login to Case Bridge"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isSignup && (
                        <>
                            <div className="mb-4">
                                <label className="text-gray-300 block mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                            required
                        />
                    </div>

                    {isSignup && (
                        <>
                            <div className="mb-4">
                                <label className="text-gray-300 block mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-gray-300 block mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                >
                                    <option value="general">
                                        General User
                                    </option>
                                    <option value="lawyer">Lawyer</option>
                                </select>
                            </div>

                            {formData.role === "general" && (
                                <>
                                    <div className="mb-4">
                                        <label className="text-gray-300 block mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-gray-300 block mb-1">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                            rows="2"
                                        />
                                    </div>
                                </>
                            )}

                            {formData.role === "lawyer" && (
                                <>
                                    <div className="mb-4">
                                        <label className="text-gray-300 block mb-1">
                                            Bar Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            name="bar_registration_number"
                                            value={
                                                formData.bar_registration_number ||
                                                ""
                                            }
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-gray-300 block mb-1">
                                            Specialization
                                        </label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={
                                                formData.specialization || ""
                                            }
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-gray-300 block mb-1">
                                            Experience (Years)
                                        </label>
                                        <input
                                            type="number"
                                            name="experience_years"
                                            value={
                                                formData.experience_years || ""
                                            }
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-gray-300 block mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-gray-300 block mb-1">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                            rows="2"
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg font-semibold transition-colors"
                >
                    {isSignup ? "Sign Up" : "Login"}
                </button>

                {message && (
                    <p className="mt-4 text-center text-gray-300 text-sm">
                        {message}
                    </p>
                )}

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-blue-400 hover:underline text-sm"
                    >
                        {isSignup
                            ? "Already have an account? Login"
                            : "Don't have an account? Sign up"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AuthPage;
