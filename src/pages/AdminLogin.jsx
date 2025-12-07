import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();
  function submit(e) {
    e.preventDefault();
    nav("/admin/dashboard");
  }
  return (
    <div className="pt-24 max-w-md mx-auto px-6">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow flex flex-col gap-4"
      >
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Password" type="password" />
        <button className="bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
