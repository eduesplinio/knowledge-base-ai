'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoMdBook } from 'react-icons/io';
import {
  MdChevronLeft,
  MdChevronRight,
  MdLogout,
  MdMenuBook,
  MdExpandMore,
  MdExpandLess,
  MdOutlineDashboard,
  MdFolderOpen,
  MdSearch,
} from 'react-icons/md';
import { fetchSpaces } from '@/lib/api';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { Button } from '@workspace/ui/components/button';
import { signOut } from 'next-auth/react';
import { SearchModal } from '@/components/search/search-modal';

interface Space {
  _id: string;
  name: string;
  description?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  isMobile?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed, isMobile = false, onToggleCollapse }: SidebarProps) {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [spacesExpanded, setSpacesExpanded] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      const data = await fetchSpaces();
      setSpaces(data);
    } catch (error) {
      console.error('Erro ao carregar espaços:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const SidebarLink = ({
    href,
    icon,
    label,
    isActive: active,
  }: {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
  }) => {
    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={`h-8 w-8 ${
                  active
                    ? 'bg-primary text-primary-foreground !hover:bg-primary !hover:text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                style={
                  active
                    ? {
                        backgroundColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                      }
                    : {}
                }
                onMouseEnter={
                  active
                    ? (e) => {
                        e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
                        e.currentTarget.style.color = 'hsl(var(--primary-foreground))';
                      }
                    : undefined
                }
                onMouseLeave={
                  active
                    ? (e) => {
                        e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
                        e.currentTarget.style.color = 'hsl(var(--primary-foreground))';
                      }
                    : undefined
                }
              >
                <Link href={href}>{icon}</Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-sm transition-colors ${
          active
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`}
      >
        {icon}
        <span className="text-sm truncate">{label}</span>
      </Link>
    );
  };

  return (
    <aside
      className={`${isCollapsed ? 'w-14' : 'w-64'} bg-muted/30 h-screen transition-all duration-300 ${isMobile && isCollapsed ? 'hidden' : ''} flex flex-col`}
    >
      {/* Logo */}
      <div className="p-4 pb-6">
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" className="flex items-center justify-center">
                  <MdMenuBook className="w-6 h-6 text-primary" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Base de Conhecimento</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <MdMenuBook className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold whitespace-nowrap">Base de Conhecimento</span>
          </Link>
        )}
      </div>

      <div className="px-4 pb-4 space-y-4 flex-1">
        {/* Pesquisa */}
        {isCollapsed ? (
          <div className="flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchModalOpen(true)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <MdSearch className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Pesquisar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setSearchModalOpen(true)}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <MdSearch className="mr-2 h-4 w-4" />
            Pesquisar
          </Button>
        )}

        {/* Dashboard */}
        <div className={isCollapsed ? 'flex justify-center' : ''}>
          <SidebarLink
            href="/"
            icon={<MdOutlineDashboard className="w-4 h-4" />}
            label="Início"
            isActive={pathname === '/'}
          />
        </div>

        {/* Espaços */}
        <div>
          {isCollapsed ? (
            <div className="flex justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSpacesExpanded(!spacesExpanded)}
                      className={`h-8 w-8 ${
                        spacesExpanded
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                      style={
                        spacesExpanded
                          ? {
                              backgroundColor: 'hsl(var(--primary))',
                              color: 'hsl(var(--primary-foreground))',
                            }
                          : {}
                      }
                      onMouseEnter={
                        spacesExpanded
                          ? (e) => {
                              e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
                              e.currentTarget.style.color = 'hsl(var(--primary-foreground))';
                            }
                          : undefined
                      }
                      onMouseLeave={
                        spacesExpanded
                          ? (e) => {
                              e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
                              e.currentTarget.style.color = 'hsl(var(--primary-foreground))';
                            }
                          : undefined
                      }
                    >
                      <MdFolderOpen className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Espaços</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setSpacesExpanded(!spacesExpanded)}
              className="w-full justify-between px-3 py-2 h-auto text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <div className="flex items-center gap-2">
                <MdFolderOpen className="w-4 h-4" />
                Espaços
              </div>
              {spacesExpanded ? (
                <MdExpandLess className="w-4 h-4" />
              ) : (
                <MdExpandMore className="w-4 h-4" />
              )}
            </Button>
          )}

          {spacesExpanded && (
            <div className={`space-y-1 mt-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
              {isLoading
                ? !isCollapsed && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">Carregando...</div>
                  )
                : spaces.length === 0
                  ? !isCollapsed && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">Nenhum espaço</div>
                    )
                  : spaces.map((space) => (
                      <div
                        key={space._id}
                        className={isCollapsed ? 'w-full flex justify-center' : ''}
                      >
                        <SidebarLink
                          href={`/spaces/${space._id}`}
                          icon={<IoMdBook className="w-4 h-4 flex-shrink-0" />}
                          label={space.name}
                          isActive={isActive(`/spaces/${space._id}`)}
                        />
                      </div>
                    ))}
            </div>
          )}
        </div>
      </div>

      {/* Botões inferiores */}
      <div className="p-4 space-y-2">
        {/* Botão Sair */}
        {isCollapsed ? (
          <div className="flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <MdLogout className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sair</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <MdLogout className="mr-2 h-4 w-4" />
            Sair
          </Button>
        )}

        {/* Botão de Colapso */}
        {!isMobile && onToggleCollapse && (
          <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              {isCollapsed ? (
                <MdChevronRight className="h-4 w-4" />
              ) : (
                <MdChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
    </aside>
  );
}
