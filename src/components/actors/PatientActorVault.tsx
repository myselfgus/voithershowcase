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
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [accessGrants, setAccessGrants] = useState<AccessGrant[]>([]);
  const [showAccessModal, setShowAccessModal] = useState(false);
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
  const handleGrantAccess = () => {
    setShowAccessModal(true);
  };
  const handleRevokeAccess = (id: string) => {
    setAccessGrants(prev => prev.filter(grant => grant.id !== id));
    toast.info('Acesso Revogado', {
      description: 'O acesso aos seus dados foi revogado com sucesso.',
    });
  };
  if (!profile) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Criar Cofre de Dados do Paciente</CardTitle>
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
            <CardTitle>{profile.name}</CardTitle>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setProfile(null)}>
            Excluir Cofre
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">ID do Ator: {profile.id}</p>
          <p className="text-sm text-muted-foreground">Data de Nascimento: {profile.dob}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} />
            <CardTitle>Controle de Acesso Soberano</CardTitle>
          </div>
          <Button onClick={handleGrantAccess}>
            <Plus className="mr-2 h-4 w-4" /> Conceder Acesso
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
                      <p className="font-semibold">{grant.entityName} via {grant.serviceName}</p>
                      <p className="text-xs text-muted-foreground">Escopo: {grant.scope} | Expira: {grant.expires}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleRevokeAccess(grant.id)}>
                      <Trash className="mr-2 h-4 w-4" /> Revogar
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