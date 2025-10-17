import BlogSection from "@/components/BlogSection";
import EventsSection from "@/components/EventsSection";
import FactCheckingSection from "@/components/FactCheckingSection";
import FeaturedSection from "@/components/FeaturedSection";
import Hero from "@/components/Hero";
import MediaLiteracySection from "@/components/MediaLiteracySection";
import StatsSection from "@/components/StatsSection";
import SubmitContentSection from "@/components/SubmitContentSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FeaturedSection />
      <StatsSection />
      <SubmitContentSection />
      <FactCheckingSection />
      <MediaLiteracySection />
      <BlogSection />
      <EventsSection />
    </div>
  );
};

export default Index;
