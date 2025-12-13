// import React from "react";

// export default function AdminDashboard() {
//   // dummy stats
//   const stats = [
//     { title: "Total Orders", value: 128 },
//     { title: "Pending", value: 14 },
//     { title: "Completed Today", value: 6 },
//   ];

//   return (
//     <div className="pt-24 max-w-6xl mx-auto px-6 pb-12">
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {stats.map((s) => (
//           <div key={s.title} className="bg-white p-4 rounded shadow">
//             <div className="text-sm text-gray-500">{s.title}</div>
//             <div className="text-3xl font-bold mt-2">{s.value}</div>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <div>
//               <div className="text-sm text-gray-500">R1001</div>
//               <div className="font-semibold">Mobile • Samsung</div>
//             </div>
//             <div className="text-blue-600">In Progress</div>
//           </div>

//           <div className="flex justify-between items-center">
//             <div>
//               <div className="text-sm text-gray-500">R1002</div>
//               <div className="font-semibold">Laptop • Dell</div>
//             </div>
//             <div className="text-green-600">Completed</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import adminApi from "@/lib/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookingTable from "@/components/admin/BookingTable";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await adminApi.get("/bookings");
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);


const stats = {
  total: bookings.length,
  pending: bookings.filter(b => b.status === "pending").length,
  progress: bookings.filter(b => b.status === "in_progress").length,
  completed: bookings.filter(b => b.status === "completed").length,
};

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(stats).map(([k, v]) => (
          <Card key={k}>
            <CardContent className="p-6">
              <p className="text-sm text-gray-500 capitalize">{k}</p>
              <h2 className="text-3xl font-bold mt-2">{v}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-4">
          <BookingTable bookings={bookings} refresh={fetchBookings} />
        </CardContent>
      </Card>
    </div>
  );
}
