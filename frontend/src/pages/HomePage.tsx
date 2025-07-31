import HeroSection from "@/components/homepage/HeroSection"
import CardGridSection from "@/components/homepage/CardGridSection"
import { Footer } from "@/components/homepage/Footer"
import { useState, useEffect, useRef } from "react"

const HomePage = () => {
  
  const [bgColor, setBgColor] = useState('#F8B195');



  // TODO: Refactor helper functions to a separate file
  // Color stops with fixed percentages
  const colorStops = [
    { pct: 0,    color: '#F8B195' },
    { pct: 0.3,  color: '#F67280' },
    { pct: 0.55, color: '#C06C84' },
    { pct: 0.8,  color: '#6C5B7B' },
    { pct: 1,    color: '#355C7D' },
  ];

  // Helper functions
  const hexToRgb = (hex: string) => {
    const res = hex.replace('#', '');
    const bigint = parseInt(res, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const interpolateColor = (c1: string, c2: string, factor: number) => {
    const a = hexToRgb(c1);
    const b = hexToRgb(c2);
    const r = Math.round(a.r + (b.r - a.r) * factor);
    const g = Math.round(a.g + (b.g - a.g) * factor);
    const bVal = Math.round(a.b + (b.b - a.b) * factor);
    return rgbToHex(r, g, bVal);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

      // Find which two stops the progress is between
      for (let i = 0; i < colorStops.length - 1; i++) {
        const curr = colorStops[i];
        const next = colorStops[i + 1];
        if (progress >= curr.pct && progress <= next.pct) {
          const localFactor = (progress - curr.pct) / (next.pct - curr.pct);
          const newColor = interpolateColor(curr.color, next.color, localFactor);
          setBgColor(newColor);
          break;
        }
      }
    };


    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const [searchQuery, setSearchQuery] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const isSearching = searchQuery.trim() !== "";
  const [isSemantic, setIsSemantic] = useState(false);


  // To be called by the search bar
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // If a query is entered, scroll to the results section
    if (query.trim() !== "") {
      setTimeout(() => {resultsRef.current?.scrollIntoView({ behavior: 'smooth' })}, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Solid background that changes per section */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 w-full h-full transition-colors duration-700 ease-in-out"
        style={{ background: bgColor }}
      >
        {/* Grainy paper overlay */}
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.25, pointerEvents: 'none' }}
        >
          <filter id="noise-solid" x="0" y="0">
            <feTurbulence type="fractalNoise" baseFrequency="4" numOctaves="10" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise-solid)" />
        </svg>
      </div>

      {/* Sections wrapped with refs for IntersectionObserver */}
      <div>
        <HeroSection onSearch={handleSearch} isSearching={isSearching} isSemantic={isSemantic} onToggleSemantic={() => setIsSemantic( prev => !prev)}/>
      </div>
      <div ref = {resultsRef}>
        <CardGridSection searchQuery={searchQuery} isSemantic={isSemantic}/>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage