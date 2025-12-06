import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AccessGrantModal } from '@/components/ui/AccessGrantModal';
import { Stethoscope, Hospital, MapPin } from 'lucide-react';
const mockServices = [
  { name: 'Clínica Bem-Estar', specialty: 'Cardiologia Médica', distance: '2.5km' },
  { name: 'Hospital Central', specialty: 'Cardiologia Médica', distance: '5.1km' },
  { name: 'Centro Médico Saúde+', specialty: 'Cardiologia Médica', distance: '8.9km' },
];
export function RegulacaoStage() {
  const [symptoms, setSymptoms] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<typeof mockServices | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms || !specialty) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }
    setIsLoading(true);
    setResults(null);
    toast.info('Buscando melhores opções...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResults(mockServices);
    setIsLoading(false);
    toast.success('Opções de encaminhamento médico encontradas.');
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Centro de Regulação Médica</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="symptoms">Sintomas Relatados</Label>
              <Input id="symptoms" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Ex: Dor no peito, falta de ar" />
            </div>
            <div>
              <Label htmlFor="specialty">Especialidade Médica</Label>
              <Select onValueChange={setSpecialty} value={specialty}>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiologia">Cardiologia Médica</SelectItem>
                  <SelectItem value="ortopedia">Ortopedia</SelectItem>
                  <SelectItem value="neurologia">Neurologia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Buscando...' : 'Encontrar Serviço'}
            </Button>
          </form>
        </CardContent>
      </Card>
      {isLoading && (
        <div className="grid md:grid-cols-3 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      )}
      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h3 className="text-xl font-bold">Opções de Encaminhamento Médico</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {results.map((service, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Hospital className="h-5 w-5" />{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="flex items-center gap-2 text-sm"><Stethoscope className="h-4 w-4" /> {service.specialty}</p>
                    <p className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" /> {service.distance}</p>
                    <Button className="w-full mt-2" onClick={() => setShowAccessModal(true)}>Solicitar Acesso aos Dados do Paciente</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      <AccessGrantModal open={showAccessModal} onOpenChange={setShowAccessModal} />
    </div>
  );
}