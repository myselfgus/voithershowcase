import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PatientActorVault } from '@/components/actors/PatientActorVault';
import { EntityActorProfile } from '@/components/actors/EntityActorProfile';
import { ServiceActorDashboard } from '@/components/actors/ServiceActorDashboard';
import { ToolActorList } from '@/components/actors/ToolActorList';
import { MedScribeStage } from '@/stages/MedScribeStage';
import { RegulacaoStage } from '@/components/stages/RegulacaoStage';
import { AgendaStage } from '@/components/stages/AgendaStage';
import { TelemedicinaStage } from '@/components/stages/TelemedicinaStage';
import { CastOverview } from './CastOverview';
import { ScriptRunner } from '@/components/ScriptRunner';
import { useCurrentRole } from '@/stores/useRoleStore';
import { WindowManager, WindowProps } from '@/components/layout/WindowManager';
import { Dock } from '@/components/layout/Dock';
import { VoitherAppLayout } from '@/components/layout/VoitherAppLayout';
type WindowConfig = Omit<WindowProps, 'onClose' | 'onMinimize' | 'onFocus' | 'zIndex' | 'isMinimized' | 'children'> & {
  path: string;
  component: React.ReactNode;
};
const windowConfig: Record<string, WindowConfig> = {
  'overview': { id: 'overview', path: '/dashboard/overview', title: 'HealthOS Core Overview', component: <CastOverview />, defaultSize: { width: 700, height: 550 } },
  'patient-profile': { id: 'patient-profile', path: '/dashboard/users/patient', title: 'Patient Profile Manager', component: <PatientActorVault />, allowedRoles: ['patient'], defaultSize: { width: 600, height: 650 } },
  'professional-user': { id: 'professional-user', path: '/dashboard/users/professional', title: 'Professional User Profiles', component: <EntityActorProfile />, allowedRoles: ['service'], defaultSize: { width: 800, height: 600 } },
  'service-unit': { id: 'service-unit', path: '/dashboard/users/service', title: 'Service Unit Dashboard', component: <ServiceActorDashboard />, allowedRoles: ['service'], defaultSize: { width: 700, height: 500 } },
  'medscribe-app': { id: 'medscribe-app', path: '/dashboard/apps/medscribe', title: 'MedScribe App', component: <MedScribeStage />, allowedRoles: ['professional', 'patient'], automationLevel: 'require_validation', defaultSize: { width: 900, height: 700 } },
  'regulation-center': { id: 'regulation-center', path: '/dashboard/apps/regulacao', title: 'Regulation Center', component: <RegulacaoStage />, allowedRoles: ['professional', 'service'], defaultSize: { width: 600, height: 600 } },
  'agenda': { id: 'agenda', path: '/dashboard/apps/agenda', title: 'Agenda App', component: <AgendaStage />, allowedRoles: ['patient', 'professional', 'service'], defaultSize: { width: 850, height: 600 } },
  'telemedicina': { id: 'telemedicina', path: '/dashboard/apps/telemedicina', title: 'Telemedicina App', component: <TelemedicinaStage />, allowedRoles: ['patient', 'professional'], automationLevel: 'require_signature', defaultSize: { width: 700, height: 650 } },
  'workflow-rules': { id: 'workflow-rules', path: '/dashboard/rules', title: 'Workflow Rules Builder', component: <ScriptRunner />, allowedRoles: ['service'], defaultSize: { width: 800, height: 700 } },
  'health-tools': { id: 'health-tools', path: '/dashboard/tools', title: 'Health Tools', component: <ToolActorList />, allowedRoles: ['professional', 'service'], defaultSize: { width: 500, height: 600 } },
};
export function Dashboard() {
  const [openWindows, setOpenWindows] = useState<any[]>([]);
  const role = useCurrentRole();
  const navigate = useNavigate();
  const location = useLocation();
  const openWindow = useCallback((id: string, path: string) => {
    const config = Object.values(windowConfig).find(wc => wc.path === path);
    if (!config) return;
    setOpenWindows(currentWindows => {
      const existingIndex = currentWindows.findIndex(w => w.id === config.id);
      if (existingIndex > -1) {
        const updated = [...currentWindows];
        updated[existingIndex].isMinimized = false;
        return updated;
      }
      if (currentWindows.length >= 5) {
        // Limit number of open windows
        return [ ...currentWindows.slice(1), { ...config, isMinimized: false }];
      }
      return [...currentWindows, { ...config, isMinimized: false }];
    });
    navigate(path);
  }, [navigate]);
  useEffect(() => {
    // Open default window on role change or initial load
    const getDefaultPathForRole = () => {
      switch (role) {
        case 'patient': return '/dashboard/users/patient';
        case 'professional': return '/dashboard/apps/medscribe';
        case 'service': return '/dashboard/users/service';
        default: return '/dashboard/overview';
      }
    };
    const defaultPath = getDefaultPathForRole();
    const defaultConfig = Object.values(windowConfig).find(wc => wc.path === defaultPath);
    if (defaultConfig && openWindows.length === 0) {
      openWindow(defaultConfig.id, defaultConfig.path);
    }
    // Close windows not allowed for the current role
    setOpenWindows(current => current.filter(w => !w.allowedRoles || w.allowedRoles.includes(role)));
  }, [role, openWindow]);
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') return;
    const config = Object.values(windowConfig).find(wc => wc.path === path);
    if (config && !openWindows.some(w => w.id === config.id)) {
      openWindow(config.id, config.path);
    }
  }, [location.pathname, openWindows, openWindow]);
  return (
    <VoitherAppLayout>
      <div className="w-full h-full p-4">
        <WindowManager openWindows={openWindows} setOpenWindows={setOpenWindows} />
      </div>
      <Dock openWindows={openWindows} onDockItemClick={openWindow} />
    </VoitherAppLayout>
  );
}