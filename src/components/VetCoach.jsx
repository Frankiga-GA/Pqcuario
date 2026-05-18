import { useEffect, useRef, useState } from 'react';
import VisionAssistant from './VisionAssistant';
import {
  Bot,
  Camera,
  CheckCircle2,
  History,
  ImagePlus,
  Loader,
  Mic,
  Send,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { aiResponses, visualHistory } from '../data/mockData';
import { clsx } from 'clsx';
import {
  addFarmTask,
  getAgroContextForAI,
  getFarmTasks,
  getFeedRecords,
  syncCalculatorDailyEggs,
  upsertFeedRecord,
  upsertProductionRecord,
} from '../lib/storage';
import { saveAIMessageRemote } from '../lib/remoteStore';
import { requestIAVetAI, extractJsonObject } from '../lib/aiService';

const SUGGESTED_PROMPTS = [
  'Hoy recogi 35 huevos',
  'Cuanto ganare este mes?',
  'Como va mi produccion?',
  'Que debo revisar hoy?',
  'Muestrame las fotos de ayer',
  'Agrega alimentacion para manana',
];

function formatMoney(value) {
  return `S/ ${Number(value || 0).toFixed(2)}`;
}

function syncProductionFromAI(eggs) {
  const today = new Date().toISOString().slice(0, 10);
  upsertProductionRecord({ id: today, date: today, eggs, damaged: 0, note: 'Registrado desde IAVet IA' });
  syncCalculatorDailyEggs(eggs);
}

function syncFeedFromAI(kg) {
  const today = new Date().toISOString().slice(0, 10);
  upsertFeedRecord({ id: today, date: today, kg, costPerKg: 1.83, note: 'Registrado desde IAVet IA' });
}

function addTaskFromAI(title, priority = 'media') {
  addFarmTask(title, priority, 'IA');
}

function getContextualAIResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  const eggMatch = msg.match(/(\d+)\s*(huevo|huevos)/);
  if (eggMatch && ['recogi', 'recogí', 'registre', 'registré', 'hoy'].some((kw) => msg.includes(kw))) {
    const eggs = Number(eggMatch[1]);
    syncProductionFromAI(eggs);
  }

  const feedMatch = msg.match(/(\d+(?:[.,]\d+)?)\s*(kg|kilos|kilogramos)/);
  if (feedMatch && ['alimento', 'alimentacion', 'balanceado', 'consumio', 'registr'].some((kw) => msg.includes(kw))) {
    const kg = Number(feedMatch[1].replace(',', '.'));
    syncFeedFromAI(kg);
    addTaskFromAI('Revisar desperdicio en tolvas y bebederos', 'media');
  }

  if (['agrega', 'crear', 'añade', 'anade'].some((kw) => msg.includes(kw)) && ['tarea', 'mañana', 'manana', 'alimentacion', 'limpiar'].some((kw) => msg.includes(kw))) {
    const taskTitle = msg.includes('aliment')
      ? 'Registrar alimentacion de manana'
      : msg.includes('limpiar')
        ? 'Limpiar nidos y revisar cama'
        : 'Tarea creada desde IAVet IA';
    addTaskFromAI(taskTitle, 'media');
  }

  const context = getAgroContextForAI();

  if (['kg', 'kilos', 'alimento', 'alimentacion', 'balanceado'].some((kw) => msg.includes(kw))) {
    const feedRecords = getFeedRecords();
    const latestFeed = feedRecords.sort((a, b) => new Date(a.date) - new Date(b.date)).at(-1);
    const kg = Number(latestFeed?.kg || 0);
    const dailyCost = kg * Number(latestFeed?.costPerKg || 0);

    return `**Alimentacion registrada y analizada**\n\nUltimo consumo: **${kg.toFixed(1)} kg** de alimento.\nCosto estimado del dia: **${formatMoney(dailyCost)}**.\n\n**Recomendacion:**\n- Comparar consumo contra produccion de huevos.\n- Revisar desperdicio en tolvas.\n- Mantener agua limpia, porque baja de agua reduce consumo y postura.\n\nTambien deje una tarea para revisar desperdicio si registraste alimento desde este chat.`;
  }

  if (['como va', 'produccion', 'postura', 'huevos', 'baja'].some((kw) => msg.includes(kw))) {
    const trendText = context.dropPercent >= 10
      ? `La produccion bajo ${context.dropPercent.toFixed(1)}% frente al promedio reciente.`
      : `La produccion esta cerca del promedio reciente (${context.previousAverage.toFixed(1)} huevos).`;

    return `**Analisis de produccion real**\n\nUltimo registro: **${context.latestEggs} huevos** y **${context.damaged} no vendibles**.\n\n${trendText}\n\n**Revisar hoy:**\n- Agua disponible y limpia.\n- Temperatura del galpon en horas de calor.\n- Horas de luz.\n- Consumo de alimento.\n\nSi vuelves a registrar manana, puedo comparar la tendencia automaticamente.`;
  }

  if (['ganar', 'ganancia', 'ingreso', 'utilidad', 'margen', 'dinero', 'mes'].some((kw) => msg.includes(kw))) {
    return `**Proyeccion economica con tus datos**\n\nHuevos vendibles estimados: **${context.sellableEggs.toLocaleString('es-PE')} al mes**.\nIngreso mensual: **${formatMoney(context.monthlyIncome)}**.\nCostos registrados: **${formatMoney(context.totalCosts)}**.\nUtilidad neta: **${formatMoney(context.netProfit)}**.\nMargen: **${context.margin.toFixed(1)}%**.\n\nPunto de equilibrio: necesitas vender aprox. **${context.breakEvenDaily} huevos por dia** para cubrir costos.`;
  }

  if (['alerta', 'revisar', 'hoy', 'que debo', 'problema', 'riesgo'].some((kw) => msg.includes(kw))) {
    const alerts = [];
    if (context.dropPercent >= 10) alerts.push('Baja productiva: revisar agua, alimento, temperatura y luz.');
    if (context.damagedRate >= 5) alerts.push('Merma alta: revisar nidos, manipulacion y traslado.');

    const tasks = getFarmTasks();
    const pendingTasks = tasks.filter((task) => task.status !== 'done').slice(0, 4);

    return `**Checklist recomendado para hoy**\n\n${alerts.length ? alerts.map((alert) => `- ${alert}`).join('\n') : '- Produccion sin alerta critica segun los registros actuales.'}\n- Confirmar produccion del dia.\n- Registrar alimento consumido.\n- Subir foto del nido si notas variacion.\n\n**Tareas pendientes:**\n${pendingTasks.length ? pendingTasks.map((task) => `- ${task.title}`).join('\n') : '- Sin tareas pendientes.'}\n\nPrioridad: resolver primero agua, calor y alimento porque impactan postura en pocas horas.`;
  }

  if (['ayer', 'historial', 'registr', 'ultimos', 'últimos'].some((kw) => msg.includes(kw))) {
    const recent = context.production.slice(-5).reverse();
    return `**Historial reciente**\n\n${recent.map((record) => `- ${record.date}: **${record.eggs} huevos**, ${record.damaged || 0} no vendibles. ${record.note || ''}`).join('\n')}\n\nEl promedio previo es **${context.previousAverage.toFixed(1)} huevos/dia**.`;
  }

  if (['foto', 'fotos', 'imagen', 'imagenes', 'camara', 'bounding', 'detectar'].some((kw) => msg.includes(kw))) {
    return `**Vision IA preparada**\n\nPuedes subir una foto del nido desde el boton de imagen. Haré una estimacion visual, marcaré zonas detectadas y luego te pediré confirmar el conteo antes de guardarlo.\n\nRecomendacion: toma la foto desde arriba, con buena luz y sin tapar los huevos.`;
  }

  for (const [, config] of Object.entries(aiResponses)) {
    if (config.keywords && config.keywords.some((kw) => msg.includes(kw))) {
      const responses = config.responses;
      return responses[0];
    }
  }
  const defaults = aiResponses.default;
  return `${defaults[0]}\n\nTambien puedo leer tus registros reales. Prueba preguntar: **"Como va mi produccion?"**, **"Cuanto ganare este mes?"** o **"Que debo revisar hoy?"**.`;
}

function readFileAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={clsx('flex gap-3 animate-slide-up', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={clsx(
          'mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl shadow-sm',
          isUser ? 'bg-slate-800' : 'bg-emerald-600',
        )}
      >
        {isUser ? <User size={15} className="text-white" /> : <Bot size={15} className="text-white" />}
      </div>

      <div
        className={clsx(
          'max-w-[88%] rounded-2xl px-3 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[84%] sm:px-4',
          isUser
            ? 'rounded-tr-md border border-emerald-100 bg-emerald-50 text-slate-800'
            : 'rounded-tl-md border border-slate-200 bg-white text-slate-700',
        )}
      >
        {message.image && (
          <div className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <img src={message.image} alt="Registro visual del criadero" className="h-44 w-full object-cover" />
          </div>
        )}
        {message.audio && (
          <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <audio src={message.audio} controls className="w-full" />
          </div>
        )}
        {message.text.split('\n').map((line, i) => {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className={i > 0 ? 'mt-1' : ''}>
              {parts.map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="font-black text-slate-950">
                    {part}
                  </strong>
                ) : (
                  part
                ),
              )}
            </p>
          );
        })}
        <p className={clsx('mt-2 text-xs font-medium', isUser ? 'text-right text-emerald-600' : 'text-left text-slate-400')}>
          {message.time}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
        <Bot size={15} className="text-white" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex h-4 items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VetCoach() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: aiResponses.default[0],
      time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('chat'); // 'chat' | 'vision' | 'history'
  const [attachedImage, setAttachedImage] = useState(null); // Preview attachment state
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const idRef = useRef(1000);

  const nextId = () => {
    idRef.current += 1;
    return idRef.current;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text, image = null, audio = null) => {
    const userText = text || input.trim();
    const imageToSend = image || attachedImage;
    if (!userText && !imageToSend && !audio) return;

    const now = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: nextId(),
      role: 'user',
      text: userText || (audio ? 'Audio de campo para IAVet' : 'Imagen para analisis IA'),
      image: imageToSend,
      audio,
      time: now,
    };
    const aiHistory = [...messages, userMsg].slice(-8).map((messageItem) => ({
      role: messageItem.role === 'ai' ? 'IAVet' : 'Productor',
      text: messageItem.text,
    }));
    setMessages((prev) => [...prev, userMsg]);
    saveAIMessageRemote({
      role: 'user',
      text: userMsg.text,
      mediaType: audio ? 'audio' : imageToSend ? 'image' : null,
    });
    setInput('');
    setAttachedImage(null); // Reset preview capsule
    setIsTyping(true);

    const fallbackText = imageToSend
      ? '**Analisis visual listo para validar**\n\nNo pude confirmar con IA externa, pero deje la foto cargada para revision.'
      : audio
        ? '**Audio recibido**\n\nNo pude procesar la voz con IA externa en este momento.'
        : getContextualAIResponse(userText);

    try {
      const aiText = await requestIAVetAI({
        message: userText,
        image,
        audio,
        history: aiHistory,
      });
      const aiMsg = {
        id: nextId(),
        role: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      saveAIMessageRemote({ role: 'ai', text: aiText });
    } catch (error) {
      console.error(error);
      const aiMsg = {
        id: nextId(),
        role: 'ai',
        text: `${fallbackText}\n\n**Nota tecnica:** hubo un error de conexion.`,
        time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      saveAIMessageRemote({ role: 'ai', text: aiMsg.text });
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const toggleVoiceRecording = async () => {
    if (isListening) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      sendMessage('Hoy recogi 35 huevos');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsListening(false);
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const audioDataUrl = await readFileAsDataUrl(audioBlob);
        sendMessage('Analiza este audio', null, audioDataUrl);
      };

      recorder.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      sendMessage('No pude activar el microfono.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: nextId(),
        role: 'ai',
        text: aiResponses.default[0],
        time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="grid h-[calc(100dvh-6.5rem)] lg:h-[calc(100vh-7rem)] min-h-0 gap-4 animate-fade-in lg:grid-cols-[minmax(0,1fr)_360px] overflow-hidden">
      <div className="flex min-h-0 flex-col flex-1">
        {/* Title Bar */}
        <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:mb-4 sm:p-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-100 sm:h-11 sm:w-11">
                <Bot size={21} className="text-emerald-700" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-black text-slate-900 sm:text-lg">IAVet Multimodal</h2>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="truncate text-xs font-bold text-emerald-700">Voz · texto · imagen</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="clear-chat-btn"
                onClick={clearChat}
                className="btn-ghost border border-transparent text-xs hover:border-slate-200"
                title="Limpiar conversacion"
              >
                <Trash2 size={14} className="text-slate-400" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tab Selector */}
        <div className="mb-3 flex rounded-xl border border-slate-200/80 bg-slate-100 p-1 lg:hidden shrink-0 shadow-sm">
          <button
            onClick={() => setActiveMobileTab('chat')}
            className={clsx(
              'flex-1 py-2 text-xs font-black rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5',
              activeMobileTab === 'chat'
                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/[0.02]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <Sparkles size={12} className={activeMobileTab === 'chat' ? 'text-emerald-600' : 'text-slate-400'} />
            Chat Pecuario
          </button>
          <button
            onClick={() => setActiveMobileTab('vision')}
            className={clsx(
              'flex-1 py-2 text-xs font-black rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5',
              activeMobileTab === 'vision'
                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/[0.02]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <Camera size={12} className={activeMobileTab === 'vision' ? 'text-emerald-600' : 'text-slate-400'} />
            Control Visual
          </button>
          <button
            onClick={() => setActiveMobileTab('history')}
            className={clsx(
              'flex-1 py-2 text-xs font-black rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5',
              activeMobileTab === 'history'
                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/[0.02]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <History size={12} className={activeMobileTab === 'history' ? 'text-emerald-600' : 'text-slate-400'} />
            Historial
          </button>
        </div>

        {/* CHAT TAB CONTENT (Mobile) */}
        {activeMobileTab === 'chat' && (
          <div className="flex lg:hidden min-h-0 flex-col flex-1 animate-fade-in">
            {/* Suggested prompts */}
            <div className="-mx-3 mb-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:mb-4 sm:px-0 shrink-0">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isTyping}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles size={11} className="text-emerald-500" />
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat history */}
            <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-inner sm:p-4 min-h-0">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:mt-4 sm:p-3 shrink-0 animate-fade-in">
              {attachedImage && (
                <div className="mb-2 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/60 p-2 w-fit animate-fade-in">
                  <img src={attachedImage} className="h-10 w-10 object-cover rounded-lg border border-slate-200 shrink-0" alt="Vista previa" />
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider leading-none mb-1">Imagen cargada</span>
                    <span className="text-[11px] font-medium text-slate-500 truncate max-w-[150px]">Lista para enviar con tu pregunta</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedImage(null)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/70 text-slate-600 transition-all hover:bg-red-100 hover:text-red-700"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={clsx(
                    'mb-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all',
                    isListening ? 'bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20' : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700',
                  )}
                  title={isListening ? 'Detener grabacion' : 'Registrar por voz'}
                >
                  {isListening ? <Loader size={18} className="animate-spin" /> : <Mic size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-emerald-100 hover:text-emerald-700"
                  title="Subir imagen"
                >
                  <ImagePlus size={18} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <textarea
                  id="vetcoach-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe una orden: produccion, alimentacion, ingresos, fotos o alertas..."
                  rows={1}
                  disabled={isTyping}
                  className="max-h-28 min-h-[44px] flex-1 resize-none overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-relaxed text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 sm:px-4"
                />
                <button
                  id="send-message-btn"
                  onClick={() => sendMessage()}
                  disabled={(!input.trim() && !attachedImage) || isTyping}
                  className={clsx(
                    'mb-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                    (input.trim() || attachedImage) && !isTyping
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:scale-105 hover:bg-emerald-700'
                      : 'cursor-not-allowed bg-slate-100 text-slate-400',
                  )}
                >
                  {isTyping ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>

            <p className="mt-3 text-center text-xs font-medium text-slate-500 shrink-0">
              IAVet orienta y automatiza registros; decisiones sanitarias criticas requieren un veterinario.
            </p>
          </div>
        )}

        {/* Desktop Always Visible & Mobile Tab conditional */}
        <div className="hidden lg:flex min-h-0 flex-col flex-1">
          {/* Suggested prompts */}
          <div className="-mx-3 mb-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:mb-4 sm:px-0 shrink-0">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isTyping}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles size={11} className="text-emerald-500" />
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat history */}
          <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-inner sm:p-4 min-h-0">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:mt-4 sm:p-3 shrink-0 animate-fade-in">
            {attachedImage && (
              <div className="mb-2 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/60 p-2 w-fit animate-fade-in">
                <img src={attachedImage} className="h-10 w-10 object-cover rounded-lg border border-slate-200 shrink-0" alt="Vista previa" />
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider leading-none mb-1">Imagen cargada</span>
                  <span className="text-[11px] font-medium text-slate-500 truncate max-w-[180px]">Lista para enviar con tu pregunta</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/70 text-slate-600 transition-all hover:bg-red-100 hover:text-red-700"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={clsx(
                  'mb-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all',
                  isListening ? 'bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20' : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700',
                )}
                title={isListening ? 'Detener grabacion' : 'Registrar por voz'}
              >
                {isListening ? <Loader size={18} className="animate-spin" /> : <Mic size={18} />}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mb-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-emerald-100 hover:text-emerald-700"
                title="Subir imagen"
              >
                <ImagePlus size={18} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <textarea
                id="vetcoach-input-desktop"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe una orden: produccion, alimentacion, ingresos, fotos o alertas..."
                rows={1}
                disabled={isTyping}
                className="max-h-28 min-h-[44px] flex-1 resize-none overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-relaxed text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 sm:px-4"
              />
              <button
                id="send-message-btn-desktop"
                onClick={() => sendMessage()}
                disabled={(!input.trim() && !attachedImage) || isTyping}
                className={clsx(
                  'mb-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                  (input.trim() || attachedImage) && !isTyping
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:scale-105 hover:bg-emerald-700'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400',
                )}
              >
                {isTyping ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>

          <p className="mt-3 text-center text-xs font-medium text-slate-500 shrink-0">
            IAVet orienta y automatiza registros; decisiones sanitarias criticas requieren un veterinario.
          </p>
        </div>

        {/* MOBILE VISION TAB CONTENT */}
        {activeMobileTab === 'vision' && (
          <div className="flex-1 overflow-y-auto lg:hidden animate-fade-in pb-4 min-h-0">
            <VisionAssistant />
          </div>
        )}

        {/* MOBILE HISTORY TAB CONTENT */}
        {activeMobileTab === 'history' && (
          <div className="flex-1 overflow-y-auto lg:hidden animate-fade-in pb-4 min-h-0 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">Historial visual</h3>
                <span className="badge-info">IA</span>
              </div>
              <div className="space-y-2">
                {visualHistory.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-black text-slate-900">{item.title}</p>
                      <span className="text-[11px] font-bold text-emerald-700">{item.confidence}%</span>
                    </div>
                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                      {item.date} · {item.category}{item.count ? ` · ${item.count} detectados` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP ASIDE (Always visible on lg) */}
      <aside className="hidden min-h-0 space-y-4 overflow-y-auto lg:block">
        <VisionAssistant />

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-in">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">Historial visual</h3>
            <span className="badge-info">IA</span>
          </div>
          <div className="space-y-2">
            {visualHistory.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black text-slate-900">{item.title}</p>
                  <span className="text-[11px] font-bold text-emerald-700">{item.confidence}%</span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-slate-500">
                  {item.date} · {item.category}{item.count ? ` · ${item.count} detectados` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
