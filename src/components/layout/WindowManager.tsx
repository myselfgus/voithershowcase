import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useCurrentRole } from '@/stores/useRoleStore';
import { CheckCircle, AlertTriangle, Signature } from 'lucide-react';
export interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number | string; height: number | string };
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  zIndex: number;
  isMinimized: boolean;
  automationLevel?: 'auto_execute' | 'require_validation' | 'require_signature';
  allowedRoles?: string[];
}
const AutomationBadge = ({ level }: { level: WindowProps['automationLevel'] }) => {
  if (!level) return null;
  const config = {
    auto_execute: { text: 'Auto-Execute', Icon: CheckCircle, color: 'text-green-500' },
    require_validation: { text: 'Validação Requerida', Icon: AlertTriangle, color: 'text-yellow-500' },
    require_signature: { text: 'Assinatura Requerida', Icon: Signature, color: 'text-red-500' },
  };
  const { text, Icon, color } = config[level];
  return (
    <div className={`flex items-center gap-1 text-xs text-muted-foreground ${color}`}>
      <Icon className="h-3 w-3" />
      {text}
    </div>
  );
};
function Window({ id, title, children, defaultPosition = { x: 50, y: 50 }, defaultSize = { width: 600, height: 400 }, onClose, onMinimize, onFocus, zIndex, isMinimized, automationLevel, allowedRoles }: WindowProps) {
  const role = useCurrentRole();
  const dragControls = useDragControls();
  if (allowedRoles && !allowedRoles.includes(role)) {
    return null;
  }
  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          drag
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.9, x: defaultPosition.x, y: defaultPosition.y }}
          animate={{ opacity: 1, scale: 1, width: defaultSize.width, height: defaultSize.height, zIndex }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute glass-card-styles rounded-lg overflow-hidden flex flex-col"
          onMouseDown={() => onFocus(id)}
          onFocus={() => onFocus(id)}
          tabIndex={0}
        >
          <header
            onPointerDown={(e) => { e.preventDefault(); dragControls.start(e); }}
            className="flex items-center justify-between px-3 h-9 border-b flex-shrink-0 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => onClose(id)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
              <button onClick={() => onMinimize(id)} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
              <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">{title}</span>
              <AutomationBadge level={automationLevel} />
            </div>
            <div className="w-16" />
          </header>
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function WindowManager({ openWindows, setOpenWindows }: { openWindows: (Omit<WindowProps, 'onClose' | 'onMinimize' | 'onFocus' | 'zIndex'> & { component: React.ReactNode })[], setOpenWindows: any }) {
  const [focusOrder, setFocusOrder] = useState<string[]>([]);
  useEffect(() => {
    setFocusOrder(openWindows.map(w => w.id));
  }, [openWindows]);
  const handleClose = useCallback((id: string) => {
    setOpenWindows((windows: any) => windows.filter((w: any) => w.id !== id));
    setFocusOrder(order => order.filter(fid => fid !== id));
  }, [setOpenWindows]);
  const handleMinimize = useCallback((id: string) => {
    setOpenWindows((windows: any) => windows.map((w: any) => w.id === id ? { ...w, isMinimized: true } : w));
    setFocusOrder(order => [ ...order.filter(fid => fid !== id), id ]);
  }, [setOpenWindows]);
  const handleFocus = useCallback((id: string) => {
    if (focusOrder[focusOrder.length - 1] !== id) {
      setFocusOrder(order => [ ...order.filter(fid => fid !== id), id ]);
    }
  }, [focusOrder]);
  return (
    <div className="w-full h-full relative">
      {openWindows.map(window => (
        <Window
          key={window.id}
          {...window}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onFocus={handleFocus}
          zIndex={focusOrder.indexOf(window.id) + 10}
        >
          {window.component}
        </Window>
      ))}
    </div>
  );
}