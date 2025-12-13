// import { useState } from "react";
// import StepBasicInfo from "./StepBasicInfo";
// import StepRoleInfo from "./StepRoleInfo";
// import StepAddressOrSpecialty from "./StepAddressOrSpecialty";
// import { Button } from "@/components/ui/button";

// export default function RegisterForm({ onSubmit }) {
//   const [step, setStep] = useState(1);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     role: "user",

//     street: "",
//     city: "",
//     state: "",
//     zip: "",
//     specialty: [],
//   });

//   function handleChange(e) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   function next() {
//     // If role is admin → skip step 3
//     if (step === 2) {
//       setStep(3); // go to submit stage
//       return;
//     }

//     setStep((prev) => prev + 1);
//   }
//   function back() {
//     setStep((prev) => prev - 1);
//   }

//   function handleFinalSubmit(e) {
//     e.preventDefault();

//     // If not on final step, go next (handles Enter key submits)
//     const FINAL_STEP = 3;
//     if (step < FINAL_STEP) {
//       next();
//       return;
//     }

//     // Validation before final submit
//     if (form.role === "user") {
//       if (!form.street || !form.city || !form.state || !form.zip) {
//         alert("Please complete your address before submitting.");
//         return;
//       }
//     }

//     if (form.role === "worker") {
//       if (!form.specialty || form.specialty.trim().length === 0) {
//         alert("Please enter at least one specialty.");
//         return;
//       }
//     }

//     // Build payload
//     const payload = {
//       name: form.name,
//       email: form.email,
//       phone: form.phone,
//       password: form.password,
//       role: form.role,
//       address:
//         form.role === "user"
//           ? {
//               street: form.street,
//               city: form.city,
//               state: form.state,
//               zip: form.zip,
//             }
//           : undefined,
//       specialty: form.role === "worker" ? form.specialty : undefined,
//     };

//     onSubmit(payload);
//   }

//   return (
//     <form onSubmit={handleFinalSubmit} className="space-y-6">
//       {/* Step Indicator */}
//       <div className="flex items-center justify-center gap-4 mb-4">
//         {["Basic Info", "Role", "Details"].map((label, index) => {
//           const stepNumber = index + 1;
//           const isActive = step === stepNumber;
//           const isCompleted = step > stepNumber;

//           return (
//             <div key={label} className="flex items-center gap-2">
//               <div
//                 className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-semibold
//             ${isActive ? "bg-blue-600 text-white" : ""}
//             ${isCompleted ? "bg-green-500 text-white" : ""}
//             ${!isActive && !isCompleted ? "bg-gray-200" : ""}
//           `}
//               >
//                 {stepNumber}
//               </div>
//               <span
//                 className={`text-sm ${
//                   isActive ? "font-bold" : "text-gray-500"
//                 }`}
//               >
//                 {label}
//               </span>

//               {stepNumber !== 3 && (
//                 <div className="w-6 h-[2px] bg-gray-300"></div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {step === 1 && <StepBasicInfo form={form} onChange={handleChange} />}
//       {step === 2 && <StepRoleInfo form={form} setForm={setForm} />}
//       {step === 3 && (
//         <StepAddressOrSpecialty form={form} onChange={handleChange} />
//       )}

//       <div className="flex justify-between pt-4">
//         {step > 1 && (
//           <Button type="button" variant="outline" onClick={back}>
//             Back
//           </Button>
//         )}

//         {step < 3 ? (
//           <Button type="button" onClick={next}>
//             Next
//           </Button>
//         ) : (
//           <Button type="submit">Register</Button>
//         )}
//       </div>
//     </form>
//   );
// }

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./validation";
import StepBasicInfo from "./StepBasicInfo";
import StepRoleInfo from "./StepRoleInfo";
import StepAddressOrSpecialty from "./StepAddressOrSpecialty";
import { Button } from "@/components/ui/button";

export default function RegisterForm({ onSubmit }) {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
      specialty: [],
    },
    mode: "onTouched",
  });

  const role = watch("role");
  const FINAL_STEP = 3;

  const next = async () => {
    let fieldsToValidate = [];

    if (step === 1) {
      fieldsToValidate = ["name", "email", "password"];
    }

    if (step === 2) {
      fieldsToValidate = ["role"];
    }

    if (step === 3 && role === "user") {
      fieldsToValidate = ["street", "city", "state", "zip"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    // Skip step 3 for admin
    if (step === 2 && role === "admin") {
      setStep(FINAL_STEP);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => prev - 1);

  const onFinalSubmit = (data) => {
    // if (step !== FINAL_STEP) return;
    if (step !== FINAL_STEP) return;

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role,
      address:
        data.role === "user"
          ? {
              street: data.street,
              city: data.city,
              state: data.state,
              zip: data.zip,
            }
          : undefined,
      specialty: data.role === "worker" ? data.specialty : undefined,
    };

    onSubmit(payload);
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();

        // Block submit before final step
        if (step !== FINAL_STEP) return;

        handleSubmit(onFinalSubmit)(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && step < FINAL_STEP) {
          e.preventDefault();
          next();
        }
      }}
      className="space-y-6"
    >
      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {["Basic Info", "Role", "Details"].map((label, index) => {
          const stepNumber = index + 1;
          const isActive = step === stepNumber;
          const isCompleted = step > stepNumber;

          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-semibold
                  ${isActive ? "bg-blue-600 text-white" : ""}
                  ${isCompleted ? "bg-green-500 text-white" : ""}
                  ${!isActive && !isCompleted ? "bg-gray-200" : ""}
                `}
              >
                {stepNumber}
              </div>
              <span
                className={`text-sm ${
                  isActive ? "font-bold" : "text-gray-500"
                }`}
              >
                {label}
              </span>

              {stepNumber !== FINAL_STEP && (
                <div className="w-6 h-[2px] bg-gray-300"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Steps */}
      {step === 1 && <StepBasicInfo register={register} errors={errors} />}
      {step === 2 && <StepRoleInfo watch={watch} setValue={setValue} />}
      {step === 3 && (
        <StepAddressOrSpecialty
          register={register}
          role={role}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
      )}

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        {step > 1 && (
          <Button type="button" variant="outline" onClick={back}>
            Back
          </Button>
        )}

        {step < FINAL_STEP ? (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              next();
            }}
          >
            Next
          </Button>
        ) : (
          <Button type="submit">Register</Button>
        )}
      </div>
    </form>
  );
}
