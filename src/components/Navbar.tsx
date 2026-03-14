import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, LogOut, Package, Shield } from 'lucide-react';
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
      setIsMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Signed Out', description: 'You have been logged out successfully.' });
      // Hard redirect to completely flush the cache state
      window.location.href = '/login'; 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-primary/95 backdrop-blur-md text-primary-foreground sticky top-0 z-50 border-b border-primary-foreground/10 shadow-sm">
      <div className="h-1 w-full" style={{ background: 'var(--gradient-gold)' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-xl font-bold transition-transform duration-300 group-hover:scale-105 shadow-md" style={{ background: 'var(--gradient-gold)' }}>
              <span className="text-primary">S</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-display font-bold tracking-tight text-primary-foreground group-hover:text-secondary transition-colors">Shree Gopal</span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-primary-foreground/70 -mt-1 font-medium">Agency</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(link => (
              <Link key={link.to} to={link.to} className="px-4 py-2 text-sm font-medium text-primary-foreground/80 hover:text-white transition-all rounded-lg hover:bg-white/10">
                {link.label}
              </Link>
            ))}
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full group">
              <Input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full bg-black/20 border-white/10 text-white placeholder:text-white/50 focus:bg-black/30 focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all rounded-full" />
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4 group-focus-within:text-secondary transition-colors" />
            </div>
          </form>

          <div className="flex items-center space-x-1 sm:space-x-3">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded-full h-10 w-10">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-primary shadow-sm" style={{ background: 'var(--gradient-gold)', color: 'hsl(var(--foreground))' }}>
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {!loading && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2.5 px-3 py-2 h-auto text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded-full border border-transparent hover:border-white/10 transition-all">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-inner" style={{ background: 'var(--gradient-gold)', color: 'hsl(var(--foreground))' }}>
                        {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[100px] truncate text-sm font-medium hidden lg:block">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-border shadow-xl">
                    <div className="px-4 py-3 bg-muted/30">
                      <p className="text-sm font-semibold truncate text-foreground">{profile?.full_name || 'Customer'}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5 px-3">
                      <Link to="/my-orders">
                        <Package className="h-4 w-4 mr-3 text-muted-foreground" /> 
                        <span className="font-medium">My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onSelect={(e) => {
                        e.preventDefault(); 
                        handleSignOut();
                      }}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer py-2.5 px-3"
                    >
                      <LogOut className="h-4 w-4 mr-3" /> 
                      <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : !loading ? (
                <>
                  <Link to="/admin/login">
                    <Button variant="ghost" size="sm" className="text-primary-foreground/50 hover:text-white hover:bg-white/10 px-3 hidden lg:flex gap-1.5">
                      <Shield className="h-3.5 w-3.5" />
                      <span className="text-xs">Admin</span>
                    </Button>
                  </Link>
                  <div className="h-4 w-px bg-white/20 mx-1 hidden lg:block" />
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 font-medium">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" style={{ background: 'var(--gradient-gold)', color: 'hsl(var(--foreground))' }}>Sign Up</Button>
                  </Link>
                </>
              ) : null}
            </div>

            <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 ml-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <form onSubmit={handleSearch} className="mb-4 px-2">
              <div className="relative">
                <Input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2.5 w-full bg-black/20 border-white/10 text-white placeholder:text-white/50 rounded-xl focus:bg-black/30" />
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              </div>
            </form>

            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(link => (
              <Link key={link.to} to={link.to} className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}

            <div className="border-t border-white/10 pt-3 mt-3 px-2">
              {user ? (
                <div className="bg-black/20 rounded-xl p-2">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-sm font-semibold text-white">{profile?.full_name || user.email}</p>
                    <p className="text-xs text-white/50 truncate">{user.email}</p>
                  </div>
                  <Link to="/my-orders" className="flex items-center px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <Package className="h-4 w-4 mr-3" /> My Orders
                  </Link>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSignOut();
                    }}
                    className="flex items-center w-full text-left px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4 mr-3" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl h-11">Login</Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full font-bold rounded-xl h-11" style={{ background: 'var(--gradient-gold)', color: 'hsl(var(--foreground))' }}>Sign Up</Button>
                    </Link>
                  </div>
                  <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-white/50 hover:text-white hover:bg-white/10 mt-1 h-10">Admin Login</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;