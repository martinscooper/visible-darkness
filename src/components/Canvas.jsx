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

const Canvas = (props) => {
  const { nce } = props;
  const [nbLayers, setNbLayers] = useState(6);
  const canvasRefs = useRef([]);
  const ppalCanvas = useRef(null);

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
    nce.updateRefs();
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
      <Col sm={6} md={3}>
        <Card>
          <CardTitle>
            <h2> Layer nb {j + 1}</h2>
          </CardTitle>
          <CardBody>
            <canvas width='200' height='200' ref={canvasRefs.current[j]} />
          </CardBody>
        </Card>
      </Col>
    );
  });
  // TODO: force canvas to depend on parent grid size
  return (
    <Container>
      <Row className='row-content'>
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
      <Row>
        <Col sm={6} md={{ size: 4, offset: 4 }}>
          <Card>
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
