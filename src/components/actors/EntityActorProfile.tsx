import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Stethoscope, IdentificationCard } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useCurrentRole } from '@/stores/useRoleStore';
interface EntityProfile {
  name: string;
  specialty: string;
  crm: string;
  id: string;
}
export function EntityActorProfile() {
  const [profiles, setProfiles] = useState<EntityProfile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const role = useCurrentRole();
  const handleCreateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const specialty = formData.get('specialty') as string;
    const crm = formData.get('crm') as string;
    if (name && specialty && crm) {
      const newProfile: EntityProfile = {
        name,
        specialty,
        crm,
        id: `entity_${crypto.randomUUID()}`,
      };
      setProfiles(prev => [...prev, newProfile]);
      toast.success('Perfil de Usuário Profissional Criado', {
        description: `Dr(a). ${name} foi adicionado(a) ao sistema.`,
      });
      setIsCreating(false);
    }
  };
  if (role !== 'service') {
    return (
      <Card>
        <CardHeader><CardTitle>Acesso Restrito</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Apenas unidades de serviço podem gerenciar perfis profissionais.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-display">Perfis de Usuários Profissionais</h2>
        <Button onClick={() => setIsCreating(prev => !prev)}>
          {isCreating ? 'Cancelar' : 'Criar Novo Perfil'}
        </Button>
      </div>
      {isCreating && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Card>
            <CardHeader>
              <CardTitle>Novo Perfil de Usuário Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="specialty">Especialidade Médica</Label>
                  <Input id="specialty" name="specialty" required />
                </div>
                <div>
                  <Label htmlFor="crm">Número do CRM</Label>
                  <Input id="crm" name="crm" required />
                </div>
                <Button type="submit">Salvar Perfil</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map(profile => (
          <Card key={profile.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User size={20} /> {profile.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Stethoscope />
                <span>{profile.specialty}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <IdentificationCard />
                <span>CRM: {profile.crm}</span>
              </div>
              <p className="text-xs text-muted-foreground pt-2">ID do Perfil: {profile.id}</p>
            </CardContent>
          </Card>
        ))}
        {profiles.length === 0 && !isCreating && (
          <p className="text-muted-foreground col-span-full text-center py-8">Nenhum perfil profissional criado.</p>
        )}
      </div>
    </motion.div>
  );
}