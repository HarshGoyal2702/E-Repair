import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ServiceCard = ({ title, subtitle, icon }) => {
  const Icon = icon; // rename for safety

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-primary/20">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        {/* Icon in a colored circle background */}
        <div className="p-3 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          {typeof Icon === "function" ? (
            <Icon className="w-6 h-6" />
          ) : (
            <span className="text-xl">🔧</span> // fallback icon
          )}
        </div>

        <div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm">
            {subtitle}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2 text-gray-600 flex-grow">
        <p>
          Expert service for {title.toLowerCase()} issues, ensuring quick
          diagnosis and certified repair techniques.
        </p>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/book">Book This Service</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
