import { useRef, useEffect } from 'react';
import { Card } from 'reactstrap';
const useCanvas = (draw, nce) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');
    //  let frameCount = 0;
    let animationFrameId;

    nce.setCanvas(canvas);

    // const render = () => {
    //   frameCount += 1;
    //   draw(context, frameCount);
    //   animationFrameId = window.requestAnimationFrame(render);
    // };
    // render();
    const render = () => {
      nce.draw();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return canvasRef;
};

export default useCanvas;
