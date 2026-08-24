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

// Curated instant lookup recipes table
export const BUILTIN_RECIPES: Record<string, { name: string; emoji: string }> = {
  // Base Pairs
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

  // Tier 2 Recipes
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
  'infinite craft+neal.fun': { name: 'Pure Joy', emoji: '🎉' },
};

export function getComboRecipeKey(a: string, b: string): string {
  const normA = a.trim().toLowerCase();
  const normB = b.trim().toLowerCase();
  return [normA, normB].sort().join('+');
}

// Client combine method that checks built-in table first, then calls backend /api/combine
export async function combineElements(
  elemA: CraftElement,
  elemB: CraftElement
): Promise<{ name: string; emoji: string; isFirstDiscovery?: boolean }> {
  const key = getComboRecipeKey(elemA.name, elemB.name);

  // 1. Check instant local dictionary
  if (BUILTIN_RECIPES[key]) {
    return {
      ...BUILTIN_RECIPES[key],
      isFirstDiscovery: false,
    };
  }

  // 2. Query server API route
  try {
    const res = await fetch('/api/combine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first: elemA.name, second: elemB.name }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.name && data.emoji) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Network combine failed, using local creative fallback:', err);
  }

  // 3. Deterministic client fallback if offline
  if (elemA.name.toLowerCase() === elemB.name.toLowerCase()) {
    return {
      name: `Super ${elemA.name}`,
      emoji: elemA.emoji || '⚡',
      isFirstDiscovery: false,
    };
  }

  return {
    name: `${elemA.name} ${elemB.name}`,
    emoji: '✨',
    isFirstDiscovery: false,
  };
}
