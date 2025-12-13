import React, { useState } from "react";
import BookingModal from "./BookingModal";
import { BOOKING_STATUS, STATUS_COLOR } from "@/constants/bookingStatus";

export default function BookingTable({ bookings, refresh }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>Device</th>
            <th>User</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="border-b">
              <td>{b.deviceType}</td>
              <td>{b.user?.email}</td>
              <td
                className={`px-2 py-1 rounded text-sm ${
                  STATUS_COLOR[b.status]
                }`}
              >
                {BOOKING_STATUS[b.status]?.label || b.status}
              </td>
              <td>{b.priority}</td>
              <td>
                <button
                  onClick={() => setSelected(b)}
                  className="text-blue-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <BookingModal
          booking={selected}
          close={() => setSelected(null)}
          refresh={refresh}
        />
      )}
    </>
  );
}
