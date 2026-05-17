import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Egg, Utensils, CheckCircle2, History as HistoryIcon, Search } from 'lucide-react';
import { clsx } from 'clsx';

export default function HistoryView() {
  const [production, setProduction] = useState([]);
  const [feed, setFeed] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('production');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [prodRes, feedRes, taskRes] = await Promise.all([
          supabase.from('production_records').select('*').order('date', { ascending: false }),
          supabase.from('feed_records').select('*').order('date', { ascending: false }),
          supabase.from('farm_tasks').select('*').order('created_at', { ascending: false })
        ]);

        if (prodRes.data) setProduction(prodRes.data);
        if (feedRes.data) setFeed(feedRes.data);
        if (taskRes.data) setTasks(taskRes.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredData = () => {
    const data = activeSubTab === 'production'
      ? production
      : activeSubTab === 'feed'
        ? feed
        : tasks;

    if (!searchTerm) return data;
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-4"></div>
          <p>Cargando registros guardados...</p>
        </div>
      );
    }

    const currentData = filteredData();

    if (currentData.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <HistoryIcon size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500 font-medium">No se encontraron registros para esta categoría</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {activeSubTab === 'production' && (
                <>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Huevos</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dañados</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Notas</th>
                </>
              )}
              {activeSubTab === 'feed' && (
                <>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kilos</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Costo/Kg</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Notas</th>
                </>
              )}
              {activeSubTab === 'tasks' && (
                <>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tarea</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Prioridad</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fuente</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                {activeSubTab === 'production' && (
                  <>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{row.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{row.eggs}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{row.damaged || 0}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic">{row.note || '-'}</td>
                  </>
                )}
                {activeSubTab === 'feed' && (
                  <>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{row.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{row.kg} kg</td>
                    <td className="px-6 py-4 text-sm text-slate-600">S/ {row.cost_per_kg}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic">{row.note || '-'}</td>
                  </>
                )}
                {activeSubTab === 'tasks' && (
                  <>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{row.title}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        row.priority === 'alta' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      )}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        row.status === 'done' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      )}>
                        {row.status === 'done' ? 'Completada' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{row.source}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Historial de Registros</h2>
          <p className="text-slate-500 font-medium">Consulta todos los datos guardados en la nube.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar en registros..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full md:w-64"
          />
        </div>
      </div>

      <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveSubTab('production')}
          className={clsx(
            'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all',
            activeSubTab === 'production' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <Egg size={18} />
          Producción
        </button>
        <button 
          onClick={() => setActiveSubTab('feed')}
          className={clsx(
            'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all',
            activeSubTab === 'feed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <Utensils size={18} />
          Alimento
        </button>
        <button 
          onClick={() => setActiveSubTab('tasks')}
          className={clsx(
            'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all',
            activeSubTab === 'tasks' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <CheckCircle2 size={18} />
          Tareas
        </button>
      </div>

      {renderContent()}
    </div>
  );
}
