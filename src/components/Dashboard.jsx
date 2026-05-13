import { useState } from 'react';
import {
  Activity,
  Syringe,
  MessageSquare,
  Heart,
  TrendingUp,
  ArrowRight,
  Bell,
  Zap,
} from 'lucide-react';
import { mockPets, recentActivity } from '../data/mockData';
import { clsx } from 'clsx';

const metrics = [
  {
    id: 'total-animals',
    label: 'Animales Activos',
    value: '6',
    sub: '+1 este mes',
    icon: Heart,
    color: 'emerald',
    gradient: 'from-emerald-50 to-white',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    trend: '+16.7%',
    trendUp: true,
  },
  {
    id: 'upcoming-vaccines',
    label: 'Próximas Vacunas',
    value: '2',
    sub: 'Próximos 30 días',
    icon: Syringe,
    color: 'amber',
    gradient: 'from-amber-50 to-white',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    trend: '!Urgente',
    trendUp: false,
  },
  {
    id: 'ai-queries',
    label: 'Consultas IA',
    value: '24',
    sub: 'Este mes',
    icon: MessageSquare,
    color: 'blue',
    gradient: 'from-blue-50 to-white',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    trend: '+40%',
    trendUp: true,
  },
  {
    id: 'wellbeing-score',
    label: 'Bienestar General',
    value: '82%',
    sub: '5 de 6 saludables',
    icon: Activity,
    color: 'purple',
    gradient: 'from-purple-50 to-white',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    trend: '+5%',
    trendUp: true,
  },
];

const activityColorMap = {
  emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
  amber: 'bg-amber-50 border-amber-100 text-amber-600',
  blue: 'bg-blue-50 border-blue-100 text-blue-600',
  purple: 'bg-purple-50 border-purple-100 text-purple-600',
  red: 'bg-red-50 border-red-100 text-red-600',
};

export default function Dashboard({ onTabChange }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const upcomingVaccines = mockPets
    .filter((p) => p.nextVaccine !== 'N/A')
    .sort((a, b) => new Date(a.nextVaccine) - new Date(b.nextVaccine))
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Bienvenido de vuelta 👋</h2>
          <p className="text-slate-500 mt-1">
            Hoy es{' '}
            <span className="text-slate-700 font-bold">
              {new Date().toLocaleDateString('es-PE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shadow-sm">
          <Bell size={15} />
          <span className="text-sm font-bold">2 alertas pendientes</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isHovered = hoveredCard === metric.id;
          return (
            <div
              key={metric.id}
              id={`metric-${metric.id}`}
              onMouseEnter={() => setHoveredCard(metric.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={clsx(
                'glass-card p-5 cursor-default transition-all duration-300',
                `bg-gradient-to-br ${metric.gradient} border ${metric.border}`,
                isHovered ? 'scale-[1.02] shadow-md border-opacity-100' : 'scale-100 border-opacity-60',
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={clsx('p-2.5 rounded-xl', metric.iconBg)}>
                  <Icon size={20} className={metric.iconColor} />
                </div>
                <span
                  className={clsx(
                    'text-xs font-bold px-2 py-1 rounded-full',
                    metric.trendUp
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700',
                  )}
                >
                  {metric.trendUp ? <TrendingUp size={10} className="inline mr-1" /> : null}
                  {metric.trend}
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{metric.value}</div>
              <div className="text-sm font-bold text-slate-700">{metric.label}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{metric.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Main content: Activity + Upcoming vaccines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title">Actividad Reciente</h3>
            <span className="badge badge-info">En vivo</span>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 group border border-transparent hover:border-slate-100"
              >
                <div className={clsx('w-9 h-9 rounded-xl border flex items-center justify-center text-base flex-shrink-0', activityColorMap[item.color] || activityColorMap.blue)}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 font-semibold leading-snug group-hover:text-slate-900">{item.text}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Vaccines */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title">Próximas Vacunas</h3>
            <Syringe size={16} className="text-amber-500" />
          </div>
          <div className="space-y-3">
            {upcomingVaccines.map((pet) => {
              const vaccDate = new Date(pet.nextVaccine);
              const today = new Date();
              const daysLeft = Math.ceil((vaccDate - today) / (1000 * 60 * 60 * 24));
              return (
                <div
                  key={pet.id}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg bg-slate-50 p-1 rounded-md border border-slate-100">{pet.emoji}</span>
                    <span className="text-sm font-bold text-slate-800">{pet.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 font-medium">{pet.breed}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      {vaccDate.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                    </span>
                    <span
                      className={clsx(
                        'text-xs font-bold px-2 py-1 rounded-md',
                        daysLeft <= 10
                          ? 'bg-red-100 text-red-700'
                          : daysLeft <= 30
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700',
                      )}
                    >
                      {daysLeft <= 0 ? 'Vencida' : `${daysLeft} días`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-5 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center gap-2 mb-5">
          <Zap size={16} className="text-emerald-500" />
          <h3 className="section-title">Acciones Rápidas</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Registrar nuevo animal', tab: 'pets', emoji: '➕', desc: 'Agrega un perfil al sistema' },
            { label: 'Consultar al VetCoach IA', tab: 'vetcoach', emoji: '🤖', desc: 'Orientación inteligente 24/7' },
            { label: 'Ver noticias SENASA', tab: 'market', emoji: '📋', desc: 'Alertas y regulaciones' },
          ].map((action) => (
            <button
              key={action.tab}
              id={`quick-action-${action.tab}`}
              onClick={() => onTabChange(action.tab)}
              className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 
                         hover:border-emerald-300 hover:shadow-md transition-all duration-200 
                         text-left group"
            >
              <span className="text-2xl bg-slate-50 p-2 rounded-xl border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">{action.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-slate-500 font-medium">{action.desc}</p>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
