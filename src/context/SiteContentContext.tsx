import React, { createContext, useContext, useState, useEffect } from 'react';

// ===== About Page Data =====
export interface AboutStat {
  label: string;
  value: string;
}

export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutMilestone {
  year: string;
  event: string;
}

export interface AboutData {
  heroTitle: string;
  heroSubtitle: string;
  stats: AboutStat[];
  storyTitle: string;
  storyParagraphs: string[];
  companyTagline: string;
  companyLocation: string;
  valuesTitle: string;
  valuesSubtitle: string;
  values: AboutValue[];
  milestones: AboutMilestone[];
}

// ===== Contact Page Data =====
export interface ContactInfoItem {
  type: 'address' | 'phone' | 'email' | 'hours';
  title: string;
  details: string[];
}

export interface ContactData {
  heroTitle: string;
  heroSubtitle: string;
  contactInfo: ContactInfoItem[];
  formTitle: string;
  formSubtitle: string;
  mapAddress: string;
  mapLink: string;
  bulkOrderTitle: string;
  bulkOrderDescription: string;
  supportTitle: string;
  supportDescription: string;
}

// ===== Defaults =====
const defaultAboutData: AboutData = {
  heroTitle: 'About Shree Gopal Agency',
  heroSubtitle: 'Your trusted partner for premium stationery since 1995. We believe that great ideas start with great tools.',
  stats: [
    { label: 'Years in Business', value: '29+' },
    { label: 'Happy Customers', value: '10,000+' },
    { label: 'Products Available', value: '5,000+' },
    { label: 'Cities Delivered', value: '50+' },
  ],
  storyTitle: 'Our Story',
  storyParagraphs: [
    'Founded in 1995 by Mr. Gopal Sharma, Shree Gopal Agency started as a humble stationery shop in Mumbai\'s bustling market area. With a passion for quality and a commitment to customer service, the business quickly grew beyond a single storefront.',
    'Over the decades, we\'ve built strong relationships with India\'s leading stationery brands — ClassMate, Reynolds, Apsara, Navneet, Flair, Parker, and many more. Today, we are one of the most trusted wholesale and retail stationery distributors in the region.',
    'Our journey online began in 2020, driven by the goal of making quality stationery accessible to everyone — from students and teachers to artists and corporate professionals — no matter where they are in India.',
  ],
  companyTagline: 'Est. 1995 • Mumbai, India',
  companyLocation: '123 Market Street, Mumbai',
  valuesTitle: 'Why Choose Us',
  valuesSubtitle: 'We\'re more than a stationery store — we\'re your partners in creativity and productivity.',
  values: [
    { title: 'Quality Assurance', description: 'We source only from trusted brands and manufacturers, ensuring every product meets our strict quality standards.' },
    { title: 'Customer First', description: 'Our customers are at the heart of everything we do. We go above and beyond to ensure your satisfaction.' },
    { title: 'Fast Delivery', description: 'We understand urgency. Enjoy quick and reliable delivery across India with real-time order tracking.' },
    { title: 'Best Prices', description: 'Competitive pricing with regular discounts and bulk order benefits. Quality stationery shouldn\'t break the bank.' },
  ],
  milestones: [
    { year: '1995', event: 'Shree Gopal Agency founded in Mumbai as a small stationery shop.' },
    { year: '2005', event: 'Expanded to wholesale distribution, partnering with top brands.' },
    { year: '2015', event: 'Launched bulk order services for schools and corporate clients.' },
    { year: '2020', event: 'Went online — bringing quality stationery to doorsteps across India.' },
    { year: '2024', event: 'Serving 10,000+ customers with 5,000+ products and growing.' },
  ],
};

const defaultContactData: ContactData = {
  heroTitle: 'Get In Touch',
  heroSubtitle: 'Have a question, need a bulk order quote, or just want to say hello? We\'d love to hear from you.',
  contactInfo: [
    { type: 'address', title: 'Visit Us', details: ['123 Market Street, Stationery Plaza', 'Mumbai - 400001, Maharashtra'] },
    { type: 'phone', title: 'Call Us', details: ['+91 98765 43210', '+91 22 2345 6789'] },
    { type: 'email', title: 'Email Us', details: ['shreegopalagency55@gmail.com'] },
    { type: 'hours', title: 'Business Hours', details: ['Mon - Sat: 9:00 AM - 8:00 PM', 'Sunday: 10:00 AM - 6:00 PM'] },
  ],
  formTitle: 'Send us a Message',
  formSubtitle: 'We typically respond within 24 hours',
  mapAddress: '123 Market Street, Mumbai - 400001',
  mapLink: 'https://maps.google.com/?q=Mumbai+Market+Street',
  bulkOrderTitle: 'Bulk Orders',
  bulkOrderDescription: 'Schools, offices, and institutions — get special pricing on bulk orders. Contact us for a custom quote.',
  supportTitle: 'Customer Support',
  supportDescription: 'Need help with an existing order? Our support team is available Mon-Sat, 9 AM to 8 PM.',
};

interface SiteContentContextType {
  aboutData: AboutData;
  contactData: ContactData;
  updateAboutData: (data: AboutData) => void;
  updateContactData: (data: ContactData) => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aboutData, setAboutData] = useState<AboutData>(() => {
    const stored = localStorage.getItem('site_about_data');
    return stored ? JSON.parse(stored) : defaultAboutData;
  });

  const [contactData, setContactData] = useState<ContactData>(() => {
    const stored = localStorage.getItem('site_contact_data');
    return stored ? JSON.parse(stored) : defaultContactData;
  });

  const updateAboutData = (data: AboutData) => {
    setAboutData(data);
    localStorage.setItem('site_about_data', JSON.stringify(data));
  };

  const updateContactData = (data: ContactData) => {
    setContactData(data);
    localStorage.setItem('site_contact_data', JSON.stringify(data));
  };

  return (
    <SiteContentContext.Provider value={{ aboutData, contactData, updateAboutData, updateContactData }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error('useSiteContent must be used within SiteContentProvider');
  return context;
};
