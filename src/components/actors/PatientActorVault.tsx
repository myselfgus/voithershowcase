import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Plus, Trash } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AccessGrantModal } from '@/components/ui/AccessGrantModal';
import { toast } from 'sonner';
import { useCurrentRole } from '@/stores/useRoleStore';
import { Badge } from '@/components/ui/badge';
interface PatientProfile {
  name: string;
  dob: string;
  id: string;
}
interface AccessGrant {
  id: string;
  entityName: string;
  serviceName: string;
  scope: string;
  expires: string;
}
export function PatientActorVault() {
  const [profile, setProfile] = useState<PatientProfile | null>({ name: 'Maria Silva', dob: '1980-05-15', id: `patient_001` });
  const [accessGrants, setAccessGrants] = useState<AccessGrant[]>([]);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const role = useCurrentRole();
  const handleCreateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const dob = formData.get('dob') as string;
    if (name && dob) {
      setProfile({ name, dob, id: `patient_${crypto.randomUUID()}` });
      toast.success('Perfil do Paciente Criado', {
        description: `Bem-vindo(a), ${name}!`,
      });
    }
  };
  const handleRevokeAccess = (id: string) => {
    setAccessGrants(prev => prev.filter(grant => grant.id !== id));
    toast.info('Acesso aos Dados Revogado', {
      description: 'O acesso aos seus dados foi revogado com sucesso.',
    });
  };
  if (role !== 'patient') {
    return (
      <Card>
        <CardHeader><CardTitle>Acesso Restrito</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">O gerenciador de perfil do paciente só pode ser acessado pelo próprio paciente. Altere seu Ponto de Vista para "Paciente" para interagir.</p>
        </CardContent>
      </Card>
    );
  }
  if (!profile) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Criar Perfil do Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="dob">Data de Nascimento</Label>
                <Input id="dob" name="dob" type="date" required />
              </div>
              <Button type="submit">Criar Perfil</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <User size={24} />
            <CardTitle>Perfil do Paciente</CardTitle>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setProfile(null)}>
            Excluir Perfil
          </Button>
        </CardHeader>
        <CardContent>
          <p className="font-semibold">{profile.name}</p>
          <p className="text-sm text-muted-foreground">ID do Perfil: {profile.id}</p>
          <p className="text-sm text-muted-foreground">Data de Nascimento: {profile.dob}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} />
            <CardTitle>Gerenciar Acesso aos Dados</CardTitle>
          </div>
          <Button onClick={() => setShowAccessModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Simular Pedido de Acesso
          </Button>
        </CardHeader>
        <CardContent>
          {accessGrants.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum acesso concedido.</p>
          ) : (
            <div className="space-y-4">
              {accessGrants.map((grant, index) => (
                <React.Fragment key={grant.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Profissional: {grant.entityName} via {grant.serviceName}</p>
                      <p className="text-xs text-muted-foreground">Escopo: {grant.scope} | Expira: {grant.expires}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleRevokeAccess(grant.id)}>
                      <Trash className="mr-2 h-4 w-4" /> Revogar Acesso
                    </Button>
                  </div>
                  {index < accessGrants.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <AccessGrantModal open={showAccessModal} onOpenChange={setShowAccessModal} />
    </motion.div>
  );
}