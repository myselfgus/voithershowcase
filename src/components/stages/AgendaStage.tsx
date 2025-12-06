import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
interface Appointment {
  id: string;
  date: Date;
  time: string;
  service: string;
}
export function AgendaStage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');
  const [service, setService] = useState('Consulta Clínica');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error('Por favor, selecione data e hora.');
      return;
    }
    setIsLoading(true);
    toast.info('Verificando disponibilidade...');
    // Mock AI check
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      date,
      time,
      service,
    };
    setAppointments(prev => [...prev, newAppointment].sort((a, b) => a.date.getTime() - b.date.getTime()));
    setIsLoading(false);
    toast.success('Agendamento confirmado!');
    setTime('');
  };
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Agendamento Inteligente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={ptBR}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Agendamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <Label>Data Selecionada</Label>
                <Input readOnly value={date ? format(date, 'PPP', { locale: ptBR }) : 'Nenhuma data selecionada'} />
              </div>
              <div>
                <Label htmlFor="time">Hora</Label>
                <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="service">Serviço</Label>
                <Input id="service" value={service} onChange={e => setService(e.target.value)} required />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Verificando...' : 'Confirmar Agendamento'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum agendamento.</p>
            ) : (
              <ul className="space-y-4">
                {appointments.map(app => (
                  <li key={app.id} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-semibold">{app.service}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" /> {format(app.date, 'dd/MM/yyyy', { locale: ptBR })}
                        <Clock className="h-3 w-3 ml-2" /> {app.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}