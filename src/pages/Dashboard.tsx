import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PatientActorVault } from '@/components/actors/PatientActorVault';
import { EntityActorProfile } from '@/components/actors/EntityActorProfile';
import { ServiceActorDashboard } from '@/components/actors/ServiceActorDashboard';
import { ToolActorList } from '@/components/actors/ToolActorList';
import { MedScribeStage } from '@/stages/MedScribeStage';
import { AIChatbotStage } from '@/stages/AIChatbotStage';
import { RegulacaoStage } from '@/components/stages/RegulacaoStage';
import { AgendaStage } from '@/components/stages/AgendaStage';
import { TelemedicinaStage } from '@/components/stages/TelemedicinaStage';
import { CastOverview } from './CastOverview';
import { ScriptRunner } from '@/components/ScriptRunner';
import { useCurrentRole } from '@/stores/useRoleStore';
import { WindowManager, WindowProps } from '@/components/layout/WindowManager';
import { Dock } from '@/components/layout/Dock';
import { DesktopCanvas, CanvasArtifact } from '@/components/layout/DesktopCanvas';
import { useCanvasArtifacts } from '@/hooks/useCanvasArtifacts';
import { ErrorBoundary } from '@/components/ErrorBoundary';

type WindowConfig = Omit<WindowProps, 'onClose' | 'onMinimize' | 'onFocus' | 'zIndex' | 'isMinimized' | 'children'> & {
  path: string;
  component: React.ReactNode;
};

