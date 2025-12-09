// src/pages/Login.jsx (Refactored)
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin"; // <-- IMPORT THE NEW HOOK

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  // --- Component State for Input Fields ONLY ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- Logic State & Functionality from Hook ---
  const { loading, error, loginUser } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    loginUser(email, password); // Call the hook function with form data
  }

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 bg-gray-50"> 
      <Card className="w-full max-w-md shadow-2xl p-6 md:p-8">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-3xl font-bold text-center text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground mt-2">
            Login to access your repair portal.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Login Button (Uses theme-aware primary variant) */}
          <Button
            type="submit"
            disabled={loading}
            className={cn("w-full py-6 text-lg font-semibold", loading && "animate-pulse")}
            variant="default" 
          >
            {loading ? "Verifying Credentials..." : "Login"}
          </Button>

        </form>
        
        <CardFooter className="mt-8 pt-0 flex flex-col items-center text-sm text-muted-foreground">
            <Link 
                to="/register" 
                className="hover:text-primary transition-colors font-medium underline-offset-4 hover:underline"
            >
                Don't have an account? Register Here
            </Link>
            <Link 
                to="/forgot-password" 
                className="mt-2 text-xs hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
                Forgot Password?
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}