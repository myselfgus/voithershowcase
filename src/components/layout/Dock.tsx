import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PenNib, ArrowsClockwise, Calendar, Monitor, User, Stethoscope, Hospital } from '@phosphor-icons/react';
import { useCurrentRole, UserRole } from '@/stores/useRoleStore';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
const allDockItems = [
  { id: 'medscribe', name: 'MedScribe', icon: PenNib, path: '/dashboard/stages/medscribe', roles: ['professional', 'service'] },
  { id: 'regulacao', name: 'Regulação', icon: ArrowsClockwise, path: '/dashboard/stages/regulacao', roles: ['professional', 'service'] },
  { id: 'agenda', name: 'Agenda', icon: Calendar, path: '/dashboard/stages/agenda', roles: ['patient', 'professional', 'service'] },
  { id: 'telemedicina', name: 'Telemedicina', icon: Monitor, path: '/dashboard/stages/telemedicina', roles: ['patient', 'professional'] },
  { id: 'patient-vault', name: 'Cofre do Paciente', icon: User, path: '/dashboard/actors/patient', roles: ['patient'] },
  { id: 'entity-profiles', name: 'Profissionais', icon: Stethoscope, path: '/dashboard/actors/entity', roles: ['service'] },
  { id: 'service-dashboard', name: 'Unidades', icon: Hospital, path: '/dashboard/actors/service', roles: ['service'] },
];
export function Dock() {
  const role = useCurrentRole();
  const navigate = useNavigate();
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
          {dockItems.map(item => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.2, y: -10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(item.path)}
                  className="relative w-14 h-14 rounded-xl bg-healthos-ice/50 dark:bg-healthos-ice/10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-healthos-prism-start"
                >
                  <item.icon className="w-8 h-8 text-healthos-ink dark:text-healthos-porcelain" weight="light" />
                  {item.id === 'medscribe' && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">1</Badge>}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </motion.div>
      </footer>
    </TooltipProvider>
  );
}