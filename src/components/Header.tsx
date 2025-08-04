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
    { name: "Voices", href: "/insights" },
    { name: "Parents", href: "/apply" },
    { name: "Join Us", href: "/teachers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-[1000] w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-tma-blue/20 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img 
                src="/lovable-uploads/fc2e671f-8b1e-4540-a554-140cadbf1d9e.png" 
                alt="TMA Academy - Teenagers Management and Leadership Academy Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-[#003A5D] font-inter hidden sm:block tracking-wide">
              TMA Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href === "/curriculum" ? "/curriculum#curriculum-top" : item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-400 ease-in-out font-inter tracking-wide group whitespace-nowrap ${
                  isActive(item.href)
                    ? "text-[#F28C28] font-semibold"
                    : "text-[#003A5D] hover:text-[#F28C28]"
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#F28C28] transition-all duration-400 ease-out ${
                  isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 ml-8 pl-6 border-l border-gray-200">
              <Button 
                className="bg-[#006D6C] hover:bg-[#006D6C]/90 text-white font-inter font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#006D6C]/25 rounded-lg px-5 py-2" 
                size="sm" 
                asChild
              >
                <Link to="/portal">
                  Student Portal
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                className="border-[#F28C28] text-[#F28C28] hover:bg-[#F28C28] hover:text-white font-inter font-medium transition-all duration-300 rounded-lg px-5 py-2" 
                size="sm" 
                asChild
              >
                <Link to="/portal-login">
                  Teacher Login
                </Link>
              </Button>
              
              {/* Auth Section */}
              {!isLoading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-[#006D6C]/5 transition-colors duration-200">
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
                      variant="outline"
                      className="border-[#F28C28] text-[#F28C28] hover:bg-[#F28C28] hover:text-white font-inter font-medium transition-all duration-300 rounded-lg px-5 py-2" 
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
          <nav className="hidden md:flex lg:hidden items-center space-x-4">
            {navigation.slice(0, 4).map((item) => (
              <Link
                key={item.name}
                  to={item.href === "/curriculum" ? "/curriculum#curriculum-top" : item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-400 ease-in-out font-inter tracking-wide group ${
                  isActive(item.href)
                    ? "text-[#F28C28] font-semibold"
                    : "text-[#003A5D] hover:text-[#F28C28]"
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#F28C28] transition-all duration-400 ease-out ${
                  isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}
            
            {!isLoading && !user && (
              <Button 
                variant="outline"
                className="border-[#F28C28] text-[#F28C28] hover:bg-[#F28C28] hover:text-white font-inter font-medium transition-all duration-300 rounded-lg ml-3" 
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
                  to={item.href === "/curriculum" ? "/curriculum#curriculum-top" : item.href}
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
                  <Link to="/portal">
                    Student Portal
                  </Link>
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full transition-all duration-300 hover:scale-105" 
                  size="sm" 
                  asChild
                >
                  <Link to="/portal-login">
                    Teacher Login
                  </Link>
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