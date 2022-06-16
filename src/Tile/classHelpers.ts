export function colorMapper(value: number) {
  switch (value) {
    case 2:
      return 'bg-stone-100 text-stone-500';
    case 4:
      return 'bg-orange-100 text-stone-600';
    case 8:
      return 'bg-orange-300 text-white';
    case 16:
      return 'bg-orange-400 text-white';
    case 32:
      return 'bg-red-400 text-white';
    case 64:
      return 'bg-red-500 text-white';
    case 128:
      return 'bg-yellow-250 text-white shadow-lg shadow-yellow-250/50';
    case 256:
      return 'bg-amber-250 text-white shadow-lg shadow-amber-250/50';
    case 512:
      return 'bg-amber-300 text-white shadow-lg shadow-amber-300/50';
    case 1024:
      return 'bg-yellow-300 text-white shadow-lg shadow-yellow-300/50';
    case 2048:
      return 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/50';
    case 4096:
      return 'bg-teal-500 text-white shadow-lg shadow-teal-500/50';
    default:
      break;
  }
  return '';
}

export function getTransition(i: number, j: number): string {
  return `tile-position-${i}-${j}`;
}
