export const BOOKING_STATUS = {
  pending: {
    label: "Pending",
    value: "pending",
  },
  assigned: {
    label: "Assigned",
    value: "assigned",
  },
  in_progress: {
    label: "In Progress",
    value: "in_progress",
  },
  completed: {
    label: "Completed",
    value: "completed",
  },
  cancelled: {
    label: "Cancelled",
    value: "cancelled",
  },
};


export const STATUS_COLOR = {
  pending: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};
export const STATUS_FLOW = {
  pending: ["assigned", "cancelled"],
  assigned: ["in_progress", "cancelled"],
  in_progress: ["completed"],
  completed: [],
  cancelled: [],
};