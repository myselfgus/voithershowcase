import React from 'react';
import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Hospital, Stethoscope, Bot, Layers, FileCode, LayoutDashboard } from 'lucide-react';
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
const routeConfig = {
  '/dashboard/overview': { title: 'Visão Geral do Cast', component: <CastOverview /> },
  '/dashboard/actors/patient': { title: 'Cofre do Paciente', component: <PatientActorVault /> },
  '/dashboard/actors/entity': { title: 'Atores de Entidade', component: <EntityActorProfile /> },
  '/dashboard/actors/service': { title: 'Atores de Serviço', component: <ServiceActorDashboard /> },
  '/dashboard/stages/medscribe': { title: 'Stage: MedScribe', component: <MedScribeStage /> },
  '/dashboard/stages/regulacao': { title: 'Stage: Regulação', component: <RegulacaoStage /> },
  '/dashboard/stages/agenda': { title: 'Stage: Agenda', component: <AgendaStage /> },
  '/dashboard/stages/telemedicina': { title: 'Stage: Telemedicina', component: <TelemedicinaStage /> },
  '/dashboard/scripts': { title: 'Orquestrador de Scripts', component: <ScriptRunner /> },
  '/dashboard/tools': { title: 'Atores de Ferramenta', component: <ToolActorList /> },
};
export function Dashboard() {
  const location = useLocation();
  const role = useCurrentRole();
  const currentRoute = Object.entries(routeConfig).find(([path]) => location.pathname.startsWith(path));
  const title = currentRoute ? currentRoute[1].title : 'Voither HealthOS';
  const getDefaultPathForRole = () => {
    switch (role) {
      case 'patient': return '/dashboard/actors/patient';
      case 'professional': return '/dashboard/stages/medscribe';
      case 'service': return '/dashboard/overview';
      default: return '/dashboard/overview';
    }
  };
  return (
    <WindowContainer title={title}>
      <Routes>
        <Route path="/" element={<Navigate to={getDefaultPathForRole()} replace />} />
        <Route path="/overview" element={<CastOverview />} />
        <Route path="/actors/patient" element={<PatientActorVault />} />
        <Route path="/actors/entity" element={<EntityActorProfile />} />
        <Route path="/actors/service" element={<ServiceActorDashboard />} />
        <Route path="/stages/medscribe" element={<MedScribeStage />} />
        <Route path="/stages/regulacao" element={<RegulacaoStage />} />
        <Route path="/stages/agenda" element={<AgendaStage />} />
        <Route path="/stages/telemedicina" element={<TelemedicinaStage />} />
        <Route path="/scripts" element={<ScriptRunner />} />
        <Route path="/tools" element={<ToolActorList />} />
      </Routes>
    </WindowContainer>
  );
}