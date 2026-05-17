import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_PROMPT = `
Eres IAVet Agro IA, asistente pecuario para granjas y criaderos de Ica, Peru.
Ayudas con produccion, alimentacion, sanidad preventiva, costos, alertas, tareas y registros.
Responde en espanol claro, practico y breve. Da pasos accionables.
Si el contexto incluye modulos pecuarios, usalos para responder cantidades de aves, ponedoras, pollos, codornices, patos o lotes. No digas que no sabes una cantidad si aparece como flockSize en el contexto.
Cuando detectes un dato registrable, mencionalo con claridad para que el productor confirme.
No reemplazas a un veterinario: ante mortalidad, signos respiratorios, brotes o sintomas graves, recomienda aislar el lote y consultar a un profesional o autoridad sanitaria.
`.trim();

app.use(cors());
app.use(express.json({ limit: '25mb' }));

function parseDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    data: match[2],
  };
}

function buildContextSummary(context) {
  if (!context) return 'No se recibio contexto local.';
  const modules = context.modules || [];
  const moduleLines = modules.length
    ? modules.map((module) => (
      `- ${module.name || 'Modulo sin nombre'}: ${Number(module.flockSize || 0)} animales. Tipo/especie: ${module.species || 'no indicado'}. Produccion: ${module.production || module.productionGoal || 'no indicada'}. Estado: ${module.status || 'no indicado'}.`
    )).join('\n')
    : '- No hay modulos pecuarios registrados.';
  const speciesLines = context.animalsBySpecies
    ? Object.entries(context.animalsBySpecies)
      .map(([species, count]) => `- ${species}: ${count} animales`)
      .join('\n')
    : '- Sin resumen por especie.';

  const structured = JSON.stringify(
    {
      moduleCount: context.moduleCount,
      totalAnimals: context.totalAnimals,
      animalsBySpecies: context.animalsBySpecies,
      modules: context.modules?.map((module) => ({
        name: module.name,
        species: module.species,
        breed: module.breed,
        flockSize: module.flockSize,
        production: module.production || module.productionGoal,
        status: module.status,
        notes: module.notes,
      })) || [],
      latestEggs: context.latestEggs,
      damaged: context.damaged,
      previousAverage: context.previousAverage,
      dropPercent: context.dropPercent,
      damagedRate: context.damagedRate,
      monthlyIncome: context.monthlyIncome,
      netProfit: context.netProfit,
      margin: context.margin,
      breakEvenDaily: context.breakEvenDaily,
      offlineRecords: context.offlineQueue?.length || 0,
      recentProduction: context.production?.slice?.(-5) || [],
    },
    null,
    2,
  );

  return `
Resumen operativo:
- Modulos registrados: ${context.moduleCount || 0}
- Total de animales/aves registrados: ${context.totalAnimals || 0}

Animales por tipo:
${speciesLines}

Detalle de modulos:
${moduleLines}

Datos estructurados:
${structured}
  `.trim();
}

function getCountAnswer(message, context) {
  const msg = String(message || '').toLowerCase();
  if (!/(cu[aá]ntas?|cantidad|total).*?(ave|aves|animal|animales|ponedora|ponedoras|gallina|gallinas|pollo|pollos|codorniz|codornices|pato|patos|m[oó]dulo|modulo|m[oó]dulos|modulos)/.test(msg)) {
    return null;
  }

  const modules = context?.modules || [];
  if (!modules.length) {
    return 'Todavia no tienes modulos pecuarios registrados. Registra un modulo con la cantidad de aves o animales para que pueda calcularlo.';
  }

  const matchesKind = (module) => {
    const haystack = `${module.name || ''} ${module.species || ''} ${module.breed || ''}`.toLowerCase();
    if (/ponedora|ponedoras|postura|gallina|gallinas/.test(msg)) {
      return /ponedora|ponedoras|postura|gallina|gallinas/.test(haystack);
    }
    if (/pollo|pollos/.test(msg)) return /pollo|pollos|engorde/.test(haystack);
    if (/codorniz|codornices/.test(msg)) return /codorniz|codornices/.test(haystack);
    if (/pato|patos/.test(msg)) return /pato|patos/.test(haystack);
    return true;
  };

  const selectedModules = modules.filter(matchesKind);
  const targetModules = selectedModules.length ? selectedModules : modules;
  const total = targetModules.reduce((sum, module) => sum + Number(module.flockSize || 0), 0);
  const detail = targetModules
    .map((module) => `- ${module.name || module.species || 'Modulo'}: ${Number(module.flockSize || 0)} animales`)
    .join('\n');

  if (/m[oó]dulo|modulo|m[oó]dulos|modulos/.test(msg)) {
    return `Tienes **${modules.length} modulo${modules.length === 1 ? '' : 's'}** registrado${modules.length === 1 ? '' : 's'}.\n\n${modules.map((module) => `- ${module.name || 'Modulo'}: ${Number(module.flockSize || 0)} animales`).join('\n')}`;
  }

  return `Tienes **${total} ${/ponedora|ponedoras|postura|gallina|gallinas/.test(msg) ? 'ponedoras/aves de postura' : 'animales registrados'}**.\n\nDetalle:\n${detail}`;
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    model,
    geminiConfigured: Boolean(apiKey),
  });
});

app.post('/api/ai/chat', async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: 'Gemini API key is not configured.',
    });
  }

  try {
    const {
      message = '',
      image,
      audio,
      history = [],
      context,
    } = req.body || {};

    const countAnswer = getCountAnswer(message, context);
    if (countAnswer) {
      return res.json({
        text: countAnswer,
        model: 'local-context',
      });
    }

    const parts = [
      {
        text: `
Contexto local de la granja:
${buildContextSummary(context)}

Historial reciente:
${history.map((item) => `${item.role}: ${item.text}`).join('\n') || 'Sin historial previo.'}

Mensaje del productor:
${message || 'El productor envio un archivo multimedia.'}

Regla para esta respuesta:
Si el productor pregunta "cuantas" aves, ponedoras, pollos, codornices, patos, animales o modulos tiene, responde directamente usando el Resumen operativo y el Detalle de modulos. No pidas ese dato si aparece en el contexto.
        `.trim(),
      },
    ];

    const imagePart = parseDataUrl(image);
    if (imagePart) {
      parts.push({
        inlineData: {
          mimeType: imagePart.mimeType,
          data: imagePart.data,
        },
      });
      parts.push({
        text: `
Analiza la imagen desde una perspectiva pecuaria.
Si parece un nido o huevos, estima huevos visibles.
Si el mensaje pide JSON, responde SOLO JSON valido con esta forma:
{
  "eggCount": number,
  "confidence": number,
  "sampleBoxes": number,
  "trendPercent": number,
  "summary": "texto breve",
  "recommendation": "texto breve"
}
No uses markdown dentro del JSON.
        `.trim(),
      });
    }

    const audioPart = parseDataUrl(audio);
    if (audioPart) {
      parts.push({
        inlineData: {
          mimeType: audioPart.mimeType,
          data: audioPart.data,
        },
      });
      parts.push({
        text: 'Transcribe o interpreta el audio como una instruccion de campo y responde con acciones pecuarias concretas.',
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.35,
      },
    });

    res.json({
      text: response.text || 'No pude generar una respuesta util en este momento.',
      model,
    });
  } catch (error) {
    console.error('Gemini request failed:', error);
    res.status(500).json({
      error: 'Gemini request failed.',
      detail: error.message,
    });
  }
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`IAVet API server running on http://localhost:${port}`);
});
