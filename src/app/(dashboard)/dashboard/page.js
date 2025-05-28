"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/hooks/useAuth";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStore } from "@/hooks/use-store";
import { ContentLayout } from "@/app/_components/DahboardLayout/content-layout";
import { useSidebar } from "@/hooks/use-sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const sidebar = useStore(useSidebar, (x) => x);

  const token = localStorage.getItem('token');
  useEffect(() => {
    // if (!token || !user) {
    //   router.push('/login');    
    // }
    if (token) {
      useAuthStore.getState().initializeAuth();
    } else {
      router.push('/login');
    }


  }, [token, user, router]);

  if (!sidebar) return null;
  const { settings, setSettings } = sidebar;

  // Show loading or nothing while checking auth
  if (!token || !user) return null;

  return (
    <>
      <div className="">
        <TooltipProvider>
          <div className="flex gap-6 mt-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-hover-open"
                    onCheckedChange={(x) => setSettings({ isHoverOpen: x })}
                    checked={settings.isHoverOpen}
                  />
                  <Label htmlFor="is-hover-open">Hover Open</Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>When hovering on the sidebar in mini state, it will open</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="disable-sidebar"
                    onCheckedChange={(x) => setSettings({ disabled: x })}
                    checked={settings.disabled}
                  />
                  <Label htmlFor="disable-sidebar">Disable Sidebar</Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hide sidebar</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </>
  );
}
