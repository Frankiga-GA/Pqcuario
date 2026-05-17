import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardCheck, Filter, Plus, Sparkles, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { getFarmTasks, STORAGE_EVENTS, writeFarmTasks } from '../lib/storage';

const priorityStyles = {
  alta: 'bg-red-50 text-red-700 border-red-200',
  media: 'bg-amber-50 text-amber-700 border-amber-200',
  baja: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function FarmTasks() {
  const [tasks, setTasks] = useState(getFarmTasks);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('media');
  const [filter, setFilter] = useState('pending');

  const pendingCount = useMemo(() => tasks.filter((task) => task.status !== 'done').length, [tasks]);
  const doneCount = useMemo(() => tasks.filter((task) => task.status === 'done').length, [tasks]);
  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    if (filter === 'done') return tasks.filter((task) => task.status === 'done');
    return tasks.filter((task) => task.status !== 'done');
  }, [filter, tasks]);

  useEffect(() => {
    const handleSync = (event) => setTasks(event.detail);
    window.addEventListener(STORAGE_EVENTS.tasks, handleSync);
    return () => window.removeEventListener(STORAGE_EVENTS.tasks, handleSync);
  }, []);

  const persist = (nextTasks) => {
    setTasks(nextTasks);
    writeFarmTasks(nextTasks);
  };

  const addTask = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    persist([
      { id: Date.now().toString(), title: title.trim(), priority, status: 'pending', source: 'Manual' },
      ...tasks,
    ]);
    setTitle('');
    setPriority('media');
  };

  const toggleTask = (id) => {
    persist(tasks.map((task) => (
      task.id === id
        ? { ...task, status: task.status === 'done' ? 'pending' : 'done' }
        : task
    )));
  };

  const deleteTask = (id) => {
    persist(tasks.filter((task) => task.id !== id));
  };

  const addSuggestedRoutine = () => {
    const suggestions = [
      { title: 'Revisar agua y bebederos', priority: 'alta', source: 'IA' },
      { title: 'Confirmar produccion de huevos', priority: 'alta', source: 'IA' },
      { title: 'Registrar alimento consumido', priority: 'media', source: 'Rutina' },
      { title: 'Limpiar nidos y retirar huevos rotos', priority: 'media', source: 'Rutina' },
    ];
    const existingTitles = new Set(tasks.map((task) => task.title.toLowerCase()));
    const nextSuggestions = suggestions
      .filter((task) => !existingTitles.has(task.title.toLowerCase()))
      .map((task, index) => ({
        id: `${Date.now()}-${index}`,
        status: 'pending',
        ...task,
      }));

    if (nextSuggestions.length) {
      persist([...nextSuggestions, ...tasks]);
      setFilter('pending');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            <ClipboardCheck size={13} />
            Tareas del dia
          </div>
          <h3 className="text-lg font-black text-slate-900">Rutina operativa</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Acciones recomendadas por IA y tareas manuales para el criadero.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700">
            {pendingCount} pendientes
          </span>
          <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
            {doneCount} hechas
          </span>
        </div>
      </div>

      <form onSubmit={addTask} className="mb-4 grid gap-2 sm:grid-cols-[1fr_120px_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="input-field"
          placeholder="Ej: Desinfectar bandejas de huevos"
        />
        <select value={priority} onChange={(event) => setPriority(event.target.value)} className="input-field">
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <button type="submit" className="btn-primary justify-center">
          <Plus size={16} />
          Agregar
        </button>
      </form>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {[
            { id: 'pending', label: 'Pendientes' },
            { id: 'done', label: 'Hechas' },
            { id: 'all', label: 'Todas' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-xs font-black transition-all',
                filter === item.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={addSuggestedRoutine}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-700 transition-all hover:bg-amber-100"
        >
          <Sparkles size={13} />
          Generar rutina IA
        </button>
      </div>

      <div className="space-y-2">
        {filteredTasks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
              <Filter size={18} />
            </div>
            <p className="text-sm font-black text-slate-900">
              {tasks.length === 0 ? 'Aun no tienes tareas' : 'No hay tareas en este filtro'}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-xs font-medium leading-relaxed text-slate-500">
              Agrega una tarea manual o genera una rutina sugerida para iniciar el control diario del criadero.
            </p>
            <button type="button" onClick={addSuggestedRoutine} className="btn-secondary mx-auto mt-4 text-xs">
              <Sparkles size={13} />
              Crear rutina inicial
            </button>
          </div>
        )}

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={clsx(
              'flex items-center gap-3 rounded-xl border p-3 transition-all',
              task.status === 'done' ? 'border-slate-100 bg-slate-50 opacity-70' : 'border-slate-200 bg-white',
            )}
          >
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              className={clsx(
                'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border transition-all',
                task.status === 'done'
                  ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-emerald-600',
              )}
            >
              <CheckCircle2 size={17} />
            </button>
            <div className="min-w-0 flex-1">
              <p className={clsx('text-sm font-black leading-tight', task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900')}>
                {task.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className={clsx('rounded-full border px-2 py-0.5 text-[10px] font-black uppercase', priorityStyles[task.priority])}>
                  {task.priority}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  {task.source === 'IA' && <Sparkles size={10} />}
                  {task.source}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
              aria-label="Eliminar tarea"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
