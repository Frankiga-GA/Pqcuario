import { useState } from 'react';
import { Search, Plus, Eye, Filter, X, ChevronDown } from 'lucide-react';
import { mockPets } from '../data/mockData';
import { clsx } from 'clsx';

const statusConfig = {
  success: { class: 'badge-success', label: '' },
  warning: { class: 'badge-warning', label: '' },
  danger: { class: 'badge-danger', label: '' },
  info: { class: 'badge-info', label: '' },
};

const speciesOptions = ['Todos', 'Perro', 'Gato', 'Vaca', 'Alpaca', 'Pez'];

function PetCard({ pet, onViewDetail }) {
  return (
    <div
      id={`pet-card-${pet.id}`}
      className="glass-card p-5 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 
                 group hover:-translate-y-1 flex flex-col bg-white"
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl',
              'bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform duration-300',
            )}
          >
            {pet.emoji}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">{pet.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{pet.species}</p>
          </div>
        </div>
        <span className={clsx('badge', statusConfig[pet.statusType]?.class || 'badge-info')}>
          {pet.status}
        </span>
      </div>

      {/* Pet details */}
      <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
        {[
          { label: 'Raza', value: pet.breed },
          { label: 'Edad', value: pet.age },
          { label: 'Peso', value: pet.weight },
          { label: 'Dueño', value: pet.ownerName.split(' ')[0] },
        ].map(({ label, value }) => (
          <div key={label} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 mb-0.5 font-medium">{label}</p>
            <p className="text-xs font-bold text-slate-800 truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Next vaccine */}
      <div className="flex items-center justify-between mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-100">
        <span className="text-xs text-slate-600 font-semibold">Próxima vacuna</span>
        <span className="text-xs font-bold text-amber-700">
          {pet.nextVaccine === 'N/A'
            ? 'N/A'
            : new Date(pet.nextVaccine).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Notes */}
      <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">{pet.notes}</p>

      {/* Actions */}
      <button
        onClick={() => onViewDetail(pet)}
        className="btn-secondary w-full justify-center text-sm py-2"
      >
        <Eye size={14} />
        Ver Detalle
      </button>
    </div>
  );
}

function PetDetailModal({ pet, onClose }) {
  if (!pet) return null;
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="pet-detail-modal"
        className="glass-card w-full max-w-lg p-6 animate-slide-up bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-4xl">
              {pet.emoji}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{pet.name}</h2>
              <p className="text-slate-500 text-sm font-medium">{pet.species} · {pet.breed}</p>
              <span className={clsx('badge mt-1.5', statusConfig[pet.statusType]?.class || 'badge-info')}>
                {pet.status}
              </span>
            </div>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Edad', value: pet.age },
            { label: 'Peso', value: pet.weight },
            { label: 'Dueño', value: pet.ownerName },
            { label: 'DNI Dueño', value: pet.ownerDni },
            { label: 'Último Chequeo', value: new Date(pet.lastCheckup).toLocaleDateString('es-PE') },
            { label: 'Próxima Vacuna', value: pet.nextVaccine === 'N/A' ? 'N/A' : new Date(pet.nextVaccine).toLocaleDateString('es-PE') },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1 font-medium">{label}</p>
              <p className="text-sm font-bold text-slate-800">{value}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs text-blue-700 mb-2 font-bold uppercase tracking-wide">Notas clínicas</p>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">{pet.notes}</p>
        </div>
      </div>
    </div>
  );
}

function NewAnimalModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '', species: '', breed: '', age: '', weight: '', ownerName: '', ownerDni: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="new-animal-modal"
        className="glass-card w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Registrar Nuevo Animal</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 animate-fade-in">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-lg font-bold text-emerald-600">¡Animal registrado!</p>
            <p className="text-sm text-slate-500 mt-1">El perfil ha sido guardado correctamente.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-700 mb-1.5 block font-bold">Nombre *</label>
                <input id="new-pet-name" required className="input-field" placeholder="Ej: Luna" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-700 mb-1.5 block font-bold">Especie *</label>
                <select id="new-pet-species" required className="input-field" value={formData.species} onChange={(e) => setFormData({ ...formData, species: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {['Perro', 'Gato', 'Vaca', 'Alpaca', 'Caballo', 'Cerdo', 'Oveja', 'Pez', 'Ave', 'Otro'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-700 mb-1.5 block font-bold">Raza</label>
                <input id="new-pet-breed" className="input-field" placeholder="Ej: Golden Retriever" value={formData.breed} onChange={(e) => setFormData({ ...formData, breed: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-700 mb-1.5 block font-bold">Edad</label>
                <input id="new-pet-age" className="input-field" placeholder="Ej: 3 años" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-700 mb-1.5 block font-bold">Peso</label>
                <input id="new-pet-weight" className="input-field" placeholder="Ej: 28 kg" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-700 mb-1.5 block font-bold">Nombre del Dueño *</label>
                <input id="new-pet-owner" required className="input-field" placeholder="Nombre completo" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-700 mb-1.5 block font-bold">DNI del Dueño</label>
              <input id="new-pet-dni" className="input-field" placeholder="Ej: 45123678" value={formData.ownerDni} onChange={(e) => setFormData({ ...formData, ownerDni: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
                Cancelar
              </button>
              <button id="submit-new-pet" type="submit" className="btn-primary flex-1 justify-center">
                <Plus size={14} />
                Registrar Animal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PetLibrary() {
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('Todos');
  const [selectedPet, setSelectedPet] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const filtered = mockPets.filter((pet) => {
    const matchesSearch =
      !search ||
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase()) ||
      pet.ownerDni.includes(search) ||
      pet.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = speciesFilter === 'Todos' || pet.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mis Animales</h2>
          <p className="text-slate-500 mt-1 font-medium">
            {filtered.length} de {mockPets.length} animales registrados
          </p>
        </div>
        <button
          id="btn-new-animal"
          onClick={() => setShowNewModal(true)}
          className="btn-primary"
        >
          <Plus size={16} />
          Nuevo Animal
        </button>
      </div>

      {/* Search + filter bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3 bg-white">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="pet-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, raza o DNI del dueño..."
            className="input-field pl-9"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            id="species-filter"
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="input-field pl-8 pr-8 appearance-none w-full sm:w-44 cursor-pointer font-medium text-slate-700"
          >
            {speciesOptions.map((s) => (
               <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((pet) => (
            <PetCard key={pet.id} pet={pet} onViewDetail={setSelectedPet} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center bg-white border border-slate-200 border-dashed">
          <p className="text-5xl mb-4 opacity-50">🔍</p>
          <p className="text-slate-900 font-bold text-lg">Sin resultados</p>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            No se encontraron animales con "{search}"
          </p>
          <button onClick={() => { setSearch(''); setSpeciesFilter('Todos'); }} className="btn-secondary mt-4 mx-auto">
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedPet && (
        <PetDetailModal pet={selectedPet} onClose={() => setSelectedPet(null)} />
      )}
      {showNewModal && (
        <NewAnimalModal onClose={() => setShowNewModal(false)} />
      )}
    </div>
  );
}
