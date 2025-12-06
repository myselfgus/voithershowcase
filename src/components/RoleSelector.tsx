import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoleStore, UserRole } from '@/stores/useRoleStore';
import { User, Stethoscope, Hospital } from 'lucide-react';
import { toast } from 'sonner';
const roleConfig = {
  patient: { icon: User, label: 'Paciente' },
  professional: { icon: Stethoscope, label: 'Profissional' },
  service: { icon: Hospital, label: 'Serviço' },
};
export function RoleSelector() {
  const role = useRoleStore((state) => state.role);
  const setRole = useRoleStore((state) => state.setRole);
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    toast.success(`Ponto de Vista alterado para: ${roleConfig[newRole].label}`);
  };
  const Icon = roleConfig[role].icon;
  return (
    <Select value={role} onValueChange={(value: UserRole) => handleRoleChange(value)}>
      <SelectTrigger className="w-auto md:w-[150px] gap-2">
        <Icon className="h-4 w-4" />
        <span className="hidden md:inline"><SelectValue /></span>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(roleConfig).map(([key, { icon: ItemIcon, label }]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <ItemIcon className="h-4 w-4" />
              {label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}