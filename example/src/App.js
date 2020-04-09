import React, { useState } from 'react';

import MyComponent from './MyComponent';

const App = () => {
  const [flag, setFlag] = useState(true);
  const [eventFlag, setEventFlag] = useState(false);

  return (
    <div className='container'>
      <div className='wrapper'>
        {flag && (
          <MyComponent
            onPan={
              eventFlag
                ? () => {
                    console.log('onPan fired');
                  }
                : null
            }
          />
        )}
      </div>
      <div>
        <button onClick={() => setFlag(!flag)}>show/hide</button>
        <button onClick={() => setEventFlag(!eventFlag)}>change props</button>
      </div>
    </div>
  );
};
export default App;
