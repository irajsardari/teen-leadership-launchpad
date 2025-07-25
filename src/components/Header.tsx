import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Curriculum", href: "/curriculum" },
    { name: "Age Groups", href: "/age-groups" },
    { name: "Parents & Teachers", href: "/parents-teachers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-tma-blue to-tma-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TMA</span>
            </div>
            <span className="text-xl font-bold text-primary">
              Teenagers Management Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-tma-teal ${
                  isActive(item.href)
                    ? "text-tma-blue border-b-2 border-tma-blue"
                    : "text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="hero" size="sm" asChild>
              <a
                href="https://tma.academy/portal"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learning Portal
              </a>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-tma-blue bg-tma-beige"
                      : "text-foreground hover:text-tma-teal hover:bg-tma-beige"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Button variant="hero" size="sm" className="w-full" asChild>
                  <a
                    href="https://tma.academy/portal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learning Portal
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;