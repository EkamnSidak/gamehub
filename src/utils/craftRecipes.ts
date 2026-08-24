export interface CraftElement {
  id: string;
  name: string;
  emoji: string;
  isBase?: boolean;
  discoveredAt?: number;
  isFirstDiscovery?: boolean;
}

export const BASE_ELEMENTS: CraftElement[] = [
  { id: 'water', name: 'Water', emoji: '💧', isBase: true },
  { id: 'fire', name: 'Fire', emoji: '🔥', isBase: true },
  { id: 'wind', name: 'Wind', emoji: '💨', isBase: true },
  { id: 'earth', name: 'Earth', emoji: '🌍', isBase: true },
];

// Expanded built-in recipe dictionary for instant offline / GitHub Pages execution
export const BUILTIN_RECIPES: Record<string, { name: string; emoji: string }> = {
  // --- Tier 1: Base Element Combinations ---
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

  // --- Tier 2: Geography, Water & Earth Forms ---
  'lava+water': { name: 'Obsidian', emoji: '🖤' },
  'earth+steam': { name: 'Geyser', emoji: '♨️' },
  'lake+lake': { name: 'Ocean', emoji: '🌊' },
  'ocean+ocean': { name: 'Sea', emoji: '🌊' },
  'lake+mountain': { name: 'Fjord', emoji: '🏞️' },
  'lava+mountain': { name: 'Volcano', emoji: '🌋' },
  'mountain+mountain': { name: 'Mountain Range', emoji: '🏔️' },
  'earth+lava': { name: 'Stone', emoji: '🪨' },
  'dust+earth': { name: 'Sand', emoji: '🏖️' },
  'dust+water': { name: 'Mud', emoji: '💩' },
  'dust+wind': { name: 'Sandstorm', emoji: '🌪️' },
  'dust+fire': { name: 'Gunpowder', emoji: '💥' },
  'sand+water': { name: 'Beach', emoji: '🏖️' },
  'beach+wind': { name: 'Dune', emoji: '🏜️' },
  'sand+sand': { name: 'Desert', emoji: '🏜️' },
  'mud+fire': { name: 'Brick', emoji: '🧱' },
  'brick+brick': { name: 'Wall', emoji: '🧱' },
  'wall+wall': { name: 'House', emoji: '🏠' },
  'house+house': { name: 'Village', emoji: '🏘️' },
  'village+village': { name: 'City', emoji: '🏙️' },

  // --- Tier 3: Flora, Plants & Materials ---
  'fire+plant': { name: 'Tobacco', emoji: '🚬' },
  'plant+water': { name: 'Swamp', emoji: '🐊' },
  'plant+wind': { name: 'Dandelion', emoji: '🌼' },
  'earth+plant': { name: 'Tree', emoji: '🌲' },
  'tree+tree': { name: 'Forest', emoji: '🌳' },
  'forest+forest': { name: 'Jungle', emoji: '🌴' },
  'fire+tree': { name: 'Ash', emoji: '💨' },
  'tree+water': { name: 'River', emoji: '🏞️' },
  'tree+wind': { name: 'Leaf', emoji: '🍃' },
  'leaf+water': { name: 'Tea', emoji: '🍵' },
  'fire+tea': { name: 'Coffee', emoji: '☕' },
  'plant+plant': { name: 'Garden', emoji: '🌻' },
  'garden+garden': { name: 'Park', emoji: '🏞️' },
  'plant+sun': { name: 'Sunflower', emoji: '🌻' },
  'tree+fire': { name: 'Charcoal', emoji: '🪵' },
  'tree+stone': { name: 'Wood', emoji: '🪵' },
  'wood+wood': { name: 'Plank', emoji: '🪵' },
  'plank+water': { name: 'Boat', emoji: '⛵' },
  'boat+ocean': { name: 'Ship', emoji: '🚢' },

  // --- Tier 4: Sky, Weather & Celestial ---
  'steam+wind': { name: 'Cloud', emoji: '☁️' },
  'cloud+water': { name: 'Rain', emoji: '🌧️' },
  'cloud+cloud': { name: 'Storm', emoji: '⛈️' },
  'cloud+earth': { name: 'Fog', emoji: '🌫️' },
  'cloud+plant': { name: 'Mushroom', emoji: '🍄' },
  'fire+rain': { name: 'Rainbow', emoji: '🌈' },
  'cloud+fire': { name: 'Lightning', emoji: '⚡' },
  'lightning+water': { name: 'Electricity', emoji: '⚡' },
  'rain+rain': { name: 'Flood', emoji: '🌊' },
  'rain+wind': { name: 'Storm', emoji: '⛈️' },
  'rain+cold': { name: 'Snow', emoji: '❄️' },
  'water+cold': { name: 'Ice', emoji: '🧊' },
  'ice+mountain': { name: 'Glacier', emoji: '🏔️' },
  'ice+wind': { name: 'Blizzard', emoji: '🌨️' },
  'fire+sky': { name: 'Sun', emoji: '☀️' },
  'earth+sun': { name: 'Planet', emoji: '🪐' },
  'planet+sun': { name: 'Solar System', emoji: '🌌' },
  'solar system+solar system': { name: 'Galaxy', emoji: '🌌' },
  'galaxy+galaxy': { name: 'Universe', emoji: '🌌' },
  'planet+wind': { name: 'Atmosphere', emoji: '🌌' },
  'atmosphere+fire': { name: 'Meteor', emoji: '☄️' },
  'meteor+earth': { name: 'Crater', emoji: '🕳️' },
  'crater+water': { name: 'Lake', emoji: '🌊' },
  'earth+sky': { name: 'Horizon', emoji: '🌅' },
  'sun+earth': { name: 'Day', emoji: '☀️' },
  'sun+cloud': { name: 'Sky', emoji: '🌤️' },
  'sun+night': { name: 'Eclipse', emoji: '🌑' },
  'universe+star': { name: 'Black Hole', emoji: '🕳️' },
  'star+star': { name: 'Supernova', emoji: '💥' },

  // --- Tier 5: Materials, Industry & Minerals ---
  'fire+sand': { name: 'Glass', emoji: '🪟' },
  'glass+sand': { name: 'Hourglass', emoji: '⏳' },
  'glass+fire': { name: 'Lens', emoji: '🔍' },
  'lens+sun': { name: 'Laser', emoji: '🔴' },
  'lens+lens': { name: 'Telescope', emoji: '🔭' },
  'fire+stone': { name: 'Metal', emoji: '🔩' },
  'metal+stone': { name: 'Blade', emoji: '🗡️' },
  'blade+wood': { name: 'Sword', emoji: '⚔️' },
  'metal+fire': { name: 'Gold', emoji: '🥇' },
  'gold+metal': { name: 'Treasure', emoji: '💰' },
  'metal+water': { name: 'Rust', emoji: '🟤' },
  'metal+lightning': { name: 'Magnet', emoji: '🧲' },
  'electricity+sand': { name: 'Silicon', emoji: '🧪' },
  'electricity+glass': { name: 'Lightbulb', emoji: '💡' },
  'electricity+silicon': { name: 'Computer', emoji: '💻' },

  // --- Tier 6: Life, Biology & Animals ---
  'earth+swamp': { name: 'Life', emoji: '🧬' },
  'earth+life': { name: 'Human', emoji: '🧑' },
  'life+water': { name: 'Fish', emoji: '🐟' },
  'life+wind': { name: 'Bird', emoji: '🦅' },
  'life+earth': { name: 'Animal', emoji: '🐾' },
  'bird+fire': { name: 'Phoenix', emoji: '🔥' },
  'bird+water': { name: 'Duck', emoji: '🦆' },
  'bird+lake': { name: 'Swan', emoji: '🦢' },
  'fish+ocean': { name: 'Shark', emoji: '🦈' },
  'fish+river': { name: 'Salmon', emoji: '🐟' },
  'fish+electricity': { name: 'Electric Eel', emoji: '⚡' },
  'animal+water': { name: 'Beaver', emoji: '🦫' },
  'animal+forest': { name: 'Wolf', emoji: '🐺' },
  'animal+desert': { name: 'Camel', emoji: '🐪' },
  'animal+grass': { name: 'Cow', emoji: '🐄' },
  'cow+fire': { name: 'Steak', emoji: '🥩' },
  'cow+water': { name: 'Milk', emoji: '🥛' },
  'milk+cold': { name: 'Ice Cream', emoji: '🍦' },
  'animal+human': { name: 'Pet', emoji: '🐶' },
  'wolf+human': { name: 'Dog', emoji: '🐕' },

  // --- Tier 7: Time, Dinosaurs & Mythical Creatures ---
  'human+hourglass': { name: 'Time', emoji: '⏳' },
  'earth+time': { name: 'Fossil', emoji: '🦴' },
  'fossil+time': { name: 'Dinosaur', emoji: '🦖' },
  'dinosaur+fire': { name: 'Dragon', emoji: '🐉' },
  'dinosaur+earth': { name: 'Oil', emoji: '🛢️' },
  'dinosaur+wind': { name: 'Pterodactyl', emoji: '🦕' },
  'dinosaur+water': { name: 'Loch Ness Monster', emoji: '🦕' },
  'fire+oil': { name: 'Energy', emoji: '⚡' },
  'dragon+knight': { name: 'Hero', emoji: '🦸' },
  'dragon+fire': { name: 'Inferno', emoji: '🔥' },
  'human+magic': { name: 'Wizard', emoji: '🧙' },
  'wizard+sword': { name: 'Paladin', emoji: '🛡️' },
  'wizard+wood': { name: 'Wand', emoji: '🪄' },
  'wizard+potion': { name: 'Alchemist', emoji: '🧪' },
  'life+space': { name: 'Alien', emoji: '👽' },
  'alien+earth': { name: 'UFO', emoji: '🛸' },
  'horse+rainbow': { name: 'Unicorn', emoji: '🦄' },
  'horse+bird': { name: 'Pegasus', emoji: '🪽' },

  // --- Tier 8: Human Society, Occupations & Art ---
  'fire+human': { name: 'Chef', emoji: '🍳' },
  'human+water': { name: 'Swimmer', emoji: '🏊' },
  'earth+human': { name: 'Farmer', emoji: '🧑‍🌾' },
  'human+plant': { name: 'Gardener', emoji: '🧑‍🌾' },
  'human+tree': { name: 'Woodcutter', emoji: '🪓' },
  'human+mountain': { name: 'Hiker', emoji: '🧗' },
  'human+ocean': { name: 'Sailor', emoji: '⛵' },
  'human+rainbow': { name: 'Artist', emoji: '🎨' },
  'human+sword': { name: 'Knight', emoji: '🛡️' },
  'human+gold': { name: 'Rich', emoji: '💎' },
  'gold+human': { name: 'King', emoji: '👑' },
  'gold+king': { name: 'Crown', emoji: '👑' },
  'crown+human': { name: 'Emperor', emoji: '👑' },
  'pot of gold+rainbow': { name: 'Leprechaun', emoji: '🍀' },
  'energy+human': { name: 'Athlete', emoji: '🏃' },
  'athlete+water': { name: 'Olympics', emoji: '🥇' },
  'lightbulb+human': { name: 'Idea', emoji: '💭' },
  'idea+magic': { name: 'Spell', emoji: '✨' },
  'artist+sound': { name: 'Music', emoji: '🎵' },
  'wood+music': { name: 'Guitar', emoji: '🎸' },

  // --- Tier 9: Computing, Tech & Internet Culture ---
  'computer+human': { name: 'Programmer', emoji: '👨‍💻' },
  'computer+computer': { name: 'Internet', emoji: '🌐' },
  'coffee+programmer': { name: 'Bug Fix', emoji: '🐛' },
  'human+internet': { name: 'Meme', emoji: '🐱' },
  'internet+meme': { name: 'Neal.fun', emoji: '🕹️' },
  'internet+idea': { name: 'Startup', emoji: '🚀' },
  'computer+life': { name: 'AI', emoji: '🤖' },
  'ai+human': { name: 'Superintelligence', emoji: '🧠' },
  'ai+internet': { name: 'Gemini', emoji: '✨' },
  'gemini+neal.fun': { name: 'Infinite Craft', emoji: '♾️' },
  'infinite craft+neal.fun': { name: 'Pure Joy', emoji: '🎉' },
  'robot+sword': { name: 'Mecha', emoji: '🤖' },
  'robot+human': { name: 'Cyborg', emoji: '🦾' },
  'rocket+planet': { name: 'Space Exploration', emoji: '🚀' },
  'rocket+human': { name: 'Astronaut', emoji: '🧑‍🚀' },
};

