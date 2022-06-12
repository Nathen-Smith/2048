import React from 'react';

interface ScoreBoxProps {
  label: string;
  score: number;
}

function ScoreBox({ label, score }: ScoreBoxProps) {
  return (
    <div
      className="text-xl sm:text-2xl px-2 sm:px-4 text-center rounded-3px"
      style={{ backgroundColor: '#bbada0' }}
    >
      <div
        className="uppercase tracking-wider text-xs font-bold"
        style={{ color: '#eee4da' }}
      >
        {label}
      </div>
      <div className="text-white font-bold">
        {score}
      </div>
    </div>
  );
}

export default ScoreBox;
