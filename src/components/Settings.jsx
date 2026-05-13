import { useState } from 'react';
import { Save, Bell, Bot, User, Building2, Check } from 'lucide-react';
import { clsx } from 'clsx';

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-200">
        <Icon size={18} className="text-emerald-600" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

function Toggle({ id, checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5 font-medium">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 flex-shrink-0 shadow-inner border border-transparent',
          checked ? 'bg-emerald-500' : 'bg-slate-200 border-slate-300',
        )}
      >
        <span
          className={clsx(
            'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Admin Granja',
    email: 'admin@petguide.pe',
    farm: 'Granja Los Andes',
    region: 'Puno',
    ruc: '20987654321',
    phone: '+51 951 234 567',
  });

  const [notifications, setNotifications] = useState({
    vaccineAlerts: true,
    senasaAlerts: true,
    marketPrices: false,
    weeklyReport: true,
    emailNotifs: false,
  });

  const [aiPrefs, setAiPrefs] = useState({
    detailedResponses: true,
    showSources: false,
    spanishOnly: true,
    autoSuggest: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configuración</h2>
        <p className="text-slate-500 mt-1 font-medium">Gestiona tu perfil, notificaciones y preferencias de la IA</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile section */}
        <div className="glass-card p-6 bg-white">
          <SectionHeader icon={User} title="Perfil Personal" subtitle="Tu información de acceso y contacto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'settings-name', field: 'name', label: 'Nombre completo', placeholder: 'Tu nombre' },
              { id: 'settings-email', field: 'email', label: 'Correo electrónico', placeholder: 'correo@ejemplo.com', type: 'email' },
              { id: 'settings-phone', field: 'phone', label: 'Teléfono', placeholder: '+51 9XX XXX XXX' },
              { id: 'settings-region', field: 'region', label: 'Región', placeholder: 'Ej: Puno, Cusco' },
            ].map(({ id, field, label, placeholder, type = 'text' }) => (
              <div key={field}>
                <label htmlFor={id} className="text-xs text-slate-700 mb-1.5 block font-bold">
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  value={profile[field]}
                  onChange={(e) => handleProfileChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Farm / organization */}
        <div className="glass-card p-6 bg-white">
          <SectionHeader icon={Building2} title="Datos del Predio / Empresa" subtitle="Información de tu granja u organización" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'settings-farm', field: 'farm', label: 'Nombre del predio / empresa', placeholder: 'Ej: Granja Los Andes' },
              { id: 'settings-ruc', field: 'ruc', label: 'RUC / DNI Contribuyente', placeholder: 'Ej: 20987654321' },
            ].map(({ id, field, label, placeholder }) => (
              <div key={field}>
                <label htmlFor={id} className="text-xs text-slate-700 mb-1.5 block font-bold">
                  {label}
                </label>
                <input
                  id={id}
                  type="text"
                  value={profile[field]}
                  onChange={(e) => handleProfileChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6 bg-white">
          <SectionHeader icon={Bell} title="Notificaciones" subtitle="Controla qué alertas y avisos recibirás" />
          <div className="space-y-0">
            <Toggle
              id="toggle-vaccine-alerts"
              checked={notifications.vaccineAlerts}
              onChange={(v) => setNotifications((p) => ({ ...p, vaccineAlerts: v }))}
              label="Alertas de vacunas próximas"
              description="Aviso 7 días antes de cada vacuna programada"
            />
            <Toggle
              id="toggle-senasa-alerts"
              checked={notifications.senasaAlerts}
              onChange={(v) => setNotifications((p) => ({ ...p, senasaAlerts: v }))}
              label="Alertas sanitarias SENASA"
              description="Notificación inmediata ante brotes o emergencias"
            />
            <Toggle
              id="toggle-market-prices"
              checked={notifications.marketPrices}
              onChange={(v) => setNotifications((p) => ({ ...p, marketPrices: v }))}
              label="Variaciones de precios de mercado"
              description="Alertas cuando los precios cambien más del 5%"
            />
            <Toggle
              id="toggle-weekly-report"
              checked={notifications.weeklyReport}
              onChange={(v) => setNotifications((p) => ({ ...p, weeklyReport: v }))}
              label="Reporte semanal de bienestar"
              description="Resumen del estado de todos tus animales"
            />
            <Toggle
              id="toggle-email-notifs"
              checked={notifications.emailNotifs}
              onChange={(v) => setNotifications((p) => ({ ...p, emailNotifs: v }))}
              label="Notificaciones por correo electrónico"
              description="Recibe las alertas también en tu email"
            />
          </div>
        </div>

        {/* AI preferences */}
        <div className="glass-card p-6 bg-white">
          <SectionHeader icon={Bot} title="Preferencias VetCoach IA" subtitle="Personaliza el comportamiento del asistente" />
          <div className="space-y-0">
            <Toggle
              id="toggle-detailed"
              checked={aiPrefs.detailedResponses}
              onChange={(v) => setAiPrefs((p) => ({ ...p, detailedResponses: v }))}
              label="Respuestas detalladas"
              description="Incluir protocolos completos y tablas de referencia"
            />
            <Toggle
              id="toggle-sources"
              checked={aiPrefs.showSources}
              onChange={(v) => setAiPrefs((p) => ({ ...p, showSources: v }))}
              label="Mostrar fuentes y referencias"
              description="Añadir citas de guías SENASA, INIA u otras fuentes"
            />
            <Toggle
              id="toggle-spanish"
              checked={aiPrefs.spanishOnly}
              onChange={(v) => setAiPrefs((p) => ({ ...p, spanishOnly: v }))}
              label="Responder siempre en español"
              description="Forzar respuestas en español sin importar el idioma de consulta"
            />
            <Toggle
              id="toggle-autoSuggest"
              checked={aiPrefs.autoSuggest}
              onChange={(v) => setAiPrefs((p) => ({ ...p, autoSuggest: v }))}
              label="Sugerencias automáticas"
              description="Mostrar preguntas sugeridas en el chat"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-4">
          <button
            id="save-settings-btn"
            type="submit"
            className={clsx(
              'btn-primary px-6 py-2.5',
              saved && 'bg-emerald-700 pointer-events-none',
            )}
          >
            {saved ? (
              <>
                <Check size={16} />
                ¡Guardado!
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar Cambios
              </>
            )}
          </button>
          {saved && (
            <p className="text-sm text-emerald-600 font-bold animate-fade-in">
              Configuración actualizada correctamente.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
