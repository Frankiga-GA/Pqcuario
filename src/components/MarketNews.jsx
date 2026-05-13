import { useState } from 'react';
import { ExternalLink, AlertTriangle, TrendingUp, BookOpen, Clock, Flame } from 'lucide-react';
import { marketNews } from '../data/mockData';
import { clsx } from 'clsx';

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: BookOpen },
  { id: 'senasa', label: 'SENASA', icon: AlertTriangle },
  { id: 'prices', label: 'Precios', icon: TrendingUp },
  { id: 'guides', label: 'Guías', icon: BookOpen },
];

const categoryConfig = {
  senasa: {
    badge: 'badge-danger',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    borderAccent: 'border-l-red-500',
    icon: AlertTriangle,
  },
  prices: {
    badge: 'badge-success',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderAccent: 'border-l-emerald-500',
    icon: TrendingUp,
  },
  guides: {
    badge: 'badge-info',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderAccent: 'border-l-blue-500',
    icon: BookOpen,
  },
};

function NewsCard({ news }) {
  const config = categoryConfig[news.category] || categoryConfig.guides;
  const Icon = config.icon;

  return (
    <div
      id={`news-card-${news.id}`}
      className={clsx(
        'glass-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-l-4 bg-white',
        config.borderAccent,
      )}
    >
      <div className="flex items-start gap-4">
        <div className={clsx('p-2.5 rounded-xl flex-shrink-0 mt-0.5 border border-slate-100', config.iconBg)}>
          <Icon size={18} className={config.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={clsx('badge', config.badge)}>{news.categoryLabel}</span>
            {news.urgent && (
              <span className="badge badge-danger flex items-center gap-1">
                <Flame size={10} />
                Urgente
              </span>
            )}
            <div className="ml-auto flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Clock size={11} />
              {new Date(news.date).toLocaleDateString('es-PE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 group-hover:text-emerald-700 transition-colors">
            {news.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">{news.summary}</p>
          <button
            onClick={() => {}}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Leer más <ExternalLink size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MarketNews() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all'
      ? marketNews
      : marketNews.filter((n) => n.category === activeCategory);

  const urgentCount = marketNews.filter((n) => n.urgent).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mercado &amp; Guía</h2>
          <p className="text-slate-500 mt-1 font-medium">Alertas SENASA, precios de mercado y guías técnicas</p>
        </div>
        {urgentCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 shadow-sm">
            <AlertTriangle size={15} />
            <span className="text-sm font-bold">
              {urgentCount} alerta{urgentCount > 1 ? 's' : ''} activa{urgentCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Category tabs */}
      <div className="glass-card p-2 flex gap-1 flex-wrap bg-white">
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count =
            cat.id === 'all'
              ? marketNews.length
              : marketNews.filter((n) => n.category === cat.id).length;
          return (
            <button
              key={cat.id}
              id={`filter-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200',
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent',
              )}
            >
              <CatIcon size={14} className={isActive ? "text-emerald-600" : "text-slate-400"} />
              {cat.label}
              <span
                className={clsx(
                  'text-xs px-1.5 py-0.5 rounded-md font-bold',
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Urgent banner */}
      {filtered.some((n) => n.urgent) && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-fade-in shadow-sm">
          <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Alerta Sanitaria Activa</p>
            <p className="text-xs text-red-600 mt-0.5 font-medium">
              Hay alertas sanitarias vigentes de SENASA. Revisa los avisos y toma medidas preventivas inmediatas.
            </p>
          </div>
        </div>
      )}

      {/* News grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center bg-white border border-slate-200 border-dashed">
          <p className="text-4xl mb-3 opacity-50">📰</p>
          <p className="text-slate-900 font-bold text-lg">Sin noticias en esta categoría</p>
        </div>
      )}

      <p className="text-center text-xs text-slate-500 font-medium pb-2">
        Información de referencia. Verifica siempre en{' '}
        <span className="text-emerald-600 font-bold">www.senasa.gob.pe</span> para datos oficiales.
      </p>
    </div>
  );
}
