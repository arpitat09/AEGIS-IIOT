import LandingNavbar from "../features/landing/Navbar/LandingNavbar";
import Hero from "../features/landing/Hero/Hero";
import Features from "../features/landing/Features/Features";
import DefensePipeline from "../features/landing/Pipeline/DefensePipeline";
import ThreatPreview from "../features/landing/ThreatPreview/ThreatPreview";
import IndustrialFocus from "../features/landing/Industrial/IndustrialFocus";
import Technology from "../features/landing/Technology/Technology";
import ArchitecturePreview from "../features/landing/Architecture/ArchitecturePreview";
import SecurityFeatures from "../features/landing/Security/SecurityFeatures";
import FinalCTA from "../features/landing/CTA/FinalCTA";
import Footer from "../features/landing/Footer/Footer";
import AnimatedCyberBackground from "../features/landing/AnimatedCyberBackground/AnimatedCyberBackground";

export default function Home() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", backgroundColor: "#060B0A" }}>
      {/* Background Animated Canvas */}
      <AnimatedCyberBackground />

      {/* Main Foreground Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <LandingNavbar />

        <main>
          <Hero />
          <Features />
          <DefensePipeline />
          <ThreatPreview />
          <IndustrialFocus />
          <Technology />
          <ArchitecturePreview />
          <SecurityFeatures />
          <FinalCTA />
        </main>

        <Footer />
      </div>
    </div>
  );
}
