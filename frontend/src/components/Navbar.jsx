import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Wrench, Car, MapPin, CalendarCheck, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: 'Home', path: '/', icon: Car },
  { name: 'Services', path: '/services', icon: Wrench },
  { name: 'Track Repair', path: '/track', icon: MapPin },
  { name: 'Book Repair', path: '/book', icon: CalendarCheck },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "w-full sticky top-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md shadow-nav" 
          : "bg-background"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 lg:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Wrench className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-foreground tracking-tight">
                E-REPAIR
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase -mt-1">
                Auto Service
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "nav-link px-4 py-2 rounded-md",
                    isActive && "nav-link-active bg-secondary"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a 
              href="tel:+1234567890" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">1-800-REPAIR</span>
            </a>
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

            <Button 
              variant="accent"
              size="sm"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent 
              side="right" 
              className="w-full max-w-sm p-0 bg-background border-l border-border"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <Link 
                    to="/" 
                    onClick={() => setIsSheetOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <span className="font-display text-xl font-bold text-foreground tracking-tight">
                      E-REPAIR
                    </span>
                  </Link>
                </div>
                
                {/* Mobile Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsSheetOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 animate-fade-in",
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Footer */}
                <div className="p-6 border-t border-border space-y-4">
                  <a 
                    href="tel:+1234567890" 
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">1-800-REPAIR</span>
                  </a>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => { navigate("/login"); setIsSheetOpen(false); }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="accent"
                      className="w-full"
                      onClick={() => { navigate("/register"); setIsSheetOpen(false); }}
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