export function getComboRecipeKey(a: string, b: string): string {
  const normA = a.trim().toLowerCase();
  const normB = b.trim().toLowerCase();
  return [normA, normB].sort().join('+');
}

const LOCAL_CACHE_KEY = 'infinite_craft_static_combos';

function getLocalStoredCombos(): Record<string, { name: string; emoji: string; isFirstDiscovery?: boolean }> {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Storage can be unavailable in private browsing or non-browser contexts.
  }
  return {};
}

function saveLocalCombo(key: string, result: { name: string; emoji: string; isFirstDiscovery?: boolean }) {
  try {
    const map = getLocalStoredCombos();
    map[key] = result;
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(map));
  } catch {
    // The game remains playable when storage is unavailable.
  }
}

export function proceduralAlchemy(
  elemA: CraftElement,
  elemB: CraftElement
): { name: string; emoji: string; isFirstDiscovery: boolean } {
  const nameA = elemA.name.trim();
  const nameB = elemB.name.trim();
  const lowA = nameA.toLowerCase();
  const lowB = nameB.toLowerCase();

  if (lowA === lowB) {
    return {
      name: `Super ${nameA}`,
      emoji: elemA.emoji || '⚡',
      isFirstDiscovery: false,
    };
  }

  const combined = `${lowA} ${lowB}`;
  if (combined.includes('dragon') && (combined.includes('robot') || combined.includes('computer') || combined.includes('ai'))) {
    return { name: 'Cyber Dragon', emoji: '🤖', isFirstDiscovery: true };
  }
  if (combined.includes('wizard') && (combined.includes('tech') || combined.includes('computer') || combined.includes('ai'))) {
    return { name: 'Technomancer', emoji: '🔮', isFirstDiscovery: true };
  }
  if (combined.includes('space') && combined.includes('time')) {
    return { name: 'Spacetime', emoji: '⏳', isFirstDiscovery: true };
  }
  if (combined.includes('magic') && combined.includes('sword')) {
    return { name: 'Excalibur', emoji: '⚔️', isFirstDiscovery: true };
  }
  if (combined.includes('alien') && (combined.includes('chef') || combined.includes('food'))) {
    return { name: 'Galactic Gourmet', emoji: '🍳', isFirstDiscovery: true };
  }
  if (combined.includes('fire') && combined.includes('ice')) {
    return { name: 'Thermal Shock', emoji: '♨️', isFirstDiscovery: true };
  }

  const words = [nameA, nameB].sort((a, b) => b.length - a.length);
  const synthName = `${words[0]} ${words[1]}`;
  return {
    name: synthName,
    emoji: pickContextualEmoji(synthName),
    isFirstDiscovery: true,
  };
}

