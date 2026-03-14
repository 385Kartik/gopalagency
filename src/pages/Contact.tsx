import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Building, Headphones } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSiteContent } from '@/context/SiteContentContext';
import { supabase } from '@/integrations/supabase/client';

const iconMap: Record<string, React.ElementType> = {
  address: MapPin,
  phone: Phone,
  email: Mail,
  hours: Clock,
};

const Contact = () => {
  const { contactData } = useSiteContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: 'Missing Fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject || null,
        message: formData.message,
      });

      if (dbError) {
        console.error('DB error:', dbError);
        throw new Error('Failed to save message');
      }

      // Send email notification
      const { error: fnError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
      });

      if (fnError) {
        console.warn('Email notification failed, but message was saved:', fnError);
      }

      toast({ title: 'Message Sent!', description: 'We received your message and will get back to you soon.' });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Submit error:', error);
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl gold-accent font-bold mb-4">{contactData.heroTitle}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            {contactData.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactData.contactInfo.map((item, i) => {
              const Icon = iconMap[item.type] || Phone;
              return (
                <div key={i} className="bg-card rounded-xl p-5 shadow-lg border border-border text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  {item.details.map((d, j) => (
                    <p key={j} className="text-sm text-muted-foreground">{d}</p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{contactData.formTitle}</h2>
                  <p className="text-sm text-muted-foreground">{contactData.formSubtitle}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                    <Select value={formData.subject} onValueChange={(val) => setFormData(prev => ({ ...prev, subject: val }))}>
                      <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="order">Order Related</SelectItem>
                        <SelectItem value="bulk">Bulk Order Quote</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="partnership">Business Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto btn-primary" disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Map + Extra Info */}
            <div className="space-y-8">
              <div className="bg-muted rounded-2xl overflow-hidden h-72 flex items-center justify-center border border-border">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-foreground mb-1">Our Location</h3>
                  <p className="text-sm text-muted-foreground">{contactData.mapAddress}</p>
                  <a
                    href={contactData.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-5 border border-border">
                  <Building className="h-6 w-6 text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-1">{contactData.bulkOrderTitle}</h4>
                  <p className="text-sm text-muted-foreground">{contactData.bulkOrderDescription}</p>
                </div>
                <div className="bg-card rounded-xl p-5 border border-border">
                  <Headphones className="h-6 w-6 text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-1">{contactData.supportTitle}</h4>
                  <p className="text-sm text-muted-foreground">{contactData.supportDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
