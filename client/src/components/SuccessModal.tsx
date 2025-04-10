import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="flex justify-center mb-4 text-4xl text-teal-600">
          <i className="fas fa-check-circle"></i>
        </div>
        <DialogTitle className="text-2xl font-playfair font-bold">Success!</DialogTitle>
        <DialogDescription className="text-center text-base">
          {message}
        </DialogDescription>
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-teal-600 to-teal-400 text-white font-semibold"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
