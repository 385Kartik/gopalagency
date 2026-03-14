import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Gold accent bar */}
      <div className="h-1 w-full" style={{ background: 'var(--gradient-gold)' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display text-lg font-bold" style={{ background: 'var(--gradient-gold)' }}>
                <span className="text-primary">S</span>
              </div>
              <div>
                <span className="text-lg font-display font-bold block leading-tight">Shree Gopal</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/50">Agency</span>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm mb-6 leading-relaxed">
              Your trusted partner for all stationery needs. Quality products, 
              competitive prices, and excellent service since 1995.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 hover:text-secondary hover:border-secondary/30 transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/40 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/contact', label: 'Bulk Orders' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-primary-foreground/60 hover:text-secondary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/40 mb-5">Categories</h3>
            <ul className="space-y-3">
              {[
                { to: '/products?category=Notebooks', label: 'Notebooks' },
                { to: '/products?category=Pens', label: 'Pens' },
                { to: '/products?category=Pencils', label: 'Pencils' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-primary-foreground/60 hover:text-secondary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/40 mb-5">Contact Info</h3>
            <div className="space-y-4">
              {[
                { icon: MapPin, text: '123 Market Street, Stationery Plaza, Mumbai - 400001' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail, text: 'shreegopalagency55@gmail.com' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start space-x-3">
                  <Icon className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <span className="text-primary-foreground/60 text-sm">{text}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10">
              <h4 className="font-semibold gold-accent text-sm mb-1.5">Business Hours</h4>
              <p className="text-primary-foreground/50 text-xs leading-relaxed">
                Mon - Sat: 9:00 AM - 8:00 PM<br />
                Sunday: 10:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/40 text-sm">
            © {new Date().getFullYear()} Shree Gopal Agency. All rights reserved.
            <span className="mx-2">·</span>Privacy Policy
            <span className="mx-2">·</span>Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
