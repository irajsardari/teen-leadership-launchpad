import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 overflow-hidden">
                <img 
                  src="/lovable-uploads/fc2e671f-8b1e-4540-a554-140cadbf1d9e.png" 
                  alt="TMA - Teenagers Management and Leadership Academy - Future Ready Leaders" 
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white">TMA Academy</span>
                <p className="text-sm text-gray-300 mt-1">Future Ready Leaders</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              The world's first academy fully dedicated to teenage leadership and life readiness.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-tma-gold" />
                <span>info@teenmanagement.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-tma-gold" />
                <a 
                  href="https://wa.me/96899668948" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 hover:text-tma-gold transition-colors flex items-center space-x-1"
                >
                  <span>WhatsApp: +968-99668948</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-tma-gold" />
                <span>P.O. Box 2643 Ruwi, Sultanate of Oman</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-tma-gold">📱</span>
                <a 
                  href="https://instagram.com/tmaleaders" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 hover:text-tma-gold transition-colors flex items-center space-x-1"
                >
                  <span>Instagram: @tmaleaders</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-tma-gold">📺</span>
                <a 
                  href="https://youtube.com/@teenmanagement.academy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 hover:text-tma-gold transition-colors flex items-center space-x-1"
                >
                  <span>YouTube: @teenmanagement.academy</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/curriculum" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link to="/age-groups" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  Age Groups
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* For Parents & Teachers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/parents-teachers" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  Parents & Teachers
                </Link>
              </li>
              <li>
                <Link to="/curriculum" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  Download Brochure
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a
                  href="https://tma.academy/portal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 hover:text-tma-gold transition-colors flex items-center space-x-1"
                >
                  <span>Learning Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get Started</h3>
            <p className="text-primary-foreground/70 text-sm">
              Ready to empower your teenager with essential life skills?
            </p>
            <div className="space-y-3">
              <Button variant="hero" size="sm" className="w-full" asChild>
                <Link to="/apply">Apply Now</Link>
              </Button>
              <Button variant="gold" size="sm" className="w-full" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-xs sm:text-sm text-primary-foreground/70 space-y-2">
          <p>&copy; 2025 <span className="font-bold">TMA®</span> – All rights reserved.</p>
          <p><span className="font-bold">TMA</span> (Teenagers Management Academy) is a registered trademark.</p>
          <p className="leading-relaxed">No part of this website — including its text, visuals, or curriculum content — may be copied, reproduced, distributed, or used in any form without prior written permission from <span className="font-bold">TMA</span>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;