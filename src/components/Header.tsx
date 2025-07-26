import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading, signOut } = useAuth();

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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/180fdff9-f676-4c90-846f-ee188ca50bb2.png" 
              alt="TMA - Teenagers Management and Leadership Academy - Future Ready Leaders" 
              className="h-12 w-auto"
            />
            <span className="text-lg font-bold text-[#012D5A] font-inter hidden sm:block">
              Teenagers Management and Leadership Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#008B8B] font-inter ${
                  isActive(item.href)
                    ? "text-[#008B8B] border-b-2 border-[#008B8B]"
                    : "text-[#012D5A]"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button className="bg-[#008B8B] hover:bg-[#008B8B]/90 text-white font-inter" size="sm" asChild>
              <a
                href="https://tma.academy/portal"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learning Portal
              </a>
            </Button>
            
            {/* Auth Section */}
            {!isLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden lg:inline">
                          {user.user_metadata?.full_name || user.email}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    className="bg-gradient-to-r from-tma-coral to-tma-coral/90 hover:from-tma-coral/90 hover:to-tma-coral/80 text-white font-inter shadow-lg hover:shadow-xl transition-all duration-200" 
                    size="sm" 
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign In
                  </Button>
                )}
              </>
            )}
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
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors font-inter ${
                    isActive(item.href)
                      ? "text-[#008B8B] bg-[#F8F4EE]"
                      : "text-[#012D5A] hover:text-[#008B8B] hover:bg-[#F8F4EE]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <Button className="bg-[#008B8B] hover:bg-[#008B8B]/90 text-white font-inter w-full" size="sm" asChild>
                  <a
                    href="https://tma.academy/portal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learning Portal
                  </a>
                </Button>
                
                {/* Mobile Auth */}
                {!isLoading && (
                  <>
                    {user ? (
                      <div className="space-y-2">
                        <div className="text-sm text-tma-blue px-3 py-1">
                          {user.user_metadata?.full_name || user.email}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full" 
                          onClick={signOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="bg-gradient-to-r from-tma-coral to-tma-coral/90 hover:from-tma-coral/90 hover:to-tma-coral/80 text-white font-inter w-full shadow-lg" 
                        size="sm" 
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};

export default Header;