import DailyProduction from './DailyProduction';
import FarmTasks from './FarmTasks';
import FeedRegistration from './FeedRegistration';

export default function Records() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Registros Operativos</h2>
        <p className="max-w-3xl text-sm font-medium leading-relaxed text-slate-500">
          Produccion, alimentacion y tareas del dia en un solo lugar. Todo queda guardado localmente para trabajar incluso sin conexion.
        </p>
      </div>

      <DailyProduction />

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <FeedRegistration />
        <FarmTasks />
      </div>
    </div>
  );
}
