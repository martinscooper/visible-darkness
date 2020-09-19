import React from 'react';
import Canvas from './Canvas';
import Header from './HeaderComponent';
import NetworkCanvasEngine from '../drawing/NetworkCanvasEngine';

const Main = () => {
  const nce = new NetworkCanvasEngine();

  return (
    <div>
      <Header />
      <Canvas nce={nce} />
    </div>
  );
};

export default Main;
