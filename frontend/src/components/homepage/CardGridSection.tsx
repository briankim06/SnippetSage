import { Card } from '@/components/ui/card';
import React from 'react';

const mockSnippets = [
  {
    id: 1,
    code: `function helloWorld() {\n  console.log('Hello, world!');\n}`,
    title: 'Hello World Function',
    tags: ['javascript', 'beginner', 'console']
  },
  {
    id: 2,
    code: `def greet(name):\n    print(f"Hello, {name}!")` ,
    title: 'Python Greet',
    tags: ['python', 'function', 'greeting']
  },
  {
    id: 3,
    code: `const sum = (a, b) => a + b;` ,
    title: 'Sum Arrow Function',
    tags: ['javascript', 'arrow', 'math']
  },
  {
    id: 4,
    code: `public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello Java\");\n  }\n}` ,
    title: 'Java Main',
    tags: ['java', 'main', 'beginner']
  },
];

const CardGridSection = () => {
  return (
    <section className="w-full px-4 py-12 min-h-[130vh]">
      <h1 className=" flex text-4xl font-bold text-black mb-10 justify-center">SNIPPETS</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
        
        {mockSnippets.map(snippet => (
          <Card
            key={snippet.id}
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
              {snippet.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-medium whitespace-nowrap border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CardGridSection;