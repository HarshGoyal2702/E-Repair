import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const API_URL = "http://localhost:5000/api/auth/login";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Login failed");

      // Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Save to Redux
      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        })
      );

      // Navigate based on role
      const role = data.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "worker") navigate("/worker/dashboard");
      else navigate("/dashboard");

      return data.user;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, loginUser };
};
