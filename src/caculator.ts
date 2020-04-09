import { GestureTouch, CenterOffset, Center } from './gesture';

export function getPointOffset(current: GestureTouch, start: GestureTouch): CenterOffset {
  if (current && start) {
    return {
      x: current.clientX - start.clientX,
      y: current.clientY - start.clientY,
    };
  }
  return { x: 0, y: 0 };
}

export function getTwoPointCenter(touchOne: GestureTouch, touchTwo: GestureTouch): Center {
  return {
    x: (touchOne.clientX + touchTwo.clientX) / 2,
    y: (touchOne.clientY + touchTwo.clientY) / 2,
  };
}

export function getRotateOfTwoLine(
  currentPointerOne: GestureTouch,
  currentPointerTwo: GestureTouch,
  prevPointerOne: GestureTouch,
  prevTwoPointerTwo: GestureTouch
): number {
  const dAx = currentPointerOne.clientX - currentPointerTwo.clientX;
  const dAy = currentPointerOne.clientY - currentPointerTwo.clientY;
  const dBx = prevPointerOne.clientX - prevTwoPointerTwo.clientX;
  const dBy = prevPointerOne.clientY - prevTwoPointerTwo.clientY;
  const angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
  return -1 * angle * (180 / Math.PI);
}

export function getLineCenterOffset(
  currentPointerOne: GestureTouch,
  currentPointerTwo: GestureTouch,
  prevPointerOne: GestureTouch,
  prevTwoPointerTwo: GestureTouch
): CenterOffset {
  const currentLineCenter = getTwoPointCenter(currentPointerOne, currentPointerTwo);
  const prevLineCenter = getTwoPointCenter(prevPointerOne, prevTwoPointerTwo);

  return {
    x: currentLineCenter.x - prevLineCenter.x,
    y: currentLineCenter.y - prevLineCenter.y,
  };
}

export function getTwoPointsDistance(touchOne: GestureTouch, touchTwo: GestureTouch): number {
  return Math.abs(
    Math.sqrt(Math.pow(touchOne.clientX - touchTwo.clientX, 2) + Math.pow(touchOne.clientY - touchTwo.clientY, 2))
  );
}
