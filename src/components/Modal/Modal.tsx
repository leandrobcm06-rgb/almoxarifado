import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, title, size = 'md', children }: ModalProps) {
  const sizeClasses = {
    sm: "sm:max-w-[420px]",
    md: "sm:max-w-[600px]",
    lg: "sm:max-w-[900px]",
    xl: "sm:max-w-[1200px]",
    full: "sm:max-w-[95vw] h-[95vh]",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${sizeClasses[size]} p-6 max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
