import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Built-in recipes lookup table for instant zero-latency responses
const BUILTIN_RECIPES: Record<string, { name: string; emoji: string }> = {
  'fire+water': { name: 'Steam', emoji: '💨' },
  'earth+water': { name: 'Plant', emoji: '🌱' },
  'earth+fire': { name: 'Lava', emoji: '🌋' },
  'earth+wind': { name: 'Dust', emoji: '🌫️' },
  'fire+wind': { name: 'Smoke', emoji: '💨' },
  'water+wind': { name: 'Wave', emoji: '🌊' },
  'water+water': { name: 'Lake', emoji: '🌊' },
  'fire+fire': { name: 'Volcano', emoji: '🌋' },
  'wind+wind': { name: 'Tornado', emoji: '🌪️' },
  'earth+earth': { name: 'Mountain', emoji: '🏔️' },
  'lava+water': { name: 'Obsidian', emoji: '🖤' },
  'earth+steam': { name: 'Geyser', emoji: '♨️' },
  'lake+lake': { name: 'Ocean', emoji: '🌊' },
  'ocean+ocean': { name: 'Sea', emoji: '🌊' },
  'fire+plant': { name: 'Tobacco', emoji: '🚬' },
  'plant+water': { name: 'Swamp', emoji: '🐊' },
  'plant+wind': { name: 'Dandelion', emoji: '🌼' },
  'earth+plant': { name: 'Tree', emoji: '🌲' },
  'tree+tree': { name: 'Forest', emoji: '🌳' },
  'forest+forest': { name: 'Jungle', emoji: '🌴' },
  'fire+tree': { name: 'Ash', emoji: '💨' },
  'tree+water': { name: 'River', emoji: '🏞️' },
  'dust+fire': { name: 'Gunpowder', emoji: '💥' },
  'dust+water': { name: 'Mud', emoji: '💩' },
  'dust+wind': { name: 'Sandstorm', emoji: '🌪️' },
  'dust+earth': { name: 'Sand', emoji: '🏖️' },
  'fire+sand': { name: 'Glass', emoji: '🪟' },
  'glass+sand': { name: 'Hourglass', emoji: '⏳' },
  'glass+fire': { name: 'Lens', emoji: '🔍' },
  'steam+wind': { name: 'Cloud', emoji: '☁️' },
  'cloud+water': { name: 'Rain', emoji: '🌧️' },
  'fire+rain': { name: 'Rainbow', emoji: '🌈' },
  'cloud+fire': { name: 'Lightning', emoji: '⚡' },
  'lightning+water': { name: 'Electricity', emoji: '⚡' },
  'earth+swamp': { name: 'Life', emoji: '🧬' },
  'earth+life': { name: 'Human', emoji: '🧑' },
  'life+water': { name: 'Fish', emoji: '🐟' },
  'life+wind': { name: 'Bird', emoji: '🦅' },
  'bird+fire': { name: 'Phoenix', emoji: '🔥' },
  'bird+water': { name: 'Duck', emoji: '🦆' },
  'bird+lake': { name: 'Swan', emoji: '🦢' },
  'fire+human': { name: 'Chef', emoji: '🍳' },
  'human+water': { name: 'Swimmer', emoji: '🏊' },
  'earth+human': { name: 'Farmer', emoji: '🧑‍🌾' },
  'human+plant': { name: 'Gardener', emoji: '🧑‍🌾' },
  'human+tree': { name: 'Woodcutter', emoji: '🪓' },
  'human+mountain': { name: 'Hiker', emoji: '🧗' },
  'human+ocean': { name: 'Sailor', emoji: '⛵' },
  'human+rainbow': { name: 'Artist', emoji: '🎨' },
  'human+hourglass': { name: 'Time', emoji: '⏳' },
  'earth+time': { name: 'Fossil', emoji: '🦴' },
  'fossil+time': { name: 'Dinosaur', emoji: '🦖' },
  'dinosaur+fire': { name: 'Dragon', emoji: '🐉' },
  'dinosaur+earth': { name: 'Oil', emoji: '🛢️' },
  'dinosaur+wind': { name: 'Pterodactyl', emoji: '🦕' },
  'fire+oil': { name: 'Energy', emoji: '⚡' },
  'electricity+glass': { name: 'Lightbulb', emoji: '💡' },
  'electricity+sand': { name: 'Silicon', emoji: '🧪' },
  'lightbulb+human': { name: 'Idea', emoji: '💭' },
  'electricity+silicon': { name: 'Computer', emoji: '💻' },
  'computer+human': { name: 'Programmer', emoji: '👨‍💻' },
  'computer+computer': { name: 'Internet', emoji: '🌐' },
  'human+internet': { name: 'Meme', emoji: '🐱' },
  'internet+meme': { name: 'Neal.fun', emoji: '🕹️' },
  'internet+idea': { name: 'Startup', emoji: '🚀' },
  'fire+sky': { name: 'Sun', emoji: '☀️' },
  'earth+sun': { name: 'Planet', emoji: '🪐' },
  'planet+sun': { name: 'Solar System', emoji: '🌌' },
  'solar system+solar system': { name: 'Galaxy', emoji: '🌌' },
  'galaxy+galaxy': { name: 'Universe', emoji: '🌌' },
  'cloud+cloud': { name: 'Storm', emoji: '⛈️' },
  'cloud+earth': { name: 'Fog', emoji: '🌫️' },
  'cloud+plant': { name: 'Mushroom', emoji: '🍄' },
  'lake+mountain': { name: 'Fjord', emoji: '🏞️' },
  'lava+mountain': { name: 'Volcano', emoji: '🌋' },
  'mountain+mountain': { name: 'Mountain Range', emoji: '🏔️' },
  'fire+stone': { name: 'Metal', emoji: '🔩' },
  'earth+lava': { name: 'Stone', emoji: '🪨' },
  'metal+stone': { name: 'Blade', emoji: '🗡️' },
  'blade+wood': { name: 'Sword', emoji: '⚔️' },
  'tree+wind': { name: 'Leaf', emoji: '🍃' },
  'leaf+water': { name: 'Tea', emoji: '🍵' },
  'fire+tea': { name: 'Coffee', emoji: '☕' },
  'coffee+programmer': { name: 'Bug Fix', emoji: '🐛' },
  'human+sword': { name: 'Knight', emoji: '🛡️' },
  'dragon+knight': { name: 'Hero', emoji: '🦸' },
  'dragon+fire': { name: 'Inferno', emoji: '🔥' },
  'human+magic': { name: 'Wizard', emoji: '🧙' },
  'idea+magic': { name: 'Spell', emoji: '✨' },
  'energy+human': { name: 'Athlete', emoji: '🏃' },
  'athlete+water': { name: 'Olympics', emoji: '🥇' },
  'gold+human': { name: 'King', emoji: '👑' },
  'pot of gold+rainbow': { name: 'Leprechaun', emoji: '🍀' },
  'metal+fire': { name: 'Gold', emoji: '🥇' },
  'gold+king': { name: 'Crown', emoji: '👑' },
  'crown+human': { name: 'Emperor', emoji: '👑' },
  'life+space': { name: 'Alien', emoji: '👽' },
  'alien+earth': { name: 'UFO', emoji: '🛸' },
  'planet+wind': { name: 'Atmosphere', emoji: '🌌' },
  'atmosphere+fire': { name: 'Meteor', emoji: '☄️' },
  'meteor+earth': { name: 'Crater', emoji: '🕳️' },
  'crater+water': { name: 'Lake', emoji: '🌊' },
  'computer+life': { name: 'AI', emoji: '🤖' },
  'ai+human': { name: 'Superintelligence', emoji: '🧠' },
  'ai+internet': { name: 'Gemini', emoji: '✨' },
  'gemini+neal.fun': { name: 'Infinite Craft', emoji: '♾️' },
};

