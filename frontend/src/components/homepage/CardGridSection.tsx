import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import type { UserSnippet } from '@/store/slices/types';
import { useGetSnippetsQuery } from '@/store/slices/api/snippetApi';
import { PaginationBar } from '@/components/paginationbar';
import { Link } from 'react-router-dom';

const CardGridSection = () => {
  const [snippets, setSnippets] = useState<UserSnippet[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {data: snippetsData, isLoading, error} = useGetSnippetsQuery({page: currentPage});

  useEffect(() => {
    if (snippetsData) {
      setTotalPages(Math.ceil((snippetsData.totalCount || 0)  / 15));
      setSnippets(snippetsData.snippets || []);
    }
  }, [snippetsData]);


  const onPageChange = (page: number) => {
    setCurrentPage(page);
  }


  return (
    <section className="relative w-full px-4 py-12 min-h-[130vh]">
      <h1 className=" flex text-4xl font-bold text-black mb-10 justify-center">SNIPPETS</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
        
        {Array.isArray(snippets) && snippets.map(snippet => (
          <Link to={`/snippets/${snippet._id}`}>
            <Card
              key={snippet._id}
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
      <div className="flex justify-center absolute bottom-0 w-full">
        <PaginationBar totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
      </div>
    </section>
  );
};

export default CardGridSection;