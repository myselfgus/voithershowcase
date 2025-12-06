import React from 'react';
import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Hospital, Stethoscope, Bot, Layers, FileCode, LayoutDashboard } from 'lucide-react';
import { PatientActorVault } from '@/components/actors/PatientActorVault';
import { EntityActorProfile } from '@/components/actors/EntityActorProfile';
import { ServiceActorDashboard } from '@/components/actors/ServiceActorDashboard';
import { ToolActorList } from '@/components/actors/ToolActorList';
import { MedScribeStage } from '@/stages/MedScribeStage';
import { StageViewer } from './StageViewer';
import { ScriptEditor } from './ScriptEditor';
import { CastOverview } from './CastOverview';
import { RegulacaoStage } from '@/components/stages/RegulacaoStage';
import { AgendaStage } from '@/components/stages/AgendaStage';
import { TelemedicinaStage } from '@/components/stages/TelemedicinaStage';
import { cn } from '@/lib/utils';
const TABS = [
  { name: 'Paciente', path: '/dashboard/actors/patient', icon: User },
  { name: 'Entidade', path: '/dashboard/actors/entity', icon: Stethoscope },
  { name: 'Serviço', path: '/dashboard/actors/service', icon: Hospital },
];
const STAGE_TABS = [
  { name: 'MedScribe', path: '/dashboard/stages/medscribe', icon: Layers },
  { name: 'Regulação', path: '/dashboard/stages/regulacao', icon: Layers },
  { name: 'Agenda', path: '/dashboard/stages/agenda', icon: Layers },
  { name: 'Telemedicina', path: '/dashboard/stages/telemedicina', icon: Layers },
  { name: 'Manifestos', path: '/dashboard/stages/viewer', icon: FileCode },
];
function ActorDashboard() {
  return (
    <div className="space-y-6">
      <nav className="flex space-x-2 border-b">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium',
                isActive ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-primary'
              )
            }
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route path="patient" element={<PatientActorVault />} />
        <Route path="entity" element={<EntityActorProfile />} />
        <Route path="service" element={<ServiceActorDashboard />} />
        <Route index element={<Navigate to="patient" replace />} />
      </Routes>
    </div>
  );
}
function StageDashboard() {
  const location = useLocation();
  return (
    <div className="space-y-6">
      <nav className="flex space-x-2 border-b overflow-x-auto">
        {STAGE_TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={() =>
              cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium flex-shrink-0',
                location.pathname.startsWith(tab.path) ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-primary'
              )
            }
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route path="medscribe" element={<MedScribeStage />} />
        <Route path="regulacao" element={<RegulacaoStage />} />
        <Route path="agenda" element={<AgendaStage />} />
        <Route path="telemedicina" element={<TelemedicinaStage />} />
        <Route path="viewer" element={<StageViewer />} />
        <Route index element={<Navigate to="medscribe" replace />} />
      </Routes>
    </div>
  );
}
export function Dashboard() {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12"
    >
      <Routes>
        <Route path="/" element={<CastOverview />} />
        <Route path="/overview" element={<CastOverview />} />
        <Route path="/actors/*" element={<ActorDashboard />} />
        <Route path="/stages/*" element={<StageDashboard />} />
        <Route path="/scripts" element={<ScriptEditor />} />
        <Route path="/tools" element={<ToolActorList />} />
      </Routes>
    </motion.div>
  );
}