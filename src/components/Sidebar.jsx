import React, { useState } from "react";
import { NavLink } from "react-router";
import {
    Home,
    ChevronDown,
    ChevronUp,
    Plus,
    Rows3,
    ScrollText,
    Gift,
    LogOut,
    Menu,
    X,
} from "lucide-react";
// import logo from "../assets/Umrah99logo.webp";

const Sidebar = ({ setIsAuthenticated }) => {
    const [openSubmenus, setOpenSubmenus] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
        setIsAuthenticated(false);
    };

    const menuStructure = [
        { path: "/", name: "Dashboard", icon: Home, type: "link" },
        {
            name: "Logs",
            icon: ScrollText,
            type: "submenu",
            submenuItems: [
                { path: "/logs/list", name: "Logs list", icon: Rows3 },
                { path: "/logs/add", name: "Add Logs", icon: Plus },
            ],
        }
    ];

    const handleSubmenuToggle = (submenuName) => {
        setOpenSubmenus((prevState) => ({
            ...prevState,
            [submenuName]: !prevState[submenuName],
        }));
    };

    const renderMenuItem = (item) => {
        if (item.type === "link") {
            return (
                <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${isActive
                            ? "bg-gray-800 text-white font-medium"
                            : "text-black hover:bg-gray-900 hover:text-white"
                        }`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                </NavLink>
            );
        }

        if (item.type === "submenu") {
            return (
                <>
                    <button
                        onClick={() => handleSubmenuToggle(item.name)}
                        className="w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 text-black hover:bg-gray-900 hover:text-white"
                    >
                        <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </div>
                        {openSubmenus[item.name] ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>

                    {openSubmenus[item.name] && (
                        <ul className="mt-1 ml-4 space-y-1 mb-1 text-xs">
                            {item.submenuItems.map((subItem) => (
                                <li key={subItem.path}>
                                    <NavLink
                                        to={subItem.path}
                                        className={({ isActive }) =>
                                            `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-150 ${isActive
                                                ? "bg-gray-700 text-white font-medium"
                                                : "text-black hover:bg-gray-900 hover:text-white"
                                            }`
                                        }
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <subItem.icon className="w-4 h-4" />
                                        <span>{subItem.name}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            );
        }
    };

    return (
        <>
            {/* Hamburger Menu Button for Mobile */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 text-black"
            >
                {isSidebarOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed border border-gray-800 lg:static inset-y-0 left-0 z-40 w-72 h-screen bg-gradient-to-b from-[#F7941C] to-[#e89a5a] text-gray-300 flex flex-col flex-shrink-0 text-sm transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Logo Section */}
                {/* <div className="flex items-center justify-center shadow-md p-3 border-b border-gray-700 flex-shrink-0">
                    <div className="flex items-center justify-center shadow-md w-20 h-20 bg-white rounded-full">
                        <img
                            src={logo}
                            alt="Umrah99 Logo"
                            className="object-contain w-full h-full"
                        />
                    </div>
                </div> */}

                <div className="flex items-center justify-center p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-semibold text-black">Royal CRM Demo</h1>
                </div>

                {/* Navigation Section */}
                <nav className="flex-grow overflow-y-auto shadow-md p-4">
                    <div className="mb-4 px-4 text-xs font-semibold text-gray-800 uppercase">
                        Main Menu
                    </div>
                    <ul className="space-y-1">
                        {menuStructure.map((item, index) => (
                            <li key={item.name || index}>{renderMenuItem(item)}</li>
                        ))}
                    </ul>
                </nav>

                {/* User Profile Section */}
                <div className="p-4 border-t border-gray-700 flex-shrink-0">
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">RCD</span>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-sm font-medium text-black">Royal CRM Demo</h3>
                            <p className="text-xs text-gray-800">Admin</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="hover:bg-white p-2 rounded-md"
                        >
                            <LogOut className="w-5 h-5 text-black" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
