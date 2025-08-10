import { Card } from '@/components/ui/card';
import { useState } from 'react';
import type { UserSnippet } from '@/store/slices/types';
import { useGetSnippetsQuery, useGetSemanticSnippetsQuery } from '@/store/slices/api/snippetApi';
import { PaginationBar } from '@/components/paginationbar';
import { Link } from 'react-router-dom';


interface CardGridSectionProps{
  searchQuery: string;
  isSemantic: boolean;
}


const CardGridSection = ({searchQuery, isSemantic}: CardGridSectionProps) => {

  const [currentPage, setCurrentPage] = useState(1);

  // fetch snippets from the backend, if q is empty, fetch all. If not, it's for a specific search query
  // added tags for future implementation

  const shouldUseSemantic = isSemantic && searchQuery.trim() !== '';
    const {
      data: snippetsData, 
      isLoading: keywordIsLoading, 
      isError: keywordIsError
    } = useGetSnippetsQuery(
      {page: currentPage, q: searchQuery, tag: ""},
      {skip: shouldUseSemantic}
    )

    const {
      data: semanticSnippetsData, 
      isLoading: semanticIsLoading, 
      isError: semanticIsError
    } = useGetSemanticSnippetsQuery(
      {page: currentPage, q: searchQuery, tag: ""},
      {skip: !shouldUseSemantic}
    )
  
    const data = isSemantic ? semanticSnippetsData : snippetsData;
    const isLoading = isSemantic ? semanticIsLoading : keywordIsLoading;
    const isError = isSemantic ? semanticIsError : keywordIsError;

    const totalPages = 
      data?.totalCount ? Math.max(1, Math.ceil(data.totalCount / 15)) : 1



  const onPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  if (isLoading) return <div className="flex justify-center mt-20 h-screen font-bold">Loading...</div>;
  if (isError) return <div className="flex justify-center mt-20 font-bold">Error loading snippets.</div>


  return (
    <section className="relative w-full px-4 py-12 min-h-[130vh]">
      <h1 className="flex text-4xl font-bold text-black mb-10 justify-center">
        {searchQuery ? "RESULTS" : "SNIPPETS"}
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
        
        {data?.snippets.map((snippet: UserSnippet) => (
          <Link key={snippet._id} to={`/snippets/${snippet._id}`}>
            <Card
              
              className="flex flex-col h-full shadow transition-transform duration-200 hover:-translate-y-2 hover:shadow-lg bg-white border border-gray-200"
              >
            {/* Code Preview */}
            <pre className="flex-1 overflow-hidden text-xs bg-gray-50 rounded-t-xl p-4 font-mono whitespace-pre-line max-h-[70%]">
              {snippet.code.length > 180 ? snippet.code.slice(0, 180) + '...' : snippet.code}
            </pre>
            {/* Title */}
            <div className="px-4 pt-2 pb-1 text-base font-medium text-black truncate">
              {snippet.title}
            </div>
            {/* Tags */}
            <div className="flex overflow-x-auto space-x-2 px-4 pb-4 pt-1">
              {snippet.tags?.map(tag => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-medium whitespace-nowrap border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
          </Link>
        ))}
      </div>
      {totalPages > 1 && <div className="flex justify-center absolute bottom-0 w-full">
        <PaginationBar totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
      </div>}
    </section>
  );
};

export default CardGridSection;