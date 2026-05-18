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
      '¡Claro que sí! Estoy súper atento y esperando tus registros de producción para calcular la postura del día, analizar las tendencias y alertarte sobre la salud de tus aves en el galpón. ¡Vamos a cuidar a tus gallinas juntos! 🐔🥚',
    ],
  },
  finanzas: {
    keywords: ['ganar', 'ganare', 'ingreso', 'utilidad', 'margen', 'precio', 'venta', 'mes'],
    responses: [
      '¡Excelente idea revisar los números de la campaña! Ingresa tus costos de alimento y precios de venta en la calculadora para proyectar tus ingresos, utilidades y margen neto al instante. ¡Hagamos que tu granja rinda al máximo! 💰📈',
    ],
  },
  default: [
    '**¡Hola, amigo productor! 🧑‍🌾 Soy IAVet, tu asistente virtual inteligente.**\n\nEstoy muy feliz de saludarte y listo para ayudarte a monitorear y cuidar tu criadero. 🐔🥚\n\nYa estoy conectado en tiempo real con la información de tu granja. Ahora puedo ayudarte a registrar la producción de huevos, analizar el consumo de alimento y calcular tus ganancias al instante.\n\nEscríbeme con total confianza o mándame una foto/audio desde el campo. ¡Hagamos crecer tu granja juntos! 🚀📈',
  ],
};

export const recentActivity = [];
