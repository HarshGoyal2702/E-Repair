import React from "react";
import ServiceCard from "../components/ServiceCard";

const services = [
  {
    title: "Mobile Repair",
    subtitle: "Screen, battery, water damage",
    icon: "📱",
  },
  { title: "Laptop Repair", subtitle: "Motherboard, SSD, display", icon: "💻" },
  { title: "TV Repair", subtitle: "Panel, sound, power", icon: "📺" },
  { title: "AC Repair", subtitle: "Gas, compressor, service", icon: "❄️" },
  { title: "Fridge Repair", subtitle: "Cooling & compressor", icon: "🧊" },
];

export default function Services() {
  return (
    <div className="pt-8 pb-12 max-w-6xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-6">All Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <ServiceCard key={s.title} {...s} />
        ))}
      </div>
    </div>
  );
}
