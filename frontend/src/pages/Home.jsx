// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard"; // Reusable ServiceCard component
import {
  Zap,
  Clock,
  ShieldCheck,
  Truck,
  Smartphone,
  Laptop,
  Tv,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wrench, Shield, Star, Car, Settings} from "lucide-react";
// Feature data for the blocks (based on the First Script's content)
const features = [
  {
    icon: Truck,
    title: "Free Pickup",
    description: "Hassle-free service in selected areas.",
    delay: "400ms",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Most repairs completed within 48 hours.",
    delay: "500ms",
  },
  {
    icon: ShieldCheck,
    title: "Warranty",
    description: "Guaranteed 30-day warranty on all repairs.",
    delay: "600ms",
  },
];

// Popular Services (Using Lucide icons for better UI)
const popularServices = [
  {
    title: "Mobile Repair",
    subtitle: "Screen, battery, water damage",
    icon: Smartphone,
  },
  {
    title: "Laptop Repair",
    subtitle: "OS, hardware, display issues",
    icon: Laptop,
  },
  { title: "TV Repair", subtitle: "Panel, power, audio issues", icon: Tv },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 1. Hero Section (Merged Layout & Style) */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24">
        {/* Subtle Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content Column (Second Script Typography) */}
            <div className="w-full lg:w-1/2">
              <div
                className="relative inline-block p-0.5 rounded-full overflow-hidden mb-6 animate-fade-in"
                style={{ animationDelay: "50ms" }}
              >
                {/* 1. Animated Gradient Layer (The moving colorful border) */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-primary to-amber-500 animate-border-spin rounded-full" />

                {/* 2. Inner Badge Content (This masks the moving gradient) */}
                <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary text-sm font-medium">
                  <Zap className="w-4 h-4 fill-primary" />
                  Quick Fixes for All Your Devices
                </div>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-700 tracking-tight mb-6 animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                Fast & Reliable <br />
                <span className="text-primary">Electronic Repair</span>
              </h1>

              <p
                className="text-lg text-gray-600 mb-8 max-w-xl animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                Mobile, Laptop, TV, Appliances — we fix it all. Professional
                service, transparent pricing, and timely delivery guaranteed.
              </p>

              {/* Action Buttons (First Script Style, Shadcn Buttons) */}
              <div
                className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-in"
                style={{ animationDelay: "300ms" }}
              >
                <Button asChild size="lg" className="group text-white text-lg px-8 py-3">
                  <Link to="/book">
                    Book a Repair
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3"
                >
                  <Link to="/services">View Services</Link>
                </Button>
              </div>

              {/* Feature Blocks (First Script Content, Second Script Clean Styling) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-3 animate-fade-in"
                    style={{ animationDelay: feature.delay }}
                  >
                    <feature.icon className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Column (First Script Layout) */}
            <div className="w-full lg:w-1/2 flex justify-center mt-12 lg:mt-0">
              <div className="w-full max-w-md rounded-xl overflow-hidden shadow-2xl ring-4 ring-primary/5">
                <img
                  alt="Repair Illustration"
                  src="https://images.unsplash.com/photo-1606577924006-27d39b132ae2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  className="w-full h-92 object-cover bg-gray-100"
                />
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="text-sm text-gray-500 font-medium text-center">
                    Trusted by local communities • Genuine parts always used.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Explore Our Popular Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularServices.map((service, index) => (
            // ServiceCard is a component you will create next using Shadcn Card
            <ServiceCard
              key={index}
              title={service.title}
              subtitle={service.subtitle}
              icon={service.icon}
            />
          ))}
        </div>
      </section>
       <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose E-Repair?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge technology with expert craftsmanship to deliver unmatched service quality.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Wrench, title: "Expert Mechanics", desc: "ASE-certified technicians with years of experience" },
              { icon: Clock, title: "Fast Turnaround", desc: "Most repairs completed within 24-48 hours" },
              { icon: Shield, title: "Warranty Included", desc: "12-month warranty on all repairs and parts" },
              { icon: Zap, title: "Live Tracking", desc: "Real-time updates on your repair status" },
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="group p-6 rounded-xl bg-background border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-105 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
