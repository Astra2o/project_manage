// import Link from "next/link";
// import { MenuIcon, PanelsTopLeft } from "lucide-react";

// import { Button } from "@/components/ui/button";
// // import { Menu } from "@/components/admin-panel/menu";
// import {
//   Sheet,
//   SheetHeader,
//   SheetContent,
//   SheetTrigger,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { Menu } from "./menu";

// export function SheetMenu() {
//   return (
//     <Sheet>
//       <SheetTrigger className="lg:hidden" asChild>
//         <Button className="h-8" variant="outline" size="icon">
//           <MenuIcon size={20} />
//         </Button>
//       </SheetTrigger>
//       <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
//         <SheetHeader>
//           <Button
//             className="flex justify-center items-center pb-2 pt-1"
//             variant="link"
//             asChild
//           >
//             <Link href="/dashboard" className="flex items-center gap-2">
//               <PanelsTopLeft className="w-6 h-6 mr-1" />
//               <SheetTitle className="font-bold text-lg">Brand</SheetTitle>
//             </Link>
//           </Button>
//         </SheetHeader>
//         <Menu isOpen />
//       </SheetContent>
//     </Sheet>
//   );
// }







"use client";

import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "./menu";

export function SheetMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <PanelsTopLeft className="w-6 h-6 mr-1" />
              <SheetTitle className="font-bold text-lg">Ek Project</SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}

