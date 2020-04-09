import { useRef, useEffect } from 'react';

export interface IMovement {
  center: {
    x: number;
    y: number;
  };
  offset: {
    x: number;
    y: number;
  };
}

export interface IPinchMovement extends IMovement {
  ratio: number;
  angleDegree: number;
}

interface IProps {
  onPinchStart: (movement: IPinchMovement) => void;
  onPinch: (movement: IPinchMovement) => void;
  onPinchEnd: () => void;

  onPanStart: (movement: IMovement) => void;
  onPan: (movement: IMovement) => void;
  onPanEnd: () => void;
}

type bindResult = {
  ref: React.MutableRefObject<HTMLElement | undefined>;
};
type touchState = boolean | 'pan' | 'pinch';

const handlePan = (event: TouchEvent, touchCache: Array<Touch>, onPan: (movment: IMovement) => void): void => {
  const currentTouch = event.targetTouches[0];
  const startPoint = touchCache.find((touch) => touch.identifier === currentTouch.identifier);

  if (startPoint) {
    const movement: IMovement = {
      center: {
        x: currentTouch.clientX,
        y: currentTouch.clientY,
      },
      offset: {
        x: currentTouch.clientX - startPoint.clientX,
        y: currentTouch.clientY - startPoint.clientY,
      },
    };
    onPan(movement);
  } else {
    touchCache = [];
  }
};

const handlePinch = (event: TouchEvent, touchCache: Array<Touch>, onPinch: (movment: IPinchMovement) => void): void => {
  event.preventDefault();
  const currentPointOne = event.targetTouches[0];
  const currentPointTwo = event.targetTouches[1];

  const startPointOne = touchCache.find((point) => point.identifier === currentPointOne.identifier);
  const startPointTwo = touchCache.find((point) => point.identifier === currentPointTwo.identifier);

  if (startPointOne && startPointTwo) {
    // Calculate the difference between the start and move coordinates
    const prevLength = Math.abs(
      Math.sqrt(
        Math.pow(startPointOne.clientX - startPointTwo.clientX, 2) +
          Math.pow(startPointOne.clientY - startPointTwo.clientY, 2)
      )
    );
    const currentLength = Math.abs(
      Math.sqrt(
        Math.pow(currentPointOne.clientX - currentPointTwo.clientX, 2) +
          Math.pow(currentPointOne.clientY - currentPointTwo.clientY, 2)
      )
    );

    const currentCenter = {
      x: (currentPointOne.clientX + currentPointTwo.clientX) / 2,
      y: (currentPointOne.clientY + currentPointTwo.clientY) / 2,
    };
    const prevCenter = {
      x: (startPointOne.clientX + startPointTwo.clientX) / 2,
      y: (startPointOne.clientY + startPointTwo.clientY) / 2,
    };

    const ratio = currentLength / prevLength;
    const centerMove = {
      x: (currentCenter.x - prevCenter.x) / ratio,
      y: (currentCenter.y - prevCenter.y) / ratio,
    };

    const dAx = currentPointOne.clientX - currentPointTwo.clientX;
    const dAy = currentPointOne.clientY - currentPointTwo.clientY;
    const dBx = startPointOne.clientX - startPointTwo.clientX;
    const dBy = startPointOne.clientY - startPointTwo.clientY;
    const angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
    const angleDegree = -1 * angle * (180 / Math.PI);

    onPinch({
      center: currentCenter,
      offset: centerMove,
      ratio,
      angleDegree,
    });
  } else {
    // empty touchCache
    touchCache = [];
  }
};

export const usePinch = ({
  onPinchStart,
  onPinch,
  onPinchEnd,
  onPanStart,
  onPan,
  onPanEnd,
}: Partial<IProps>): (() => bindResult) => {
  const ref = useRef<HTMLElement>();

  const touchState = useRef<touchState>(false);
  const touchCache = useRef<Array<Touch>>([]);

  const handleTouchStart = (event: TouchEvent | PointerEvent): void => {
    event.preventDefault();
    console.log('touchStart', event);

    touchState.current = true;

    if (event instanceof window.TouchEvent) {
      touchCache.current = [...Array.prototype.slice.call(event.targetTouches)];
    }
  };

  const handleTouchMove = (event: TouchEvent | PointerEvent): void => {
    if (!touchState.current) return;

    if (event instanceof window.TouchEvent) {
      console.log('touches', event.touches.length);
      console.log('targetTouches', event.targetTouches.length);
      if (event.touches.length === 1 && event.targetTouches.length === 1) {
        const callback = touchState.current === 'pan' ? onPan : onPanStart;
        callback && handlePan(event, touchCache.current, callback);

        if (touchState.current !== 'pan') touchState.current = 'pan';
      }

      if (event.touches.length >= 2 && event.targetTouches.length >= 2) {
        const callback = touchState.current === 'pinch' ? onPinch : onPinchStart;
        callback && handlePinch(event, touchCache.current, callback);

        if (touchState.current !== 'pinch') touchState.current = 'pinch';
      }
    }

    // console.log('touchMove', event);
    // onPanStart && onPanStart();
  };
  const handleTouchEnd = (event: TouchEvent | PointerEvent): void => {
    console.log('touchEnd', event);
    // onPanStart && onPanStart();
    switch (touchState.current) {
      case 'pan':
        onPanEnd && onPanEnd();
        break;
      case 'pinch':
        onPinchEnd && onPinchEnd();
        break;
    }

    touchState.current = false;
  };

  useEffect(() => {
    const domElement = ref.current;
    if (domElement) {
      // if (window.PointerEvent) {
      //   domElement.addEventListener('pointerdown', handleTouchStart);
      //   domElement.addEventListener('pointermove', handleTouchMove);
      //   domElement.addEventListener('pointerup', handleTouchEnd);
      // } else {
      domElement.addEventListener('touchstart', handleTouchStart);
      domElement.addEventListener('touchmove', handleTouchMove);
      domElement.addEventListener('touchend', handleTouchEnd);
      // }
    }

    return (): void => {
      if (domElement) {
        // if (window.PointerEvent) {
        //   domElement.removeEventListener('pointerdown', handleTouchStart);
        //   domElement.removeEventListener('pointermove', handleTouchMove);
        //   domElement.removeEventListener('pointerup', handleTouchEnd);
        // } else {
        domElement.removeEventListener('touchstart', handleTouchStart);
        domElement.removeEventListener('touchmove', handleTouchMove);
        domElement.removeEventListener('touchend', handleTouchEnd);
        // }
      }
    };
  }, [ref, onPanStart]);

  return (): bindResult => ({
    ref: ref,
  });
};
