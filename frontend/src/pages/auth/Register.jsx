// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";

// export default function Register() {
//   const nav = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   function handleChange(e) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.msg || "Registration failed");
//       }

//       // Success → Go to login
//       nav("/login");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center  px-4">
//       <Card className="w-full max-w-md shadow-2xl rounded-2xl">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl font-bold text-blue-700">
//             Create Your Account
//           </CardTitle>
//           <p className="text-center text-sm text-gray-500">
//             Join us and get started
//           </p>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <Label>Full Name</Label>
//               <Input
//                 name="name"
//                 placeholder="John Doe"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div>
//               <Label>Email</Label>
//               <Input
//                 name="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div>
//               <Label>Phone</Label>
//               <Input
//                 name="phone"
//                 type="tel"
//                 placeholder="9876543210"
//                 value={form.phone}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <Label>Password</Label>
//               <Input
//                 name="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//                 minLength={6}
//               />
//             </div>

//             {error && (
//               <div className="bg-red-100 text-red-700 text-sm p-2 rounded-md">
//                 {error}
//               </div>
//             )}

//             <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
//               {loading ? "Creating account..." : "Register"}
//             </Button>

//             <p className="text-center text-sm text-gray-500">
//               Already have an account?{" "}
//               <span
//                 className="text-blue-600 cursor-pointer hover:underline"
//                 onClick={() => nav("/login")}
//               >
//                 Login
//               </span>
//             </p>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  const nav = useNavigate();

  async function handleRegister(payload) {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      nav("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm onSubmit={handleRegister} />
        </CardContent>
      </Card>
    </div>
  );
}
