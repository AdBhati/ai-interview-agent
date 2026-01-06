import Header from "@/components/pages/landing/Header";
import HeroSection from "@/components/pages/landing/HeroSection";
import HowItWorksSection from "@/components/pages/landing/HowItWorksSection";
import ExperienceSection from "@/components/pages/landing/ExperienceSection";
import FeaturesSection from "@/components/pages/landing/FeaturesSection";
import RecruitersCandidatesSection from "@/components/pages/landing/RecruitersCandidatesSection";
import PerfectForSection from "@/components/pages/landing/PerfectForSection";
import NewsletterSection from "@/components/pages/landing/NewsletterSection";
import ContactSection from "@/components/pages/landing/ContactSection";
import CTASection from "@/components/pages/landing/CTASection";
import Footer from "@/components/pages/landing/Footer";

export default function Home() {
  return (
    <div className="bg-background-light text-slate-900 font-display antialiased overflow-x-hidden">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <ExperienceSection />
      <FeaturesSection />
      <RecruitersCandidatesSection />
      <PerfectForSection />
      <NewsletterSection />
      <ContactSection />
      <CTASection />
      <Footer />
    </div>
  );
}
