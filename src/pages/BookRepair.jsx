import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function BookRepair() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    deviceType: "",
    brand: "",
    issue: "",
    priority: "Medium",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Redirect unauthenticated users
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("deviceType", form.deviceType);
      formData.append("brand", form.brand);
      formData.append("issue", form.issue);
      formData.append("priority", form.priority);

      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      alert("✅ Repair request submitted!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 max-w-2xl mx-auto px-6 pb-16">
      <Card className="shadow-xl border border-gray-100">
        <CardContent className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Book a Repair</h1>
            <p className="text-sm text-gray-500 mt-1">
              Fill the form to request a repair service
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Device Type */}
            <div className="space-y-1">
              <Label>Device Type</Label>
              <Select
                value={form.deviceType}
                onValueChange={(v) => handleChange("deviceType", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Tablet">Tablet</SelectItem>
                  <SelectItem value="TV">TV</SelectItem>
                  <SelectItem value="Appliance">Appliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div className="space-y-1">
              <Label>Brand</Label>
              <Input
                placeholder="e.g. Samsung, Dell, Apple"
                value={form.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                required
              />
            </div>

            {/* Issue */}
            <div className="space-y-1">
              <Label>Describe the Issue</Label>
              <Textarea
                placeholder="Explain the problem in detail"
                rows={4}
                value={form.issue}
                onChange={(e) => handleChange("issue", e.target.value)}
                required
              />
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => handleChange("priority", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-1">
              <Label>Upload Images (Optional)</Label>
              <Input type="file" multiple onChange={handleFileChange} />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full text-lg" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
