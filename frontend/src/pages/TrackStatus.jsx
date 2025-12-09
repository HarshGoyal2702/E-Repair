import React, { useState } from "react";
import RepairStatusCard from "../components/RepairStatusCard";

const dummyOrders = [
  {
    id: "R1001",
    device: "Mobile",
    issue: "Screen cracked",
    status: "In Progress",
  },
  { id: "R1002", device: "Laptop", issue: "Won't boot", status: "Pending" },
];

export default function TrackStatus() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  function search(e) {
    e.preventDefault();
    const found = dummyOrders.find(
      (o) => o.id.toLowerCase() === query.toLowerCase()
    );
    setResult(
      found || {
        id: query,
        device: "-",
        issue: "No record found",
        status: "Pending",
      }
    );
  }

  return (
    <div className="pt-24 max-w-2xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-4">Track Repair</h1>

      <form onSubmit={search} className="flex gap-3">
        <input
          className="input"
          placeholder="Enter Repair ID (e.g., R1001)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      <div className="mt-6">
        {result ? (
          <RepairStatusCard order={result} />
        ) : (
          <p className="text-gray-600">Enter an ID to see status.</p>
        )}
      </div>
    </div>
  );
}
