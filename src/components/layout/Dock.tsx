import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PenNib, ArrowsClockwise, Calendar, Monitor, User, Stethoscope, Hospital, Wrench } from '@phosphor-icons/react';
import { useCurrentRole } from '@/stores/useRoleStore';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate, useLocation } from 'react-router-dom';
const allDockItems = [
  { id: 'medscribe-app', name: 'MedScribe App', icon: PenNib, path: '/dashboard/apps/medscribe', roles: ['professional', 'service'] },
  { id: 'regulation-center', name: 'Regulation Center', icon: ArrowsClockwise, path: '/dashboard/apps/regulacao', roles: ['professional', 'service'] },
  { id: 'agenda', name: 'Agenda', icon: Calendar, path: '/dashboard/apps/agenda', roles: ['patient', 'professional', 'service'] },
  { id: 'telemedicina', name: 'Telemedicina', icon: Monitor, path: '/dashboard/apps/telemedicina', roles: ['patient', 'professional'] },
  { id: 'patient-profile', name: 'Patient Profile', icon: User, path: '/dashboard/users/patient', roles: ['patient'] },
  { id: 'professional-user', name: 'Professional User', icon: Stethoscope, path: '/dashboard/users/professional', roles: ['service'] },
  { id: 'service-unit', name: 'Service Unit', icon: Hospital, path: '/dashboard/users/service', roles: ['service'] },
  { id: 'health-tools', name: 'Health Tools', icon: Wrench, path: '/dashboard/tools', roles: ['professional', 'service'] },
];
export function Dock() {
  const role = useCurrentRole();
  const navigate = useNavigate();
  const location = useLocation();
  const dockItems = useMemo(() => {
    return allDockItems.filter(item => item.roles.includes(role));
  }, [role]);
  return (
    <TooltipProvider>
      <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="bg-healthos-porcelain/60 dark:bg-healthos-ink/60 backdrop-blur-lg rounded-2xl p-2 shadow-2xl flex items-end gap-2 border border-healthos-ice/50 dark:border-healthos-ice/10"
        >
          {dockItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.2, y: -10 }}
                    whileTap={{ scale: 0.95, y: 5 }}
                    onClick={() => navigate(item.path)}
                    className="relative w-14 h-14 rounded-xl bg-healthos-ice/50 dark:bg-healthos-ice/10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-healthos-prism-start"
                  >
                    <item.icon className="w-8 h-8 text-healthos-ink dark:text-healthos-porcelain" weight="light" />
                    {isActive && <div className="absolute bottom-0.5 h-1 w-1 rounded-full bg-healthos-ink dark:bg-healthos-porcelain" />}
                    {item.id === 'medscribe-app' && role === 'professional' && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">1</Badge>}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </motion.div>
      </footer>
    </TooltipProvider>
  );
}