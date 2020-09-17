import { useRef, useEffect } from 'react';

const useCanvas = (draw, nce) => {
  const canvasRef = useRef(null);
  const canvasTransRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasTrans = canvasTransRef.current;
    // const context = canvas.getContext('2d');
    //  let frameCount = 0;
    let animationFrameId;

    nce.addCanvas(canvas);
    nce.addCanvas(canvasTrans);
    nce.prepareToDraw();

    const render = () => {
      nce.draw();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return { canvasRef, canvasTransRef };
};

export default useCanvas;
