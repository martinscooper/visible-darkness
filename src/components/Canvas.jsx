import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import PropTypes from 'prop-types';
import useCanvas from '../drawing/useCanvas';
import NetworkCanvasEngine from '../drawing/NetworkCanvasEngine';

const Canvas = (props) => {
  const { draw, nce } = props;
  const { canvasRef, canvasTransRef } = useCanvas(draw, nce);

  // TODO: force canvas to depend on parent grid size
  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card>
            <CardTitle>
              <h2>Network input</h2>
            </CardTitle>
            <CardBody>
              <canvas width='400' height='400' ref={canvasRef} />
            </CardBody>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <CardTitle>
              <h2>Second layer</h2>
            </CardTitle>
            <CardBody>
              <canvas width='400' height='400' ref={canvasTransRef} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

Canvas.propTypes = {
  draw: PropTypes.func.isRequired,
};

export default Canvas;
