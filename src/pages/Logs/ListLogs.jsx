import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2, Filter, Download, Calendar, Search, ArrowUpRight, ArrowDownLeft, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Table from "../../components/Table";
import API from "../../lib/utils";

const ListLogs = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchEntryData = async () => {
            try {
                setIsLoading(true)
                const response = await API.get("admin/getData");
                console.log("Entery data", response.data)
                setPayments(response.data.forms)
            } catch (error) {
                console.log("Error fetching entery datra", error)
            }finally{
                setIsLoading(false)
            }
        }
        fetchEntryData();
    }, [])

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.phone.includes(searchTerm);

        const matchesType =
            selectedFilter === "all" ||
            (selectedFilter === "received" && payment.type === "IN") ||
            (selectedFilter === "paid" && payment.type === "OUT");

        return matchesSearch && matchesType;
    });

    const deletePayment = async (id) => {
        toast.custom(
            <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg">
                <p>Are you sure you want to delete this payment record?</p>
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={() => {
                            toast.dismiss();
                            setPayments((prev) => prev.filter((item) => item.id !== id));
                            toast.success("Payment record deleted successfully");
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                        No
                    </button>
                </div>
            </div>,
            { duration: Infinity }
        );
    };

    const totalInflow = filteredPayments
        .filter((p) => p.type === "IN")
        .reduce((sum, payment) => sum + parseInt(payment.amount), 0);

    const totalOutflow = filteredPayments
        .filter((p) => p.type === "OUT")
        .reduce((sum, payment) => sum + parseInt(payment.amount), 0);

    const columns = [
        {
            header: "Details",
            render: (row) => (
                <div className="flex items-start gap-3 capitalize">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{row.name}</p>
                        <p className="text-sm text-gray-500">{row.mobile}</p>
                        {row.remark && (
                            <p className="text-xs text-gray-500 mt-1">{row.remark}</p>
                        )}
                        <div className="flex gap-2 mt-1">
                            {row.whatsappSent ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                                    <FaWhatsapp className="w-3 h-3" />
                                    Sent
                                </span>
                            ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                                    <FaWhatsapp className="w-3 h-3" />
                                    Not Sent
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Transaction",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${row.type === "IN"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                            }`}
                    >
                        {row.type === "IN" ? (
                            <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                            <ArrowUpRight className="w-5 h-5" />
                        )}
                    </div>
                    <div>
                        <p
                            className={`font-semibold ${row.type === "IN" ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            ₹{parseInt(row.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                            {row.type === "IN" ? "Received" : "Paid"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Date & Time",
            accessor: "createdAt",
        },
    ];

    // Define actions
    //   const actions = [
    //     {
    //       label: <SquarePen className="w-4 h-4" />,
    //       handler: (row) => navigate("/payments/add", { state: { paymentData: row } }),
    //       className: "text-green-500 hover:text-green-600",
    //     },
    //     {
    //       label: <Trash2 className="w-4 h-4" />,
    //       handler: (row) => deletePayment(row.id),
    //       className: "text-red-500 hover:text-red-600",
    //     },
    //     {
    //       label: <FaWhatsapp className="w-4 h-4" />,
    //       handler: (row) => {}, // Empty handler as WhatsApp is automatic
    //       className: "text-green-500 hover:text-green-600",
    //     },
    //   ];

    return (
        <div className="p-6 min-h-[100dvh]">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-1 text-sm bg-white px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button
                            onClick={() => navigate("/logs/add")}
                            className="flex items-center gap-1 text-sm bg-blue-600 px-3 py-1.5 rounded text-white hover:bg-blue-700"
                        >
                            + New Transaction
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-between gap-3 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="relative flex-grow max-w-md">
                        <input
                            type="text"
                            placeholder="Search by name, phone or remarks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-9 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    </div>

                    <div className="flex gap-3">
                        <div className="relative inline-block" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center gap-1 bg-gray-100 px-3 py-2 rounded text-gray-700 text-sm font-medium"
                            >
                                <Filter className="w-4 h-4" />
                                {selectedFilter === "all"
                                    ? "All Transactions"
                                    : selectedFilter === "received"
                                        ? "Money Received"
                                        : "Money Paid"}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {isOpen && (
                                <div className="absolute mt-1 right-0 w-48 bg-white rounded-md shadow-lg z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={() => { setSelectedFilter("all"); setIsOpen(false); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            All Transactions
                                        </button>
                                        <button
                                            onClick={() => { setSelectedFilter("received"); setIsOpen(false); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Money Received
                                        </button>
                                        <button
                                            onClick={() => { setSelectedFilter("paid"); setIsOpen(false); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Money Paid
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Use the reusable Table component */}
            {/* <Table columns={columns} data={filteredPayments} globalActions={actions} /> */}
            <Table columns={columns} data={filteredPayments} />
        </div>
    );
};

export default ListLogs;