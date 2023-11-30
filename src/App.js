import React from 'react';
import Weather from './weather';

const App = () => {
  const apiKey = '6ad8741639da51e62515b73faac1b0f7';
  const city = 'Toronto';

  return (
    <div>
      <h1 className='title'>Weather App by 101395226</h1>
      <Weather apiKey={apiKey} city={city} />
    </div>
  );
};

export default App;
