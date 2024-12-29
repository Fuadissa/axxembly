"use client";

import { Dialog, DialogOverlay, DialogContent } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <DialogContent
          className="overflow-y-auto 
          max-h-[100vh] 
          max-w-[100vw] 
          w-full h-full 
          lg:max-w-[900px] 
          lg:max-h-[600px]
          "
        >
          <ScrollArea className="overflow-y-auto">{children}</ScrollArea>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
