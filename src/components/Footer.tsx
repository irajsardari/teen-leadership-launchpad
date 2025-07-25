import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-tma-navy text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-tma-blue to-tma-teal rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TMA</span>
              </div>
              <span className="text-lg font-bold">TMA</span>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering teenagers with leadership, management, and life skills
              for a successful future.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-tma-teal" />
                <span>info@tma.academy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-tma-teal" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-tma-teal" />
                <span>Global Online Academy</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-tma-teal transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/curriculum" className="text-gray-300 hover:text-tma-teal transition-colors">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link to="/age-groups" className="text-gray-300 hover:text-tma-teal transition-colors">
                  Age Groups
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-gray-300 hover:text-tma-teal transition-colors">
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
                <Link to="/parents-teachers" className="text-gray-300 hover:text-tma-teal transition-colors">
                  Parents & Teachers
                </Link>
              </li>
              <li>
                <Link to="/curriculum" className="text-gray-300 hover:text-tma-teal transition-colors">
                  Download Brochure
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-tma-teal transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a
                  href="https://tma.academy/portal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-tma-teal transition-colors flex items-center space-x-1"
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
            <p className="text-gray-300 text-sm">
              Ready to empower your teenager with essential life skills?
            </p>
            <div className="space-y-3">
              <Button variant="accent" size="sm" className="w-full" asChild>
                <Link to="/apply">Apply Now</Link>
              </Button>
              <Button variant="outline-hero" size="sm" className="w-full" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 Teenagers Management Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;