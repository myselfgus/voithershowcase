import React, { useEffect } from 'react';
import { Link, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Home, Users, Layers3, Code, Wrench, Stethoscope, Hospital } from "lucide-react";
import { PenNib, ArrowsClockwise, Calendar, Monitor } from '@phosphor-icons/react';
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
import { TopMenuBar } from './TopMenuBar';
import { Dock } from './Dock';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';
import { useCurrentRole } from '@/stores/useRoleStore';
import { WindowManager } from './WindowManager';
import { Dashboard } from '@/pages/Dashboard';
const navItems = [
    { path: '/dashboard/overview', label: 'Overview', icon: Home, roles: ['patient', 'professional', 'service'] },
    { path: '/dashboard/users/patient', label: 'Patient Profile', icon: Users, roles: ['patient'] },
    { path: '/dashboard/users/professional', label: 'Professional Users', icon: Stethoscope, roles: ['service'] },
    { path: '/dashboard/users/service', label: 'Service Units', icon: Hospital, roles: ['service'] },
    { path: '/dashboard/apps/medscribe', label: 'MedScribe App', icon: PenNib, roles: ['professional', 'patient'] },
    { path: '/dashboard/apps/regulacao', label: 'Regulation Center', icon: ArrowsClockwise, roles: ['professional', 'service'] },
    { path: '/dashboard/apps/agenda', label: 'Agenda App', icon: Calendar, roles: ['patient', 'professional', 'service'] },
    { path: '/dashboard/apps/telemedicina', label: 'Telemedicina App', icon: Monitor, roles: ['patient', 'professional'] },
    { path: '/dashboard/rules', label: 'Workflow Rules', icon: Code, roles: ['service'] },
    { path: '/dashboard/tools', label: 'Health Tools', icon: Wrench, roles: ['professional', 'service'] },
];
function AppSidebar() {
  const location = useLocation();
  const role = useCurrentRole();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const filteredNav = navItems.filter(item => item.roles.includes(role));
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <div className="h-6 w-6 rounded-md bg-gradient-prism" />
          <span className="text-sm font-medium">HealthOS</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {filteredNav.map(item => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={isActive(item.path)}>
                  <Link to={item.path}><item.icon className="h-4 w-4" /> <span>{item.label}</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 text-xs text-muted-foreground">Voither HealthOS</div>
      </SidebarFooter>
    </Sidebar>
  );
}
export function AppLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const location = useLocation();
  const { transcript, startListening, isSupported } = useSpeechRecognition();
  useEffect(() => {
    if (isSupported) {
      startListening();
    }
  }, [isSupported, startListening]);
  useEffect(() => {
    if (transcript) {
      toast.info(`Comando: "${transcript}"`);
      // Mock parse, integrate /api/voice-command in future
      if (transcript.toLowerCase().includes('medscribe')) {
        window.location.href = '/dashboard/apps/medscribe';
      }
    }
  }, [transcript]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="h-screen w-screen bg-healthos-porcelain dark:bg-healthos-ink text-healthos-ink dark:text-healthos-porcelain flex flex-col overflow-hidden">
        <TopMenuBar />
        <div className="flex flex-1 overflow-hidden">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex-1 relative">
              <div className="absolute left-2 top-2 z-40">
                <SidebarTrigger />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full w-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    </MotionConfig>
  );
}