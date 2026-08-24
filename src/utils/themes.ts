import { GameTheme } from '../types';

export const THEMES: GameTheme[] = [
  {
    id: 'yellow',
    name: 'Sunshine',
    bgColor: '#FFC93C',
    accentColor: '#FF4B4B',
    darkText: true,
    tag: 'Classic',
  },
  {
    id: 'dark',
    name: 'Obsidian',
    bgColor: '#12141A',
    accentColor: '#FFC93C',
    darkText: false,
    tag: 'OLED Dark',
  },
  {
    id: 'mint',
    name: 'Neo Mint',
    bgColor: '#2EC4B6',
    accentColor: '#FF3366',
    darkText: true,
    tag: 'Fresh',
  },
  {
    id: 'purple',
    name: 'Cyber Violet',
    bgColor: '#6C5CE7',
    accentColor: '#FFD166',
    darkText: false,
    tag: 'Vibe',
  },
  {
    id: 'coral',
    name: 'Electric Coral',
    bgColor: '#FF5E7E',
    accentColor: '#FFE600',
    darkText: false,
    tag: 'Warm',
  },
  {
    id: 'sky',
    name: 'Breeze Azure',
    bgColor: '#3B82F6',
    accentColor: '#FFD166',
    darkText: false,
    tag: 'Clean',
  },
];
