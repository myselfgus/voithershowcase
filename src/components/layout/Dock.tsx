import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { PenNib, ArrowsClockwise, Calendar, Monitor, User, Stethoscope, Hospital, Wrench, ChatCircleDots, DotsSixVertical } from '@phosphor-icons/react';
import { useCurrentRole } from '@/stores/useRoleStore';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface DockItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  roles: string[];
  isMinimized?: boolean;
  title?: string;
}

const allDockItems: DockItem[] = [
  { id: 'ai-chatbot', name: 'AI Assistant', icon: ChatCircleDots, path: '/dashboard/apps/ai-chat', roles: ['patient', 'professional', 'service'] },
  { id: 'medscribe-app', name: 'MedScribe App', icon: PenNib, path: '/dashboard/apps/medscribe', roles: ['professional', 'service'] },
  { id: 'regulation-center', name: 'Regulation Center', icon: ArrowsClockwise, path: '/dashboard/apps/regulacao', roles: ['professional', 'service'] },
  { id: 'agenda', name: 'Agenda', icon: Calendar, path: '/dashboard/apps/agenda', roles: ['patient', 'professional', 'service'] },
  { id: 'telemedicina', name: 'Telemedicina', icon: Monitor, path: '/dashboard/apps/telemedicina', roles: ['patient', 'professional'] },
  { id: 'patient-profile', name: 'Patient Profile', icon: User, path: '/dashboard/users/patient', roles: ['patient'] },
  { id: 'professional-user', name: 'Professional User', icon: Stethoscope, path: '/dashboard/users/professional', roles: ['service'] },
  { id: 'service-unit', name: 'Service Unit', icon: Hospital, path: '/dashboard/users/service', roles: ['service'] },
  { id: 'health-tools', name: 'Health Tools', icon: Wrench, path: '/dashboard/tools', roles: ['professional', 'service'] },
];

interface DockPosition {
  x: number;
  y: number;
}

interface DockProps {
  openWindows: any[];
  onDockItemClick: (id: string, path: string) => void;
}

export function Dock({ openWindows, onDockItemClick }: DockProps) {
  const role = useCurrentRole();
  const location = useLocation();
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<DockPosition>(() => {
    const saved = localStorage.getItem('dockPosition');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { x: 0, y: 0 };
      }
    }
    return { x: 0, y: 0 };
  });

  const [isVertical, setIsVertical] = useState(() => {
    return localStorage.getItem('dockOrientation') === 'vertical';
  });

  useEffect(() => {
    localStorage.setItem('dockPosition', JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    localStorage.setItem('dockOrientation', isVertical ? 'vertical' : 'horizontal');
  }, [isVertical]);

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
    const uniqueMinimized = minimizedItems.filter(m => !roleItems.some(r => r.path === m.path));
    return [...roleItems, ...uniqueMinimized];
  }, [role, openWindows]);

  const toggleOrientation = () => {
    setIsVertical(prev => !prev);
  };

  return (
    <TooltipProvider>
      {/* Invisible constraints container */}
      <div
        ref={constraintsRef}
        className="fixed inset-0 pointer-events-none z-[99]"
        style={{ top: '40px', bottom: '8px', left: '8px', right: '8px' }}
      />

      <motion.div
        drag
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={constraintsRef}
        onDragEnd={(_, info) => {
          setPosition({ x: info.point.x, y: info.point.y });
        }}
        initial={{
          opacity: 0,
          scale: 0.8,
          x: position.x || 'calc(50vw - 200px)',
          y: position.y || 'calc(100vh - 100px)'
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed z-[100] cursor-grab active:cursor-grabbing"
        style={{
          left: position.x ? undefined : '50%',
          bottom: position.y ? undefined : '16px',
          transform: position.x ? undefined : 'translateX(-50%)'
        }}
      >
        <motion.div
          className={cn(
            "glass-card-styles rounded-2xl p-2 flex gap-1 items-center",
            "bg-white/80 dark:bg-black/60 backdrop-blur-xl",
            "border border-white/20 dark:border-white/10",
            "shadow-2xl shadow-black/20"
          )}
          style={{ flexDirection: isVertical ? 'column' : 'row' }}
        >
          {/* Drag handle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onPointerDown={(e) => dragControls.start(e)}
                onDoubleClick={toggleOrientation}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  "bg-healthos-ice/30 dark:bg-healthos-ice/10",
                  "hover:bg-healthos-ice/50 dark:hover:bg-healthos-ice/20",
                  "cursor-grab active:cursor-grabbing transition-colors"
                )}
              >
                <DotsSixVertical
                  className="w-5 h-5 text-healthos-ink/50 dark:text-healthos-porcelain/50"
                  weight="bold"
                  style={{ transform: isVertical ? 'rotate(90deg)' : 'none' }}
                />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side={isVertical ? 'right' : 'top'}>
              <p>Arrastar para mover / Duplo clique para girar</p>
            </TooltipContent>
          </Tooltip>

          {/* Separator */}
          <div className={cn(
            "bg-healthos-ink/10 dark:bg-healthos-porcelain/10",
            isVertical ? "w-10 h-px my-1" : "w-px h-10 mx-1"
          )} />

          {/* Dock items */}
          {dockItems.map(item => {
            const isActive = location.pathname.startsWith(item.path) &&
              !openWindows.find(w => w.id === item.id)?.isMinimized;
            const isAI = item.id === 'ai-chatbot';

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{
                      scale: 1.15,
                      y: isVertical ? 0 : -8,
                      x: isVertical ? 8 : 0
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDockItemClick(item.id, item.path)}
                    className={cn(
                      "relative w-12 h-12 rounded-xl flex items-center justify-center",
                      "focus:outline-none focus:ring-2 focus:ring-healthos-prism-start",
                      "transition-colors duration-200",
                      isAI
                        ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 dark:from-violet-500/30 dark:to-fuchsia-500/30"
                        : "bg-healthos-ice/50 dark:bg-healthos-ice/10 hover:bg-healthos-ice/70 dark:hover:bg-healthos-ice/20"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-7 h-7",
                        isAI
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-healthos-ink dark:text-healthos-porcelain"
                      )}
                      weight={isAI ? "duotone" : "light"}
                    />

                    {/* Active indicator */}
                    {(isActive || item.isMinimized) && (
                      <motion.div
                        layoutId="dock-indicator"
                        className={cn(
                          "absolute rounded-full bg-healthos-ink dark:bg-healthos-porcelain",
                          isVertical ? "right-0.5 w-1 h-2" : "bottom-0.5 h-1 w-2"
                        )}
                      />
                    )}

                    {/* Notification badge for MedScribe */}
                    {item.id === 'medscribe-app' && role === 'professional' && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                      >
                        1
                      </Badge>
                    )}

                    {/* AI pulse effect */}
                    {isAI && (
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500"
                        style={{ zIndex: -1 }}
                      />
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side={isVertical ? 'right' : 'top'}>
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
