import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";
import SocialProofSection from "./SocialProofSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import FAQSection from "./FAQSection";
import FinalCTASection from "./FinalCTASection";
import LandingFooter from "./LandingFooter";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <LandingNavbar />
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection />
      <FinalCTASection />
      <LandingFooter />
    </main>
  );
}
