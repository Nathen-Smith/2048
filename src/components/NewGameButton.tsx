/* eslint-disable react/require-default-props */
import React from 'react';
import { initialTilesRandom, TileMeta } from '../Tile';

interface NewGameButtonProps {
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>
  setTilesArr: React.Dispatch<React.SetStateAction<TileMeta[]>>
  setScore: React.Dispatch<React.SetStateAction<number>>
  restartButtonRef?: React.MutableRefObject<null>;
}

function NewGameButton({
  setGameOver, setTilesArr, setScore, restartButtonRef,
}:NewGameButtonProps) {
  return (
    <button
      onClick={() => {
        setGameOver(false);
        setTilesArr(initialTilesRandom());
        setScore(0);
      }}
      ref={restartButtonRef}
      type="button"
      className={`text-white px-2 sm:px-4 py-1 sm:py-2 rounded-[3px] font-bold
        text-md mx-auto cursor-pointer`}
      style={{ backgroundColor: '#8f7a66', color: '#f9f6f2' }}
    >
      New Game
    </button>
  );
}

export default NewGameButton;
