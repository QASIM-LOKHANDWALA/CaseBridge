import React, { useState, useEffect } from "react";
import {
    Plus,
    X,
    Calendar,
    User,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Phone,
    Mail,
    MapPin,
    Filter,
    Search,
    Edit,
    Trash2,
    Video,
    UserCheck,
    CalendarDays,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";

const Appointments = ({ clients }) => {
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [formData, setFormData] = useState({
        user_id: "",
        title: "",
        description: "",
        appointment_date: "",
        appointment_time: "",
        status: "scheduled",
    });
    const { token } = useAuth();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/appointments/",
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            console.log(response.data);

            setAppointments(response.data || []);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error("Failed to fetch appointments");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        const requiredFields = [
            "user_id",
            "title",
            "appointment_date",
            "appointment_time",
            "description",
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
                "http://localhost:8000/api/appointments/schedule-appointment/",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                closeModal();
                fetchAppointments();
                toast.success("Appointment scheduled successfully!");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to save appointment");
            console.error("Error saving appointment:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            const response = await axios.patch(
                `http://localhost:8000/api/appointments/${appointmentId}/status/`,
                { status: newStatus },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                fetchAppointments();
                toast.success("Appointment status updated!");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update appointment status");
        }
    };

    const handleDelete = async (appointmentId) => {
        if (
            !window.confirm("Are you sure you want to delete this appointment?")
        ) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:8000/api/appointments/${appointmentId}/delete/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                fetchAppointments();
                toast.success("Appointment deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting appointment:", error);
            toast.error("Failed to delete appointment");
        }
    };

    const openModal = (appointment = null) => {
        setFormData({
            user_id: "",
            title: "",
            description: "",
            appointment_date: "",
            appointment_time: "",
            status: "scheduled",
        });

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
        setFormData({
            user_id: "",
            title: "",
            description: "",
            appointment_date: "",
            appointment_time: "",
            status: "scheduled",
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case "cancelled":
                return <XCircle className="w-4 h-4 text-red-400" />;
            case "no_show":
                return <AlertCircle className="w-4 h-4 text-orange-400" />;
            default:
                return <Clock className="w-4 h-4 text-blue-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-600/20 text-green-400";
            case "cancelled":
                return "bg-red-600/20 text-red-400";
            case "no_show":
                return "bg-orange-600/20 text-orange-400";
            default:
                return "bg-blue-600/20 text-blue-400";
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "court_hearing":
                return <CalendarDays className="w-4 h-4 text-purple-400" />;
            case "video_call":
                return <Video className="w-4 h-4 text-blue-400" />;
            case "phone_call":
                return <Phone className="w-4 h-4 text-green-400" />;
            default:
                return <UserCheck className="w-4 h-4 text-gray-400" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const isUpcoming = (date, time) => {
        const appointmentDateTime = new Date(`${date.split("T")[0]}T${time}`);
        return appointmentDateTime > new Date();
    };

    const filteredAppointments = appointments.filter((appointment) => {
        const client = clients.find((c) => c.id === appointment.user);
        const clientName = client ? client.name : "Unknown Client";

        const matchesSearch = clientName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || appointment.status === statusFilter;

        let matchesDate = true;
        const appointmentDate = appointment.appointment_date.split("T")[0];
        if (dateFilter === "upcoming") {
            matchesDate = isUpcoming(
                appointment.appointment_date,
                appointment.appointment_time
            );
        } else if (dateFilter === "past") {
            matchesDate = !isUpcoming(
                appointment.appointment_date,
                appointment.appointment_time
            );
        } else if (dateFilter === "today") {
            const today = new Date().toISOString().split("T")[0];
            matchesDate = appointmentDate === today;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                    Appointments
                </h3>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Appointment</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by client name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                </select>

                <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                </select>
            </div>

            <div className="grid gap-4">
                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-lg">No appointments found</p>
                        <p className="text-sm">
                            Schedule your first appointment to get started
                        </p>
                    </div>
                ) : (
                    filteredAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h4 className="font-semibold text-white">
                                                {appointment.user.full_name}
                                            </h4>
                                            <div
                                                className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(
                                                    appointment.status
                                                )}`}
                                            >
                                                {getStatusIcon(
                                                    appointment.status
                                                )}
                                                <span className="capitalize">
                                                    {appointment.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                handleDelete(appointment.id)
                                            }
                                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                            title="Delete appointment"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            Date
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            {formatDate(
                                                appointment.appointment_date
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            Time
                                        </p>
                                        <p className="text-sm text-blue-400">
                                            {formatTime(
                                                appointment.appointment_time
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            Contact
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm text-gray-300">
                                                {appointment.user.phone_number}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            Description
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            {appointment.description || "—"}
                                        </p>
                                    </div>
                                </div>

                                {appointment.status === "scheduled" && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    appointment.id,
                                                    "completed"
                                                )
                                            }
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                        >
                                            Mark Completed
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    appointment.id,
                                                    "cancelled"
                                                )
                                            }
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    appointment.id,
                                                    "no_show"
                                                )
                                            }
                                            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                        >
                                            No Show
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">
                                Schedule New Appointment
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
                                        <User className="w-4 h-4 inline mr-1" />
                                        Client *
                                    </label>
                                    <select
                                        name="user_id"
                                        value={formData.user}
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="appointment_date"
                                        value={formData.appointment_date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="appointment_time"
                                        value={formData.appointment_time}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

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
                                        <option value="scheduled">
                                            Scheduled
                                        </option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                        <option value="no_show">No Show</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter appointment title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Additional description about the appointment"
                                />
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
                                            <span>Scheduling...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="w-4 h-4" />
                                            <span>Schedule Appointment</span>
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

export default Appointments;
