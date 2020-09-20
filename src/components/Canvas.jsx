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
import NetworkCanvasEngine from '../drawing/NetworkCanvasEngine';

const Canvas = (props) => {
  const { nce } = props;

  const [nbLayers, setNbLayers] = useState(1);
  //const [canvasRefs, setCanvasRefs] = useState([]);

  const addLayer = () => {
    if (nce.getNbLayers() - 1 > nbLayers) {
      setNbLayers((prev) => prev + 1);
    }
  };

  const canvasRefs = Array(nbLayers)
    .fill()
    .map((x) => createRef());
  const pplalCanvas = createRef();

  useEffect(() => {
    let animationFrameId;
    // setCanvasRefs((refs) => Array(nbLayers).fill(createRef()));

    //alert(`the size is: ${canvasRefs.length} and nbLayers is: ${nbLayers}`);
    nce.prepareToDraw(pplalCanvas, canvasRefs);
    //alert('inside useEffect but not in loop');
    const render = () => {
      nce.update();
      nce.draw();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [nbLayers]);

  const canvasComps = canvasRefs.map((ref, i) => {
    return (
      <Col sm={6} md={4}>
        <Card>
          <CardTitle>
            <h2> Layer nb {i + 1}</h2>
          </CardTitle>
          <CardBody>
            <canvas width='200' height='200' ref={ref} />
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
      </Row>
      <Row>
        <Col sm={6} md={4}>
          <Card>
            <CardTitle>
              <h2>Network input</h2>
            </CardTitle>
            <CardBody>
              <canvas width='200' height='200' ref={pplalCanvas} />
            </CardBody>
          </Card>
        </Col>
        {nbLayers > 0 ? canvasComps : null}
      </Row>
    </Container>
  );
};

export default Canvas;
