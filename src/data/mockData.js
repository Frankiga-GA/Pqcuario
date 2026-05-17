export const productionSummary = {
  date: new Date().toISOString().split('T')[0],
  flock: 0,
  dailyEggs: 0,
  expectedEggs: 0,
  weeklyAverage: 0,
  productionRate: 0,
  feedKg: 0,
  waterLiters: 0,
  temperature: 0,
  humidity: 0,
  offlineRecords: 0,
  aiConfidence: 0,
};

export const productionTrend = [
  { day: 'Vie', eggs: 0, expected: 0 },
  { day: 'Sab', eggs: 0, expected: 0 },
  { day: 'Dom', eggs: 0, expected: 0 },
  { day: 'Lun', eggs: 0, expected: 0 },
  { day: 'Mar', eggs: 0, expected: 0 },
  { day: 'Mie', eggs: 0, expected: 0 },
  { day: 'Hoy', eggs: 0, expected: 0 },
];

export const aiAlerts = [];

export const financialProjection = {
  eggPrice: 0,
  dailyIncome: 0,
  monthlyIncome: 0,
  feedCost: 0,
  otherCosts: 0,
  netProfit: 0,
  margin: 0,
};

export const quickHistory = [];

export const livestockModules = [];

export const mockPets = [];

export const visualHistory = [];

export const marketNews = [];

export const aiResponses = {
  produccion: {
    keywords: ['huevo', 'huevos', 'produccion', 'recogi', 'postura', 'registro', 'registre'],
    responses: [
      'Esperando datos de producción para analizar...',
    ],
  },
  finanzas: {
    keywords: ['ganar', 'ganare', 'ingreso', 'utilidad', 'margen', 'precio', 'venta', 'mes'],
    responses: [
      'Registra datos en la calculadora para ver proyecciones financieras.',
    ],
  },
  default: [
    '**Hola, soy IAVet Agro IA.**\n\nEstoy listo para operar con tus datos reales de Supabase.',
  ],
};

export const recentActivity = [];
