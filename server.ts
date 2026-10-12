import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy init of Gemini SDK using server-side GEMINI_API_KEY
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  return new GoogleGenAI({ apiKey });
}

// API: AI Romantic Assistant (Love Letter & Date Ideas)
app.post('/api/ai/romantic-assistant', async (req, res) => {
  try {
    const { mode, partnerName, userName, tone, details, relationshipLength } = req.body;

    const ai = getGenAI();

    let systemInstruction = `Sen romantik, duygu dolu, içten ve incelikli mektuplar, şiirler ve çift sürprizleri tasarlayan uzman bir aşk ve ilişki yazarısın. Yanıtlarını Türkçe dilinde, yapmacıklıktan uzak, kalbe dokunan, samimi ve unutulmaz bir tonda ver.`;
    let userPrompt = '';

    if (mode === 'letter') {
      userPrompt = `Aşağıdaki bilgilerle ${partnerName || 'Sevgilim'} için unutulmaz, dokunaklı ve kişiselleştirilmiş bir aşk mektubu yaz:
Yazar: ${userName || 'Sevgilin'}
Alıcı: ${partnerName || 'Sevgilim'}
İlişki süresi/Detay: ${relationshipLength || 'Birlikte geçen güzel zamanlarımız'}
Seçilen Ton: ${tone || 'Duygusal, içten ve şiirsel'}
Özel anılar & detaylar: ${details || 'Gözlerinin ışıltısı, ilk kahvemiz, birlikte güldüğümüz anlar'}.

Mektup başlığı olsun, akıcı paragraflarla ilerlesin ve kalpleri ısıtacak tatlı bir kapanış cümlesi ile imza içersin.`;
    } else if (mode === 'date_ideas') {
      userPrompt = `${partnerName || 'Sevgilim'} için yaratıcı, sürprizli ve bütçe dostu 4 adet romantik randevu / buluşma fikri öner.
Detaylar: ${details || 'Evde veya şehirde samimi anlar'}.
Her fikir için çekici bir başlık, mini açıklama ve küçük bir tatlı dokunuş/sürpriz belirt.`;
    } else if (mode === 'reasons') {
      userPrompt = `${partnerName || 'Sevgilim'} için "Seni Neden Seviyorum?" temalı 6 adet çok tatlı, özgün ve içten neden maddesi yaz. Her biri tek cümlelik veya iki cümlelik vurucu sevgi cümleleri olsun.
Detaylar: ${details || 'Gülüşü, sabrı, şefkati, yanındayken dünya duruyor gibi hissettirmesi'}.`;
    } else {
      userPrompt = `Bugün sevgilisine sürpriz yapmak ve gününü planlamak isteyen biri için 3 adet moral verici, sevgi dolu günlük öneri ve planlama motivasyonu sun. Detay: ${details || 'Günü organize etmek ve sevgiyi hissettirmek'}.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    res.json({
      success: true,
      result: response.text || '',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Yapay zeka asistanı yanıt üretirken bir sorun oluştu.',
    });
  }
});

// Configure Vite middleware in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Kalp & Ajanda server running on http://localhost:${PORT}`);
  });
}

startServer();
