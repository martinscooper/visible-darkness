import React from 'react';
import Canvas from './Canvas';
import Header from './HeaderComponent';
import NetworkCanvasEngine from '../drawing/NetworkCanvasEngine';

const Main = () => {
  const draw = (ctx, frameCount) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0DF004';
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(50, 30, 20 * Math.cos(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  const nce = new NetworkCanvasEngine();

  return (
    <div>
      <Header />
      <Canvas draw={draw} nce={nce} />
    </div>
  );
};

export default Main;
