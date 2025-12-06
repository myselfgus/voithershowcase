import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hospital, Users, ChartBar } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
interface ServiceProfile {
  name: string;
  address: string;
  id: string;
}
export function ServiceActorDashboard() {
  const [services, setServices] = useState<ServiceProfile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const handleCreateService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    if (name && address) {
      const newService: ServiceProfile = {
        name,
        address,
        id: `service_${crypto.randomUUID()}`,
      };
      setServices(prev => [...prev, newService]);
      toast.success('Unidade de Saúde Criada', {
        description: `${name} foi adicionada ao sistema.`,
      });
      setIsCreating(false);
    }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-display">Atores de Serviço (Unidades)</h2>
        <Button onClick={() => setIsCreating(prev => !prev)}>
          {isCreating ? 'Cancelar' : 'Adicionar Unidade'}
        </Button>
      </div>
      {isCreating && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Card>
            <CardHeader>
              <CardTitle>Nova Unidade de Saúde</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateService} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Unidade</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" name="address" required />
                </div>
                <Button type="submit">Salvar Unidade</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {services.map(service => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Hospital size={20} /> {service.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{service.address}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Estatísticas (Mock)</h4>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2"><Users /> Pacientes Ativos: <strong>{Math.floor(Math.random() * 100)}</strong></div>
                  <div className="flex items-center gap-2"><ChartBar /> Atendimentos/Dia: <strong>{Math.floor(Math.random() * 50)}</strong></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-2">ID do Ator: {service.id}</p>
            </CardContent>
          </Card>
        ))}
        {services.length === 0 && !isCreating && (
          <p className="text-muted-foreground col-span-full text-center py-8">Nenhuma unidade de saúde criada.</p>
        )}
      </div>
    </motion.div>
  );
}