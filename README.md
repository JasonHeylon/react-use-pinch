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
  const bind = usePinch();
  return (
    <div {...bind()}>
      <Other></Other>
    </div>
  );
};
```

## License

MIT © [JasonHeylon](https://github.com/JasonHeylon)
