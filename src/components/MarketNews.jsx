import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  ExternalLink,
  Flame,
  Package,
  TrendingUp,
} from 'lucide-react';
import { clsx } from 'clsx';
import { getAgroContextForAI, getFeedRecords } from '../lib/storage';

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: BookOpen },
  { id: 'prices', label: 'Huevos', icon: TrendingUp },
  { id: 'feed', label: 'Alimento', icon: Package },
  { id: 'birds', label: 'Aves', icon: BarChart3 },
  { id: 'senasa', label: 'SENASA', icon: AlertTriangle },
  { id: 'guides', label: 'Guias', icon: BookOpen },
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
  feed: {
    badge: 'badge-warning',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderAccent: 'border-l-amber-500',
    icon: Package,
  },
  birds: {
    badge: 'badge-info',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    borderAccent: 'border-l-sky-500',
    icon: BarChart3,
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
        'rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
        config.borderAccent,
      )}
    >
      <div className="flex items-start gap-4">
        <div className={clsx('mt-0.5 flex-shrink-0 rounded-xl border border-slate-100 p-2.5', config.iconBg)}>
          <Icon size={18} className={config.iconColor} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={clsx('badge', config.badge)}>{news.categoryLabel}</span>
            {news.urgent && (
              <span className="badge badge-danger">
                <Flame size={10} />
                Urgente
              </span>
            )}
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">
              {new Date(news.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
            </span>
          </div>
          <h3 className="mb-2 text-sm font-black leading-snug text-slate-900">{news.title}</h3>
          <p className="mb-4 text-xs leading-relaxed text-slate-600">{news.summary}</p>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Indicador</p>
              <p className="text-sm font-black text-slate-900">{news.metric}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
              {news.trend}
            </span>
          </div>
          <button
            onClick={() => {}}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 transition-colors hover:text-emerald-700"
          >
            Ver analisis <ExternalLink size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MarketNews() {
  const [activeCategory, setActiveCategory] = useState('all');
  const context = getAgroContextForAI();
  const feedRecords = getFeedRecords();
  const latestFeed = feedRecords.at(-1);
  const dailyEggs = Number(context.latestEggs || context.calculator.dailyEggs || 0);
  const eggPrice = Number(context.calculator.eggPrice || 0);
  const dailyIncome = dailyEggs * eggPrice * (1 - Number(context.calculator.lossRate || 0) / 100);
  const feedCost = Number(context.calculator.feedCost || 0);
  const margin = Number(context.margin || 0);

  const marketNews = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const items = [];

    if (eggPrice > 0) {
      items.push({
        id: 'egg-price',
        category: 'prices',
        categoryLabel: 'Precio huevos',
        title: 'Precio de venta registrado para tu produccion',
        summary:
          `Tu precio actual es S/ ${eggPrice.toFixed(2)} por huevo. Con ${dailyEggs} huevos diarios, el ingreso estimado del dia es S/ ${dailyIncome.toFixed(2)}.`,
        date: today,
        urgent: false,
        metric: `S/ ${eggPrice.toFixed(2)} por huevo`,
        trend: dailyIncome > 0 ? `S/ ${dailyIncome.toFixed(2)}/dia` : 'Sin ventas',
      });
    }

    if (feedCost > 0 || latestFeed) {
      const latestKg = Number(latestFeed?.kg || 0);
      const latestCost = Number(latestFeed?.costPerKg || 0);
      items.push({
        id: 'feed-cost',
        category: 'feed',
        categoryLabel: 'Alimento',
        title: 'Costo de alimento dentro de la proyeccion',
        summary:
          `El costo mensual registrado de alimento es S/ ${feedCost.toFixed(2)}.${latestFeed ? ` Ultimo consumo: ${latestKg.toFixed(1)} kg a S/ ${latestCost.toFixed(2)} por kg.` : ''}`,
        date: latestFeed?.date || today,
        urgent: feedCost > context.monthlyIncome && context.monthlyIncome > 0,
        metric: `S/ ${feedCost.toFixed(2)}/mes`,
        trend: latestFeed ? `${latestKg.toFixed(1)} kg` : 'Planificado',
      });
    }

    if (context.totalAnimals > 0) {
      items.push({
        id: 'birds-count',
        category: 'birds',
        categoryLabel: 'Aves',
        title: 'Capacidad pecuaria registrada',
        summary:
          `Tienes ${context.totalAnimals} animales registrados en ${context.moduleCount} modulo${context.moduleCount === 1 ? '' : 's'}. Este dato ayuda a medir postura, consumo y rentabilidad por ave.`,
        date: today,
        urgent: false,
        metric: `${context.totalAnimals} animales`,
        trend: `${context.moduleCount} modulo${context.moduleCount === 1 ? '' : 's'}`,
      });
    }

    if (context.dropPercent >= 10 || context.damagedRate >= 5) {
      items.push({
        id: 'risk-alert',
        category: 'senasa',
        categoryLabel: 'Alerta operativa',
        title: 'Riesgo productivo que puede afectar margen',
        summary:
          `Se detecta baja de produccion de ${context.dropPercent.toFixed(1)}% o merma de ${context.damagedRate.toFixed(1)}%. Revisa agua, alimento, calor, nidos y manipulacion.`,
        date: today,
        urgent: true,
        metric: 'Vigilancia',
        trend: 'Alta',
      });
    }

    items.push({
      id: 'guide-margin',
      category: 'guides',
      categoryLabel: 'Guia tecnica',
      title: 'Lectura economica del lote',
      summary:
        context.monthlyIncome > 0
          ? `Tu ingreso mensual proyectado es S/ ${context.monthlyIncome.toFixed(2)} y la utilidad neta estimada es S/ ${context.netProfit.toFixed(2)}. Margen actual: ${margin.toFixed(1)}%.`
          : 'Registra precio por huevo, produccion y costos para activar la lectura economica completa.',
      date: today,
      urgent: false,
      metric: context.monthlyIncome > 0 ? `S/ ${context.netProfit.toFixed(2)} neto` : 'Sin proyeccion',
      trend: context.monthlyIncome > 0 ? `${margin.toFixed(1)}%` : 'Pendiente',
    });

    return items;
  }, [context, dailyEggs, dailyIncome, eggPrice, feedCost, latestFeed, margin]);

  const filtered =
    activeCategory === 'all'
      ? marketNews
      : marketNews.filter((n) => n.category === activeCategory);

  const urgentCount = marketNews.filter((n) => n.urgent).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Mercado Pecuario IA</h2>
          <p className="mt-1 font-medium text-slate-500">
            Precios de huevos, alimento balanceado, aves y alertas economicas.
          </p>
        </div>
        {urgentCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-red-700 shadow-sm">
            <AlertTriangle size={15} />
            <span className="text-sm font-bold">{urgentCount} alerta activa</span>
          </div>
        )}
      </div>

      <section className="grid gap-3 min-[430px]:grid-cols-2 md:grid-cols-4">
        {[
          { label: 'Ingreso diario', value: `S/ ${dailyIncome.toFixed(2)}`, sub: `${dailyEggs} huevos registrados` },
          { label: 'Ingreso mensual', value: `S/ ${context.monthlyIncome.toFixed(2)}`, sub: 'Proyeccion actual' },
          { label: 'Costo alimento', value: `S/ ${feedCost.toFixed(2)}`, sub: 'Costo mensual' },
          { label: 'Utilidad neta', value: `S/ ${context.netProfit.toFixed(2)}`, sub: `${margin.toFixed(1)}% margen` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{item.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{item.sub}</p>
          </div>
        ))}
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex gap-1 overflow-x-auto sm:flex-wrap">
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
                  'flex flex-shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-black transition-all duration-200',
                  isActive
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800',
                )}
              >
                <CatIcon size={14} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                {cat.label}
                <span className={clsx('rounded-md px-1.5 py-0.5 text-xs font-black', isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.some((n) => n.urgent) && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm animate-fade-in">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-black text-red-800">Alerta sanitaria vinculada al mercado</p>
            <p className="mt-0.5 text-xs font-medium text-red-600">
              Las alertas sanitarias pueden afectar ventas, transporte y reposicion. Verifica siempre fuentes oficiales.
            </p>
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-black text-slate-900">Sin datos en esta categoria</p>
        </div>
      )}

      <p className="pb-2 text-center text-xs font-medium text-slate-500">
        Precios y tendencias son referenciales para planificacion. Datos oficiales sanitarios: www.senasa.gob.pe.
      </p>
    </div>
  );
}
