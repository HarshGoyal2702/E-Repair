import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import { Plus, BarChart2 } from "lucide-react";

export default function UserDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div className="pt-24 max-w-7xl mx-auto px-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition">
          <Plus size={18} /> New Booking
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Bookings</p>
          <h2 className="text-3xl font-bold mt-2">{orders.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">In Progress</p>
          <h2 className="text-3xl font-bold mt-2 text-yellow-500">
            {orders.filter((o) => o.status === "In Progress").length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {orders.filter((o) => o.status === "Completed").length}
          </h2>
        </div>
      </div>

      {/* Graph Section Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="text-blue-600" />
          <h2 className="text-xl font-semibold">Service Activity</h2>
        </div>

        <div className="h-64 flex items-center justify-center text-gray-400">
          Graph 
        </div>
      </div>

      {/* Orders List */}
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((o) => (
          <OrderCard key={o._id} order={o} />
        ))}
      </div>
    </div>
  );
}
