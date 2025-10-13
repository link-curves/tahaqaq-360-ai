import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedSection from "@/components/FeaturedSection";
import FactCheckingSection from "@/components/FactCheckingSection";
import MediaLiteracySection from "@/components/MediaLiteracySection";
import BlogSection from "@/components/BlogSection";
import EventsSection from "@/components/EventsSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedSection />
      <StatsSection />
      <FactCheckingSection />
      <MediaLiteracySection />
      <BlogSection />
      <EventsSection />
      <Footer />
    </div>
  );
};

export default Index;
