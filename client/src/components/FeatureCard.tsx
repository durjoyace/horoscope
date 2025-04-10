import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  dialogContent: {
    sections: {
      title: string;
      content: string;
    }[];
  };
}

export function FeatureCard({ icon, title, description, dialogContent }: FeatureCardProps) {
  console.log(`Rendering FeatureCard for: ${title}`);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const openDialog = () => {
    console.log(`Opening dialog for: ${title}`);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    console.log(`Closing dialog for: ${title}`);
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <div 
        className="text-center group relative cursor-pointer rounded-xl overflow-hidden h-full"
        onClick={openDialog}
      >
        <div className="rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 p-6 md:p-7 shadow-lg border border-primary/10 backdrop-blur-sm group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/30 transition-all duration-300 h-full flex flex-col transform group-hover:translate-y-[-4px] group-hover:scale-[1.02]">
          <div className="bg-primary/40 group-hover:bg-primary/60 rounded-full p-5 inline-flex mb-6 mx-auto transform group-hover:rotate-12 transition-all duration-500 shadow-inner">
            <div className="h-11 w-11 text-primary-foreground group-hover:text-white">
              {icon}
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-all duration-300">{title}</h3>
          <p className="text-muted-foreground flex-grow text-sm md:text-base">
            {description}
          </p>
          <div className="mt-5 text-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-sm font-medium mr-2">Learn more</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto p-4 md:p-6" onClick={closeDialog}>
          <div 
            className="bg-background rounded-xl shadow-2xl max-w-lg w-full mx-auto my-8 overflow-hidden relative" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 md:p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-b border-primary/20 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/40 rounded-full p-3 inline-flex shadow-md flex-shrink-0">
                  <div className="h-8 w-8 text-primary-foreground">
                    {icon}
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">{description}</p>
              <button 
                className="absolute top-4 right-4 rounded-full p-1.5 hover:bg-background/30 transition-colors duration-200 text-foreground/70 hover:text-foreground"
                onClick={closeDialog}
                aria-label="Close dialog"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="p-5 md:p-6">
              <div className="space-y-5 py-2">
                {dialogContent.sections.map((section, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-semibold mb-2 text-base md:text-lg">{section.title}</h4>
                    <p className="text-sm text-muted-foreground">{section.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={closeDialog}
                  className="px-6"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}