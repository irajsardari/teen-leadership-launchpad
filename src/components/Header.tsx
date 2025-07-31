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
    { name: "About", href: "/about" },
    { name: "Curriculum", href: "/curriculum" },
    { name: "Parents", href: "/apply" },
    { name: "Join as Teacher", href: "/teachers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200">
            <img 
              src="/lovable-uploads/180fdff9-f676-4c90-846f-ee188ca50bb2.png" 
              alt="TMA Academy - Future Ready Leaders" 
              className="h-10 w-auto"
            />
            <span className="text-lg font-semibold text-[#012D5A] font-inter hidden sm:block tracking-tight">
              TMA Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out font-inter rounded-md group ${
                  isActive(item.href)
                    ? "text-[#008B8B] bg-[#008B8B]/5"
                    : "text-[#012D5A] hover:text-[#008B8B] hover:bg-[#008B8B]/5"
                }`}
              >
                {item.name}
                <span className={`absolute bottom-1 left-1/2 w-0 h-0.5 bg-[#008B8B] transition-all duration-300 ease-out group-hover:w-3/4 group-hover:left-[12.5%] ${
                  isActive(item.href) ? "w-3/4 left-[12.5%]" : ""
                }`} />
              </Link>
            ))}
            
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
              <Button 
                className="bg-[#008B8B] hover:bg-[#008B8B]/90 text-white font-inter transition-all duration-300 hover:scale-105 hover:shadow-md" 
                size="sm" 
                asChild
              >
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
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-[#008B8B]/5 transition-colors duration-200">
                          <User className="h-4 w-4" />
                          <span className="hidden xl:inline text-sm">
                            {user.user_metadata?.full_name || user.email}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={signOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button 
                      className="bg-gradient-to-r from-tma-coral to-tma-coral/90 hover:from-tma-coral/90 hover:to-tma-coral/80 text-white font-inter shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105" 
                      size="sm" 
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      Sign In
                    </Button>
                  )}
                </>
              )}
            </div>
          </nav>

          {/* Tablet Navigation */}
          <nav className="hidden md:flex lg:hidden items-center space-x-1">
            {navigation.slice(0, 4).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-xs font-medium transition-all duration-300 ease-in-out font-inter rounded-md group ${
                  isActive(item.href)
                    ? "text-[#008B8B] bg-[#008B8B]/5"
                    : "text-[#012D5A] hover:text-[#008B8B] hover:bg-[#008B8B]/5"
                }`}
              >
                {item.name === "Join as Teacher" ? "Teachers" : item.name}
                <span className={`absolute bottom-1 left-1/2 w-0 h-0.5 bg-[#008B8B] transition-all duration-300 ease-out group-hover:w-3/4 group-hover:left-[12.5%] ${
                  isActive(item.href) ? "w-3/4 left-[12.5%]" : ""
                }`} />
              </Link>
            ))}
            
            {!isLoading && !user && (
              <Button 
                className="bg-gradient-to-r from-tma-coral to-tma-coral/90 hover:from-tma-coral/90 hover:to-tma-coral/80 text-white font-inter shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 ml-3" 
                size="sm" 
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-[#008B8B]/5 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 font-inter hover-scale ${
                    isActive(item.href)
                      ? "text-[#008B8B] bg-[#008B8B]/10"
                      : "text-[#012D5A] hover:text-[#008B8B] hover:bg-[#008B8B]/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-3 pt-4 border-t border-gray-200 mt-3">
                <Button 
                  className="bg-[#008B8B] hover:bg-[#008B8B]/90 text-white font-inter w-full transition-all duration-300 hover:scale-105" 
                  size="sm" 
                  asChild
                >
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
                        <div className="text-sm text-[#012D5A] px-3 py-1 font-medium">
                          {user.user_metadata?.full_name || user.email}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full transition-all duration-300 hover:scale-105" 
                          onClick={signOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="bg-gradient-to-r from-tma-coral to-tma-coral/90 hover:from-tma-coral/90 hover:to-tma-coral/80 text-white font-inter w-full shadow-lg transition-all duration-300 hover:scale-105" 
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