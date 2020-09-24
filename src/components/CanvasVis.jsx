import React, { useEffect } from 'react';
import { Card, CardBody, CardTitle, Col } from 'reactstrap';
const CanvasVis = (props) => {
  const { layerType, layerIx, nce, canvasRef } = props;
  const handleClick = () => {
    nce.cycle(layerIx);
  };

  return (
    <Card className='text-center'>
      <CardTitle className='mb-0'>
        {layerType} layer ({layerIx + 1})
      </CardTitle>
      <CardBody>
        <canvas
          onClick={handleClick}
          width='200'
          height='200'
          ref={canvasRef}
        />
      </CardBody>
    </Card>
  );
};

export default CanvasVis;
