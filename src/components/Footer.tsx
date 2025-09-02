import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ExternalLink, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
// Using same logo as header for consistency

const Footer = () => {
  return (
    <footer className="relative bg-[#003A5D] text-white overflow-hidden">
      {/* Animated Glass Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-white/20 rounded-full floating"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full floating" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/fc2e671f-8b1e-4540-a554-140cadbf1d9e.png" 
                alt="TMA Academy - Teenagers Management and Leadership Academy Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-2xl font-bold text-white">TMA Academy</span>
            </div>
            <p className="text-white/90 leading-relaxed text-lg">
              The world's first comprehensive academy empowering teenagers with essential life skills and future-ready leadership.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/tmaleaders" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-button p-3 rounded-xl text-white/80 hover:text-white transition-all hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/@teenmanagement.academy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-button p-3 rounded-xl text-white/80 hover:text-white transition-all hover:scale-110"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-tma-orange to-tma-yellow bg-clip-text text-transparent">
              Explore
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-white/80 hover:text-white transition-all hover:translate-x-2 block">About Our Mission</Link></li>
              <li><Link to="/curriculum" className="text-white/80 hover:text-white transition-all hover:translate-x-2 block">Curriculum</Link></li>
              <li><Link to="/voices" className="text-white/80 hover:text-white transition-all hover:translate-x-2 block">Student Success</Link></li>
              <li><Link to="/teachers" className="text-white/80 hover:text-white transition-all hover:translate-x-2 block">For Educators</Link></li>
              <li><Link to="/faq" className="text-white/80 hover:text-white transition-all hover:translate-x-2 block">FAQ</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-tma-teal to-tma-blue bg-clip-text text-transparent">
              Connect
            </h3>
            <ul className="space-y-3">
              <li><a href="mailto:info@teenmanagement.com" className="text-white/80 hover:text-white transition-all flex items-center gap-3 group">
                <div className="glass-button p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Mail className="h-4 w-4" />
                </div>
                Get Support
              </a></li>
              <li><a href="https://wa.me/96899668948" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all flex items-center gap-3 group">
                <div className="glass-button p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-4 w-4" />
                </div>
                WhatsApp Chat
              </a></li>
              <li><Link to="/privacy-policy" className="text-white/80 hover:text-white transition-all hover:translate-x-2 block">Privacy Policy</Link></li>
              <li><a href="/portal" className="text-white/80 hover:text-white transition-all flex items-center gap-3 group">
                <div className="glass-button p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <ExternalLink className="h-4 w-4" />
                </div>
                Learning Portal
              </a></li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-tma-orange to-tma-teal bg-clip-text text-transparent">
              Start Today
            </h3>
            <p className="text-white/90 leading-relaxed">
              Ready to unlock your teenager's potential? Join the future of education.
            </p>
            <div className="flex flex-col space-y-4">
              <Button 
                asChild
                className="glass-button bg-gradient-to-r from-tma-orange to-tma-yellow hover:from-tma-orange hover:to-tma-orange text-white font-bold py-3 px-6 rounded-xl border-0 transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/apply">🚀 Apply Now</Link>
              </Button>
              <Button 
                variant="outline"
                asChild
                className="glass-button text-white border-2 border-white/30 hover:border-white/50 py-3 px-6 rounded-xl font-semibold"
              >
                <Link to="/contact">💬 Let's Talk</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="glass-card-modern mt-16 p-6 rounded-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-6">
            <p className="text-white/80 font-medium">
              &copy; 2025 TMA Academy. Shaping tomorrow's leaders today.
            </p>
            <p className="text-white/70 mt-2 md:mt-0 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              P.O. Box 2643 Ruwi, Sultanate of Oman
            </p>
          </div>
          
          {/* Trademark Information */}
          <div className="border-t border-white/20 pt-6">
            <p className="text-white/70 text-sm leading-relaxed text-center">
              TMA (Teenagers Management and Leadership Academy) is an officially registered trademark in the Sultanate of Oman, under Registration Number: 188581. No part of this website — including its text, visuals, curriculum content, or digital materials — may be copied, reproduced, distributed, or used in any form without prior written permission from TMA.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;