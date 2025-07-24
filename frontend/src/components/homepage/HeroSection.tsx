import SearchBar from '@/components/ui/searchbar';
import UtilityBar from '@/components/ui/utilitybar';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 relative">
      {/* Subtle colored accent shape */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl z-0" />
      {/* Minimalistic background with subtle gradient (removed for continuous background) */}
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-black mb-16 animate-fade-in">
          SNIPPETSAGE
        </h1>
        
        <div className="animate-fade-in delay-1500">
          <SearchBar onSearch={onSearch} />
        </div>
        
        <div className="mt-12 animate-fade-in delay-1500">
          <UtilityBar />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;