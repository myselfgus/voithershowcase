import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Layers3, FileCode, Bot, LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
function AppSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <div className="h-6 w-6 rounded-md bg-gradient-prism" />
          <span className="text-sm font-medium">HealthOS Cast</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === '/dashboard' || location.pathname === '/dashboard/overview'}>
                <Link to="/dashboard/overview"><LayoutDashboard className="h-4 w-4" /> <span>Overview</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard/actors')}>
                <Link to="/dashboard/actors"><Users className="h-4 w-4" /> <span>Actors</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard/stages')}>
                <Link to="/dashboard/stages"><Layers3 className="h-4 w-4" /> <span>Stages</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard/scripts')}>
                <Link to="/dashboard/scripts"><FileCode className="h-4 w-4" /> <span>Scripts</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard/tools')}>
                <Link to="/dashboard/tools"><Bot className="h-4 w-4" /> <span>Tool Actors</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 text-xs text-muted-foreground">Voither HealthOS</div>
      </SidebarFooter>
    </Sidebar>
  );
}
type DashboardLayoutProps = {
  children: React.ReactNode;
  className?: string;
};
export function DashboardLayout({ children, className }: DashboardLayoutProps): JSX.Element {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={className}>
        <div className="absolute left-2 top-2 z-20">
          <SidebarTrigger />
        </div>
        <ThemeToggle className="absolute top-2 right-2" />
        <main className="h-full w-full overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}