import {
  loadRemoteDataset,
  syncCalculatorRemote,
  syncFeedRemote,
  syncProductionRemote,
  syncTasksRemote,
  syncModulesRemote,
} from './remoteStore';

export const STORAGE_KEYS = {
  production: 'iavet-daily-production',
  calculator: 'iavet-egg-calculator',
  calculatorSnapshot: 'iavet-egg-calculator-snapshot',
  feed: 'iavet-feed-records',
  tasks: 'iavet-farm-tasks',
  modules: 'iavet-livestock-modules',
};

export const STORAGE_EVENTS = {
  production: 'iavet-daily-production-sync',
  calculator: 'iavet-egg-calculator-sync',
  feed: 'iavet-feed-records-sync',
  tasks: 'iavet-farm-tasks-sync',
  modules: 'iavet-livestock-modules-sync',
};

export const DEFAULT_PRODUCTION_RECORDS = [];
export const DEFAULT_FEED_RECORDS = [];
export const DEFAULT_TASKS = [];
export const DEFAULT_CALCULATOR_VALUES = {
  dailyEggs: 0,
  eggPrice: 0,
  traySize: 30,
  monthDays: 30,
  feedCost: 0,
  otherCosts: 0,
  flockSize: 0,
  lossRate: 0,
};

function sortByDate(records) {
  return [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Store in-memory for the current session only (No LocalStorage as requested before)
let inMemoryStore = {
  production: [],
  feed: [],
  tasks: [],
  modules: [],
  calculator: { ...DEFAULT_CALCULATOR_VALUES },
};

export function readStore(key, fallback) {
  const type = key.replace('iavet-', '');
  return inMemoryStore[type] || fallback;
}

export function writeStore(key, value, eventName) {
  const type = key.replace('iavet-', '');
  inMemoryStore[type] = value;
  if (eventName) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: value }));
  }
}

// --- Production ---
export function getProductionRecords() {
  return sortByDate(inMemoryStore.production || []);
}

export function writeProductionRecords(records) {
  const sorted = sortByDate(records);
  inMemoryStore.production = sorted;
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.production, { detail: sorted }));
  syncProductionRemote(sorted);
  return sorted;
}

export function upsertProductionRecord(record) {
  return writeProductionRecords([
    ...getProductionRecords().filter((item) => item.date !== record.date),
    record,
  ]);
}

// --- Feed ---
export function getFeedRecords() {
  return sortByDate(inMemoryStore.feed || []);
}

export function writeFeedRecords(records) {
  const sorted = sortByDate(records);
  inMemoryStore.feed = sorted;
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.feed, { detail: sorted }));
  syncFeedRemote(sorted);
  return sorted;
}

export function upsertFeedRecord(record) {
  return writeFeedRecords([
    ...getFeedRecords().filter((item) => item.date !== record.date),
    record,
  ]);
}

// --- Tasks ---
export function getFarmTasks() {
  return inMemoryStore.tasks || [];
}

export function writeFarmTasks(tasks) {
  inMemoryStore.tasks = tasks;
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.tasks, { detail: tasks }));
  syncTasksRemote(tasks);
  return tasks;
}

export function addFarmTask(title, priority = 'media', source = 'IA') {
  return writeFarmTasks([
    { id: Date.now().toString(), title, priority, status: 'pending', source },
    ...getFarmTasks(),
  ]);
}

// --- Livestock Modules ---
export function getLivestockModules() {
  return inMemoryStore.modules || [];
}

export function writeLivestockModules(modules) {
  inMemoryStore.modules = modules;
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.modules, { detail: modules }));
  syncModulesRemote(modules);
  return modules;
}

export function addLivestockModule(module) {
  const modules = getLivestockModules();
  const newModules = [
    { ...module, id: Date.now().toString() },
    ...modules,
  ];
  return writeLivestockModules(newModules);
}

// --- Calculator ---
export function getCalculatorValues() {
  return inMemoryStore.calculator || { ...DEFAULT_CALCULATOR_VALUES };
}

export function writeCalculatorValues(values) {
  inMemoryStore.calculator = values;
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.calculator, { detail: values }));
  syncCalculatorRemote(values);
  return values;
}

export function syncCalculatorDailyEggs(dailyEggs) {
  return writeCalculatorValues({
    ...getCalculatorValues(),
    dailyEggs,
  });
}

// --- AI Context ---
export function getAgroContextForAI() {
  const production = getProductionRecords();
  const calculator = getCalculatorValues();
  const modules = getLivestockModules();
  
  const latest = production.at(-1);
  const previous = production.slice(-8, -1);
  const previousAverage = previous.length
    ? previous.reduce((sum, record) => sum + Number(record.eggs || 0), 0) / previous.length
    : Number(latest?.eggs || 0);
  
  const latestEggs = Number(latest?.eggs || calculator.dailyEggs || 0);
  const damaged = Number(latest?.damaged || 0);
  const dropPercent = previousAverage > 0 ? ((previousAverage - latestEggs) / previousAverage) * 100 : 0;
  const damagedRate = latestEggs > 0 ? (damaged / latestEggs) * 100 : 0;
  
  const sellableEggs = Math.round(
    Number(calculator.dailyEggs || latestEggs)
      * Number(calculator.monthDays || 30)
      * (1 - Number(calculator.lossRate || 0) / 100),
  );
  
  const monthlyIncome = sellableEggs * Number(calculator.eggPrice || 0);
  const totalCosts = Number(calculator.feedCost || 0) + Number(calculator.otherCosts || 0);
  const netProfit = monthlyIncome - totalCosts;
  const margin = monthlyIncome > 0 ? (netProfit / monthlyIncome) * 100 : 0;
  
  const totalAnimals = modules.reduce((sum, m) => sum + (Number(m.flockSize) || 0), 0);
  const breakEvenDaily = Number(calculator.eggPrice || 0) > 0
    ? Math.ceil((totalCosts / Number(calculator.eggPrice || 1)) / Number(calculator.monthDays || 30))
    : 0;

  return {
    production,
    calculator,
    modules,
    moduleCount: modules.length,
    totalAnimals,
    latest,
    previousAverage,
    latestEggs,
    damaged,
    dropPercent,
    damagedRate,
    sellableEggs,
    monthlyIncome,
    totalCosts,
    netProfit,
    margin,
    breakEvenDaily,
  };
}

// --- Hydration ---
export async function hydrateLocalStoreFromRemote() {
  const remote = await loadRemoteDataset();
  if (!remote) return null;

  inMemoryStore.production = remote.production || [];
  inMemoryStore.feed = remote.feed || [];
  inMemoryStore.tasks = remote.tasks || [];
  inMemoryStore.modules = remote.modules || [];
  inMemoryStore.calculator = remote.calculator || { ...DEFAULT_CALCULATOR_VALUES };

  // Notify components that data has arrived
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.production, { detail: inMemoryStore.production }));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.feed, { detail: inMemoryStore.feed }));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.tasks, { detail: inMemoryStore.tasks }));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.modules, { detail: inMemoryStore.modules }));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.calculator, { detail: inMemoryStore.calculator }));

  return remote;
}
