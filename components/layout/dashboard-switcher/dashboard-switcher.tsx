import { Suspense, useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  LaptopMinimal,
  Plus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type Dashboard = {
  name: string;
  logo: React.ComponentType<{ className?: string }>;
};

async function getDashboards(): Promise<Dashboard[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    { name: "Dashboard Pro", logo: BriefcaseBusiness },
    { name: "Dashboard Perso", logo: LaptopMinimal },
  ];
}

export function DashboardSwitcher() {
  const [activeDashboard, setActiveDashboard] = useState<
    Dashboard | undefined
  >();
  const dashboards = getDashboards();

  if (!activeDashboard) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-fit px-1.5">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md">
                  <activeDashboard.logo className="size-3" />
                </div>
                <span className="truncate font-medium">
                  {activeDashboard.name}
                </span>
                <ChevronDown className="opacity-50" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 rounded-lg"
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Dashboard(s)
              </DropdownMenuLabel>
              {dashboards.map((dashboard, index) => (
                <DropdownMenuItem
                  key={dashboard.name}
                  onClick={() => setActiveDashboard(dashboard)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-xs border">
                    <dashboard.logo className="size-4 shrink-0" />
                  </div>
                  {dashboard.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />

              <DropdownMenuItem className="gap-2 p-2">
                <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">Ajouter</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </Suspense>
  );
}
