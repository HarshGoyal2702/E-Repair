import adminApi from "@/lib/adminApi";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BOOKING_STATUS, STATUS_FLOW } from "@/constants/bookingStatus.js";
import { UpdateBookingStatusSchema } from "@/validations/bookingSchema";
export default function BookingModal({ booking, close, refresh }) {
  const [status, setStatus] = useState(booking.status);
  const [workerId, setWorkerId] = useState("");
  const [notes, setNotes] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [fallbackWorkers, setFallbackWorkers] = useState(false);

  const allowedStatuses = STATUS_FLOW[booking.status] || [];

  const updateStatus = async () => {
    try {
      // ✅ Validate & transform before sending
      if (status === booking.status) {
        return alert("Status is already the same");
      }
      if (status === "in_progress" && !booking.worker) {
        return alert("Assign a worker before starting the job");
      }
      const payload = {
        currentStatus: booking.status,
        nextStatus: status,
      };
      const parsedStatus = UpdateBookingStatusSchema.parse(payload);

      await adminApi.patch(`/bookings/${booking._id}/status`, {
        status: status,
      });

      refresh();
      close();
    } catch (err) {
      console.error("Status update failed:", err);

      // Optional: toast / alert
      alert("Invalid status selected");
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  //   const fetchWorkers = async () => {
  //     try {
  //       setLoadingWorkers(true);

  //       const res = await adminApi.get("/bookings/worker-details", {
  //         params: {
  //           specialty: booking.specialty,
  //         },
  //       });

  //       setWorkers(res.data.workers);
  //       setFallbackWorkers(res.data.fallback);
  //       if (res.data.fallback) {
  //         console.warn(
  //           "No workers found for this specialty. Showing all available workers."
  //         );
  //       }
  //     } catch (err) {
  //       console.error("Failed to load workers", err);
  //     } finally {
  //       setLoadingWorkers(false);
  //     }
  //   };

  const fetchWorkers = async () => {
    setLoadingWorkers(true);
    try {
      const { data } = await adminApi.get("/bookings/worker-details", {
        params: { specialty: booking.specialty },
      });
      console.log(data);
      setWorkers(data.workers || []);
      setFallbackWorkers(data.fallback);
    } catch (err) {
      console.error("Failed to load workers", err);
      alert("Failed to load workers. Please check server.");
    } finally {
      setLoadingWorkers(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const assignWorker = async () => {
    if (!workerId) return;

    try {
      await adminApi.patch(`/bookings/${booking._id}/assign`, {
        workerId,
      });

      // // Optional but recommended: status auto update
      // await adminApi.patch(`/bookings/${booking._id}/status`, {
      //   status: "assigned",
      // });

      refresh();
      close();
    } catch (err) {
      console.error("Worker assignment failed", err);
      alert("Failed to assign worker");
    }
  };

  const addNotes = async () => {
    await adminApi.patch(`/bookings/${booking._id}/admin-notes`, { notes });
    refresh();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 w-full max-w-lg rounded-xl space-y-4">
        <h2 className="text-xl font-bold">Booking Details</h2>

        <p>
          <b>Issue:</b> {booking.issue}
        </p>
        <p>
          <b>Address:</b> {booking.serviceAddress?.street}
        </p>

        <select
          disabled={booking.status === "completed"}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value={booking.status} disabled>
            {BOOKING_STATUS[booking.status].label}
          </option>

          {allowedStatuses.map((key) => (
            <option key={key} value={key}>
              {BOOKING_STATUS[key].label}
            </option>
          ))}
        </select>

        <Button onClick={updateStatus}>Update Status</Button>

        {booking.status === "pending" && (
          <div className="space-y-2">
            <h3 className="font-semibold">Assign Worker</h3>

            {fallbackWorkers && (
              <p className="text-xs text-orange-600">
                No workers found for this specialty. Showing all available
                workers.
              </p>
            )}
            {/* 
            {loadingWorkers ? (
              <p className="text-sm text-gray-500">Loading workers...</p>
            ) : workers.length === 0 ? (
              <p className="text-sm text-gray-500">No workers available</p>
            ) : (
              <select
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select a worker</option>
                {workers.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.name} ({w.email})
                  </option>
                ))}
              </select>
            )} */}
            {loadingWorkers ? (
              <p className="text-sm text-gray-500">Loading workers...</p>
            ) : workers.length === 0 ? (
              <p className="text-sm text-gray-500">No workers available</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {workers.map((w) => (
                  <div
                    key={w._id}
                    onClick={() => setWorkerId(w._id)}
                    className={`border rounded p-3 cursor-pointer transition
          ${
            workerId === w._id
              ? "border-blue-500 bg-blue-50"
              : "hover:bg-gray-50"
          }`}
                  >
                    <p className="font-semibold">{w.name}</p>
                    <p className="text-sm text-gray-600">{w.email}</p>
                    <p className="text-xs text-gray-500">
                      Specialty: {w.specialty || "General"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Button disabled={!workerId} onClick={assignWorker}>
              Assign Worker
            </Button>
          </div>
        )}

        <Button variant="outline" onClick={close}>
          Close
        </Button>
      </div>
    </div>
  );
}
