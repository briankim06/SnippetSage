import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/components/hooks/useScrollAnimation';

const CTASection = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const handleCTAClick = () => {
    console.log('CTA button clicked - navigate to AI sandbox editor');
    // Add navigation logic here
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-snip-pink via-snip-rose to-snip-purple transition-opacity duration-1000 ease-out ${
          isVisible ? 'opacity-90' : 'opacity-0'
        }`} 
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 
            className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-12 leading-tight tracking-tight transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: isVisible ? '0.5s' : '0s' }}
          >
            try out our AI<br />
            <span className="text-white/90">sandbox editor</span>
          </h2>
          
          <Button
            onClick={handleCTAClick}
            className={`group bg-white/10 hover:bg-accent text-white hover:text-accent-foreground border-2 border-white/30 hover:border-accent text-xl md:text-2xl px-12 py-8 h-auto rounded-2xl backdrop-blur-sm transition-all duration-1000 ease-out hover:scale-105 hover:shadow-2xl ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: isVisible ? '1s' : '0s' }}
          >
            Get Started
            <ArrowRight className="ml-4 h-8 w-8 transition-transform duration-300 group-hover:translate-x-2" />
          </Button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div 
        className={`absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl transition-opacity duration-1000 ease-out ${
          isVisible ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`}
        style={{ transitionDelay: isVisible ? '0.8s' : '0s' }}
      />
      <div 
        className={`absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl transition-opacity duration-1000 ease-out ${
          isVisible ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`}
        style={{ transitionDelay: isVisible ? '1.2s' : '0s' }}
      />
    </section>
  );
};

export default CTASection;