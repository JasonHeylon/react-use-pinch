import { getPointOffset, getTwoPointsDistance, getTwoPointCenter, getRotateOfTwoLine } from './caculator';
import {
  parseTouchEventToGestureTouches,
  parsePointerEventToGestureTouch,
  isPanTouchEvent,
  isPinchTouchEvent,
} from './EventUtils';

function log(msg: string, ...options: any[]): void {
  console.log(`[Gesture]: ${msg}`, options);
}

export type GestureTouch = {
  id: number;
  clientX: number;
  clientY: number;
};

export type Center = {
  x: number;
  y: number;
};

export type GestureCallback = (offset: GestureOffset) => void;

export type CenterOffset = Center;

export type GestureOffset = {
  center: CenterOffset;
  scaleRatio: number;
  rotate: number;
};
type TouchState = boolean | 'pan' | 'pinch';

export default class Gesture {
  touchState: TouchState = false;
  touchCache: GestureTouch[] = [];

  onPanStart: GestureCallback | undefined;
  onPan: GestureCallback | undefined;
  onPanEnd: (() => void) | undefined;
  onPinchStart: GestureCallback | undefined;
  onPinch: GestureCallback | undefined;
  onPinchEnd: (() => void) | undefined;

  constructor({
    onPanStart,
    onPan,
    onPanEnd,
    onPinchStart,
    onPinch,
    onPinchEnd,
  }: Partial<{
    onPanStart: GestureCallback;
    onPan: GestureCallback;
    onPanEnd: () => void;
    onPinchStart: GestureCallback;
    onPinch: GestureCallback;
    onPinchEnd: () => void;
  }>) {
    this.onPanStart = onPanStart;
    this.onPan = onPan;
    this.onPanEnd = onPanEnd;

    this.onPinchStart = onPinchStart;
    this.onPinch = onPinch;
    this.onPinchEnd = onPinchEnd;
  }

  prevOffset: GestureOffset = {
    center: { x: 0, y: 0 },
    scaleRatio: 1,
    rotate: 0,
  };

  handleTouchStart = (event: TouchEvent | PointerEvent): void => {
    event.preventDefault();
    log('touchStart', event);

    this.touchState = true;

    if (event instanceof window.TouchEvent) {
      this.touchCache = parseTouchEventToGestureTouches(event);
    } else if (event instanceof window.PointerEvent) {
      this.touchCache.push(parsePointerEventToGestureTouch(event));
    }
  };

  handleTouchMove = (event: TouchEvent | PointerEvent): void => {
    if (!this.touchState) return;

    if (event instanceof window.TouchEvent) {
      log('touches', event.touches.length);
      log('targetTouches', event.targetTouches.length);

      const touches = parseTouchEventToGestureTouches(event);

      if (isPanTouchEvent(event)) {
        const callback = this.touchState === 'pan' ? this.onPan : this.onPanStart;
        callback && this.handlePan(touches, callback);

        if (this.touchState !== 'pan') this.touchState = 'pan';
      }

      if (isPinchTouchEvent(event)) {
        const callback = this.touchState === 'pinch' ? this.onPinch : this.onPinchStart;
        callback && this.handlePinch(touches, callback);

        if (this.touchState !== 'pinch') this.touchState = 'pinch';
      }
    }

    // console.log('touchMove', event);
  };

  handleTouchEnd = (event: TouchEvent | PointerEvent): void => {
    console.log('touchEnd', event);

    switch (this.touchState) {
      case 'pan':
        this.onPanEnd && this.onPanEnd();
        break;
      case 'pinch':
        this.onPinchEnd && this.onPinchEnd();
        break;
    }

    this.touchState = false;
  };

  handlePan = (touches: Array<GestureTouch>, onPan: (offset: GestureOffset) => void): void => {
    const currentTouch = touches[0];
    const startPoint = this.touchCache.find((touch) => touch.id === currentTouch.id);

    if (startPoint) {
      const offset: GestureOffset = {
        center: getPointOffset(currentTouch, startPoint),
        scaleRatio: 1,
        rotate: 0,
      };
      this.prevOffset = offset;

      onPan(offset);
    } else {
      this.touchCache = [];
    }
  };

  handlePinch = (touches: Array<GestureTouch>, onPinch: (offset: GestureOffset) => void): void => {
    const currentPointOne = touches[0];
    const currentPointTwo = touches[1];

    const startPointOne = this.touchCache.find((point) => point.id === currentPointOne.id);
    const startPointTwo = this.touchCache.find((point) => point.id === currentPointTwo.id);

    if (startPointOne && startPointTwo) {
      // Calculate the difference between the start and move coordinates
      const prevLength = getTwoPointsDistance(startPointOne, startPointTwo);
      const currentLength = getTwoPointsDistance(currentPointOne, currentPointTwo);

      const currentCenter = getTwoPointCenter(currentPointOne, currentPointTwo);
      const prevCenter = getTwoPointCenter(startPointOne, startPointTwo);

      const scaleRatio = currentLength / prevLength;
      const center = {
        x: (currentCenter.x - prevCenter.x) / scaleRatio,
        y: (currentCenter.y - prevCenter.y) / scaleRatio,
      };

      const rotate = getRotateOfTwoLine(currentPointOne, currentPointTwo, startPointOne, startPointTwo);
      const offset = {
        center,
        scaleRatio,
        rotate,
      };

      this.prevOffset = offset;

      onPinch(offset);
    } else {
      // empty touchCache
      this.touchCache = [];
    }
  };
}
