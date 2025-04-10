import React from 'react';
import { ArrowRight } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="text-center group relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300 rounded-xl overflow-hidden">
          <div className="rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 p-6 shadow-lg border border-primary/10 backdrop-blur-sm group-hover:shadow-primary/20 group-hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
            <div className="bg-primary/40 group-hover:bg-primary/60 rounded-full p-4 inline-flex mb-5 mx-auto transform group-hover:rotate-12 transition-all duration-300 shadow-inner">
              <div className="h-10 w-10 text-primary-foreground group-hover:text-white">
                {icon}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-all duration-300">{title}</h3>
            <p className="text-muted-foreground flex-grow">
              {description}
            </p>
            <div className="mt-4 text-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm font-medium mr-1">Learn more</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/40 rounded-full p-3 inline-flex shadow-md">
              <div className="h-8 w-8 text-primary-foreground">
                {icon}
              </div>
            </div>
            <DialogTitle className="text-xl">{title}</DialogTitle>
          </div>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {dialogContent.sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-2">{section.title}</h4>
              <p className="text-sm text-muted-foreground">{section.content}</p>
            </div>
          ))}
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}