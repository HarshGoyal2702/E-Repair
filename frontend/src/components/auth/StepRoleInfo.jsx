import { Label } from "@/components/ui/label";

export default function StepRoleInfo({ watch, setValue }) {
  const role = watch("role");

  return (
    <div className="space-y-3">
      <Label>Select Role</Label>
      <div className="flex gap-3">
        {["user", "worker"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setValue("role", r)}
            className={`px-4 py-2 rounded-lg border ${
              role === r ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
