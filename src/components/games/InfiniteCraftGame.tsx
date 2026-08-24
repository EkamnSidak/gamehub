import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CraftElement, BASE_ELEMENTS, combineElements } from '../../utils/craftRecipes';
import { CanvasCraftItem, BestScoreRecord } from '../../types';
import { sound } from '../../utils/audio';
import {
  Search,
  Trash2,
  Sparkles,
  Shuffle,
  RotateCcw,
  Share2,
  Check,
  Trophy,
  Copy,
  Flame,
  Plus,
  Layers,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InfiniteCraftGameProps {
  onScoreSave: (score: BestScoreRecord) => void;
  bestScore?: BestScoreRecord | null;
  onOpenShareModal: (title: string, score: number, verdict: string) => void;
}

export const InfiniteCraftGame: React.FC<InfiniteCraftGameProps> = ({
  onScoreSave,
  bestScore,
  onOpenShareModal,
}) => {
  // Inventory of discovered elements
  const [elements, setElements] = useState<CraftElement[]>(() => {
    try {
      const saved = localStorage.getItem('infinite_craft_elements');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) return parsed;
      }
    } catch {
      // ignore
    }
    return BASE_ELEMENTS;
  });

  // Canvas items currently placed on the workspace
  const [canvasItems, setCanvasItems] = useState<CanvasCraftItem[]>([
    { instanceId: 'init-1', id: 'water', name: 'Water', emoji: '💧', x: 60, y: 80 },
    { instanceId: 'init-2', id: 'fire', name: 'Fire', emoji: '🔥', x: 200, y: 80 },
    { instanceId: 'init-3', id: 'earth', name: 'Earth', emoji: '🌍', x: 60, y: 170 },
    { instanceId: 'init-4', id: 'wind', name: 'Wind', emoji: '💨', x: 200, y: 170 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'alpha'>('recent');
  const [isCombining, setIsCombining] = useState(false);
  const [newDiscoveryToast, setNewDiscoveryToast] = useState<{ name: string; emoji: string; isFirstDiscovery?: boolean } | null>(null);
  const [hoverTargetId, setHoverTargetId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Dragging state
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const draggingItemRef = useRef<{
    instanceId: string;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
  } | null>(null);

  // Save elements to localStorage on change & record score
  useEffect(() => {
    try {
      localStorage.setItem('infinite_craft_elements', JSON.stringify(elements));
    } catch {
      // ignore
    }

    const count = elements.length;
    let verdict = 'Apprentice Alchemist 🧪';
    if (count >= 50) verdict = 'Master of Creation 🌌';
    else if (count >= 30) verdict = 'World Builder 🌍';
    else if (count >= 15) verdict = 'Elementalist ⚡';
    else if (count >= 8) verdict = 'Curious Crafter 🔍';

    if (!bestScore || count > bestScore.score) {
      onScoreSave({
        score: count,
        date: new Date().toISOString(),
        verdict,
        extra: `${count} Elements Discovered`,
      });
    }
  }, [elements]);

  // Filter & Sort Inventory
  const filteredElements = useMemo(() => {
    let list = elements.filter((el) =>
      el.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    if (sortOrder === 'alpha') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // recent first (non-base elements with discoveredAt descending)
      list = [...list].sort((a, b) => (b.discoveredAt || 0) - (a.discoveredAt || 0));
    }
    return list;
  }, [elements, searchQuery, sortOrder]);

  // Spawn element onto canvas
  const handleSpawnElement = (el: CraftElement, dropX?: number, dropY?: number) => {
    sound.playPop();
    const canvas = canvasRef.current;
    const rect = canvas ? canvas.getBoundingClientRect() : { width: 400, height: 350 };

    const x = dropX !== undefined ? dropX : Math.max(30, Math.min(rect.width - 130, 80 + Math.random() * 140));
    const y = dropY !== undefined ? dropY : Math.max(30, Math.min(rect.height - 70, 60 + Math.random() * 160));

    const newItem: CanvasCraftItem = {
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      id: el.id,
      name: el.name,
      emoji: el.emoji,
      x,
      y,
    };

    setCanvasItems((prev) => [...prev, newItem]);
  };

  // Drag logic on Canvas
  const handleItemPointerDown = (e: React.PointerEvent, item: CanvasCraftItem) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    draggingItemRef.current = {
      instanceId: item.instanceId,
      offsetX: clickX - item.x,
      offsetY: clickY - item.y,
      startX: item.x,
      startY: item.y,
    };

    // Bring dragged item to top of rendering stack
    setCanvasItems((prev) => {
      const filtered = prev.filter((i) => i.instanceId !== item.instanceId);
      return [...filtered, item];
    });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingItemRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const { instanceId, offsetX, offsetY } = draggingItemRef.current;
    const newX = Math.max(0, Math.min(rect.width - 110, currentX - offsetX));
    const newY = Math.max(0, Math.min(rect.height - 45, currentY - offsetY));

    setCanvasItems((prev) =>
      prev.map((it) => (it.instanceId === instanceId ? { ...it, x: newX, y: newY } : it))
    );

    // Collision detection with other elements
    const draggedCenterX = newX + 55;
    const draggedCenterY = newY + 22;

    let targetFound: string | null = null;
    for (const other of canvasItems) {
      if (other.instanceId === instanceId) continue;
      const otherCenterX = other.x + 55;
      const otherCenterY = other.y + 22;
      const dist = Math.hypot(draggedCenterX - otherCenterX, draggedCenterY - otherCenterY);

      if (dist < 60) {
        targetFound = other.instanceId;
        break;
      }
    }
    setHoverTargetId(targetFound);
  };

  const handlePointerUp = async (e: React.PointerEvent) => {
    if (!draggingItemRef.current) return;
    const { instanceId } = draggingItemRef.current;
    const targetId = hoverTargetId;

    draggingItemRef.current = null;
    setHoverTargetId(null);

    // Check if combined with target
    if (targetId && !isCombining) {
      const activeItem = canvasItems.find((i) => i.instanceId === instanceId);
      const targetItem = canvasItems.find((i) => i.instanceId === targetId);

      if (activeItem && targetItem) {
        await executeCombination(activeItem, targetItem);
      }
    }
  };

  // Perform combination of two canvas items
  const executeCombination = async (itemA: CanvasCraftItem, itemB: CanvasCraftItem) => {
    setIsCombining(true);
    sound.playClick();

    // Mark as combining
    setCanvasItems((prev) =>
      prev.map((it) =>
        it.instanceId === itemA.instanceId || it.instanceId === itemB.instanceId
          ? { ...it, isCombining: true }
          : it
      )
    );

    try {
      const res = await combineElements(
        { id: itemA.id, name: itemA.name, emoji: itemA.emoji },
        { id: itemB.id, name: itemB.name, emoji: itemB.emoji }
      );

      const targetX = (itemA.x + itemB.x) / 2;
      const targetY = (itemA.y + itemB.y) / 2;

      // Remove the 2 parent items and place the new one
      const newInstanceId = `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newId = res.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

      const newCanvasItem: CanvasCraftItem = {
        instanceId: newInstanceId,
        id: newId,
        name: res.name,
        emoji: res.emoji,
        x: targetX,
        y: targetY,
      };

      setCanvasItems((prev) => [
        ...prev.filter((it) => it.instanceId !== itemA.instanceId && it.instanceId !== itemB.instanceId),
        newCanvasItem,
      ]);

      // Check if this is a newly discovered element
      setElements((prev) => {
        const exists = prev.some((el) => el.name.toLowerCase() === res.name.toLowerCase());
        if (!exists) {
          const newCraftEl: CraftElement = {
            id: newId,
            name: res.name,
            emoji: res.emoji,
            discoveredAt: Date.now(),
            isFirstDiscovery: res.isFirstDiscovery,
          };

          sound.playScoreFanfare(95);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 },
            colors: ['#FFC93C', '#2EC4B6', '#FF4B4B', '#1A1A1A'],
          });

          setNewDiscoveryToast({
            name: res.name,
            emoji: res.emoji,
            isFirstDiscovery: res.isFirstDiscovery,
          });
          setTimeout(() => setNewDiscoveryToast(null), 3500);

          return [newCraftEl, ...prev];
        } else {
          sound.playPop();
          return prev;
        }
      });
    } catch (err) {
      console.error('Failed to combine:', err);
    } finally {
      setIsCombining(false);
    }
  };

  // Duplicate an item on double click
  const handleItemDoubleClick = (item: CanvasCraftItem) => {
    sound.playPop();
    const newItem: CanvasCraftItem = {
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      id: item.id,
      name: item.name,
      emoji: item.emoji,
      x: item.x + 20,
      y: item.y + 20,
    };
    setCanvasItems((prev) => [...prev, newItem]);
  };

  // Remove a single item on right click
  const handleItemContextMenu = (e: React.MouseEvent, instanceId: string) => {
    e.preventDefault();
    sound.playClick();
    setCanvasItems((prev) => prev.filter((i) => i.instanceId !== instanceId));
  };

  // Clear all items on canvas
  const handleClearCanvas = () => {
    sound.playClick();
    setCanvasItems([]);
  };

  // Random merge from inventory
  const handleRandomCombo = () => {
    if (elements.length < 2) return;
    sound.playClick();
    const randA = elements[Math.floor(Math.random() * elements.length)];
    const randB = elements[Math.floor(Math.random() * elements.length)];

    const canvas = canvasRef.current;
    const rect = canvas ? canvas.getBoundingClientRect() : { width: 400, height: 350 };
    const cx = rect.width / 2 - 55;
    const cy = rect.height / 2 - 20;

    const itemA: CanvasCraftItem = {
      instanceId: `inst-rand-1-${Date.now()}`,
      id: randA.id,
      name: randA.name,
      emoji: randA.emoji,
      x: cx - 40,
      y: cy,
    };
    const itemB: CanvasCraftItem = {
      instanceId: `inst-rand-2-${Date.now()}`,
      id: randB.id,
      name: randB.name,
      emoji: randB.emoji,
      x: cx + 40,
      y: cy,
    };

    setCanvasItems((prev) => [...prev, itemA, itemB]);
    setTimeout(() => {
      executeCombination(itemA, itemB);
    }, 400);
  };

  // Reset inventory to base 4 elements
  const handleResetInventory = () => {
    if (confirm('Reset your discovered elements back to the 4 base elements?')) {
      sound.playClick();
      setElements(BASE_ELEMENTS);
      setCanvasItems([
        { instanceId: 'init-1', id: 'water', name: 'Water', emoji: '💧', x: 60, y: 80 },
        { instanceId: 'init-2', id: 'fire', name: 'Fire', emoji: '🔥', x: 200, y: 80 },
        { instanceId: 'init-3', id: 'earth', name: 'Earth', emoji: '🌍', x: 60, y: 170 },
        { instanceId: 'init-4', id: 'wind', name: 'Wind', emoji: '💨', x: 200, y: 170 },
      ]);
    }
  };

  const handleShareDiscoveries = async () => {
    sound.playClick();
    const text = `I've discovered ${elements.length} unique elements in Infinite Craft! Can you reach the Universe?`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none gap-3 sm:gap-4 px-1 sm:px-2">
      {/* Header */}
      <div className="text-center pt-1">
        <h1 className="text-[28px] xs:text-[36px] sm:text-[48px] font-black leading-tight uppercase tracking-tight text-[#1A1A1A] mb-1 flex items-center justify-center gap-2">
          <span>INFINITE CRAFT</span>
          <span className="text-2xl sm:text-3xl">♾️</span>
        </h1>
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#1A1A1A] opacity-75">
          Drag elements together to create anything in the universe
        </p>
      </div>

      {/* Main Workspace: Canvas on Left, Inventory on Right */}
      <div
        id="infinite-craft-workspace"
        className="w-full max-w-[840px] bg-white rounded-3xl border-[2.5px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row h-[520px] sm:h-[560px] max-h-[82vh] relative"
      >
        {/* Canvas Area */}
        <div
          ref={canvasRef}
          id="craft-canvas"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="flex-1 h-full bg-[#FCFCFC] relative overflow-hidden touch-none border-b-2 md:border-b-0 md:border-r-2 border-[#1A1A1A] cursor-default min-h-[220px]"
          style={{
            backgroundImage: 'radial-gradient(#E5E7EB 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Top Canvas Toolbar */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 z-10">
            <span className="text-[10px] sm:text-xs font-black uppercase bg-[#1A1A1A] text-white px-2.5 py-1 rounded-full shadow-sm">
              Canvas ({canvasItems.length})
            </span>

            {canvasItems.length > 0 && (
              <button
                onClick={handleClearCanvas}
                className="p-1 sm:p-1.5 rounded-full bg-white border-[2px] border-[#1A1A1A] text-[#1A1A1A] hover:bg-neutral-100 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                title="Clear Canvas"
              >
                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}

            <button
              onClick={handleRandomCombo}
              className="px-2 sm:px-2.5 py-1 rounded-full bg-amber-400 border-[2px] border-[#1A1A1A] text-[#1A1A1A] font-black text-[10px] sm:text-xs uppercase flex items-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              title="Merge 2 Random Elements"
            >
              <Shuffle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Random</span>
            </button>
          </div>

          {/* Top Right Discovery Counter */}
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1.5 z-10">
            <div className="bg-[#2EC4B6] text-[#1A1A1A] font-black text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full border-[2px] border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#1A1A1A]" />
              <span>{elements.length} Discovered</span>
            </div>
          </div>

          {/* Render Items on Canvas */}
          {canvasItems.map((item) => {
            const isHovered = hoverTargetId === item.instanceId;

            return (
              <div
                key={item.instanceId}
                onPointerDown={(e) => handleItemPointerDown(e, item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                onContextMenu={(e) => handleItemContextMenu(e, item.instanceId)}
                style={{
                  transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
                  touchAction: 'none',
                }}
                className={`absolute top-0 left-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border-[2px] sm:border-[2.5px] border-[#1A1A1A] bg-white font-bold text-xs sm:text-sm text-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-grab active:cursor-grabbing select-none transition-transform duration-75 ${
                  isHovered
                    ? 'ring-4 ring-[#2EC4B6] scale-110 shadow-[5px_5px_0px_0px_rgba(46,196,182,1)] bg-emerald-50'
                    : ''
                } ${item.isCombining ? 'animate-pulse scale-90' : ''}`}
              >
                <span className="text-base sm:text-lg leading-none">{item.emoji}</span>
                <span className="font-black tracking-tight">{item.name}</span>
              </div>
            );
          })}

          {/* Empty Canvas Prompt */}
          {canvasItems.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none opacity-40">
              <Sparkles className="w-7 h-7 text-[#1A1A1A] mb-1.5" />
              <p className="font-black text-xs sm:text-sm uppercase tracking-wider text-[#1A1A1A]">
                Canvas is empty
              </p>
              <p className="text-[11px] font-bold text-neutral-500 mt-0.5">
                Tap any element in inventory to spawn it here
              </p>
            </div>
          )}

          {/* New Discovery Toast Alert */}
          {newDiscoveryToast && (
            <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-white px-3.5 sm:px-5 py-2 rounded-full border-[2px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-black uppercase tracking-wider animate-in fade-in zoom-in-95 duration-200 z-30 max-w-[90%] truncate ${
              newDiscoveryToast.isFirstDiscovery
                ? 'bg-amber-400 border-amber-300 text-black shadow-[3px_3px_0px_0px_rgba(255,201,60,1)]'
                : 'bg-[#1A1A1A] border-amber-400'
            }`}>
              <span className="text-base">{newDiscoveryToast.emoji}</span>
              <span className="truncate">
                {newDiscoveryToast.isFirstDiscovery ? '✨ First Discovery: ' : 'New: '}
                {newDiscoveryToast.name}!
              </span>
            </div>
          )}

          {/* Bottom helper tip */}
          <div className="absolute bottom-2.5 left-3 text-[10px] font-bold text-neutral-400 pointer-events-none hidden sm:block">
            Drop on another element to combine • Double-click to clone
          </div>
        </div>

        {/* Inventory Sidebar / Mobile Drawer */}
        <div
          id="craft-inventory-drawer"
          className="w-full md:w-[280px] h-[210px] md:h-full bg-neutral-50 flex flex-col p-3 gap-2 shrink-0 border-t md:border-t-0 border-neutral-200"
        >
          {/* Search Box */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-[1.5px] sm:border-[2px] border-[#1A1A1A] rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sorting & Stats toolbar */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black uppercase text-neutral-500 px-0.5">
            <span>
              {filteredElements.length} {filteredElements.length === 1 ? 'Item' : 'Items'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSortOrder(sortOrder === 'recent' ? 'alpha' : 'recent')}
                className="px-2 py-0.5 rounded-lg bg-white border border-[#1A1A1A] text-[10px] font-bold text-[#1A1A1A] hover:bg-neutral-100 cursor-pointer shadow-xs"
              >
                {sortOrder === 'recent' ? '⏳ Recent' : '🔤 A-Z'}
              </button>
            </div>
          </div>

          {/* Elements List */}
          <div className="flex-1 overflow-y-auto pr-0.5 flex flex-wrap gap-1.5 content-start touch-pan-y">
            {filteredElements.map((el) => (
              <button
                key={el.id}
                onClick={() => handleSpawnElement(el)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border-[1.5px] sm:border-[2px] border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all text-xs font-black text-[#1A1A1A] cursor-pointer ${
                  el.isFirstDiscovery ? 'bg-amber-100/80' : 'bg-white'
                }`}
                title={`Click to spawn ${el.name}${el.isFirstDiscovery ? ' (First Discovery!)' : ''}`}
              >
                <span className="text-xs sm:text-sm">{el.emoji}</span>
                <span>{el.name}</span>
                {el.isFirstDiscovery && <span className="text-[10px] text-amber-600 font-black">★</span>}
              </button>
            ))}

            {filteredElements.length === 0 && (
              <div className="w-full text-center py-6 text-xs font-bold text-neutral-400">
                No matching elements
              </div>
            )}
          </div>

          {/* Footer Action buttons */}
          <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between gap-2">
            <button
              onClick={handleResetInventory}
              className="text-[10px] sm:text-[11px] font-bold text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1"
              title="Reset to 4 base elements"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleShareDiscoveries}
              className="px-3 py-1 rounded-xl bg-[#1A1A1A] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
