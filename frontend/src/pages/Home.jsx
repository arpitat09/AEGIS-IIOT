import LandingNavbar from "../features/landing/Navbar/LandingNavbar";
import Hero from "../features/landing/Hero/Hero";
import Stats from "../features/landing/Stats/Stats";
import Features from "../features/landing/Features/Features";
import ArchitecturePreview from "../features/landing/Architecture/ArchitecturePreview";
import Technology from "../features/landing/Technology/Technology";
import ResearchContribution from "../features/landing/Research/ResearchContribution";
import Footer from "../features/landing/Footer/Footer";

function Home() {
  return (
    <>
      <LandingNavbar />
      <Hero />
      <Stats />
      <Features />
      <ArchitecturePreview />
      <Technology />
      <ResearchContribution />
      <Footer />
    </>
  );
}

export default Home;