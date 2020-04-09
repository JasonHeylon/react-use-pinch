import React, { useState } from 'react';
import { usePinch } from 'react-use-pinch';

const MyComponent = () => {
  const [ratio, setRatio] = useState(1.0);
  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  });
  const [degree, setDegree] = useState(0);

  const bind = usePinch({
    onPinchStart: (movement) => {
      console.log('on onPinchStart fired', movement);
    },
    onPinch: (movement) => {
      setRatio(movement.scaleRatio);
      setOffset(movement.center);
      setDegree(movement.rotate);
      console.log('on onPinch fired', movement);
    },
    onPinchEnd: () => {
      console.log('on onPinchEnd fired');
      setRatio(1);
      setOffset({ x: 0, y: 0 });
      setDegree(0);
    },
    onPanStart: (movement) => {
      console.log('on onPanStart fired', movement);
    },
    onPan: (movement) => {
      console.log('on onPan fired', movement);
      setOffset(movement.center);
    },
    onPanEnd: () => {
      console.log('on onPanEnd fired');
      setOffset({ x: 0, y: 0 });
    },
  });

  const transform = `scale(${ratio}) translate(${offset.x}px, ${offset.y}px) rotate(${degree}deg)`;

  return (
    <div {...bind()} className='container'>
      <img
        src='https://images.unsplash.com/photo-1518145312389-36e7f6e06034?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
        style={{
          height: '200px',
          objectFit: 'cover',
          transition: 'transform ease-out .1s',
          transformOrigin: 'center',
          transform,
        }}
      />
    </div>
  );
};
export default MyComponent;
