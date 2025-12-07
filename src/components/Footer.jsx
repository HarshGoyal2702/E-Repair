// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  Services: [
    { name: 'Mobile Repair', path: '/services#mobile' },
    { name: 'Laptop Repair', path: '/services#laptop' },
    { name: 'Appliance Fix', path: '/services#appliance' },
    { name: 'View All Services', path: '/services' },
  ],
  Company: [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Admin Login', path: '/admin/login' },
  ],
  Support: [
    { name: 'FAQ', path: '/faq' },
    { name: 'Track Order', path: '/track' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-8 border-b border-gray-700 pb-10 mb-8">
          
          {/* Column 1: Logo and Contact Info */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center text-3xl font-extrabold text-primary">
              <Wrench className="w-7 h-7 mr-2 fill-primary" /> E-Repair
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              Your reliable partner for fast, professional electronic and appliance repairs. Quality guaranteed.
            </p>
            
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2 shrink-0" />
                Headquarters, Anytown, India 12345
              </div>
              <a href="tel:+1234567890" className="flex items-center text-gray-400 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 mr-2 shrink-0" />
                (123) 456-7890
              </a>
              <a href="mailto:support@erepair.com" className="flex items-center text-gray-400 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 mr-2 shrink-0" />
                support@erepair.com
              </a>
            </div>
          </div>

          {/* Columns 2-4: Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
        </div>

        {/* Bottom Section: Copyright */}
        <div className="text-center md:flex md:items-center md:justify-between pt-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} E-Repair. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            Designed and Developed with Focus on UI/UX
          </p>
        </div>
      </div>
    </footer>
  );
}