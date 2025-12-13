// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";

// export default function BookRepair() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [form, setForm] = useState({
//     deviceType: "",
//     brand: "",
//     issue: "",
//     priority: "Medium",
//   });

//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔐 Redirect unauthenticated users
//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleFileChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("deviceType", form.deviceType);
//       formData.append("brand", form.brand);
//       formData.append("issue", form.issue);
//       formData.append("priority", form.priority);

//       images.forEach((file) => {
//         formData.append("images", file);
//       });

//       const res = await fetch("http://localhost:5000/api/bookings", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to create booking");
//       }

//       alert("✅ Repair request submitted!");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert(`❌ ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="pt-24 max-w-2xl mx-auto px-6 pb-16">
//       <Card className="shadow-xl border border-gray-100">
//         <CardContent className="p-6 space-y-6">
//           <div>
//             <h1 className="text-3xl font-bold">Book a Repair</h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Fill the form to request a repair service
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Device Type */}
//             <div className="space-y-1">
//               <Label>Device Type</Label>
//               <Select
//                 value={form.deviceType}
//                 onValueChange={(v) => handleChange("deviceType", v)}
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select device type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Mobile">Mobile</SelectItem>
//                   <SelectItem value="Laptop">Laptop</SelectItem>
//                   <SelectItem value="Tablet">Tablet</SelectItem>
//                   <SelectItem value="TV">TV</SelectItem>
//                   <SelectItem value="Appliance">Appliance</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Brand */}
//             <div className="space-y-1">
//               <Label>Brand</Label>
//               <Input
//                 placeholder="e.g. Samsung, Dell, Apple"
//                 value={form.brand}
//                 onChange={(e) => handleChange("brand", e.target.value)}
//                 required
//               />
//             </div>

//             {/* Issue */}
//             <div className="space-y-1">
//               <Label>Describe the Issue</Label>
//               <Textarea
//                 placeholder="Explain the problem in detail"
//                 rows={4}
//                 value={form.issue}
//                 onChange={(e) => handleChange("issue", e.target.value)}
//                 required
//               />
//             </div>

//             {/* Priority */}
//             <div className="space-y-1">
//               <Label>Priority</Label>
//               <Select
//                 value={form.priority}
//                 onValueChange={(v) => handleChange("priority", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select priority" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Low">Low</SelectItem>
//                   <SelectItem value="Medium">Medium</SelectItem>
//                   <SelectItem value="High">High</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* File Upload */}
//             <div className="space-y-1">
//               <Label>Upload Images (Optional)</Label>
//               <Input type="file" multiple onChange={handleFileChange} />
//             </div>

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full text-lg bg-blue-700 hover:bg-blue-900 text-white"
//             >
//               {loading ? "Submitting..." : "Submit Request"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";

// import api from "@/lib/axios";
// import { bookingSchema } from "@/validations/bookingSchema";
// import { State, City } from "country-state-city";
// import pincode from "india-pincode-lookup";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";

// export default function BookRepair() {
//   const navigate = useNavigate();
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

//   const selectedState = watch("state");
//   const selectedCity = watch("city");
//   // Load Indian states
//   useEffect(() => {
//     const statesData = State.getStatesOfCountry("IN");
//     setStates(statesData);
//   }, []);

//   // Load cities when state changes
//   useEffect(() => {
//     if (!selectedState) return;
//     const citiesData = City.getCitiesOfState("IN", selectedState);
//     setCities(citiesData);
//     setValue("city", "");
//   }, [selectedState, setValue]);

//   // Auto-fill pincode when city changes
//   useEffect(() => {
//     if (!selectedCity) return;

//     try {
//       const result = pincode.lookup(selectedCity);
//       if (result?.length > 0) {
//         setValue("zip", result[0].pincode);
//       }
//     } catch {
//       // silent
//     }
//   }, [selectedCity, setValue]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) navigate("/login");
//   }, [token, navigate]);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(bookingSchema),
//     defaultValues: {
//       priority: "medium",
//     },
//   });

//   const onSubmit = async (data) => {
//     setLoading(true);

//     try {
//       const formData = new FormData();

//       formData.append("deviceType", data.deviceType);
//       formData.append("brand", data.brand);
//       formData.append("issue", data.issue);
//       formData.append("specialty", data.specialty);
//       formData.append("priority", data.priority || "medium");
//       formData.append("serviceAddress", data.serviceAddress);

//       images.forEach((file) => {
//         formData.append("images", file);
//       });

//       await api.post("/bookings", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("✅ Booking created successfully");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.msg || "❌ Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="pt-24 max-w-2xl mx-auto px-6 pb-16">
//       <Card>
//         <CardContent className="p-6 space-y-6">
//           <h1 className="text-3xl font-bold">Book a Repair</h1>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {/* Device Type */}
//             <div>
//               <Label>Device Type</Label>
//               <Select onValueChange={(v) => setValue("deviceType", v)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select device type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Mobile">Mobile</SelectItem>
//                   <SelectItem value="Laptop">Laptop</SelectItem>
//                   <SelectItem value="Tablet">Tablet</SelectItem>
//                   <SelectItem value="TV">TV</SelectItem>
//                   <SelectItem value="Appliance">Appliance</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.deviceType && (
//                 <p className="text-sm text-red-500">
//                   {errors.deviceType.message}
//                 </p>
//               )}
//             </div>

