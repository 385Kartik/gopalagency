import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { UserPlus, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

const CustomerRegister = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({ title: 'Missing Fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Weak Password', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Password Mismatch', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password, fullName);
    setIsLoading(false);

    if (error) {
      toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account Created!', description: 'You can now log in with your credentials.' });
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
              <UserPlus className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <p className="text-sm text-muted-foreground">Join Shree Gopal Agency</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Full Name *</Label>
                <div className="relative">
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="pl-10" />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Email *</Label>
                <div className="relative">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="pl-10" />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Password *</Label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="pl-10 pr-10" />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Confirm Password *</Label>
                <div className="relative">
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="pl-10" />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerRegister;
