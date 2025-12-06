import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Layers, Compass, Star, Settings, LifeBuoy, FileText, Code, Storefront } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
  SidebarInput,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
function AppSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-1">
          <div className="h-6 w-6 rounded-md bg-gradient-prism" />
          <span className="text-sm font-medium">HealthOS</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/')}>
                <Link to="/"><Home /> <span>Home</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Dev Portal</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/stages')}>
                <Link to="/stages"><FileText /> <span>Stages</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/scripts')}>
                <Link to="/scripts"><Code /> <span>Scripts</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/marketplace')}>
                <Link to="/marketplace"><Storefront /> <span>Marketplace</span></Link>
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
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={className}>
        <div className="absolute left-2 top-2 z-20">
          <SidebarTrigger />
        </div>
        {container ? (
          <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" + (contentClassName ? ` ${contentClassName}` : "")}>{children}</div>
        ) : (
          children
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}