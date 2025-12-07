import React from "react";

export default function OrderCard({ order }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
      <div>
        <div className="text-sm text-gray-500">#{order.id}</div>
        <div className="font-semibold">
          {order.device} • {order.brand}
        </div>
        <div className="text-sm text-gray-600">{order.status}</div>
      </div>
      <div>
        <button className="px-3 py-1 bg-blue-600 text-white rounded mr-2">
          View
        </button>
        <button className="px-3 py-1 border rounded">Edit</button>
      </div>
    </div>
  );
}
