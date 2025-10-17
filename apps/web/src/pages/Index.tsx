import BlogSection from "@/components/BlogSection";
import EventsSection from "@/components/EventsSection";
import FactCheckingSection from "@/components/FactCheckingSection";
import FeaturedSection from "@/components/FeaturedSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MediaLiteracySection from "@/components/MediaLiteracySection";
import Navbar from "@/components/Navbar";
import StatsSection from "@/components/StatsSection";
import SubmitContentSection from "@/components/SubmitContentSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedSection />
      <StatsSection />
      <SubmitContentSection />
      <FactCheckingSection />
      <MediaLiteracySection />
      <BlogSection />
      <EventsSection />
      <Footer />
    </div>
  );
};

export default Index;
