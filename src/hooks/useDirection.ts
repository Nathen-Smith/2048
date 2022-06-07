import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

interface DirCallbackProps {
  onMoveUp?: () => any;
  onMoveDown?: () => any;
  onMoveLeft?: () => any;
  onMoveRight?: () => any;
}

type DirectionProps = 'up' | 'down' | 'left' | 'right' | '';

function useDirection({
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}: DirCallbackProps) {
  const [direction, setDirection] = useState<DirectionProps>('');
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
  }, [direction, shouldUpdate]);

  const swipeRef = useSwipeable({
    onSwipedUp: () => {setDirection('up'); setShouldUpdate(!shouldUpdate)},
    onSwipedDown: () => {setDirection('down'); setShouldUpdate(!shouldUpdate)},
    onSwipedLeft: () => {setDirection('left'); setShouldUpdate(!shouldUpdate)},
    onSwipedRight: () => {setDirection('right'); setShouldUpdate(!shouldUpdate)},
  });

  onkeydown = ({ key }) => {
    switch (key) {
      case 'ArrowUp':
        setDirection('up');
        setShouldUpdate(!shouldUpdate)
        break;
      case 'ArrowDown':
        setDirection('down');
        setShouldUpdate(!shouldUpdate)
        break;
      case 'ArrowLeft':
        setDirection('left');
        setShouldUpdate(!shouldUpdate)
        break;
      case 'ArrowRight':
        setDirection('right');
        setShouldUpdate(!shouldUpdate)
        break;
      default:
        break;
    }
  };

  return swipeRef;
}

export default useDirection;
