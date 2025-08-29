import { useState, useEffect } from "react";
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

  // Handle body scroll locking for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    }

    return () => {
      document.body.classList.remove('nav-open');
    };
  }, [isMenuOpen]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Curriculum", href: "/curriculum" },
    { name: "Voices", href: "/voices" },
    { name: "Parents", href: "/apply" },
    { name: "Teach with TMA", href: "/teach-with-tma" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-[1000] w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition-opacity duration-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-tma-blue/20 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img 
                src="/lovable-uploads/fc2e671f-8b1e-4540-a554-140cadbf1d9e.png" 
                alt="TMA Academy - Teenagers Management and Leadership Academy Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-[#003A5D] font-inter hidden xs:block tracking-wide">
              TMA Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href === "/curriculum" ? "/curriculum#curriculum-top" : 
                    item.href === "/insights" ? "/insights#voices-top" : item.href}
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
                className="bg-tma-accent-green hover:bg-tma-accent-green/90 text-white font-inter font-medium transition-all duration-300 hover:shadow-lg hover:shadow-tma-accent-green/25 rounded-lg px-5 py-2 min-h-[44px]" 
                size="sm" 
                asChild>
                <Link to="/learning-portal">
                  Learning Portal
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
                to={item.href === "/curriculum" ? "/curriculum#curriculum-top" : 
                    item.href === "/insights" ? "/insights#voices-top" : item.href}
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
                className="border-tma-secondary-orange text-tma-secondary-orange hover:bg-tma-secondary-orange hover:text-white font-inter font-medium transition-all duration-300 rounded-lg ml-3 min-h-[44px]" 
                size="sm" 
                onClick={() => setIsAuthModalOpen(true)}>
                Sign In
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-tma-neutral-bg transition-colors duration-200 h-10 w-10 min-w-[44px] min-h-[44px] text-tma-navy-text"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <>
            {/* Mobile menu backdrop */}
            {isMenuOpen && (
              <div 
                className="mobile-nav-backdrop lg:hidden"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
            )}
          
          {/* Mobile menu panel */}
          <div className={`mobile-nav-panel lg:hidden ${isMenuOpen ? 'open' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b border-tma-neutral-bg">
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/fc2e671f-8b1e-4540-a554-140cadbf1d9e.png" 
                  alt="TMA Academy Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-lg font-semibold text-tma-navy-text font-inter">
                  TMA Academy
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                className="h-10 w-10 min-h-[44px] min-w-[44px] hover:bg-tma-neutral-bg text-tma-navy-text"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href === "/curriculum" ? "/curriculum#curriculum-top" : 
                      item.href === "/insights" ? "/insights#voices-top" : item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 font-inter min-h-[44px] flex items-center ${
                    isActive(item.href)
                      ? "text-white bg-tma-primary-blue"
                      : "text-tma-navy-text hover:text-tma-primary-blue hover:bg-tma-neutral-bg"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile CTA buttons - non-sticky */}
              <div className="cta-buttons px-1 py-2 space-y-3 pt-4 border-t border-tma-neutral-bg mt-3">
                <Button 
                  className="bg-tma-accent-green hover:bg-tma-accent-green/90 text-white font-inter w-full transition-all duration-300 min-h-[44px]"
                  size="sm" 
                  asChild
                >
                  <Link to="/learning-portal" onClick={() => setIsMenuOpen(false)}>
                    Learning Portal
                  </Link>
                </Button>
                
                {/* Mobile Auth */}
                {!isLoading && (
                  <>
                    {user ? (
                      <div className="space-y-2">
                        <div className="text-sm text-tma-navy-text px-3 py-1 font-medium">
                          {user.user_metadata?.full_name || user.email}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full transition-all duration-300 min-h-[44px] border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="bg-tma-secondary-orange hover:bg-tma-secondary-orange/90 text-white font-inter w-full shadow-lg transition-all duration-300 min-h-[44px]"
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
        </>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};

export default Header;