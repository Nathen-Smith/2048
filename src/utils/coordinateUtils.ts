export function flatIdx(i:number, j:number) {
  return i * 4 + j;
}
export function matrixIndices(flatIndex: number) {
  return { i: Math.floor(flatIndex / 4), j: (flatIndex % 4) };
}