// In-memory global server cache
const combinationCache = new Map<string, { name: string; emoji: string; isFirstDiscovery: boolean; fromCache?: boolean }>();

// Pre-seed cache with built-in recipes
for (const [key, value] of Object.entries(BUILTIN_RECIPES)) {
  combinationCache.set(key, { ...value, isFirstDiscovery: false, fromCache: true });
}

function getComboKey(a: string, b: string): string {
  const normA = a.trim().toLowerCase();
  const normB = b.trim().toLowerCase();
  return [normA, normB].sort().join('+');
}

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback models in priority order to handle temporary 503/capacity limits gracefully
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.7-flash'];

// Infinite Craft API Endpoint
// 1. [Check Cache / DB] -> Found -> Return instantly ($0 cost)
// 2. Not Found -> [LLM API: Gemini with resilient multi-model fallback]
// 3. [Save to Global Cache] -> Return new element
app.post('/api/combine', async (req, res) => {
  try {
    const { first, second } = req.body;
    if (!first || !second || typeof first !== 'string' || typeof second !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid first/second element names' });
    }

    const key = getComboKey(first, second);
    
    // Step 1: Check Global Cache (or built-ins)
    if (combinationCache.has(key)) {
      const cachedItem = combinationCache.get(key)!;
      return res.json({
        ...cachedItem,
        isFirstDiscovery: false,
        fromCache: true,
      });
    }

    // Step 2: Query LLM API with fallback models
    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are the core crafting engine for Neal.fun's Infinite Craft.
Combine these two elements: "${first}" + "${second}".

Task: Create a logical, creative, humorous, or emergent single concept or entity that results from combining them.
Examples of Infinite Craft style alchemy:
- "Fire" + "Water" -> "Steam"
- "Earth" + "Water" -> "Plant"
- "Human" + "Internet" -> "Meme"
- "Dragon" + "Knight" -> "Hero"
- "Computer" + "Life" -> "AI"
- "Philosopher" + "Rock" -> "Philosopher's Stone"

Return ONLY a JSON object with:
{
  "name": "Short Name (1-3 words, Title Cased, e.g. Obsidian, Superhero, Solar Flare, Black Hole)",
  "emoji": "A single fitting emoji, e.g. 🌋, 🦸, ☀️, 🕳️"
}`;

      for (const modelName of FALLBACK_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const text = response.text?.trim() || '';
          if (text) {
            const parsed = JSON.parse(text);
            if (parsed.name && parsed.emoji) {
              const cleanName = String(parsed.name).trim();
              const cleanEmoji = String(parsed.emoji).trim() || '✨';
              
              const result = {
                name: cleanName,
                emoji: cleanEmoji,
                isFirstDiscovery: true,
                fromCache: false,
              };
              
              // Step 3: Save to Global Cache
              combinationCache.set(key, { ...result, isFirstDiscovery: false });
              return res.json(result);
            }
          }
        } catch (modelErr: any) {
          // Log transient error and attempt next model in fallback list
          const status = modelErr?.status || modelErr?.code || 'ERROR';
          console.warn(`Model ${modelName} unavailable (${status}), trying fallback...`);
        }
      }
    }

    // Deterministic alchemical fallback if all models or network are unavailable
    const fallbackResult = generateDeterministicCombo(first, second);
    combinationCache.set(key, { ...fallbackResult, isFirstDiscovery: false });
    return res.json(fallbackResult);
  } catch (error) {
    console.error('Unhandled combination error:', error);
    const fallbackResult = generateDeterministicCombo(req.body?.first || 'Water', req.body?.second || 'Fire');
    return res.json(fallbackResult);
  }
});

function generateDeterministicCombo(a: string, b: string): { name: string; emoji: string; isFirstDiscovery: boolean } {
  const normA = a.trim();
  const normB = b.trim();

  // Basic rules
  if (normA.toLowerCase() === normB.toLowerCase()) {
    return { name: `Super ${normA}`, emoji: '⚡', isFirstDiscovery: false };
  }

  // Blended emergent concept
  const words = [normA, normB].sort();
  const emoji = pickEmojiForWords(words[0], words[1]);
  return {
    name: `${words[0]} ${words[1]}`,
    emoji,
    isFirstDiscovery: false,
  };
}

function pickEmojiForWords(w1: string, w2: string): string {
  const combined = (w1 + ' ' + w2).toLowerCase();
  if (combined.includes('fire') || combined.includes('lava') || combined.includes('sun')) return '🔥';
  if (combined.includes('water') || combined.includes('lake') || combined.includes('sea')) return '🌊';
  if (combined.includes('plant') || combined.includes('tree') || combined.includes('leaf')) return '🌿';
  if (combined.includes('cloud') || combined.includes('sky') || combined.includes('wind')) return '☁️';
  if (combined.includes('light') || combined.includes('spark') || combined.includes('energy')) return '⚡';
  if (combined.includes('magic') || combined.includes('star') || combined.includes('cosmic')) return '✨';
  if (combined.includes('human') || combined.includes('person') || combined.includes('hero')) return '🦸';
  if (combined.includes('dragon') || combined.includes('monster') || combined.includes('beast')) return '🐉';
  if (combined.includes('stone') || combined.includes('rock') || combined.includes('mountain')) return '🪨';
  if (combined.includes('gold') || combined.includes('treasure') || combined.includes('crown')) return '👑';
  return '✨';
}

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Infinite Craft & Precision Games Server running on port ${PORT}`);
  });
}

startServer();
