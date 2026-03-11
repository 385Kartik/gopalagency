import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Truck, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-stationery.jpg';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero */}
      <div className="hero-gradient min-h-[680px] flex items-center relative">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-sm font-medium mb-6"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Premium Quality Stationery
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-[1.1]">
                Your One-Stop
                <span className="block gold-accent mt-1">
                  Stationery Shop
                </span>
              </h1>
              
              <p className="text-lg text-primary-foreground/70 mb-10 max-w-lg leading-relaxed">
                Discover premium quality stationery products for students, professionals, 
                and creative minds. From notebooks to pens, we have everything you need.
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/products">
                  <Button size="lg" className="text-base px-8 py-6 font-semibold gap-2 rounded-xl shadow-lg" style={{ background: 'var(--gradient-gold)', color: 'hsl(var(--foreground))' }}>
                    <ShoppingBag className="h-5 w-5" />
                    Shop Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                
                <Link to="/about">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-base px-8 py-6 border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground rounded-xl backdrop-blur-sm"
                  >
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl opacity-20" style={{ background: 'var(--gradient-gold)' }} />
                <img
                  src={heroImage}
                  alt="Premium Stationery Collection"
                  className="relative rounded-2xl w-full h-auto shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features Strip */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: ShoppingBag, title: 'Wide Selection', desc: 'Thousands of products from trusted brands', color: 'bg-primary' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Quick and reliable delivery across the city', color: 'bg-secondary' },
              { icon: Award, title: 'Premium Quality', desc: 'Only the best quality for our customers', color: 'bg-primary' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-start gap-5 group"
              >
                <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold mb-1">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
