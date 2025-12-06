import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShieldCheck, User, Hospital } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
interface AccessGrantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function AccessGrantModal({ open, onOpenChange }: AccessGrantModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const handleApprove = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsApproved(true);
      toast.success('Acesso concedido!', {
        description: 'Dr. João agora pode visualizar seus dados de telemedicina.',
      });
      setTimeout(() => {
        onOpenChange(false);
        // Reset state after closing
        setTimeout(() => {
          setIsApproved(false);
        }, 300);
      }, 2000);
    }, 1500);
  };
  const handleDeny = () => {
    onOpenChange(false);
    toast.info('Acesso negado.', {
      description: 'A solicitação de acesso foi negada.',
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card-styles p-0 max-w-md">
        <AnimatePresence>
          {isApproved ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center p-8 text-center h-80"
            >
              <ShieldCheck
                weight="fill"
                className="w-20 h-20 text-green-500 mb-4"
              />
              <h2 className="text-2xl font-bold font-display">Acesso Concedido</h2>
              <p className="text-muted-foreground mt-2">
                Os dados foram compartilhados com segurança.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-2xl font-display flex items-center gap-2">
                  <ShieldCheck weight="fill" className="text-healthos-prism-start" />
                  Solicitação de Acesso
                </DialogTitle>
                <DialogDescription>
                  Um profissional de sa��de está solicitando acesso temporário aos seus dados.
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 pb-6 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-healthos-ice/50 dark:bg-healthos-ice/10">
                  <User className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Profissional</p>
                    <p className="font-semibold">Dr. João da Silva</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-healthos-ice/50 dark:bg-healthos-ice/10">
                  <Hospital className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Unidade</p>
                    <p className="font-semibold">Clínica Bem-Estar</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Escopo do Acesso:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Visualizar histórico de telemedicina</li>
                    <li>Acesso por 60 minutos</li>
                  </ul>
                </div>
              </div>
              <DialogFooter className="p-6 bg-healthos-ice/30 dark:bg-healthos-ice/5 rounded-b-2xl">
                <Button variant="outline" onClick={handleDeny} disabled={isLoading}>
                  Negar
                </Button>
                <Button onClick={handleApprove} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2"
                      />
                      Aprovando...
                    </>
                  ) : (
                    'Aprovar Acesso'
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}