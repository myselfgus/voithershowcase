import React from 'react';
import { Apple, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/ThemeToggle';
import { RoleSelector } from '@/components/RoleSelector';
export function TopMenuBar() {
  return (
    <header className="bg-healthos-porcelain/80 dark:bg-healthos-ink/80 backdrop-blur-md border-b border-healthos-ice/50 dark:border-healthos-ice/10 flex items-center justify-between px-4 h-10 flex-shrink-0 z-50">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Apple className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Voither HealthOS</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sobre Voither HealthOS</DropdownMenuItem>
            <DropdownMenuItem>Preferências...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="font-bold text-sm">Voither</span>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><button>Arquivo</button></DropdownMenuTrigger>
            <DropdownMenuContent><DropdownMenuItem>Novo Actor...</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><button>Editar</button></DropdownMenuTrigger>
            <DropdownMenuContent><DropdownMenuItem>Desfazer</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><button>Visualizar</button></DropdownMenuTrigger>
            <DropdownMenuContent><DropdownMenuItem>Alternar Dock</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><button>Janela</button></DropdownMenuTrigger>
            <DropdownMenuContent><DropdownMenuItem>Minimizar</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><button>Ajuda</button></DropdownMenuTrigger>
            <DropdownMenuContent><DropdownMenuItem>Documentação</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="focus:outline-none"><Search className="h-4 w-4" /></button>
        <RoleSelector />
        <ThemeToggle className="relative top-0 right-0" />
      </div>
    </header>
  );
}