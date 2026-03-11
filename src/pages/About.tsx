import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, Users, Truck, Shield, Star, Clock, MapPin, Heart } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

const iconPool = [Clock, Users, Award, Truck, Shield, Heart, Star, MapPin];
const valueIcons = [Shield, Heart, Truck, Star, Award, Clock, Users, MapPin];

const About = () => {
  const { aboutData } = useSiteContent();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{aboutData.heroTitle}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            {aboutData.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 -mt-10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aboutData.stats.map((stat, i) => {
              const Icon = iconPool[i % iconPool.length];
              return (
                <div key={i} className="bg-card rounded-xl p-6 text-center shadow-lg border border-border">
                  <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">{aboutData.storyTitle}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {aboutData.storyParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div className="bg-muted rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-primary rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-primary-foreground text-4xl font-bold">S</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Shree Gopal Agency</h3>
                <p className="text-muted-foreground mt-2">{aboutData.companyTagline}</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{aboutData.companyLocation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-foreground">{aboutData.valuesTitle}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {aboutData.valuesSubtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.values.map((value, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <div key={i} className="bg-card rounded-xl p-6 text-center shadow-sm border border-border hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Our Journey</h2>
          <div className="space-y-8">
            {aboutData.milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {milestone.year}
                  </div>
                  {index < aboutData.milestones.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-8">
                  <p className="text-foreground leading-relaxed pt-3">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
