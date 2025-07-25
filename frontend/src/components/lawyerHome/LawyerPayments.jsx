import React, { useState, useEffect } from "react";
import {
    Plus,
    X,
    IndianRupee,
    User,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    FileText,
    Eye,
    Search,
    CreditCard,
    Send,
    RefreshCw,
} from "lucide-react";

const LawyerPayments = ({ clients, token }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        client_id: "",
        amount: "",
        description: "",
    });

    const fetchTransactions = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/transactions/",
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                const formattedTransactions = data.transactions.map(
                    (transaction) => ({
                        ...transaction,
                        user: {
                            id: transaction.id,
                            full_name: transaction.user_name,
                            email: transaction.user_email,
                        },
                    })
                );
                setTransactions(formattedTransactions);
                setFilteredTransactions(formattedTransactions);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTransactions();
        }
    }, [token]);

    useEffect(() => {
        filterTransactions();
    }, [searchTerm, statusFilter, transactions]);

    const filterTransactions = () => {
        let filtered = transactions;

        if (searchTerm) {
            filtered = filtered.filter(
                (transaction) =>
                    transaction.user.full_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    transaction.id
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    transaction.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(
                (transaction) => transaction.status === statusFilter
            );
        }

        setFilteredTransactions(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        const requiredFields = ["client_id", "amount", "description"];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setError(`${field.replace("_", " ")} is required`);
                setIsLoading(false);
                return;
            }
        }

        if (parseFloat(formData.amount) <= 0) {
            setError("Amount must be greater than 0");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8000/api/transactions/create/",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (response.ok) {
                const newTransaction = {
                    ...data.transaction,
                    user: {
                        id: data.transaction.id,
                        full_name: data.transaction.user_name,
                        email: data.transaction.user_email,
                    },
                };

                setTransactions((prev) => [newTransaction, ...prev]);
                setIsModalOpen(false);
                setFormData({
                    client_id: "",
                    amount: "",
                    description: "",
                });

                alert("Payment request sent successfully!");
            } else {
                setError(data.error || "Failed to create payment request");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            console.error("Error creating payment request:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
        setFormData({
            client_id: "",
            amount: "",
            description: "",
        });
    };

    const openDetailModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setSelectedTransaction(null);
        setIsDetailModalOpen(false);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case "pending":
                return <Clock className="w-4 h-4 text-yellow-400" />;
            case "failed":
                return <XCircle className="w-4 h-4 text-red-400" />;
            case "refunded":
                return <RefreshCw className="w-4 h-4 text-blue-400" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-600/20 text-green-400 border-green-600/30";
            case "pending":
                return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
            case "failed":
                return "bg-red-600/20 text-red-400 border-red-600/30";
            case "refunded":
                return "bg-blue-600/20 text-blue-400 border-blue-600/30";
            default:
                return "bg-gray-600/20 text-gray-400 border-gray-600/30";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const getStatusStats = () => {
        const stats = {
            total: transactions.length,
            completed: transactions.filter((t) => t.status === "completed")
                .length,
            pending: transactions.filter((t) => t.status === "pending").length,
            failed: transactions.filter((t) => t.status === "failed").length,
            refunded: transactions.filter((t) => t.status === "refunded")
                .length,
        };

        const totalAmount = transactions
            .filter((t) => t.status === "completed")
            .reduce((sum, t) => sum + t.amount, 0);

        return { ...stats, totalAmount };
    };

    const stats = getStatusStats();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                    Payment Management
                </h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Payment Request</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">
                                Total Earnings
                            </p>
                            <p className="text-xl font-semibold text-green-400">
                                {formatCurrency(stats.totalAmount)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                            <IndianRupee className="w-5 h-5 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Pending</p>
                            <p className="text-xl font-semibold text-yellow-400">
                                {stats.pending}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Completed</p>
                            <p className="text-xl font-semibold text-green-400">
                                {stats.completed}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Failed</p>
                            <p className="text-xl font-semibold text-red-400">
                                {stats.failed}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-red-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by client name, transaction ID, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                </select>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                        Recent Transactions
                    </h4>

                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <p>No transactions found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="bg-gray-900 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-white">
                                                    {transaction.user.full_name}
                                                </h5>
                                                <p className="text-sm text-gray-400">
                                                    {transaction.id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="font-semibold text-white">
                                                    {formatCurrency(
                                                        transaction.amount
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    {formatDate(
                                                        transaction.timestamp
                                                    )}
                                                </p>
                                            </div>

                                            <div
                                                className={`px-3 py-1 rounded-full text-xs border flex items-center space-x-1 ${getStatusColor(
                                                    transaction.status
                                                )}`}
                                            >
                                                {getStatusIcon(
                                                    transaction.status
                                                )}
                                                <span className="capitalize">
                                                    {transaction.status}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    openDetailModal(transaction)
                                                }
                                                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-700">
                                        <p className="text-sm text-gray-300">
                                            {transaction.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">
                                Create Payment Request
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

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <User className="w-4 h-4 inline mr-1" />
                                    Select Client *
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
                                    {clients
                                        .filter(
                                            (client) =>
                                                client.hire_status ===
                                                "accepted"
                                        )
                                        .map((client) => (
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
                                    <IndianRupee className="w-4 h-4 inline mr-1" />
                                    Amount (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    step="0.01"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter amount"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FileText className="w-4 h-4 inline mr-1" />
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter payment description (e.g., Legal consultation fees, Court representation charges)"
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
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Send Request</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isDetailModalOpen && selectedTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">
                                Transaction Details
                            </h2>
                            <button
                                onClick={closeDetailModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">
                                        Transaction ID
                                    </p>
                                    <p className="text-white font-medium">
                                        {selectedTransaction.id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">
                                        Status
                                    </p>
                                    <div
                                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(
                                            selectedTransaction.status
                                        )}`}
                                    >
                                        {getStatusIcon(
                                            selectedTransaction.status
                                        )}
                                        <span className="capitalize">
                                            {selectedTransaction.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-1">
                                    Client
                                </p>
                                <p className="text-white font-medium">
                                    {selectedTransaction.user.full_name}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {selectedTransaction.user.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-1">
                                    Amount
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    {formatCurrency(selectedTransaction.amount)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-1">
                                    Description
                                </p>
                                <p className="text-white">
                                    {selectedTransaction.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">
                                        Request Sent
                                    </p>
                                    <p className="text-white">
                                        {formatDate(
                                            selectedTransaction.timestamp
                                        )}
                                    </p>
                                </div>
                                {selectedTransaction.paid_at && (
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">
                                            Paid At
                                        </p>
                                        <p className="text-white">
                                            {formatDate(
                                                selectedTransaction.paid_at
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={closeDetailModal}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LawyerPayments;
