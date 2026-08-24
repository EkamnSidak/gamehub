import React from 'react';
import { CircleResult } from '../types';
import { sound } from '../utils/audio';

interface RecentHistoryProps {
  history: CircleResult[];
  activeId: string | null;
  onSelectAttempt: (result: CircleResult) => void;
  onClearHistory: () => void;
  darkText: boolean;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({
  history,
  activeId,
  onSelectAttempt,
  onClearHistory,
  darkText,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col items-center gap-2 mt-4 select-none px-2">
      <div className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider">
        <span className={darkText ? 'text-[#1A1A1A] opacity-75' : 'text-white opacity-90'}>
          RECENT ATTEMPTS ({history.length})
        </span>
        {history.length > 3 && (
          <button
            onClick={() => {
              sound.playClick();
              onClearHistory();
            }}
            className={`text-xs underline font-bold cursor-pointer hover:opacity-100 ${
              darkText ? 'text-[#1A1A1A] opacity-60' : 'text-white opacity-75'
            }`}
          >
            CLEAR
          </button>
        )}
      </div>

      <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {history.slice(0, 8).map((item, idx) => {
          const isSelected = activeId === item.id;
          const scoreClass =
            item.score >= 90
              ? 'bg-[#FFC93C] text-[#1A1A1A]'
              : item.score >= 70
              ? 'bg-white text-[#1A1A1A]'
              : 'bg-neutral-100 text-[#1A1A1A]';

          return (
            <button
              key={item.id}
              id={`history-chip-${idx}`}
              onClick={() => {
                sound.playClick();
                onSelectAttempt(item);
              }}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[2.5px] border-[#1A1A1A] text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-105'
                  : `${scoreClass} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105`
              }`}
            >
              <span>{item.score.toFixed(1)}%</span>
              {idx === 0 && (
                <span className="text-[10px] opacity-60 font-bold">
                  NEW
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

