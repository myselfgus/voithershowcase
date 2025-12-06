import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PatientActorVault } from '@/components/actors/PatientActorVault';
import { EntityActorProfile } from '@/components/actors/EntityActorProfile';
import { ServiceActorDashboard } from '@/components/actors/ServiceActorDashboard';
import { ToolActorList } from '@/components/actors/ToolActorList';
import { MedScribeStage } from '@/stages/MedScribeStage';
import { RegulacaoStage } from '@/components/stages/RegulacaoStage';
import { AgendaStage } from '@/components/stages/AgendaStage';
import { TelemedicinaStage } from '@/components/stages/TelemedicinaStage';
import { CastOverview } from './CastOverview';
import { WindowContainer } from '@/components/layout/WindowContainer';
import { ScriptRunner } from '@/components/ScriptRunner';
import { useCurrentRole } from '@/stores/useRoleStore';
import { ErrorBoundary } from '@/components/ErrorBoundary';
const routeConfig = {
  '/dashboard/overview': { title: 'HealthOS Core Overview', component: <CastOverview /> },
  '/dashboard/users/patient': { title: 'Patient Profile Manager', component: <PatientActorVault /> },
  '/dashboard/users/professional': { title: 'Professional User Profiles', component: <EntityActorProfile /> },
  '/dashboard/users/service': { title: 'Service Unit Dashboard', component: <ServiceActorDashboard /> },
  '/dashboard/apps/medscribe': { title: 'MedScribe App', component: <MedScribeStage /> },
  '/dashboard/apps/regulacao': { title: 'Regulation Center', component: <RegulacaoStage /> },
  '/dashboard/apps/agenda': { title: 'Agenda App', component: <AgendaStage /> },
  '/dashboard/apps/telemedicina': { title: 'Telemedicina App', component: <TelemedicinaStage /> },
  '/dashboard/rules': { title: 'Workflow Rules Builder', component: <ScriptRunner /> },
  '/dashboard/tools': { title: 'Health Tools', component: <ToolActorList /> },
};
export function Dashboard() {
  const location = useLocation();
  const role = useCurrentRole();
  const currentRoute = Object.entries(routeConfig).find(([path]) => location.pathname.startsWith(path));
  const title = currentRoute ? currentRoute[1].title : 'Voither HealthOS';
  const getDefaultPathForRole = () => {
    if (!role) return '/dashboard/overview';
    switch (role) {
      case 'patient': return '/dashboard/users/patient';
      case 'professional': return '/dashboard/apps/medscribe';
      case 'service': return '/dashboard/users/service';
      default: return '/dashboard/overview';
    }
  };
  return (
    <WindowContainer title={title}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 h-full">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate to={getDefaultPathForRole()} replace />} />
            <Route path="/overview" element={<CastOverview />} />
            <Route path="/users/patient" element={<PatientActorVault />} />
            <Route path="/users/professional" element={<EntityActorProfile />} />
            <Route path="/users/service" element={<ServiceActorDashboard />} />
            <Route path="/apps/medscribe" element={<MedScribeStage />} />
            <Route path="/apps/regulacao" element={<RegulacaoStage />} />
            <Route path="/apps/agenda" element={<AgendaStage />} />
            <Route path="/apps/telemedicina" element={<TelemedicinaStage />} />
            <Route path="/rules" element={<ScriptRunner />} />
            <Route path="/tools" element={<ToolActorList />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </WindowContainer>
  );
}