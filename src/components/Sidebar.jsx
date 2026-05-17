import { useState } from 'react';
import {
  Bot,
  Calculator,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  Warehouse,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../lib/supabaseClient';

const navItems = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, description: 'Produccion y alertas' },
  { id: 'records', label: 'Registros', icon: ClipboardList, description: 'Huevos, alimento y tareas' },
  { id: 'calculator', label: 'Calculadora', icon: Calculator, description: 'Costos y utilidad' },
  { id: 'pets', label: 'Biblioteca Pecuaria', icon: Warehouse, description: 'Modulos productivos' },
  { id: 'history', label: 'Historial', icon: History, description: 'Registros guardados' },
  { id: 'vetcoach', label: 'IAVet IA', icon: Bot, description: 'Voz, texto e imagen' },
  { id: 'market', label: 'Mercado IA', icon: Newspaper, description: 'Precios y margen' },
  { id: 'settings', label: 'Configuracion', icon: Settings, description: 'Perfil y ajustes' },
];


export default function Sidebar({ activeTab, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        id="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-[#cfe1d3] bg-white p-2.5 text-[#1f3d2b] shadow-sm transition-all duration-200 hover:bg-[#f4faf2] lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed left-0 top-0 z-50 flex h-full flex-col border-r border-[#d6a84f]/20 bg-[linear-gradient(180deg,#12372a_0%,#1f4f35_55%,#243b2c_100%)] shadow-xl transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
          {!collapsed && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#f2d58a]/40 bg-[#12372a] shadow-lg shadow-[#d6a84f]/10">
                <Bot size={22} className="text-[#f2d58a]" />
              </div>
              <div>
                <h1 className="text-sm font-black leading-tight text-white tracking-tight">AGROPECUARIO</h1>
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-[#f2d58a]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f2d58a]">IA</span>
                </div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f2d58a]/40 bg-[#12372a] shadow-lg shadow-[#d6a84f]/10">
              <Bot size={20} className="text-[#f2d58a]" />
            </div>
          )}

          <button
            id="sidebar-collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white lg:flex"
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Cerrar menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-500">
              Operacion
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleTabChange(item.id)}
                title={collapsed ? item.label : ''}
                className={clsx(
                  'group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 font-medium transition-all duration-200',
                  isActive
                    ? 'border-[#f2d58a]/30 bg-[#f2d58a]/12 text-white shadow-sm'
                    : 'border-transparent text-[#b7cbbd] hover:bg-white/8 hover:text-white',
                  collapsed ? 'justify-center' : '',
                )}
              >
                <Icon
                  size={20}
                  className={clsx(
                    'flex-shrink-0 transition-transform duration-200',
                    isActive ? 'text-[#f2d58a]' : 'text-[#91ad99] group-hover:text-[#dceade]',
                    !collapsed && 'group-hover:scale-110',
                  )}
                />
                {!collapsed && (
                  <div className="flex min-w-0 flex-col items-start text-left animate-fade-in">
                    <span className="truncate text-sm font-semibold leading-tight">{item.label}</span>
                    <span className={clsx('mt-0.5 truncate text-xs leading-tight', isActive ? 'text-[#f2d58a]/80' : 'text-[#91ad99]')}>
                      {item.description}
                    </span>
                  </div>
                )}
                {isActive && !collapsed && <div className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#f2d58a]" />}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="border-t border-white/10 bg-white/[0.04] p-4 animate-fade-in">
            <div className="flex items-center gap-3 rounded-xl border border-[#f2d58a]/15 bg-white/8 p-3 shadow-sm">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d6a84f] to-[#2f7d4b] text-sm font-bold text-white">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">Admin Granja</p>
                <p className="truncate text-xs font-medium text-[#b7cbbd]">IAVet MVP</p>
              </div>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-3 flex w-full items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-200 transition-all hover:bg-red-500/10 hover:text-white"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        )}
      </aside>

      <div className={clsx('hidden flex-shrink-0 transition-all duration-300 lg:block', collapsed ? 'w-20' : 'w-64')} />
    </>
  );
}