export function Dashboard() {
  const [openWindows, setOpenWindows] = useState<any[]>([]);
  const role = useCurrentRole();
  const navigate = useNavigate();
  const location = useLocation();
  const prevRole = useRef(role);
  const { artifacts, addArtifact, removeArtifact, clearArtifacts } = useCanvasArtifacts();

  // Handle rendering content to canvas from AI chatbot
  const handleRenderToCanvas = useCallback((content: string, type: 'text' | 'code' | 'html') => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    addArtifact({
      type,
      content,
      position: {
        x: Math.random() * (viewportWidth - 400) + 50,
        y: Math.random() * (viewportHeight - 300) + 100
      },
      size: {
        width: type === 'code' ? 500 : 350,
        height: type === 'code' ? 300 : 200
      }
    });
  }, [addArtifact]);

  // Window configurations with AI Chatbot - memoized to prevent unnecessary re-renders
  const windowConfig: Record<string, WindowConfig> = useMemo(() => ({
    'overview': {
      id: 'overview',
      path: '/dashboard/overview',
      title: 'HealthOS Core Overview',
      component: <CastOverview />,
      defaultSize: { width: 700, height: 550 }
    },
    'ai-chatbot': {
      id: 'ai-chatbot',
      path: '/dashboard/apps/ai-chat',
      title: 'AI Assistant',
      component: <AIChatbotStage onRenderToCanvas={handleRenderToCanvas} />,
      defaultSize: { width: 450, height: 600 },
      defaultPosition: { x: 100, y: 80 }
    },
    'patient-profile': {
      id: 'patient-profile',
      path: '/dashboard/users/patient',
      title: 'Patient Profile Manager',
      component: <PatientActorVault />,
      allowedRoles: ['patient'],
      defaultSize: { width: 600, height: 650 }
    },
    'professional-user': {
      id: 'professional-user',
      path: '/dashboard/users/professional',
      title: 'Professional User Profiles',
      component: <EntityActorProfile />,
      allowedRoles: ['service'],
      defaultSize: { width: 800, height: 600 }
    },
    'service-unit': {
      id: 'service-unit',
      path: '/dashboard/users/service',
      title: 'Service Unit Dashboard',
      component: <ServiceActorDashboard />,
      allowedRoles: ['service'],
      defaultSize: { width: 700, height: 500 }
    },
    'medscribe-app': {
      id: 'medscribe-app',
      path: '/dashboard/apps/medscribe',
      title: 'MedScribe App',
      component: <MedScribeStage />,
      allowedRoles: ['professional', 'patient'],
      automationLevel: 'require_validation',
      defaultSize: { width: 900, height: 700 }
    },
    'regulation-center': {
      id: 'regulation-center',
      path: '/dashboard/apps/regulacao',
      title: 'Regulation Center',
      component: <RegulacaoStage />,
      allowedRoles: ['professional', 'service'],
      defaultSize: { width: 600, height: 600 }
    },
    'agenda': {
      id: 'agenda',
      path: '/dashboard/apps/agenda',
      title: 'Agenda App',
      component: <AgendaStage />,
      allowedRoles: ['patient', 'professional', 'service'],
      defaultSize: { width: 850, height: 600 }
    },
    'telemedicina': {
      id: 'telemedicina',
      path: '/dashboard/apps/telemedicina',
      title: 'Telemedicina App',
      component: <TelemedicinaStage />,
      allowedRoles: ['patient', 'professional'],
      automationLevel: 'require_signature',
      defaultSize: { width: 700, height: 650 }
    },
    'workflow-rules': {
      id: 'workflow-rules',
      path: '/dashboard/rules',
      title: 'Workflow Rules Builder',
      component: <ScriptRunner />,
      allowedRoles: ['service'],
      defaultSize: { width: 800, height: 700 }
    },
    'health-tools': {
      id: 'health-tools',
      path: '/dashboard/tools',
      title: 'Health Tools',
      component: <ToolActorList />,
      allowedRoles: ['professional', 'service'],
      defaultSize: { width: 500, height: 600 }
    },
  }), [handleRenderToCanvas]);

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
        return [...currentWindows.slice(1), { ...config, isMinimized: false }];
      }
      return [...currentWindows, { ...config, isMinimized: false }];
    });
    navigate(path);
  }, [navigate, windowConfig]);

  // Filter windows when role changes
  useEffect(() => {
    if (role !== prevRole.current) {
      setOpenWindows(current => current.filter(w => !w.allowedRoles || w.allowedRoles.includes(role)));
      prevRole.current = role;
    }
  }, [role]);

  // Open window based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      if (openWindows.length === 0) {
        const defaultConfigId = role === 'professional' ? 'medscribe-app' : 'ai-chatbot';
        const defaultConfig = Object.values(windowConfig).find(wc => wc.id === defaultConfigId);
        if (defaultConfig) {
          openWindow(defaultConfig.id, defaultConfig.path);
        }
      }
      return;
    }
    const config = Object.values(windowConfig).find(wc => wc.path === path);
    if (config && !openWindows.some(w => w.id === config.id)) {
      openWindow(config.id, config.path);
    }
  }, [location.pathname, openWindows, openWindow, role, windowConfig]);

  // Handle canvas artifact click
  const handleArtifactClick = useCallback((artifact: CanvasArtifact) => {
    // Could open a modal or do something with the artifact
    console.log('Artifact clicked:', artifact);
  }, []);

  // Handle canvas click
  const handleCanvasClick = useCallback((position: { x: number; y: number }) => {
    // Could be used to place new artifacts
    console.log('Canvas clicked at:', position);
  }, []);

  const wrappedWindows = openWindows.map(win => ({
    ...win,
    component: (
      <ErrorBoundary fallback={<div className="p-4 text-center text-red-500">Ocorreu um erro neste módulo.</div>}>
        {win.id === 'ai-chatbot' ? (
          <AIChatbotStage onRenderToCanvas={handleRenderToCanvas} />
        ) : (
          win.component
        )}
      </ErrorBoundary>
    )
  }));

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Desktop Canvas Background */}
      <DesktopCanvas
        artifacts={artifacts}
        onArtifactClick={handleArtifactClick}
        onCanvasClick={handleCanvasClick}
      />

      {/* Window Manager */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          <WindowManager openWindows={wrappedWindows} setOpenWindows={setOpenWindows} />
        </div>
      </div>

      {/* Floating Dock */}
      <Dock openWindows={openWindows} onDockItemClick={openWindow} />
    </div>
  );
}
