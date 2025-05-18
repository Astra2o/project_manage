"use client";

import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";
import { useSidebar } from "@/hooks/use-sidebar";
import { ContentLayout } from "./content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";


import { usePathname } from "next/navigation";
import React from "react";

export function useBreadcrumbs() {
  const pathname = usePathname();
  const pathWithoutQuery = pathname.split("?")[0]; // if needed
  const pathArray = pathWithoutQuery.split("/").filter((p) => p);

  return pathArray;
}


export default function AdminPanelLayout({ children }) {
  const sidebar = useStore(useSidebar, (x) => x);
    const breadcrumbs = useBreadcrumbs();

  

  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)]  dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >

         <ContentLayout title="Dashboard">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                     {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {idx === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={`/${breadcrumbs.slice(0, idx + 1).join("/")}`}>
                          {crumb}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
                  {/* <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem> */}
                </BreadcrumbList>
              </Breadcrumb> 
              <div className=" m-2">
        
        {children}
              </div>
            </ContentLayout>



      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
