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
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/e97b61c3-e7e0-48e7-95a6-ad9037c6ed7f.png" 
                alt="Teenagers Management and Leadership Academy - Future Ready Leaders" 
                className="h-10 w-auto"
              />
              <span className="text-lg font-bold">TMA</span>
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
                <MapPin className="h-4 w-4 text-tma-gold" />
                <span>P.O. Box 2643 Ruwi, Sultanate of Oman</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-tma-gold">📱</span>
                <span>Instagram: @teenagers.management.academy</span>
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

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/70">
          <p>&copy; 2024 Teenagers Management Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;