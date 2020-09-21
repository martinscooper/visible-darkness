import React, { useRef, useEffect, createRef, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
} from 'reactstrap';

// TODO: make canvas responsive and square
// TODO: add layer names a types
// TODO:
// TODO:
// TODO:
// TODO:

const Canvas = (props) => {
  const { nce } = props;
  const [nbLayers, setNbLayers] = useState(6);
  const canvasRefs = useRef([]);
  const ppalCanvas = useRef(null);
  const layerTypes = nce.getLayerTypes();

  const addLayer = () => {
    if (nce.getNbLayers() - 1 > nbLayers) {
      setNbLayers((prev) => prev + 1);
    }
  };

  const removeLayer = () => {
    if (nbLayers > 0) {
      setNbLayers((previous) => previous - 1);
    } else if (nbLayers === 0) {
      setNbLayers(0);
    }
  };

  useEffect(() => {
    nce.prepareToDraw(ppalCanvas, canvasRefs);
  }, []);

  useEffect(() => {
    nce.updateRefs();

    let animationFrameId;
    const render = () => {
      nce.update();
      nce.draw();
      debugger;
      //nce.drawTry();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    debugger;

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [nbLayers]);

  if (nbLayers != canvasRefs.current.length) {
    // add or remove refs
    canvasRefs.current = Array(nbLayers)
      .fill()
      .map((_, i) => {
        return canvasRefs.current[i] || createRef();
      });
  }

  const canvasComps = new Array(nbLayers).fill().map((i, j) => {
    return (
      <Col sm={6} md={3} className='mt-3'>
        <Card className='text-center'>
          <CardTitle className='mb-0'>
            {layerTypes[j]} layer ({j + 1})
          </CardTitle>
          <CardBody>
            <Col>
              <Button className='mb-1' onClick={() => nce.cycle(j)}>
                Cycle neurons
              </Button>
            </Col>
            <canvas width='200' height='200' ref={canvasRefs.current[j]} />
          </CardBody>
        </Card>
      </Col>
    );
  });
  // TODO: force canvas to depend on parent grid size
  return (
    <Container>
      <Row className='mt-3'>
        <Col>
          <Button color='primary' onClick={addLayer}>
            Add layer
          </Button>
        </Col>
        <Col>
          <Button color='primary' onClick={removeLayer}>
            Remove layer
          </Button>
        </Col>
        <Col>
          <Button color='danger' onClick={() => nce.reload()}>
            Reload
          </Button>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col sm={6} md={{ size: 4, offset: 4 }}>
          <Card className='text-center'>
            <CardTitle>
              <h2>Network input</h2>
            </CardTitle>
            <CardBody>
              <canvas width='200' height='200' ref={ppalCanvas} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>{nbLayers > 0 ? canvasComps : null}</Row>
    </Container>
  );
};

export default Canvas;
