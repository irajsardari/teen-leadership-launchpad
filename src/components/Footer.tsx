import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-tma-teal via-tma-blue to-tma-teal text-white relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-[10%] w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[15%] w-80 h-80 bg-tma-orange rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
          {/* Premium Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/30 overflow-hidden">
                <img 
                  src="/lovable-uploads/fc2e671f-8b1e-4540-a554-140cadbf1d9e.png" 
                  alt="TMA - Teenagers Management and Leadership Academy - Future Ready Leaders" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-black text-white">TMA — Teenagers Management Academy</span>
                <p className="text-base text-tma-yellow font-bold mt-1 flex items-center gap-2">
                  <span>🌟</span>
                  <span>Future Ready Leaders</span>
                  <span>🌟</span>
                </p>
              </div>
            </div>
            <p className="text-white/80 text-base leading-relaxed">
              The world's first comprehensive academy for pre-teens and teenagers (ages 10-18) dedicated to leadership and life readiness.
            </p>
            <div className="space-y-3 text-base">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-tma-orange" />
                <a 
                  href="mailto:info@teenmanagement.com"
                  className="text-white/80 hover:text-tma-orange transition-colors font-medium"
                  aria-label="Email TMA at info@teenmanagement.com"
                >
                  info@teenmanagement.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-tma-orange" />
                <a 
                  href="https://wa.me/96899668948" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-tma-orange transition-colors flex items-center space-x-2 font-medium"
                >
                  <span>WhatsApp: +968-99668948</span>
                  <ExternalLink className="h-4 w-4" />
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
                <Link to="/founder" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  Our Founder
                </Link>
              </li>
              <li>
                <Link to="/curriculum" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link to="/voices" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  Voices
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
                <Link to="/privacy-policy" className="text-primary-foreground/70 hover:text-tma-gold transition-colors">
                  Privacy Policy
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

          {/* Premium CTA Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white">Get Started</h3>
            <p className="text-white/80 leading-relaxed">
              Ready to empower your pre-teen or teenager with essential life skills?
            </p>
            <div className="space-y-4">
              <Button variant="accent" className="w-full font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/apply" className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  Apply Now
                </Link>
              </Button>
              <Button variant="outline" className="w-full font-bold py-3 rounded-xl bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20" asChild>
                <Link to="/contact" className="flex items-center justify-center gap-2">
                  <span>💬</span>
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm sm:text-base text-primary-foreground/70 space-y-3 px-4 sm:px-0">
          <p>&copy; 2025 <span className="font-bold">TMA®</span> — All rights reserved.</p>
          <p className="leading-relaxed"><span className="font-bold">TMA</span> (Teenagers Management and Leadership Academy) is an officially registered trademark in the Sultanate of Oman, under Registration Number: 185581.</p>
          <p className="leading-relaxed">No part of this website — including its text, visuals, curriculum content, or digital materials — may be copied, reproduced, distributed, or used in any form without prior written permission from <span className="font-bold">TMA</span>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;