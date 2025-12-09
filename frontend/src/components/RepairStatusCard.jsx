import React from "react";

export default function RepairStatusCard({ order }) {
  const statusColor =
    {
      Pending: "text-yellow-600",
      "In Progress": "text-blue-600",
      Completed: "text-green-600",
      Delivered: "text-gray-600",
    }[order.status] || "text-gray-600";

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">Order ID</div>
          <div className="font-semibold">{order.id}</div>
        </div>
        <div className={`${statusColor} font-semibold`}>{order.status}</div>
      </div>

      <div className="mt-3 text-gray-700">
        <div>
          <strong>Device:</strong> {order.device}
        </div>
        <div className="mt-1">
          <strong>Issue:</strong> {order.issue}
        </div>
      </div>
    </div>
  );
}
