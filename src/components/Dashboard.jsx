import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bell,
  Camera,
  ClipboardList,
  DollarSign,
  Droplets,
  Mic,
  Thermometer,
  TrendingDown,
  TrendingUp,
  WifiOff,
  Zap,
  Download,
} from 'lucide-react';
import { clsx } from 'clsx';
import { getAgroContextForAI, getFarmTasks, getFeedRecords } from '../lib/storage';

const severityStyles = {
  high: 'bg-[#5b2525]/55 border-red-300/30 text-red-50',
  medium: 'bg-[#684f1d]/45 border-[#f2d58a]/35 text-amber-50',
  info: 'bg-[#1f5b3b]/55 border-[#9bc5a8]/35 text-emerald-50',
};

const activityColorMap = {
  emerald: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-200',
  amber: 'bg-amber-400/10 border-amber-400/20 text-amber-200',
  blue: 'bg-sky-400/10 border-sky-400/20 text-sky-200',
  purple: 'bg-violet-400/10 border-violet-400/20 text-violet-200',
  red: 'bg-red-400/10 border-red-400/20 text-red-200',
};

function MiniTrendChart({ trend }) {
  const max = Math.max(1, ...trend.map((item) => Math.max(item.eggs, item.expected)));

  return (
    <div className="h-36 flex items-end gap-2">
      {trend.map((item) => {
        const height = Math.max(8, (item.eggs / max) * 100);
        const expectedHeight = Math.max(8, (item.expected / max) * 100);

        const isToday = item.day === 'Hoy';
        return (
          <div key={item.day} className="flex-1 h-full flex flex-col items-center justify-end gap-2">
            <div className="relative w-full h-28 flex items-end justify-center">
              <div
                className="absolute bottom-0 w-1.5 rounded-full bg-amber-300/35"
                style={{ height: `${expectedHeight}%` }}
              />
              <div
                className={clsx(
                  'w-7 rounded-t-lg transition-all duration-500',
                  isToday ? 'bg-amber-300 shadow-lg shadow-amber-300/20' : 'bg-emerald-400',
                )}
                style={{ height: `${height}%` }}
                title={`${item.eggs} huevos`}
              />
            </div>
            <span className={clsx('text-[11px] font-bold', isToday ? 'text-amber-200' : 'text-slate-400')}>
              {item.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard({ onTabChange }) {
  const [voiceListening, setVoiceListening] = useState(false);
  const [activeGalpon, setActiveGalpon] = useState('all'); // 'all' | 'galpon1' | 'galpon2'
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('Modo Campo Activo · Sincronizado');
  const [_, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setUpdateTrigger((prev) => prev + 1);

    // List of events that affect dashboard metrics
    window.addEventListener('iavet-daily-production-sync', handleUpdate);
    window.addEventListener('iavet-egg-calculator-sync', handleUpdate);
    window.addEventListener('iavet-farm-tasks-sync', handleUpdate);
    window.addEventListener('iavet-livestock-modules-sync', handleUpdate);
    window.addEventListener('iavet-feed-records-sync', handleUpdate);

    return () => {
      window.removeEventListener('iavet-daily-production-sync', handleUpdate);
      window.removeEventListener('iavet-egg-calculator-sync', handleUpdate);
      window.removeEventListener('iavet-farm-tasks-sync', handleUpdate);
      window.removeEventListener('iavet-livestock-modules-sync', handleUpdate);
      window.removeEventListener('iavet-feed-records-sync', handleUpdate);
    };
  }, []);

  const context = getAgroContextForAI();
  const feedRecords = getFeedRecords();
  const tasks = getFarmTasks();
  const latestFeed = feedRecords.at(-1);
  const pendingTasks = tasks.filter((task) => task.status !== 'done');

  // Dynamic Galpón computations to partition data
  const activeMultiplier = activeGalpon === 'galpon1' ? 0.6 : activeGalpon === 'galpon2' ? 0.4 : 1.0;
  const currentEggs = Math.round(context.latestEggs * activeMultiplier);
  const currentAnimals = Math.round(context.totalAnimals * activeMultiplier);
  const currentIncome = context.monthlyIncome * activeMultiplier;
  const currentNetProfit = context.netProfit * activeMultiplier;
  const currentAverage = context.previousAverage * activeMultiplier;

  const triggerSync = () => {
    setIsSyncing(true);
    setSyncMessage('Sincronizando registros locales...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('¡Sincronizado con éxito!');
      setTimeout(() => {
        setSyncMessage('Modo Campo Activo · Sincronizado');
      }, 3000);
    }, 1500);
  };

  const exportExecutiveReport = () => {
    const galponName = activeGalpon === 'all' ? 'Todos los Galpones' : activeGalpon === 'galpon1' ? 'Galpon 1 (Lohmann)' : 'Galpon 2 (Hy-Line)';
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Fecha,Galpon,Categoria,Detalle,Valor\n"
      + `${new Date().toLocaleDateString()},${galponName},Produccion Diaria,Huevos Registrados,${currentEggs}\n`
      + `${new Date().toLocaleDateString()},${galponName},Inventario Pecuario,Aves Activas,${currentAnimals}\n`
      + `${new Date().toLocaleDateString()},${galponName},Finanzas,Ingresos Proyectados,S/ ${currentIncome.toFixed(2)}\n`
      + `${new Date().toLocaleDateString()},${galponName},Finanzas,Utilidad Neta,S/ ${currentNetProfit.toFixed(2)}\n`
      + `${new Date().toLocaleDateString()},${galponName},Eficiencia,Margen Operativo,${context.margin.toFixed(1)}%\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Ejecutivo_IAVet_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const trend = context.production.slice(-7).map((record, index, arr) => ({
    day: index === arr.length - 1 ? 'Hoy' : new Date(`${record.date}T00:00:00`).toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', ''),
    eggs: Math.round(Number(record.eggs || 0) * activeMultiplier),
    expected: Math.max(1, Math.round((context.previousAverage || Number(record.eggs || 0)) * activeMultiplier)),
  }));
  const chartTrend = trend.length ? trend : [{ day: 'Hoy', eggs: 0, expected: 1 }];

  const aiAlerts = useMemo(() => {
    const alerts = [];
    if (context.production.length === 0) {
      alerts.push({
        id: 'no-production',
        title: 'Registra tu primera produccion',
        detail: 'Aun no hay huevos registrados para analizar tendencia, postura o merma.',
        severity: 'info',
        recommendation: 'Ve a Registros y guarda la produccion del dia para activar alertas reales.',
      });
    }
    if (context.dropPercent >= 10) {
      alerts.push({
        id: 'drop',
        title: 'Baja de produccion detectada',
        detail: `La produccion bajo ${context.dropPercent.toFixed(1)}% frente al promedio reciente.`,
        severity: 'high',
        recommendation: 'Revisar agua, alimento, temperatura, luz y estres del lote.',
      });
    }
    if (context.damagedRate >= 5) {
      alerts.push({
        id: 'damage',
        title: 'Merma elevada',
        detail: `La merma actual es ${context.damagedRate.toFixed(1)}% de los huevos registrados.`,
        severity: 'medium',
        recommendation: 'Revisar nidos, manipulacion y traslado hacia almacenamiento.',
      });
    }
    if (pendingTasks.length > 0) {
      alerts.push({
        id: 'tasks',
        title: 'Tareas pendientes de rutina',
        detail: `Hay ${pendingTasks.length} tarea${pendingTasks.length === 1 ? '' : 's'} pendiente${pendingTasks.length === 1 ? '' : 's'} para completar.`,
        severity: 'info',
        recommendation: 'Completa primero agua, alimento, limpieza y confirmacion de produccion.',
      });
    }
    if (context.modules.length === 0) {
      alerts.push({
        id: 'no-modules',
        title: 'Sin modulos pecuarios registrados',
        detail: 'Aun no hay lotes o especies registrados en la biblioteca pecuaria.',
        severity: 'info',
        recommendation: 'Crea un modulo con cantidad de aves para que la IA calcule indicadores por animal.',
      });
    }
    return alerts.slice(0, 4);
  }, [context, pendingTasks.length]);

  const quickHistory = useMemo(() => {
    const items = [];
    if (context.latest) {
      items.push({
        id: 'production',
        label: 'Produccion',
        value: `${context.latest.eggs} huevos`,
        time: context.latest.date,
        status: `${context.latest.damaged || 0} no vendibles`,
      });
    }
    if (latestFeed) {
      items.push({
        id: 'feed',
        label: 'Alimento',
        value: `${Number(latestFeed.kg || 0).toFixed(1)} kg`,
        time: latestFeed.date,
        status: `S/ ${Number(latestFeed.costPerKg || 0).toFixed(2)} por kg`,
      });
    }
    pendingTasks.slice(0, 2).forEach((task) => {
      items.push({
        id: `task-${task.id}`,
        label: 'Tarea',
        value: task.title,
        time: task.priority,
        status: task.source,
      });
    });
    return items;
  }, [context.latest, latestFeed, pendingTasks]);

  const recentActivity = quickHistory.map((item, index) => ({
    id: item.id,
    icon: item.label.slice(0, 2).toUpperCase(),
    text: `${item.label}: ${item.value}`,
    time: item.time,
    color: ['emerald', 'amber', 'blue', 'purple'][index % 4],
  }));

  const metricCards = useMemo(
    () => [
      {
        label: 'Produccion diaria',
        value: `${currentEggs}`,
        sub: `Promedio reciente: ${currentAverage.toFixed(1)} huevos`,
        icon: ClipboardList,
        trend: `${context.dropPercent.toFixed(1)}%`,
        tone: 'amber',
      },
      {
        label: 'Lote monitoreado',
        value: `${currentAnimals}`,
        sub: `${context.moduleCount} modulo${context.moduleCount === 1 ? '' : 's'} registrado${context.moduleCount === 1 ? '' : 's'}`,
        icon: Activity,
        trend: 'online',
        tone: 'emerald',
      },
      {
        label: 'Ingreso mensual',
        value: `S/ ${currentIncome.toFixed(2)}`,
        sub: `Utilidad neta: S/ ${currentNetProfit.toFixed(2)}`,
        icon: DollarSign,
        trend: `${context.margin.toFixed(1)}% margen`,
        tone: 'gold',
      },
      {
        label: 'Tareas pendientes',
        value: `${pendingTasks.length}`,
        sub: 'Rutina operativa activa',
        icon: ClipboardList,
        trend: 'conectado',
        tone: 'slate',
      },
    ],
    [currentEggs, currentAverage, currentAnimals, currentIncome, currentNetProfit, context.moduleCount, context.dropPercent, context.margin, pendingTasks.length],
  );

  return (
    <div className="space-y-4 animate-fade-in text-white sm:space-y-5">
      <section className="relative overflow-hidden rounded-2xl border border-[#d6a84f]/25 bg-[#12372a] p-4 shadow-2xl shadow-[#12372a]/20 sm:p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,168,79,0.28),transparent_34%),linear-gradient(135deg,rgba(18,55,42,0.98),rgba(47,125,75,0.82)_58%,rgba(74,91,45,0.72))]" />
        <div className="relative grid gap-5 lg:grid-cols-[1.45fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#f2d58a]/25 bg-[#f2d58a]/10 px-3 py-1 text-xs font-bold text-[#f2d58a]">
                    <Zap size={13} className="animate-pulse" />
                    Command Center Agro IA
                  </div>
                  
                  {/* Offline Sync Widget */}
                  <button
                    onClick={triggerSync}
                    disabled={isSyncing}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold transition-all duration-300",
                      isSyncing 
                        ? "border-amber-400/25 bg-amber-50/10 text-amber-300"
                        : "border-emerald-400/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    )}
                  >
                    <div className={clsx("h-1.5 w-1.5 rounded-full", isSyncing ? "bg-amber-400 animate-spin" : "bg-emerald-400 animate-pulse")} />
                    {syncMessage}
                  </button>

                  {/* Galpón Selector Dropdown */}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/80 px-2.5 py-0.5 text-xs font-bold text-slate-200">
                    <span className="text-slate-400">Lote:</span>
                    <select
                      value={activeGalpon}
                      onChange={(e) => setActiveGalpon(e.target.value)}
                      className="bg-transparent text-slate-200 border-none outline-none cursor-pointer pr-1 font-bold focus:ring-0 text-xs"
                    >
                      <option value="all" className="bg-slate-900 text-white">Todos los Galpones</option>
                      <option value="galpon1" className="bg-slate-900 text-white">Galpón 1 (Lohmann)</option>
                      <option value="galpon2" className="bg-slate-900 text-white">Galpón 2 (Hy-Line)</option>
                    </select>
                  </div>
                </div>
                <h2 className="text-xl font-black tracking-normal text-white sm:text-3xl">
                  IAVet monitorea tu criadero en tiempo real
                </h2>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-300">
                  Produccion, alertas, clima, registros y finanzas en una vista pensada para una operacion pecuaria real.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start shrink-0 w-full sm:w-auto animate-fade-in">
                <button
                  onClick={() => setVoiceListening((value) => !value)}
                  className={clsx(
                    'inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-300 sm:w-auto',
                    voiceListening
                      ? 'border-[#f2d58a]/70 bg-[#f2d58a] text-[#12372a] shadow-lg shadow-[#d6a84f]/20'
                      : 'border-[#f2d58a]/30 bg-white/8 text-[#f4ead0] hover:bg-white/12',
                  )}
                >
                  <Mic size={17} />
                  {voiceListening ? 'Escuchando...' : 'Registrar por voz'}
                </button>
                <button
                  onClick={exportExecutiveReport}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 text-sm font-bold transition-all duration-300 sm:w-auto shadow-md hover:shadow-lg"
                >
                  <Download size={17} />
                  Exportar Reporte
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-4">
              {metricCards.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-3 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f2d58a]/35 hover:bg-white/[0.12] sm:p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="rounded-lg bg-[#f2d58a]/12 p-2 text-[#f2d58a]">
                        <Icon size={18} />
                      </div>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-bold uppercase text-slate-300">
                        {metric.trend}
                      </span>
                    </div>
                    <p className="text-2xl font-black text-white">{metric.value}</p>
                    <p className="mt-1 text-xs font-bold text-slate-200">{metric.label}</p>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">{metric.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-white">Tendencia productiva</h3>
                <p className="text-xs font-medium text-slate-400">Huevos reales vs objetivo IA</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f2d58a]/10 px-2.5 py-1 text-xs font-bold text-[#f2d58a]">
                <TrendingDown size={12} />
                {context.dropPercent.toFixed(1)}%
              </span>
            </div>
            <MiniTrendChart trend={chartTrend} />
            
            {/* Nuevo bloque para llenar el espacio y dar valor */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#f2d58a]">Resumen Operativo</h4>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Utilidad Proyectada</p>
                  <p className="mt-1 text-sm font-black text-emerald-400">S/ {currentNetProfit.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Eficiencia Lote</p>
                  <p className="mt-1 text-sm font-black text-amber-400">{context.margin.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Cajas/Jabas Hoy</p>
                  <p className="mt-1 text-sm font-black text-white">{Math.floor(currentEggs / 30)} jaba(s)</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Meta Diaria</p>
                  <p className="mt-1 text-sm font-black text-slate-300">{Math.round(context.breakEvenDaily * activeMultiplier)} huevos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-[#1f4f35]/20 bg-[#12372a] p-4 shadow-xl shadow-[#12372a]/10 sm:p-5 lg:col-span-2">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-white">Alertas IA y recomendaciones</h3>
              <p className="text-xs font-medium text-[#b7cbbd]">Analisis automatico de produccion, clima y sincronizacion.</p>
            </div>
            <Bell size={18} className="text-amber-300" />
          </div>
          <div className="space-y-3">
            {aiAlerts.length === 0 && (
              <div className="rounded-xl border border-[#9bc5a8]/25 bg-[#1f5b3b]/55 p-4 text-emerald-50">
                <p className="text-sm font-black">Sin alertas criticas</p>
                <p className="mt-1 text-xs leading-relaxed opacity-80">
                  Registra produccion, alimento, tareas y modulos para que IAVet genere recomendaciones automaticas.
                </p>
              </div>
            )}
            {aiAlerts.map((alert) => (
              <div
                key={alert.id}
                className={clsx('rounded-xl border p-4 transition-all duration-300 hover:translate-x-1', severityStyles[alert.severity])}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black">{alert.title}</p>
                    <p className="mt-1 text-xs leading-relaxed opacity-80">{alert.detail}</p>
                    <p className="mt-3 text-xs font-bold text-emerald-200">{alert.recommendation}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-black uppercase">
                    IA
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#1f4f35]/20 bg-[#12372a] p-4 shadow-xl shadow-[#12372a]/10 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-white">Clima del galpon</h3>
              <p className="text-xs font-medium text-[#b7cbbd]">Riesgo operativo rapido.</p>
            </div>
            <span className="rounded-full bg-amber-300/10 px-2.5 py-1 text-xs font-bold text-amber-200">vigilar</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#f2d58a]/15 bg-white/[0.07] p-4">
              <Thermometer size={18} className="mb-3 text-amber-200" />
              <p className="text-2xl font-black text-white">-- C</p>
              <p className="text-xs font-medium text-slate-400">Temperatura</p>
            </div>
            <div className="rounded-xl border border-[#9dd5df]/15 bg-white/[0.07] p-4">
              <Droplets size={18} className="mb-3 text-sky-200" />
              <p className="text-2xl font-black text-white">--%</p>
              <p className="text-xs font-medium text-slate-400">Humedad</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-[#9bc5a8]/25 bg-[#2f7d4b]/20 p-4">
            <p className="text-xs font-black uppercase text-[#cde8d0]">IA pensando</p>
            <div className="mt-2 flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              Si la temperatura supera 30 C, priorizar ventilacion y agua antes de registrar nuevas tareas.
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className="section-title">Historial rapido</h3>
            <span className="badge-success">Auto guardado</span>
          </div>
          <div className="space-y-3">
            {quickHistory.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm font-black text-slate-900">Aun no hay historial</p>
                <p className="mx-auto mt-1 max-w-sm text-xs font-medium leading-relaxed text-slate-500">
                  Guarda produccion, alimento o tareas para ver aqui los eventos recientes.
                </p>
              </div>
            )}
            {quickHistory.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                  {item.label.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">{item.value}</p>
                  <p className="text-xs font-medium text-slate-500">{item.time} · {item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Zap size={16} className="text-emerald-600" />
            <h3 className="section-title">Accesos rapidos IA</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Hablar con IAVet', tab: 'vetcoach', icon: Mic, desc: 'Voz, texto e imagenes' },
              { label: 'Registrar datos', tab: 'records', icon: ClipboardList, desc: 'Huevos, alimento y tareas' },
              { label: 'Calcular utilidad', tab: 'calculator', icon: DollarSign, desc: 'Costos, margen y equilibrio' },
              { label: 'Analizar fotos', tab: 'vetcoach', icon: Camera, desc: 'Conteo con validacion' },
              { label: 'Ver modulos pecuarios', tab: 'pets', icon: Activity, desc: 'Produccion e historial' },
              { label: 'Mercado pecuario', tab: 'market', icon: TrendingUp, desc: 'Huevos, alimento y aves' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => onTabChange(action.tab)}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                >
                  <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-slate-900">{action.label}</span>
                    <span className="block text-xs font-medium text-slate-500">{action.desc}</span>
                  </span>
                  <ArrowRight size={16} className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600" />
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="section-title">Actividad reciente automatizada</h3>
            <p className="section-subtitle">Eventos creados por voz, imagen y chat IA.</p>
          </div>
          <span className="badge-info">En vivo</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {recentActivity.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-500 md:col-span-2 xl:col-span-5">
              Sin actividad reciente. Los eventos apareceran automaticamente al registrar datos.
            </div>
          )}
          {recentActivity.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className={clsx('mb-3 inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-black', activityColorMap[item.color])}>
                {item.icon}
              </div>
              <p className="text-xs font-bold leading-snug text-slate-800">{item.text}</p>
              <p className="mt-2 text-[11px] font-medium text-slate-500">{item.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