function pickContextualEmoji(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('super') || t.includes('hyper') || t.includes('ultra')) return '⚡';
  if (t.includes('cyber') || t.includes('robot') || t.includes('tech') || t.includes('computer') || t.includes('ai')) return '🤖';
  if (t.includes('space') || t.includes('cosmic') || t.includes('galaxy') || t.includes('planet') || t.includes('star')) return '🌌';
  if (t.includes('dragon') || t.includes('monster') || t.includes('beast')) return '🐉';
  if (t.includes('magic') || t.includes('wizard') || t.includes('spell') || t.includes('mystic')) return '✨';
  if (t.includes('fire') || t.includes('flame') || t.includes('lava') || t.includes('inferno') || t.includes('burn')) return '🔥';
  if (t.includes('water') || t.includes('ocean') || t.includes('sea') || t.includes('lake') || t.includes('wave')) return '🌊';
  if (t.includes('ice') || t.includes('snow') || t.includes('cold') || t.includes('frost') || t.includes('blizzard')) return '❄️';
  if (t.includes('plant') || t.includes('tree') || t.includes('flower') || t.includes('forest') || t.includes('leaf')) return '🌿';
  if (t.includes('cloud') || t.includes('wind') || t.includes('storm') || t.includes('air') || t.includes('sky')) return '☁️';
  if (t.includes('gold') || t.includes('king') || t.includes('crown') || t.includes('treasure') || t.includes('rich')) return '👑';
  if (t.includes('sword') || t.includes('blade') || t.includes('knight') || t.includes('warrior')) return '⚔️';
  if (t.includes('food') || t.includes('chef') || t.includes('cook') || t.includes('meal')) return '🍳';
  if (t.includes('human') || t.includes('person') || t.includes('hero')) return '🦸';
  if (t.includes('time') || t.includes('clock') || t.includes('hour')) return '⏳';
  if (t.includes('love') || t.includes('heart')) return '💖';
  return '✨';
}

// GitHub Pages is static. It uses the local engine unless an external backend
// is configured through the VITE_API_BASE_URL Actions variable.
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');
const combineApiUrl = configuredApiBaseUrl
  ? `${configuredApiBaseUrl}/api/combine`
  : import.meta.env.DEV
    ? '/api/combine'
    : null;

export async function combineElements(
  elemA: CraftElement,
  elemB: CraftElement
): Promise<{ name: string; emoji: string; isFirstDiscovery?: boolean }> {
  const key = getComboRecipeKey(elemA.name, elemB.name);

  if (BUILTIN_RECIPES[key]) {
    return { ...BUILTIN_RECIPES[key], isFirstDiscovery: false };
  }

  const localCache = getLocalStoredCombos();
  if (localCache[key]) {
    return { ...localCache[key], isFirstDiscovery: false };
  }

  if (combineApiUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(combineApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first: elemA.name, second: elemB.name }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data?.name && data?.emoji) {
          saveLocalCombo(key, data);
          return data;
        }
      }
    } catch {
      // Backend unavailable: continue with static procedural synthesis.
    }
  }

  const syntheticResult = proceduralAlchemy(elemA, elemB);
  saveLocalCombo(key, syntheticResult);
  return syntheticResult;
}
