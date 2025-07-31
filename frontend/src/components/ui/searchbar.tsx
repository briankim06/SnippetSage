import { useState } from 'react';
import { InputNoFocusBorder } from '@/components/ui/input';
import { Button } from './button';
import { cn } from '@/lib/utils';



interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isSemantic?: boolean;
  onToggleSemantic: () => void;
}

const SearchBar = ({ onSearch, placeholder = "Search for anything...", isSemantic, onToggleSemantic}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  }

  return (
    <form className="w-full max-w-4xl mx-auto" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 items-start">
        <div className="relative group w-full bg-white/90 rounded-2xl border-snip-pink-light/30 pb-9">
          
          <InputNoFocusBorder
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-5 pr-8 py-6 text-xl rounded-2xl bg-transparent border-0 focus: outline-none transition-all duration-300 h-16"
          />

          <Button 
              variant="semantic" 
              size="sm" 
              onClick={onToggleSemantic}
              className={cn(
                  "absolute left-4 bottom-2 rounded-full text-xs border border-snip-pink-light transition-colors",
                  isSemantic && "bg-snip-pink-light text-snip-purple"
                  )}>
            SEMANTIC
          </Button>
        </div>

        
      </div>
    </form>
  );
};

export default SearchBar;