import React from 'react';
import { Navbar } from '@/Components/landing/Navbar';
import { Hero } from '@/Components/landing/Hero';
import { StoresMarquee } from '@/Components/landing/StoresMarquee';
import { HowItWorks } from '@/Components/landing/HowItWorks';
import { LiveDemo } from '@/Components/landing/LiveDemo';
import { Features } from '@/Components/landing/Features';
import { Pricing } from '@/Components/landing/Pricing';
import { CTASection } from '@/Components/landing/CTASection';
import { Footer } from '@/Components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="bg-page-balanced font-body text-ink antialiased min-h-screen">
      <Navbar />
      <Hero />
      <StoresMarquee />
      <HowItWorks />
      <LiveDemo />
      <Features />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}
