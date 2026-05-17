import { isSupabaseConfigured, supabase } from './supabaseClient';

function logRemoteError(action, error) {
  if (error) {
    console.warn(`[Supabase] ${action} failed:`, error.message);
  }
}

async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id;
}

// --- Mappers ---

function toProductionRow(record, userId) {
  return {
    id: String(record.id),
    user_id: userId,
    date: record.date,
    eggs: Number(record.eggs || 0),
    damaged: Number(record.damaged || 0),
    note: record.note || null,
    updated_at: new Date().toISOString(),
  };
}

function fromProductionRow(row) {
  return {
    id: row.id,
    date: row.date,
    eggs: Number(row.eggs || 0),
    damaged: Number(row.damaged || 0),
    note: row.note || '',
  };
}

function toFeedRow(record, userId) {
  return {
    id: String(record.id),
    user_id: userId,
    date: record.date,
    kg: Number(record.kg || 0),
    cost_per_kg: Number(record.costPerKg || 0),
    note: record.note || null,
    updated_at: new Date().toISOString(),
  };
}

function fromFeedRow(row) {
  return {
    id: row.id,
    date: row.date,
    kg: Number(row.kg || 0),
    costPerKg: Number(row.cost_per_kg || 0),
    note: row.note || '',
  };
}

function toTaskRow(task, userId) {
  return {
    id: String(task.id),
    user_id: userId,
    title: task.title,
    priority: task.priority || 'media',
    status: task.status || 'pending',
    source: task.source || 'Manual',
    updated_at: new Date().toISOString(),
  };
}

function fromTaskRow(row) {
  return {
    id: row.id,
    title: row.title,
    priority: row.priority,
    status: row.status,
    source: row.source,
  };
}

function toCalculatorRow(values, userId) {
  return {
    user_id: userId,
    daily_eggs: Number(values.dailyEggs || 0),
    egg_price: Number(values.eggPrice || 0),
    tray_size: Number(values.traySize || 0),
    month_days: Number(values.monthDays || 0),
    feed_cost: Number(values.feedCost || 0),
    other_costs: Number(values.otherCosts || 0),
    flock_size: Number(values.flockSize || 0),
    loss_rate: Number(values.lossRate || 0),
    updated_at: new Date().toISOString(),
  };
}

function fromCalculatorRow(row) {
  return {
    dailyEggs: Number(row.daily_eggs || 0),
    eggPrice: Number(row.egg_price || 0),
    traySize: Number(row.tray_size || 0),
    monthDays: Number(row.month_days || 0),
    feedCost: Number(row.feed_cost || 0),
    otherCosts: Number(row.other_costs || 0),
    flockSize: Number(row.flock_size || 0),
    lossRate: Number(row.loss_rate || 0),
  };
}

function toModuleRow(module, userId) {
  return {
    id: String(module.id),
    user_id: userId,
    name: module.name,
    species: module.species,
    breed: module.breed,
    age: module.age,
    weight: module.weight,
    status: module.status,
    status_type: module.statusType,
    emoji: module.emoji,
    code: module.code,
    flock_size: Number(module.flockSize || 0),
    efficiency: module.efficiency,
    notes: module.notes,
  };
}

function fromModuleRow(row) {
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    breed: row.breed,
    age: row.age,
    weight: row.weight,
    status: row.status,
    statusType: row.status_type,
    emoji: row.emoji,
    code: row.code,
    flockSize: row.flock_size,
    efficiency: row.efficiency,
    notes: row.notes,
  };
}

// --- Sync Functions ---

export async function loadRemoteDataset() {
  if (!isSupabaseConfigured) return null;
  const userId = await getUserId();
  if (!userId) return null;

  const [
    productionResult,
    feedResult,
    tasksResult,
    calculatorResult,
    modulesResult,
  ] = await Promise.all([
    supabase.from('production_records').select('*').eq('user_id', userId).order('date'),
    supabase.from('feed_records').select('*').eq('user_id', userId).order('date'),
    supabase.from('farm_tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('calculator_settings').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('livestock_modules').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ]);

  [productionResult, feedResult, tasksResult, calculatorResult, modulesResult].forEach((result) => {
    logRemoteError('load dataset', result.error);
  });

  if (productionResult.error || feedResult.error || tasksResult.error || calculatorResult.error || modulesResult.error) {
    return null;
  }

  return {
    production: productionResult.data.map(fromProductionRow),
    feed: feedResult.data.map(fromFeedRow),
    tasks: tasksResult.data.map(fromTaskRow),
    calculator: calculatorResult.data ? fromCalculatorRow(calculatorResult.data) : null,
    modules: modulesResult.data.map(fromModuleRow),
  };
}

export async function syncProductionRemote(records) {
  if (!isSupabaseConfigured) return;
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('production_records')
    .upsert(records.map(r => toProductionRow(r, userId)), { onConflict: 'user_id,id' });
  logRemoteError('sync production', error);
}

export async function syncFeedRemote(records) {
  if (!isSupabaseConfigured) return;
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('feed_records')
    .upsert(records.map(r => toFeedRow(r, userId)), { onConflict: 'user_id,id' });
  logRemoteError('sync feed', error);
}

export async function syncTasksRemote(tasks) {
  if (!isSupabaseConfigured) return;
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('farm_tasks')
    .upsert(tasks.map(t => toTaskRow(t, userId)), { onConflict: 'user_id,id' });
  logRemoteError('sync tasks', error);
}

export async function deleteTaskRemote(taskId) {
  if (!isSupabaseConfigured) return;
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('farm_tasks')
    .delete()
    .eq('user_id', userId)
    .eq('id', String(taskId));
  logRemoteError('delete task', error);
}

export async function syncCalculatorRemote(values) {
  if (!isSupabaseConfigured) return;
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('calculator_settings')
    .upsert(toCalculatorRow(values, userId), { onConflict: 'user_id' });
  logRemoteError('sync calculator', error);
}

export async function syncModulesRemote(modules) {
  if (!isSupabaseConfigured) return;
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('livestock_modules')
    .upsert(modules.map(m => toModuleRow(m, userId)), { onConflict: 'user_id,id' });
  logRemoteError('sync modules', error);
}

export async function saveAIMessageRemote(message) {
  if (!isSupabaseConfigured) return;
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('ai_messages')
    .insert({
      user_id: userId,
      role: message.role,
      text: message.text,
      media_type: message.mediaType || null,
    });
  logRemoteError('save ai message', error);
}
