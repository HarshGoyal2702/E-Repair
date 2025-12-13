import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { publicRoutes, userRoutes, adminRoutes } from "./Routes";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
// main.jsx or index.jsx
import "leaflet/dist/leaflet.css";

import "./App.css";

function App() {


  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 ">
        <Routes>
          {/* ----------- Public Routes ----------- */}
          {publicRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={<route.element />} />
          ))}

          {/* ----------- User Protected Routes ----------- */}
          {userRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute>
                  <route.element />
                </ProtectedRoute>
              }
            />
          ))}

          {/* ----------- Admin Routes ----------- */}
          {adminRoutes.map((route, index) => {
            if (route.path === "/admin/login") {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.element />}
                />
              );
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <AdminRoute>
                    <route.element />
                  </AdminRoute>
                }
              />
            );
          })}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
