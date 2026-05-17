import { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ChevronDown,
  DollarSign,
  Eye,
  Filter,
  Gauge,
  Leaf,
  Plus,
  Search,
  Sparkles,
  ThermometerSun,
  UserRoundPlus,
  UsersRound,
  X,
} from 'lucide-react';
import { getLivestockModules, addLivestockModule, STORAGE_EVENTS } from '../lib/storage';
import { financialProjection } from '../data/mockData';
import { clsx } from 'clsx';

const statusConfig = {
  success: { class: 'badge-success' },
  warning: { class: 'badge-warning' },
  danger: { class: 'badge-danger' },
  info: { class: 'badge-info' },
};

const speciesOptions = ['Todos', 'Aves de postura', 'Aves de carne', 'Aves menores', 'Aves acuaticas', 'Expansion'];

function ModuleCard({ module, onViewDetail }) {
  return (
    <div
      id={`pet-card-${module.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg sm:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-amber-50 text-3xl shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
            <span aria-hidden="true">{module.emoji || '🐔'}</span>
            <span className="absolute -bottom-1 -right-1 rounded-md border border-emerald-100 bg-white px-1.5 py-0.5 text-[10px] font-black text-emerald-700 shadow-sm">
              {module.code}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black leading-tight text-slate-900 transition-colors group-hover:text-emerald-700 sm:text-base">
              {module.name}
            </h3>
            <p className="text-xs font-medium text-slate-500">{module.species}</p>
          </div>
        </div>
        <span className={clsx('badge max-w-[112px] shrink-0 justify-center text-center leading-tight', statusConfig[module.statusType]?.class || 'badge-info')}>
          {module.status}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {[
          { label: 'Lote', value: module.flockSize || 'Config.' },
          { label: 'Produccion', value: module.production || '0' },
          { label: 'Eficiencia', value: module.efficiency || '0%' },
          { label: 'Alertas', value: module.alerts || 0 },
        ].map(({ label, value }) => (
          <div key={label} className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="mb-1 text-[11px] font-bold uppercase text-slate-400">{label}</p>
            <p className="text-xs font-black leading-tight text-slate-800 sm:truncate">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 p-3">
        <div className="flex items-center gap-2 text-amber-700">
          <Sparkles size={14} />
          <span className="text-xs font-black">Recomendacion IA</span>
        </div>
        <p className="mt-2 line-clamp-2 text-xs font-medium leading-relaxed text-slate-700">{module.notes}</p>
      </div>

      <div className="mt-auto flex gap-2">
        <button onClick={() => onViewDetail(module)} className="btn-secondary flex-1 justify-center text-sm">
          <Eye size={14} />
          Ver modulo
        </button>
      </div>
    </div>
  );
}

function ModuleDetailModal({ module, onClose }) {
  if (!module) return null;

  const isLayerModule = module.name.includes('Ponedoras');
  const recommendations = isLayerModule
    ? [
        'Mantener 14 a 16 horas de luz constante para estabilizar postura.',
        'Revisar bebederos dos veces al dia si la temperatura supera 28 C.',
        'Registrar huevos por la manana y tarde para detectar bajas reales.',
      ]
    : [
        'Registrar consumo diario y peso promedio para ajustar conversion alimenticia.',
        'Vigilar ventilacion, densidad y limpieza para reducir riesgo sanitario.',
        'Comparar produccion semanal contra objetivo del modulo.',
      ];

  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        id="pet-detail-modal"
        className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-4 shadow-2xl animate-slide-up sm:max-h-[90vh] sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />
        <div className="sticky top-0 z-10 -mx-4 mb-4 border-b border-slate-100 bg-white/95 px-4 pb-4 backdrop-blur sm:static sm:mx-0 sm:mb-6 sm:border-b-0 sm:bg-transparent sm:px-0 sm:pb-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-amber-50 text-4xl shadow-sm sm:h-16 sm:w-16">
              <span aria-hidden="true">{module.emoji || '🐔'}</span>
              <span className="absolute -bottom-1 -right-1 rounded-md border border-emerald-100 bg-white px-1.5 py-0.5 text-[10px] font-black text-emerald-700 shadow-sm">
                {module.code}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black leading-tight text-slate-900 sm:text-xl">{module.name}</h2>
              <p className="text-sm font-medium text-slate-500">{module.species} · {module.breed || 'N/A'}</p>
              <span className={clsx('badge mt-2', statusConfig[module.statusType]?.class || 'badge-info')}>
                {module.status}
              </span>
            </div>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'Produccion', value: module.production || '0', icon: BarChart3 },
            { label: 'Monitoreo', value: `${module.flockSize || '0'} animales`, icon: Activity },
            { label: 'Alertas IA', value: module.alerts || 0, icon: AlertTriangle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <Icon size={17} className="mb-3 text-emerald-600" />
              <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
              <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-white p-4">
            <p className="text-xs font-black uppercase text-slate-400">Detalles del módulo</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">
              Edad: {module.age || 'N/A'} · Peso: {module.weight || 'N/A'}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-black uppercase text-emerald-700">IA pecuaria</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">{module.notes}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <Gauge size={17} className="mb-3 text-emerald-600" />
            <p className="text-xs font-black uppercase text-slate-400">Rendimiento</p>
            <p className="mt-1 text-sm font-black text-slate-900">{module.efficiency}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <Leaf size={17} className="mb-3 text-emerald-600" />
            <p className="text-xs font-black uppercase text-slate-400">Alimentacion sugerida</p>
            <p className="mt-1 text-sm font-black text-slate-900">
              {isLayerModule ? '110-120 g/ave/dia' : 'Segun peso y edad'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <ThermometerSun size={17} className="mb-3 text-amber-600" />
            <p className="text-xs font-black uppercase text-slate-400">Riesgo actual</p>
            <p className="mt-1 text-sm font-black text-slate-900">
              {module.alerts > 0 ? 'Requiere vigilancia' : 'Estable'}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-amber-700">
              <Sparkles size={16} />
              <p className="text-xs font-black uppercase">Plan sugerido por IA</p>
            </div>
            <div className="space-y-2">
              {recommendations.map((item) => (
                <div key={item} className="flex gap-2 text-sm font-medium leading-relaxed text-slate-700">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-emerald-700">
              <DollarSign size={16} />
              <p className="text-xs font-black uppercase">Impacto economico</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">Ingreso mes</p>
                <p className="text-sm font-black text-slate-900">S/ {financialProjection.monthlyIncome}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">Utilidad</p>
                <p className="text-sm font-black text-slate-900">S/ {financialProjection.netProfit}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">Margen</p>
                <p className="text-sm font-black text-slate-900">{financialProjection.margin}%</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">Precio huevo</p>
                <p className="text-sm font-black text-slate-900">S/ {financialProjection.eggPrice}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-950 p-4 text-white">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays size={16} className="text-emerald-300" />
            <p className="text-xs font-black uppercase text-slate-300">Proximas acciones</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {['Confirmar produccion de hoy', 'Subir foto del nido', 'Revisar agua y temperatura'].map((task) => (
              <div key={task} className="rounded-lg border border-white/10 bg-white/[0.06] p-3 text-xs font-bold text-slate-200">
                {task}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewAnimalModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [registrationMode, setRegistrationMode] = useState('batch');
  const [individuals, setIndividuals] = useState([
    { id: 1, code: 'AVE-001', name: '', note: '' },
  ]);

  const [selectedSpecies, setSelectedSpecies] = useState('');

  const isMeatBird = selectedSpecies === 'Pollos de Engorde';

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    
    const newModule = {
      name: fd.get('name'),
      species: fd.get('species'),
      flockSize: Number(fd.get('flockSize') || 0),
      productionGoal: fd.get('productionGoal'),
      location: fd.get('location'),
      notes: fd.get('notes'),
      emoji: isMeatBird ? '🍗' : '🐔',
      code: 'MOD',
      status: 'Activo',
      statusType: 'success',
      efficiency: '0%',
      alerts: 0
    };

    addLivestockModule(newModule);
    setSubmitted(true);
    setTimeout(onClose, 1600);
  };

  const updateIndividual = (id, field, value) => {
    setIndividuals((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addIndividual = () => {
    setIndividuals((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        code: `AVE-${String(prev.length + 1).padStart(3, '0')}`,
        name: '',
        note: '',
      },
    ]);
  };

  const removeIndividual = (id) => {
    setIndividuals((prev) => (prev.length === 1 ? prev : prev.filter((item) => item.id !== id)));
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        id="new-animal-modal"
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-4 shadow-2xl animate-slide-up sm:max-h-[90vh] sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Nuevo modulo pecuario</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Sparkles size={26} />
            </div>
            <p className="text-lg font-black text-emerald-700">Modulo preparado</p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {registrationMode === 'batch'
                ? 'El lote queda listo para monitoreo por cantidad.'
                : `${individuals.length} registro${individuals.length > 1 ? 's' : ''} individual${individuals.length > 1 ? 'es' : ''} listo${individuals.length > 1 ? 's' : ''} para seguimiento.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'batch',
                    label: 'Por cantidad',
                    description: 'Ideal para lotes o galpones',
                    icon: UsersRound,
                  },
                  {
                    id: 'individual',
                    label: 'Uno por uno',
                    description: 'Seguimiento animal individual',
                    icon: UserRoundPlus,
                  },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isActive = registrationMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setRegistrationMode(mode.id)}
                      className={clsx(
                        'rounded-xl border p-3 text-left transition-all duration-200',
                        isActive
                           ? 'border-emerald-300 bg-white text-emerald-800 shadow-sm'
                          : 'border-transparent bg-transparent text-slate-600 hover:bg-white',
                      )}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Icon size={16} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                        <span className="text-sm font-black">{mode.label}</span>
                      </div>
                      <p className="text-[11px] font-medium leading-snug text-slate-500">{mode.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Nombre del modulo *</label>
                <input name="name" required className="input-field" placeholder={registrationMode === 'batch' ? 'Ej: Ponedoras lote B' : 'Ej: Ponedoras reproductoras'} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Tipo *</label>
                <select 
                  name="species" 
                  required 
                  className="input-field"
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option>Gallinas Ponedoras</option>
                  <option>Pollos de Engorde</option>
                  <option>Codornices</option>
                  <option>Patos</option>
                  <option>Otra especie</option>
                </select>
              </div>
              {registrationMode === 'batch' ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Cantidad *</label>
                    <input name="flockSize" required className="input-field" inputMode="numeric" placeholder="Ej: 120" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      {isMeatBird ? 'Objetivo de Peso' : 'Objetivo productivo'}
                    </label>
                    <input 
                      name="productionGoal" 
                      className="input-field" 
                      placeholder={isMeatBird ? 'Ej: 2.8 kg / 45 dias' : 'Ej: 40 huevos/dia'} 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Ubicacion</label>
                    <input name="location" className="input-field" placeholder="Ej: Jaula A / corral 1" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Objetivo individual</label>
                    <input name="individualGoal" className="input-field" placeholder="Ej: postura, peso, sanidad" />
                  </div>
                </>
              )}
            </div>

            {registrationMode === 'individual' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-900">Animales individuales</p>
                    <p className="text-xs font-medium text-slate-500">Agrega codigo, nombre o nota de identificacion.</p>
                  </div>
                  <button type="button" onClick={addIndividual} className="btn-secondary px-3 py-2 text-xs">
                    <Plus size={13} />
                    Agregar
                  </button>
                </div>
                <div className="space-y-3">
                  {individuals.map((item, index) => (
                    <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-500">Animal {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeIndividual(item.id)}
                          disabled={individuals.length === 1}
                          className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-white hover:text-red-600 disabled:opacity-40"
                          aria-label="Eliminar animal"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input
                          className="input-field py-2.5 text-sm"
                          value={item.code}
                          onChange={(e) => updateIndividual(item.id, 'code', e.target.value)}
                          placeholder="Codigo"
                        />
                        <input
                          className="input-field py-2.5 text-sm"
                          value={item.name}
                          onChange={(e) => updateIndividual(item.id, 'name', e.target.value)}
                          placeholder="Nombre opcional"
                        />
                        <input
                          className="input-field py-2.5 text-sm"
                          value={item.note}
                          onChange={(e) => updateIndividual(item.id, 'note', e.target.value)}
                          placeholder="Nota"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">Notas para IA</label>
              <textarea
                name="notes"
                className="input-field min-h-24 resize-none"
                placeholder={
                  registrationMode === 'batch'
                    ? 'Rutina, alimento, ubicacion del galpon...'
                    : 'Criterios de identificacion, revisiones o comportamiento...'
                }
              />
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
                Cancelar
              </button>
              <button id="submit-new-pet" type="submit" className="btn-primary flex-1 justify-center">
                <Plus size={14} />
                Crear modulo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PetLibrary() {
  const [modules, setModules] = useState([]);
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('Todos');
  const [selectedModule, setSelectedModule] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    const loadModules = () => setModules(getLivestockModules());
    loadModules();
    window.addEventListener(STORAGE_EVENTS.modules, loadModules);
    return () => window.removeEventListener(STORAGE_EVENTS.modules, loadModules);
  }, []);

  const filtered = useMemo(() => {
    return modules.filter((module) => {
      const haystack = `${module.name} ${module.species} ${module.breed} ${module.ownerName}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      const matchesSpecies = speciesFilter === 'Todos' || module.species === speciesFilter;
      return matchesSearch && matchesSpecies;
    });
  }, [modules, search, speciesFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Biblioteca Pecuaria IA</h2>
          <p className="mt-1 font-medium text-slate-500">
            {filtered.length} de {modules.length} modulos con produccion, historial y monitoreo.
          </p>
        </div>
        <button id="btn-new-animal" onClick={() => setShowNewModal(true)} className="btn-primary w-full justify-center sm:w-auto">
          <Plus size={16} />
          Nuevo modulo
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="pet-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar especie, lote, raza o modulo..."
              className="input-field pl-9"
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              id="species-filter"
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="input-field w-full cursor-pointer appearance-none pl-8 pr-8 font-medium text-slate-700 sm:w-52"
            >
              {speciesOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((module) => (
            <ModuleCard key={module.id} module={module} onViewDetail={setSelectedModule} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-black text-slate-900">Sin resultados</p>
          <p className="mt-1 text-sm font-medium text-slate-500">No se encontraron modulos con "{search}".</p>
          <button onClick={() => { setSearch(''); setSpeciesFilter('Todos'); }} className="btn-secondary mx-auto mt-4">
            Limpiar filtros
          </button>
        </div>
      )}

      {selectedModule && <ModuleDetailModal module={selectedModule} onClose={() => setSelectedModule(null)} />}
      {showNewModal && <NewAnimalModal onClose={() => setShowNewModal(false)} />}
    </div>
  );
}
