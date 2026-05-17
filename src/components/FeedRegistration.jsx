import { useEffect, useMemo, useState } from 'react';
import { Beef, CheckCircle2, Scale, Wheat } from 'lucide-react';
import { getFeedRecords, STORAGE_EVENTS, upsertFeedRecord } from '../lib/storage';

export default function FeedRegistration() {
  const [records, setRecords] = useState(getFeedRecords);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    kg: 18,
    costPerKg: 1.83,
    flockSize: 120,
    note: '',
  });
  const [saved, setSaved] = useState(false);

  const latest = useMemo(
    () => [...records].sort((a, b) => new Date(a.date) - new Date(b.date)).at(-1),
    [records],
  );

  useEffect(() => {
    const handleSync = (event) => setRecords(event.detail);
    window.addEventListener(STORAGE_EVENTS.feed, handleSync);
    return () => window.removeEventListener(STORAGE_EVENTS.feed, handleSync);
  }, []);

  const metrics = useMemo(() => {
    const kg = Number(latest?.kg || form.kg || 0);
    const costPerKg = Number(latest?.costPerKg || form.costPerKg || 0);
    const flockSize = Math.max(1, Number(form.flockSize || 1));
    const dailyCost = kg * costPerKg;
    const gramsPerBird = (kg * 1000) / flockSize;
    const monthlyCost = dailyCost * 30;

    return { kg, dailyCost, gramsPerBird, monthlyCost };
  }, [latest, form]);

  const updateForm = (field, value) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextRecord = {
      id: form.date,
      date: form.date,
      kg: Math.max(0, Number(form.kg) || 0),
      costPerKg: Math.max(0, Number(form.costPerKg) || 0),
      note: form.note || 'Registro manual',
    };
    const nextRecords = upsertFeedRecord(nextRecord);
    setRecords(nextRecords);
    setSaved(true);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
            <Wheat size={13} />
            Alimentacion
          </div>
          <h3 className="text-lg font-black text-slate-900">Registrar alimento diario</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Controla consumo, costo diario y gramos por ave.
          </p>
        </div>
        <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">
          {metrics.kg.toFixed(1)} kg hoy
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Fecha</span>
              <input type="date" value={form.date} onChange={(event) => updateForm('date', event.target.value)} className="input-field bg-white" required />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Kg consumidos</span>
              <input type="number" min="0" step="0.1" inputMode="decimal" value={form.kg} onChange={(event) => updateForm('kg', event.target.value)} className="input-field bg-white" required />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Costo por kg</span>
              <input type="number" min="0" step="0.01" inputMode="decimal" value={form.costPerKg} onChange={(event) => updateForm('costPerKg', event.target.value)} className="input-field bg-white" required />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Cantidad de aves</span>
              <input type="number" min="1" inputMode="numeric" value={form.flockSize} onChange={(event) => updateForm('flockSize', event.target.value)} className="input-field bg-white" />
            </label>
          </div>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Observacion</span>
            <input value={form.note} onChange={(event) => updateForm('note', event.target.value)} className="input-field bg-white" placeholder="Ej: cambio de proveedor, desperdicio, normal..." />
          </label>
          <button type="submit" className="btn-primary mt-4 w-full justify-center">
            {saved ? <CheckCircle2 size={16} /> : <Wheat size={16} />}
            {saved ? 'Alimento guardado' : 'Guardar alimento'}
          </button>
        </form>

        <div className="rounded-2xl border border-[#12372a] bg-[linear-gradient(180deg,#12372a,#1f4f35)] p-4 text-white">
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            <div className="min-w-0 rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-3">
              <Scale size={17} className="mb-3 text-amber-200" />
              <p className="text-[10px] font-bold uppercase leading-tight text-slate-400">Gramos por ave</p>
              <p className="mt-1 break-words text-lg font-black leading-tight sm:text-xl xl:text-lg 2xl:text-xl">
                {metrics.gramsPerBird.toFixed(0)} g
              </p>
            </div>
            <div className="min-w-0 rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-3">
              <Beef size={17} className="mb-3 text-emerald-200" />
              <p className="text-[10px] font-bold uppercase leading-tight text-slate-400">Costo diario</p>
              <p className="mt-1 break-words text-lg font-black leading-tight sm:text-xl xl:text-lg 2xl:text-xl">
                S/ {metrics.dailyCost.toFixed(2)}
              </p>
            </div>
            <div className="min-w-0 rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-3">
              <Wheat size={17} className="mb-3 text-amber-200" />
              <p className="text-[10px] font-bold uppercase leading-tight text-slate-400">Costo mensual</p>
              <p className="mt-1 break-words text-lg font-black leading-tight sm:text-xl xl:text-lg 2xl:text-xl">
                S/ {metrics.monthlyCost.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#f2d58a]/25 bg-[#d6a84f]/15 p-3">
            <p className="text-xs font-black uppercase text-[#f2d58a]">Lectura IA</p>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-300">
              Para ponedoras, un consumo cercano a 110-120 g por ave/dia suele ser referencia operativa. Si sube mucho sin mejorar postura, revisar desperdicio en tolvas.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {records.slice(-3).reverse().map((record) => (
              <div key={record.id} className="rounded-xl border border-[#f2d58a]/15 bg-white/[0.06] p-3">
                <p className="text-xs font-black text-white">{record.date}: {record.kg} kg</p>
                <p className="mt-1 text-[11px] font-medium text-slate-400">{record.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
