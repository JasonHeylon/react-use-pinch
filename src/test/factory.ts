import { GestureTouch } from '../gesture';

export function createGestureTouch({
  id,
  clientX,
  clientY,
}: {
  id: number;
  clientX?: number;
  clientY?: number;
}): GestureTouch {
  return {
    id,
    clientX: clientX || id * 100,
    clientY: clientY || id * 100,
  };
}

export function createGestureTouchList(num = 1): GestureTouch[] {
  const list: GestureTouch[] = [];

  for (let index = 0; index < num; index++) {
    list.push(createGestureTouch({ id: index }));
  }

  return list;
}
