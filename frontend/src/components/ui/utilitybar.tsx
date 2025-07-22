import { Button } from '@/components/ui/button';

const UtilityBar = () => {
  const buttons = [
    'NEW SNIPPET',
    'IMPORT FROM CLIPBOARD', 
    'BULK UPLOAD',
    'CREATE COLLECTION'
  ];

  const handleButtonClick = (action: string) => {
    console.log(`${action} clicked`);
  };

  return (
    <div className="relative mt-10 w-full max-w-2xl mx-auto">
      <div className="flex space-x-6 justify-center">
        {buttons.map((button, index) => (
          <Button
            key={`${button}-${index}`}
            variant="utility"
            size="lg"
            onClick={() => handleButtonClick(button)}
            className="px-1 justify-start text-lg whitespace-nowrap text-black hover:text-snip-purple transition-all duration-300 font-medium tracking-wide "
          >
            {button}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default UtilityBar;
