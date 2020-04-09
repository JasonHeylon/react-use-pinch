const EVENTS_MAPPINGS = {
  touchEvent: {
    id: 'identifier',
    x: 'clientX',
    y: 'clientY',
  },
  pointerEvent: {
    id: 'pointerId',
    x: 'clientX',
    y: 'clientY',
  },
};

type GestureType = 'PAN' | 'PINCH' | null;

type GestureTouch = {
  id: number;
  clientX: number;
  clientY: number;
};

function getWrappedTouchesByTouchEvent(event: TouchEvent): GestureTouch[] {
  const list: GestureTouch[] = [];

  for (let index = 0; index < event.targetTouches.length; index++) {
    const touch = event.targetTouches[index];
    list.push(parseTouchEventToGestureTouch(touch));
  }

  return list;
}

function parseTouchEventToGestureTouch(touch: Touch): GestureTouch {
  return {
    id: touch.identifier,
    clientX: touch.clientX,
    clientY: touch.clientY,
  };
}

function parsePointerEventToGestureTouch(event: PointerEvent): GestureTouch {
  return {
    id: event.pointerId,
    clientX: event.clientX,
    clientY: event.clientY,
  };
}

export default class Gesture {
  startTouches: GestureTouch[] = [];

  constructor(touches: GestureTouch[]) {
    this.startTouches = touches;
  }

  get gestureType(): GestureType {
    if (this.startTouches.length === 1) {
      return 'PAN';
    } else if (this.startTouches.length > 1) {
      return 'PINCH';
    }
    return null;
  }
}
