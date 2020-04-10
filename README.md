# react-use-pinch

> A react hook to handle Pinch and Pan Gesture on mobile devices

[![NPM](https://img.shields.io/npm/v/react-use-pinch.svg)](https://www.npmjs.com/package/react-use-pinch) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-use-pinch
```

## Usage

```tsx
import * as React from 'react';

import { usePinch } from 'react-use-pinch';

const Example = () => {
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
  });

  const transform = `scale(${ratio}) translate(${offset.x}px, ${offset.y}px) rotate(${degree}deg)`;

  return (
    <div {...bind()} style={transform}>
      <Other></Other>
    </div>
  );
};
```

## License

MIT © [JasonHeylon](https://github.com/JasonHeylon)
