import { useState } from 'react';
import {
  LayoutDashboard,
  PawPrint,
  Bot,
  Newspaper,
  Settings,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Menu,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Resumen general' },
  { id: 'pets', label: 'Mis Animales', icon: PawPrint, description: 'Gestión de perfiles' },
  { id: 'vetcoach', label: 'VetCoach IA', icon: Bot, description: 'Consultas inteligentes' },
  { id: 'market', label: 'Mercado & Guía', icon: Newspaper, description: 'Noticias y precios' },
  { id: 'settings', label: 'Configuración', icon: Settings, description: 'Perfil y ajustes' },
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
      {/* Mobile hamburger button */}
      <button
        id="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white border border-slate-200 
                   shadow-sm text-slate-700 hover:bg-slate-50 transition-all duration-200 
                   lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300',
          'bg-white border-r border-slate-200 shadow-sm',
          // Desktop width toggle
          collapsed ? 'w-20' : 'w-64',
          // Mobile: slide in/out
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-100">
          {!collapsed && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 
                              flex items-center justify-center shadow-md shadow-emerald-600/20 flex-shrink-0">
                <HeartPulse size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">PetGuide</h1>
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Agro IA</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-9 h-9 rounded-xl bg-emerald-600 
                            flex items-center justify-center shadow-md shadow-emerald-600/20 mx-auto">
              <HeartPulse size={18} className="text-white" />
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            id="sidebar-collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 
                       hover:bg-slate-100 transition-all duration-200"
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 
                       hover:bg-slate-100 transition-all duration-200"
            aria-label="Cerrar menú"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
              Navegación
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
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent',
                  collapsed ? 'justify-center' : '',
                )}
              >
                <Icon
                  size={20}
                  className={clsx(
                    'flex-shrink-0 transition-transform duration-200',
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600',
                    !collapsed && 'group-hover:scale-110',
                  )}
                />
                {!collapsed && (
                  <div className="flex flex-col items-start min-w-0 animate-fade-in text-left">
                    <span className="text-sm font-semibold leading-tight truncate">{item.label}</span>
                    <span className={clsx('text-xs leading-tight truncate mt-0.5', isActive ? 'text-emerald-600/80' : 'text-slate-400')}>
                      {item.description}
                    </span>
                  </div>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom user info */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-100 animate-fade-in bg-slate-50/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 
                              flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">Admin Granja</p>
                <p className="text-xs text-slate-500 truncate font-medium">ProInnovate MVP</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Spacer for fixed sidebar on desktop */}
      <div className={clsx('hidden lg:block flex-shrink-0 transition-all duration-300', collapsed ? 'w-20' : 'w-64')} />
    </>
  );
}
