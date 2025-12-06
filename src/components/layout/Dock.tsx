import React, { useMemo, useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { PenNib, ArrowsClockwise, Calendar, Monitor, User, Stethoscope, Hospital, Wrench } from '@phosphor-icons/react';
import { useCurrentRole } from '@/stores/useRoleStore';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { cn } from '@/lib/utils';
type DockPosition = 'bottom' | 'left' | 'right';
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
export function Dock({ openWindows, onDockItemClick }: { openWindows: any[], onDockItemClick: (id: string, path: string) => void }) {
  const role = useCurrentRole();
  const location = useLocation();
  const [position, setPosition] = useState<DockPosition>('bottom');
  useEffect(() => {
    const savedPosition = localStorage.getItem('dockPosition') as DockPosition;
    if (savedPosition) {
      setPosition(savedPosition);
    }
  }, []);
  const handlePositionChange = (newPosition: DockPosition) => {
    setPosition(newPosition);
    localStorage.setItem('dockPosition', newPosition);
  };
  const dockItems = useMemo(() => {
    const roleItems = allDockItems.filter(item => item.roles.includes(role));
    const minimizedItems = openWindows
      .filter(w => w.isMinimized)
      .map(w => {
        const baseItem = allDockItems.find(item => item.path === w.path);
        return {
          ...w,
          name: w.title,
          icon: baseItem?.icon || Wrench,
        };
      });
    return [...roleItems, ...minimizedItems.filter(m => !roleItems.some(r => r.path === m.path))];
  }, [role, openWindows]);
  const handlers = useSwipeable({
    onSwipedLeft: () => handlePositionChange('right'),
    onSwipedRight: () => handlePositionChange('left'),
    onSwipedDown: () => handlePositionChange('bottom'),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });
  const positionClasses = {
    bottom: 'bottom-2 left-1/2 -translate-x-1/2 flex-row items-end',
    left: 'left-2 top-1/2 -translate-y-1/2 flex-col items-start',
    right: 'right-2 top-1/2 -translate-y-1/2 flex-col items-end',
  };
  return (
    <TooltipProvider>
      <motion.div
        {...handlers}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(event, info) => {
          const { x, y } = info.point;
          const { innerWidth, innerHeight } = window;
          if (x < innerWidth / 4) handlePositionChange('left');
          else if (x > (innerWidth * 3) / 4) handlePositionChange('right');
          else handlePositionChange('bottom');
        }}
        className={cn("fixed z-50", positionClasses[position])}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="bg-healthos-porcelain/60 dark:bg-healthos-ink/60 backdrop-blur-lg rounded-2xl p-2 shadow-2xl flex gap-2 border border-healthos-ice/50 dark:border-healthos-ice/10"
          style={{ flexDirection: position === 'bottom' ? 'row' : 'column' }}
        >
          {dockItems.map(item => {
            const isActive = location.pathname.startsWith(item.path) && !item.isMinimized;
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.2, y: position === 'bottom' ? -10 : 0, x: position === 'left' ? 10 : position === 'right' ? -10 : 0 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDockItemClick(item.id, item.path)}
                    className="relative w-14 h-14 rounded-xl bg-healthos-ice/50 dark:bg-healthos-ice/10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-healthos-prism-start"
                  >
                    <item.icon className="w-8 h-8 text-healthos-ink dark:text-healthos-porcelain" weight="light" />
                    {(isActive || item.isMinimized) && <div className="absolute bottom-0.5 h-1 w-1 rounded-full bg-healthos-ink dark:bg-healthos-porcelain" />}
                    {item.id === 'medscribe-app' && role === 'professional' && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">1</Badge>}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side={position === 'bottom' ? 'top' : position === 'left' ? 'right' : 'left'}>
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}