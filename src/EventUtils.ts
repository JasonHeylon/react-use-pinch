import { GestureTouch } from './gesture';

export function parsePointerEventToGestureTouch(event: PointerEvent): GestureTouch {
  return {
    id: event.pointerId,
    clientX: event.clientX,
    clientY: event.clientY,
  };
}

export function parseTouchEventToGestureTouches(event: TouchEvent): GestureTouch[] {
  return Array.prototype.slice
    .call(event.targetTouches)
    .map((touch: Touch) => ({ clientX: touch.clientX, clientY: touch.clientY, id: touch.identifier }));
}

export function isPanTouchEvent(event: TouchEvent): boolean {
  return event.touches.length === 1 && event.targetTouches.length === 1;
}

export function isPinchTouchEvent(event: TouchEvent): boolean {
  return event.touches.length >= 2 && event.targetTouches.length >= 2;
}
