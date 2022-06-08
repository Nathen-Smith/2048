/* eslint-disable no-unused-expressions */
import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

interface MoveCallbackProps {
  onMoveUp?: () => any;
  onMoveDown?: () => any;
  onMoveLeft?: () => any;
  onMoveRight?: () => any;
}

type MovementDir = 'up' | 'down' | 'left' | 'right' | '';

function useMovement({
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}: MoveCallbackProps) {
  const [direction, setDirection] = useState<MovementDir>('');
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    switch (direction) {
      case 'up':
        onMoveUp && onMoveUp();
        break;
      case 'down':
        onMoveDown && onMoveDown();
        break;
      case 'left':
        onMoveLeft && onMoveLeft();
        break;
      case 'right':
        onMoveRight && onMoveRight();
        break;
      default:
        break;
    }
  }, [shouldUpdate, direction, onMoveUp, onMoveDown, onMoveLeft, onMoveRight]);

  const swipeRef = useSwipeable({
    onSwipedUp: () => { setDirection('up'); setShouldUpdate(!shouldUpdate); },
    onSwipedDown: () => { setDirection('down'); setShouldUpdate(!shouldUpdate); },
    onSwipedLeft: () => { setDirection('left'); setShouldUpdate(!shouldUpdate); },
    onSwipedRight: () => { setDirection('right'); setShouldUpdate(!shouldUpdate); },
  });

  onkeydown = ({ key }) => {
    switch (key) {
      case 'ArrowUp':
      case 'w':
        setDirection('up');
        setShouldUpdate(!shouldUpdate);
        break;
      case 'ArrowDown':
      case 's':
        setDirection('down');
        setShouldUpdate(!shouldUpdate);
        break;
      case 'ArrowLeft':
      case 'a':
        setDirection('left');
        setShouldUpdate(!shouldUpdate);
        break;
      case 'ArrowRight':
      case 'd':
        setDirection('right');
        setShouldUpdate(!shouldUpdate);
        break;
      default:
        break;
    }
  };

  return swipeRef;
}

export default useMovement;
