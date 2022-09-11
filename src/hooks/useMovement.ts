/* eslint-disable no-unused-expressions */
import { useSwipeable } from 'react-swipeable';

interface MoveCallbackProps {
  onMoveUp?: () => any;
  onMoveDown?: () => any;
  onMoveLeft?: () => any;
  onMoveRight?: () => any;
}

function useMovement({
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}: MoveCallbackProps) {
  const swipeRef = useSwipeable({
    preventScrollOnSwipe: true,
    onSwipedUp: () => {
      onMoveUp && onMoveUp();
    },
    onSwipedDown: () => {
      onMoveDown && onMoveDown();
    },
    onSwipedLeft: () => {
      onMoveLeft && onMoveLeft();
    },
    onSwipedRight: () => {
      onMoveRight && onMoveRight();
    },
  });

  document.onkeydown = ({ key }) => {
    switch (key) {
      case 'ArrowUp':
      case 'w':
        onMoveUp && onMoveUp();
        break;
      case 'ArrowDown':
      case 's':
        onMoveDown && onMoveDown();
        break;
      case 'ArrowLeft':
      case 'a':
        onMoveLeft && onMoveLeft();
        break;
      case 'ArrowRight':
      case 'd':
        onMoveRight && onMoveRight();
        break;
      default:
        break;
    }
  };

  return swipeRef;
}

export default useMovement;
