import HeroSection from "@/components/homepage/HeroSection"
import CardGridSection from "@/components/homepage/CardGridSection"
import { useState } from "react"

const HomePage = () => {

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
    // Add your search logic here
  };

  return (
    <div className = "min-h-screen flex flex-col ">
      <HeroSection onSearch={handleSearch} />
      <CardGridSection />
    </div>
  )
}

export default HomePage