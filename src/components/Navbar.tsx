import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, UserCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, profile, signOut, loading } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Signed Out', description: 'You have been logged out.' });
    navigate('/');
  };

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'var(--gradient-gold)' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display text-lg font-bold transition-transform group-hover:scale-105" style={{ background: 'var(--gradient-gold)' }}>
              <span className="text-primary">S</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-display font-bold tracking-tight text-primary-foreground">Shree Gopal</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60 -mt-1">Agency</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-primary-foreground/80 hover:text-secondary transition-colors rounded-lg hover:bg-primary-foreground/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:bg-primary-foreground/15 focus:border-secondary/50 transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/40 h-4 w-4" />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Link to="/cart" className="relative group">
              <Button variant="ghost" size="sm" className="p-2.5 text-primary-foreground/80 hover:text-secondary hover:bg-primary-foreground/5">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center" style={{ background: 'var(--gradient-gold)', color: 'hsl(var(--foreground))' }}>
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth - Desktop */}
            <div className="hidden md:block">
              {!loading && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-primary-foreground/80 hover:text-secondary hover:bg-primary-foreground/5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--gradient-gold)', color: 'hsl(var(--foreground))' }}>
                        {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[80px] truncate text-sm">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold truncate">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/my-orders" className="cursor-pointer">
                        <Package className="h-4 w-4 mr-2" /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/login" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : !loading ? (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="font-semibold" style={{ background: 'var(--gradient-gold)', color: 'hsl(var(--foreground))' }}>Sign Up</Button>
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-primary-foreground/10 pb-4">
            <div className="pt-3 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-3 px-1">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/40 h-4 w-4" />
                </div>
              </form>

              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="block px-3 py-2.5 text-primary-foreground/80 hover:text-secondary hover:bg-primary-foreground/5 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-primary-foreground/10 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-primary-foreground">{profile?.full_name || user.email}</p>
                      <p className="text-xs text-primary-foreground/50">{user.email}</p>
                    </div>
                    <Link to="/my-orders" className="block px-3 py-2.5 text-primary-foreground/80 hover:text-secondary rounded-lg" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                    <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-destructive hover:bg-primary-foreground/5 rounded-lg">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-3 pt-1">
                    <Link to="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-primary-foreground/20 text-primary-foreground">Login</Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full font-semibold" style={{ background: 'var(--gradient-gold)', color: 'hsl(var(--foreground))' }}>Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
