import { useState, useEffect, useCallback } from "react";
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

  // Callback to close menu - prevents recreating function on every render
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle body scroll locking with iOS-safe cleanup
  useEffect(() => {
    if (isMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
      
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.touchAction = '';
      };
    }
  }, [isMenuOpen]);

  // Always close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen, closeMenu]);

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Curriculum", href: "/curriculum" },
    { name: "TMA Lexicon", href: "/dictionary" },
    { name: "Voices", href: "/voices" },
    { name: "TMA Plus", href: "/tma-plus", badge: "Coming Soon" },
    { name: "Parents", href: "/apply" },
    { name: "Teach with TMA", href: "/teach-with-tma" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-[1000] w-full border-b bg-tma-cream/95 backdrop-blur supports-[backdrop-filter]:bg-tma-cream/80 shadow-sm">
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
            <span className="text-lg sm:text-xl font-semibold text-tma-blue font-inter hidden xs:block tracking-wide">
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
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-400 ease-in-out font-inter tracking-wide group whitespace-nowrap flex items-center gap-2 ${
                  isActive(item.href)
                    ? "text-tma-orange font-semibold"
                    : "text-tma-blue hover:text-tma-orange"
                }`}
              >
                {item.name}
                {item.badge && (
                  <span className="text-[10px] bg-tma-orange text-white px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-tma-orange transition-all duration-400 ease-out ${
                  isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 ml-8 pl-6 border-l border-gray-200">
              <Button 
                className="bg-tma-blue hover:bg-tma-blue/90 text-white font-inter font-medium transition-all duration-300 hover:shadow-lg rounded-lg px-5 py-2 min-h-[44px]" 
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
                        className="border-tma-orange text-tma-orange hover:bg-tma-orange hover:text-white font-inter font-medium transition-all duration-300 rounded-lg px-5 py-2" 
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
                    ? "text-tma-orange font-semibold"
                    : "text-tma-blue hover:text-tma-orange"
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-tma-orange transition-all duration-400 ease-out ${
                  isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}
            
            {!isLoading && !user && (
              <Button 
                variant="outline"
                className="border-tma-orange text-tma-orange hover:bg-tma-orange hover:text-white font-inter font-medium transition-all duration-300 rounded-lg ml-3 min-h-[44px]" 
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
              className="hover:bg-gray-100 transition-colors duration-200 h-10 w-10 min-w-[44px] min-h-[44px] text-tma-blue"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - iOS Safe Implementation */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-hidden={!isMenuOpen}
          className={`
            fixed inset-0 z-[100] lg:hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <nav
            className={`
              absolute right-0 top-0 h-[100dvh] w-[85vw] max-w-[360px]
              bg-white shadow-xl transition-transform duration-300 ease-in-out
              ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
              overflow-y-auto overscroll-contain
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/fc2e671f-8b1e-4540-a554-140cadbf1d9e.png" 
                  alt="TMA Academy Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-lg font-semibold text-tma-blue font-inter">
                  TMA Academy
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                className="h-10 w-10 min-h-[44px] min-w-[44px] hover:bg-gray-100 text-tma-blue"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Navigation Links */}
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href === "/curriculum" ? "/curriculum#curriculum-top" : 
                      item.href === "/insights" ? "/insights#voices-top" : item.href}
                  className={`
                    block px-4 py-3 rounded-lg text-base font-medium 
                    transition-all duration-200 font-inter min-h-[44px] 
                    flex items-center justify-between
                    ${isActive(item.href)
                      ? "text-white bg-tma-blue"
                      : "text-tma-blue hover:text-tma-orange hover:bg-gray-50"
                    }
                  `}
                  onClick={closeMenu}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-xs bg-tma-orange text-white px-2 py-1 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              
              {/* Mobile CTA buttons */}
              <div className="px-1 py-2 space-y-3 pt-4 border-t border-gray-100 mt-3">
                <Button 
                  className="bg-tma-blue hover:bg-tma-blue/90 text-white font-inter w-full transition-all duration-300 min-h-[44px]"
                  size="sm" 
                  asChild
                >
                  <Link to="/learning-portal" onClick={closeMenu}>
                    Learning Portal
                  </Link>
                </Button>
                
                {/* Mobile Auth */}
                {!isLoading && (
                  <>
                    {user ? (
                      <div className="space-y-2">
                        <div className="text-sm text-tma-blue px-3 py-1 font-medium">
                          {user.user_metadata?.full_name || user.email}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full transition-all duration-300 min-h-[44px] border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => {
                            signOut();
                            closeMenu();
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="bg-tma-orange hover:bg-tma-orange/90 text-white font-inter w-full shadow-lg transition-all duration-300 min-h-[44px]"
                        size="sm" 
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          closeMenu();
                        }}
                      >
                        Sign In
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};

export default Header;