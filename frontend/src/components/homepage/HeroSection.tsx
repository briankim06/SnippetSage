import SearchBar from '@/components/ui/searchbar';
import UtilityBar from '@/components/ui/utilitybar';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isSemantic: boolean;
  isSearching: boolean;
  onToggleSemantic: () => void;
}

const HeroSection = ({ onSearch, isSearching, isSemantic, onToggleSemantic}: HeroSectionProps) => {
  
  
  return (
    <section className={`
      flex flex-col justify-center items-center px-6 relative
      transition-all duration-500 ease-in-out
      ${isSearching ? "h-[30vh] pt-12" : "h-screen"}
      `}>
      {/* Subtle colored accent shape */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl z-0" />
      {/* Minimalistic background with subtle gradient (removed for continuous background) */}
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <h1 className={`
          font-bold text-black mb-16 animate-fade-in
          ${isSearching ? "text-5xl pt-14" : "text-6xl md:text-7xl"}`}>
          SNIPPETSAGE
        </h1>
        
        <div className="animate-fade-in delay-1500">
          <SearchBar onSearch={onSearch} isSemantic = {isSemantic} onToggleSemantic={onToggleSemantic}/>
        </div>
        
        <div className="mt-12 animate-fade-in delay-1500">
          <UtilityBar />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;