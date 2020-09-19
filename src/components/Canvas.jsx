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
import PropTypes from 'prop-types';

const Canvas = (props) => {
  const { nce } = props;

  const [nbLayers, setNbLayers] = useState(1);
  const canvasRefs = new Array(nbLayers + 1).fill(useRef(null));

  useEffect(() => {
    let animationFrameId;
    nce.prepareToDraw(canvasRefs);
    const render = () => {
      nce.update();
      nce.draw();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const canvasComps = canvasRefs.slice(1).map((canvasRef, index) => {
    return (
      <Col md={6}>
        <Card>
          <CardTitle>
            <h2> Layer nb {index + 1}</h2>
          </CardTitle>
          <CardBody>
            <canvas style={{ width: '100%', height: '100%' }} ref={canvasRef} />
          </CardBody>
        </Card>
      </Col>
    );
  });
  // TODO: force canvas to depend on parent grid size
  return (
    <Container>
      <Row>
        <Col>
          <Button onClick={() => setNbLayers((prevState) => prevState + 1)}>
            Add layer
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card>
            <CardTitle>
              <h2>Network input</h2>
            </CardTitle>
            <CardBody>
              <canvas
                style={{ width: '100%', height: '100%' }}
                ref={canvasRefs[0]}
              />
            </CardBody>
          </Card>
        </Col>
        {nbLayers > 0 ? canvasComps : null}
      </Row>
    </Container>
  );
};

export default Canvas;
