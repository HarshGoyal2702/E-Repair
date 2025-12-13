// // import { useEffect, useState } from "react";
// // import { Country, State, City } from "country-state-city";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";

// // export default function StepAddressOrSpecialty({ form, onChange }) {
// //   const [states, setStates] = useState([]);
// //   const [cities, setCities] = useState([]);

// //   // Load states when country is India (or hardcoded if you want)
// //   useEffect(() => {
// //     const statesData = State.getStatesOfCountry("IN");
// //     setStates(statesData);
// //   }, []);

// //   // Load cities when state changes
// //   useEffect(() => {
// //     if (!form.state) return;
// //     const citiesData = City.getCitiesOfState("IN", form.state);
// //     setCities(citiesData);
// //   }, [form.state]);

// //   if (form.role === "admin") return null;

// //   if (form.role === "user") {
// //     return (
// //       <div className="space-y-3">

// //         {/* Country (fixed to India here) */}
// //         <Label>Country</Label>
// //         <Input value="India" disabled />

// //         {/* State Dropdown */}
// //         <Label>State</Label>
// //         <select
// //           name="state"
// //           value={form.state}
// //           onChange={onChange}
// //           className="w-full p-2 border rounded-md"
// //         >
// //           <option value="">Select State</option>
// //           {states.map((s) => (
// //             <option key={s.isoCode} value={s.isoCode}>
// //               {s.name}
// //             </option>
// //           ))}
// //         </select>

// //         {/* City Dropdown */}
// //         <Label>City</Label>
// //         <select
// //           name="city"
// //           value={form.city}
// //           onChange={onChange}
// //           className="w-full p-2 border rounded-md"
// //         >
// //           <option value="">Select City</option>
// //           {cities.map((c) => (
// //             <option key={c.name} value={c.name}>
// //               {c.name}
// //             </option>
// //           ))}
// //         </select>
// //         <Label>Street</Label>
// //         <Input name="street" value={form.street} onChange={onChange} />

// //         {/* ZIP / PIN Code */}
// //         <Label>ZIP / PIN Code</Label>
// //         <Input
// //           name="zip"
// //           value={form.zip}
// //           onChange={onChange}
// //           placeholder="Auto or manual"
// //         />
// //       </div>
// //     );
// //   }

// //   if (form.role === "worker") {
// //     return (
// //       <div className="space-y-3">
// //         <Label>Specialties (comma separated)</Label>
// //         <Input name="specialty" onChange={onChange} value={form.specialty} />
// //       </div>
// //     );
// //   }
// // }

// import { useEffect, useState } from "react";
// import { Country, State, City } from "country-state-city";
// import pincode from "india-pincode-lookup";
// import Select from "react-select";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function StepAddressOrSpecialty({ form, onChange }) {
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

// const SPECIALTY_OPTIONS = [
//   { value: "plumbing", label: "Plumbing" },
//   { value: "electrician", label: "Electrician" },
//   { value: "carpentry", label: "Carpentry" },
//   { value: "painting", label: "Painting" },
//   { value: "ac_repair", label: "AC Repair" },
//   { value: "cleaning", label: "Cleaning" },
//   { value: "appliance_repair", label: "Appliance Repair" },
// ];
//   // Load states (India)
//   useEffect(() => {
//     const statesData = State.getStatesOfCountry("IN");
//     setStates(statesData);
//   }, []);

//   // Load cities when state changes
//   useEffect(() => {
//     if (!form.state) return;
//     const citiesData = City.getCitiesOfState("IN", form.state);
//     setCities(citiesData);
//   }, [form.state]);

//   // Auto fill pincode when city changes
//   useEffect(() => {
//     if (!form.city) return;

//     try {
//       const result = pincode.lookup(form.city);

//       if (result && result.length > 0) {
//         // Take first matching pincode
//         const pin = result[0]?.pincode;
//         onChange({
//           target: {
//             name: "zip",
//             value: pin,
//           },
//         });
//       }
//     } catch (err) {
//       console.log("Pincode not found for city");
//     }
//   }, [form.city]);

//   if (form.role === "admin") return null;

//   if (form.role === "user") {
//     return (
//       <div className="space-y-3">
//         <Label>Country</Label>
//         <Input value="India" disabled />

