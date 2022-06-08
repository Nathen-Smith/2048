import React from 'react';
import useDirection from './hooks/useMovement';

function App() {
  const s = 'HI';

  const swipeRef = useDirection({
    onMoveDown: () => console.log('down'),
    onMoveUp: function d() {
      console.log('up');
    },
    onMoveLeft: () => console.log(s),
  });

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="h-screen" {...swipeRef}>
      <div className="h-32 w-32 flex rounded-xl justify-center items-center text-6xl font-bold text-white bg-gray-200">
        hi
      </div>
    </div>
  );
}

export default App;
