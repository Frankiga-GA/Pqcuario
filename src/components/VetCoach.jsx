import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Trash2, Lightbulb } from 'lucide-react';
import { aiResponses } from '../data/mockData';
import { clsx } from 'clsx';

const SUGGESTED_PROMPTS = [
  '¿Cuándo debo vacunar a mi perro?',
  '¿Qué come una vaca Holstein al día?',
  '¿Cómo adiestro a mi mascota?',
  '¿Cuáles son síntomas de urgencia?',
  '¿Cómo registro mi predio en SENASA?',
  '¿Cuál es el precio del kg de fibra de alpaca?',
];

function getAIResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  for (const [, config] of Object.entries(aiResponses)) {
    if (config.keywords && config.keywords.some((kw) => msg.includes(kw))) {
      const responses = config.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  const defaults = aiResponses.default;
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div
      className={clsx(
        'flex gap-3 animate-slide-up',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm',
          isUser
            ? 'bg-blue-600'
            : 'bg-emerald-600',
        )}
      >
        {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>

      {/* Bubble */}
      <div
        className={clsx(
          'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm',
          isUser
            ? 'bg-blue-50 border border-blue-100 text-slate-800 rounded-tr-md'
            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-md',
        )}
      >
        {/* Render markdown-like bold */}
        {message.text.split('\n').map((line, i) => {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className={i > 0 ? 'mt-1' : ''}>
              {parts.map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="font-bold text-slate-900">
                    {part}
                  </strong>
                ) : (
                  part
                ),
              )}
            </p>
          );
        })}
        <p className={clsx('text-xs mt-2 font-medium', isUser ? 'text-right text-blue-400' : 'text-left text-slate-400')}>
          {message.time}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-emerald-600 shadow-sm flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-white" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-slate-200 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
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
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    const now = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), role: 'user', text: userText, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      const aiText = getAIResponse(userText);
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
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
        id: Date.now(),
        role: 'ai',
        text: aiResponses.default[0],
        time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="glass-card p-4 mb-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200">
            <Bot size={20} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">VetCoach IA</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-600 font-bold">En línea · Orientación 24/7</span>
            </div>
          </div>
        </div>
        <button
          id="clear-chat-btn"
          onClick={clearChat}
          className="btn-ghost text-xs border border-transparent hover:border-slate-200"
          title="Limpiar conversación"
        >
          <Trash2 size={14} className="text-slate-400" />
          <span className="hidden sm:inline">Limpiar</span>
        </button>
      </div>

      {/* Suggested prompts */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            disabled={isTyping}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full font-medium
                       bg-white border border-slate-200 text-slate-600 shadow-sm
                       hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lightbulb size={10} className="text-emerald-500" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div className="glass-card flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-slate-50 border-none shadow-inner">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="glass-card mt-4 p-3 flex gap-3 items-end bg-white">
        <textarea
          id="vetcoach-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu consulta sobre nutrición, salud, vacunas, SENASA..."
          rows={1}
          disabled={isTyping}
          className="flex-1 bg-slate-50 rounded-xl px-4 text-slate-800 placeholder-slate-400 resize-none 
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm leading-relaxed py-3 max-h-28 overflow-y-auto
                     disabled:opacity-50 border border-slate-200 transition-all"
          style={{ minHeight: '44px' }}
        />
        <button
          id="send-message-btn"
          onClick={() => sendMessage()}
          disabled={!input.trim() || isTyping}
          className={clsx(
            'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 mb-0.5',
            input.trim() && !isTyping
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:scale-105'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed',
          )}
        >
          {isTyping ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>

      <p className="text-center text-xs text-slate-500 font-medium mt-3">
        VetCoach IA es un asistente de orientación — no reemplaza la consulta veterinaria profesional.
      </p>
    </div>
  );
}
