import React, { useEffect, useState } from "react";
import { MoveDown, MoveUp, ArrowUpDown, IndianRupee } from "lucide-react";
import Card from "../components/Card";
import API from "../lib/utils";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntryData = async () => {
      try {
        const response = await API.get("admin/getData");
        console.log("Entry data:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching entry data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntryData();
  }, []);

  // Show a loading state before rendering data
  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  const DashboardItems = [
    {
      title: "Inflow/day",
      value: <div className="text-green-500">{parseInt(data?.todayInAmount || 0).toLocaleString()}</div>,
      icon: <MoveUp className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Outflow/day",
      value: <div className="text-red-500">{parseInt(data?.todayOutAmount || 0).toLocaleString()}</div>,
      icon: <MoveDown className="w-5 h-5 text-red-500" />,
    },
    {
      title: "Net Balance/day",
      value: parseInt(data?.todaysTotalAmount || 0).toLocaleString(),
      icon: <ArrowUpDown className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "Total Balance",
      value: parseInt(data?.totalAmount || 0).toLocaleString(),
      icon: <IndianRupee className="w-5 h-5 text-blue-500" />,
    },
  ];

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-800 p-6">Transaction History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-6 mt-7">
        {DashboardItems.map((item, index) => (
          <Card key={index} title={item.title} value={item.value} icon={item.icon} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
