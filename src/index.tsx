import { useRef, useEffect } from 'react';
import Gesture, { GestureCallback } from './gesture';

interface IProps {
  onPinchStart: GestureCallback;
  onPinch: GestureCallback;
  onPinchEnd: () => void;

  onPanStart: GestureCallback;
  onPan: GestureCallback;
  onPanEnd: () => void;
}

type bindResult = {
  ref: React.MutableRefObject<HTMLElement | undefined>;
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
  const gestureRef = useRef<Gesture>(new Gesture({ onPinchStart, onPinch, onPinchEnd, onPanStart, onPan, onPanEnd }));

  useEffect(() => {
    const domElement = ref.current;
    const gesture = gestureRef.current;

    if (domElement) {
      domElement.addEventListener('touchstart', gesture.handleTouchStart);
      domElement.addEventListener('touchmove', gesture.handleTouchMove);
      domElement.addEventListener('touchend', gesture.handleTouchEnd);
    }

    return (): void => {
      if (domElement) {
        domElement.removeEventListener('touchstart', gesture.handleTouchStart);
        domElement.removeEventListener('touchmove', gesture.handleTouchMove);
        domElement.removeEventListener('touchend', gesture.handleTouchEnd);
      }
    };
  }, [ref, onPanStart]);

  return (): bindResult => ({
    ref: ref,
  });
};
