import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperPlaneRight, Robot, User, Spinner, Trash, ArrowsOut, Code, TextT } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { chatService, MODELS } from '@/lib/chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrentRole } from '@/stores/useRoleStore';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

interface AIChatbotStageProps {
  onRenderToCanvas?: (content: string, type: 'text' | 'code' | 'html') => void;
}

export function AIChatbotStage({ onRenderToCanvas }: AIChatbotStageProps) {
  const role = useCurrentRole();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const systemPrompt = `Você é um assistente de IA do Voither HealthOS, um sistema operacional de saúde inteligente.
Você pode ajudar com:
- Informações médicas gerais (não substitui consulta médica)
- Agendamentos e organização de consultas
- Explicação de termos médicos
- Dicas de saúde e bem-estar
- Navegação pelo sistema HealthOS

Seja sempre profissional, empático e claro nas respostas.
Se detectar urgência médica, oriente a buscar atendimento presencial.
Responda em português brasileiro.

Contexto: O usuário atual tem o papel de "${role}" no sistema.`;

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = crypto.randomUUID();
    let streamedContent = '';

    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    }]);

    try {
      await chatService.sendMessage(
        userMessage.content,
        selectedModel,
        (chunk) => {
          streamedContent += chunk;
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: streamedContent }
              : msg
          ));
        },
        systemPrompt
      );

      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, isStreaming: false }
          : msg
      ));
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    chatService.newSession();
    toast.success('Conversa limpa');
  };

  const handleRenderToCanvas = (content: string, type: 'text' | 'code' | 'html') => {
    if (onRenderToCanvas) {
      onRenderToCanvas(content, type);
      toast.success('Conteúdo renderizado no canvas');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Robot className="w-6 h-6 text-violet-600 dark:text-violet-400" weight="duotone" />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Voither HealthOS</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map(model => (
                <SelectItem key={model.id} value={model.id} className="text-xs">
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 w-8 p-0"
            title="Limpar conversa"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <Robot className="w-16 h-16 text-violet-500/30 mb-4" weight="duotone" />
              <h4 className="text-lg font-medium text-muted-foreground mb-2">
                Olá! Como posso ajudar?
              </h4>
              <p className="text-sm text-muted-foreground/70 max-w-md">
                Sou o assistente de IA do HealthOS. Posso ajudar com informações de saúde,
                agendamentos e navegação pelo sistema.
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  message.role === 'user'
                    ? "bg-healthos-prism-start/20"
                    : "bg-violet-500/20"
                )}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-healthos-prism-start" weight="bold" />
                  ) : (
                    <Robot className="w-5 h-5 text-violet-500" weight="duotone" />
                  )}
                </div>

                <div className={cn(
                  "flex-1 max-w-[80%]",
                  message.role === 'user' ? 'text-right' : 'text-left'
                )}>
                  <div className={cn(
                    "inline-block p-3 rounded-2xl text-sm",
                    message.role === 'user'
                      ? "bg-healthos-prism-start text-white rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  )}>
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                      {message.isStreaming && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block ml-1"
                        >
                          |
                        </motion.span>
                      )}
                    </div>
                  </div>

                  <div className={cn(
                    "flex items-center gap-2 mt-1 text-xs text-muted-foreground",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}>
                    <span>{formatTime(message.timestamp)}</span>

                    {message.role === 'assistant' && !message.isStreaming && message.content && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRenderToCanvas(message.content, 'text')}
                          title="Renderizar como texto no canvas"
                        >
                          <TextT className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRenderToCanvas(message.content, 'code')}
                          title="Renderizar como código no canvas"
                        >
                          <Code className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRenderToCanvas(message.content, 'html')}
                          title="Renderizar como HTML no canvas"
                        >
                          <ArrowsOut className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Spinner className="w-4 h-4 animate-spin" />
              <span className="text-sm">Pensando...</span>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t bg-background/50">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 p-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
          >
            {isLoading ? (
              <Spinner className="w-5 h-5 animate-spin" />
            ) : (
              <PaperPlaneRight className="w-5 h-5" weight="fill" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Shift + Enter para nova linha
        </p>
      </div>
    </div>
  );
}
