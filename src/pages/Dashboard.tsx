import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Hospital, Stethoscope, Bot, Layers3, FileCode } from '@phosphor-icons/react';
import { PatientActorVault } from '@/components/actors/PatientActorVault';
import { EntityActorProfile } from '@/components/actors/EntityActorProfile';
import { ServiceActorDashboard } from '@/components/actors/ServiceActorDashboard';
import { ToolActorList } from '@/components/actors/ToolActorList';
import { MedScribeStage } from '@/stages/MedScribeStage';
import { StageViewer } from './StageViewer';
import { ScriptEditor } from './ScriptEditor';
import { cn } from '@/lib/utils';
const TABS = [
  { name: 'Paciente', path: '/dashboard/actors/patient', icon: User },
  { name: 'Entidade', path: '/dashboard/actors/entity', icon: Stethoscope },
  { name: 'Serviço', path: '/dashboard/actors/service', icon: Hospital },
];
const STAGE_TABS = [
  { name: 'MedScribe', path: '/dashboard/stages/medscribe', icon: Layers3 },
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
            <tab.icon />
            {tab.name}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route path="patient" element={<PatientActorVault />} />
        <Route path="entity" element={<EntityActorProfile />} />
        <Route path="service" element={<ServiceActorDashboard />} />
        <Route index element={<PatientActorVault />} />
      </Routes>
    </div>
  );
}
function StageDashboard() {
  return (
    <div className="space-y-6">
      <nav className="flex space-x-2 border-b">
        {STAGE_TABS.map(tab => (
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
            <tab.icon />
            {tab.name}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route path="medscribe" element={<MedScribeStage />} />
        <Route path="viewer" element={<StageViewer />} />
        <Route index element={<MedScribeStage />} />
      </Routes>
    </div>
  );
}
function MainDashboard() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold font-display">Bem-vindo ao HealthOS Cast</h1>
      <p className="text-muted-foreground mt-2">Selecione uma opção na barra lateral para começar.</p>
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
        <Route path="/" element={<MainDashboard />} />
        <Route path="/actors/*" element={<ActorDashboard />} />
        <Route path="/stages/*" element={<StageDashboard />} />
        <Route path="/scripts" element={<ScriptEditor />} />
        <Route path="/tools" element={<ToolActorList />} />
      </Routes>
    </motion.div>
  );
}