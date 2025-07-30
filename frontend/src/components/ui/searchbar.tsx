import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';



interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search for anything..." }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  }

  return (
    <form className="w-full max-w-4xl mx-auto" onSubmit={handleSubmit}>
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-snip-purple/60 h-6 w-6 transition-colors group-focus-within:text-snip-purple z-10" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-16 pr-8 py-6 text-xl border-2 border-snip-pink-light/30 rounded-2xl focus:border-snip-purple focus:ring-0 bg-white/90 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl focus:shadow-2xl h-16"
        />
      </div>
    </form>
  );
};

export default SearchBar;