//         <Label>State</Label>
//         <select
//           name="state"
//           value={form.state}
//           onChange={onChange}
//           className="w-full p-2 border rounded-md"
//         >
//           <option value="">Select State</option>
//           {states.map((s) => (
//             <option key={s.isoCode} value={s.isoCode}>
//               {s.name}
//             </option>
//           ))}
//         </select>

//         <Label>City</Label>
//         <select
//           name="city"
//           value={form.city}
//           onChange={onChange}
//           className="w-full p-2 border rounded-md"
//         >
//           <option value="">Select City</option>
//           {cities.map((c) => (
//             <option key={c.name} value={c.name}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//         <Label>Street</Label>
//         <Input name="street" value={form.street} onChange={onChange} />

//         <Label>ZIP / PIN</Label>
//         <Input name="zip" value={form.zip} onChange={onChange} />
//       </div>
//     );
//   }

//   if (form.role === "worker") {
//   return (
//     <div className="space-y-3">
//       <Label>Specialties</Label>

//       <Select
//         isMulti
//         options={SPECIALTY_OPTIONS}
//         value={form.specialty?.map((s) => ({
//           value: s,
//           label: s.charAt(0).toUpperCase() + s.slice(1),
//         }))}
//         onChange={(selected) => {
//           const values = selected ? selected.map((s) => s.value) : [];

//           onChange({
//             target: {
//               name: "specialty",
//               value: values,
//             },
//           });
//         }}
//         className="text-black"
//         placeholder="Select specialties..."
//       />
//     </div>
//   );
// }
// }

import { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import pincode from "india-pincode-lookup";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SPECIALTY_OPTIONS = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrician", label: "Electrician" },
  { value: "carpentry", label: "Carpentry" },
  { value: "painting", label: "Painting" },
];

export default function StepAddressOrSpecialty({
  role,
  register,
  setValue,
  watch,
  errors,
}) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const selectedState = watch("state");
  const selectedCity = watch("city");
  const specialty = watch("specialty") || [];

  // Load Indian states
  useEffect(() => {
    const statesData = State.getStatesOfCountry("IN");
    setStates(statesData);
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!selectedState) return;
    const citiesData = City.getCitiesOfState("IN", selectedState);
    setCities(citiesData);
    setValue("city", "");
  }, [selectedState, setValue]);

  // Auto-fill pincode when city changes
  useEffect(() => {
    if (!selectedCity) return;

    try {
      const result = pincode.lookup(selectedCity);
      if (result?.length > 0) {
        setValue("zip", result[0].pincode);
      }
    } catch {
      // silent
    }
  }, [selectedCity, setValue]);

  if (role === "admin") return null;

  // USER FIELDS
  if (role === "user") {
    return (
      <div className="space-y-3">
        <div>
          <Label>Country</Label>
          <Input value="India" disabled />
        </div>

        <div>
          <Label>State</Label>
          <select
            {...register("state")}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>
          {errors?.state && (
            <p className="text-sm text-red-500">{errors.state.message}</p>
          )}
        </div>

        <div>
          <Label>City</Label>
          <select
            {...register("city")}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {errors?.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        <div>
          <Label>Street</Label>
          <Input {...register("street")} />
          {errors?.street && (
            <p className="text-sm text-red-500">{errors.street.message}</p>
          )}
        </div>

        <div>
          <Label>ZIP / PIN</Label>
          <Input {...register("zip")} />
          {errors?.zip && (
            <p className="text-sm text-red-500">{errors.zip.message}</p>
          )}
        </div>
      </div>
    );
  }

  // WORKER FIELDS
  if (role === "worker") {
    return (
      <div className="space-y-3">
        <Label>Specialties</Label>
        <Select
          isMulti
          options={SPECIALTY_OPTIONS}
          value={specialty.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
          onChange={(selected) =>
            setValue(
              "specialty",
              selected ? selected.map((s) => s.value) : [],
              { shouldValidate: true }
            )
          }
          placeholder="Select specialties..."
        />
        {errors?.specialty && (
          <p className="text-sm text-red-500">{errors.specialty.message}</p>
        )}
      </div>
    );
  }
}