//             {/* Brand */}
//             <div>
//               <Label>Brand</Label>
//               <Input {...register("brand")} />
//               {errors.brand && (
//                 <p className="text-sm text-red-500">{errors.brand.message}</p>
//               )}
//             </div>

//             {/* Specialty */}
//             <div>
//               <Label>Repair Specialty</Label>
//               <Input
//                 placeholder="e.g. screen repair, battery, motherboard"
//                 {...register("specialty")}
//               />
//               {errors.specialty && (
//                 <p className="text-sm text-red-500">
//                   {errors.specialty.message}
//                 </p>
//               )}
//             </div>

//             {/* Issue */}
//             <div>
//               <Label>Issue</Label>
//               <Textarea rows={4} {...register("issue")} />
//               {errors.issue && (
//                 <p className="text-sm text-red-500">{errors.issue.message}</p>
//               )}
//             </div>

//             {/* Priority */}
//             <div>
//               <Label>Priority</Label>
//               <Select
//                 defaultValue="medium"
//                 onValueChange={(v) => setValue("priority", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="low">Low</SelectItem>
//                   <SelectItem value="medium">Medium</SelectItem>
//                   <SelectItem value="high">High</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <div>
//                 <Label>Country</Label>
//                 <Input value="India" disabled />
//               </div>

//               <div>
//                 <Label>State</Label>
//                 <select
//                   {...register("state")}
//                   className="w-full p-2 border rounded-md"
//                 >
//                   <option value="">Select State</option>
//                   {states.map((s) => (
//                     <option key={s.isoCode} value={s.isoCode}>
//                       {s.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors?.state && (
//                   <p className="text-sm text-red-500">{errors.state.message}</p>
//                 )}
//               </div>

//               <div>
//                 <Label>City</Label>
//                 <select
//                   {...register("city")}
//                   className="w-full p-2 border rounded-md"
//                 >
//                   <option value="">Select City</option>
//                   {cities.map((c) => (
//                     <option key={c.name} value={c.name}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors?.city && (
//                   <p className="text-sm text-red-500">{errors.city.message}</p>
//                 )}
//               </div>

//               <div>
//                 <Label>Street</Label>
//                 <Input {...register("street")} />
//                 {errors?.street && (
//                   <p className="text-sm text-red-500">
//                     {errors.street.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label>ZIP / PIN</Label>
//                 <Input {...register("zip")} />
//                 {errors?.zip && (
//                   <p className="text-sm text-red-500">{errors.zip.message}</p>
//                 )}
//               </div>
//             </div>

//             {/* Images */}
//             <div>
//               <Label>Upload Images</Label>
//               <Input
//                 type="file"
//                 multiple
//                 onChange={(e) => setImages(Array.from(e.target.files || []))}
//               />
//             </div>

//             <Button disabled={loading} className="w-full">
//               {loading ? "Submitting..." : "Create Booking"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import api from "@/lib/axios";
import { bookingSchema } from "@/validations/bookingSchema";
import { State, City } from "country-state-city";
import pincode from "india-pincode-lookup";

import AddressMap from "@/components/AddressMap";

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
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { priority: "medium" },
  });

  const selectedState = watch("state");
  const selectedCity = watch("city");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    setStates(State.getStatesOfCountry("IN"));
  }, []);

  useEffect(() => {
    if (!selectedState) return;
    setCities(City.getCitiesOfState("IN", selectedState));
    setValue("city", "");
  }, [selectedState, setValue]);

  useEffect(() => {
    if (!selectedCity) return;
    const result = pincode.lookup(selectedCity);
    if (result?.length) setValue("zip", result[0].pincode);
  }, [selectedCity, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const serviceAddress = {
        country: "India",
        state: data.state,
        city: data.city,
        street: data.street,
        zip: data.zip,
      };

      const formData = new FormData();
      formData.append("deviceType", data.deviceType);
      formData.append("brand", data.brand);
      formData.append("issue", data.issue);
      formData.append("specialty", data.specialty);
      formData.append("priority", data.priority || "medium");
      formData.append("serviceAddress", JSON.stringify(serviceAddress));

      images.forEach((file) => formData.append("images", file));

      await api.post("/bookings", formData);

      alert("✅ Booking created successfully");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 max-w-2xl mx-auto px-6 pb-16">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h1 className="text-3xl font-bold">Book a Repair</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Device */}
            <Select onValueChange={(v) => setValue("deviceType", v)}>
              <SelectTrigger><SelectValue placeholder="Device Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Laptop">Laptop</SelectItem>
                <SelectItem value="TV">TV</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Brand" {...register("brand")} />
            <Input placeholder="Specialty" {...register("specialty")} />
            <Textarea placeholder="Describe issue" {...register("issue")} />

            {/* Address */}
            <Label>Address</Label>
            <Input value="India" disabled />

            <select {...register("state")} className="input">
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
              ))}
            </select>

            <select {...register("city")} className="input">
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>

            <Input placeholder="Street" {...register("street")} />
            <Input placeholder="PIN" {...register("zip")} />

            {/* Map Preview */}
            <AddressMap />

            {/* Images */}
            <Input type="file" multiple onChange={(e) => setImages([...e.target.files])} />

            <Button disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Create Booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
