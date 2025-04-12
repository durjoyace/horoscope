import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';

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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/40 rounded-full p-3 inline-flex shadow-md flex-shrink-0">
                <div className="h-8 w-8 text-primary-foreground">
                  {icon}
                </div>
              </div>
              <DialogTitle className="text-xl md:text-2xl font-bold">{title}</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-sm md:text-base">
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 py-2">
            {dialogContent.sections.map((section, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-semibold mb-2 text-base md:text-lg">{section.title}</h4>
                <p className="text-sm text-muted-foreground">{section.content}</p>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={closeDialog}
              className="px-6"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}