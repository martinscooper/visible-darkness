import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import useCanvas from '../drawing/useCanvas';
import NetworkCanvasEngine from '../drawing/NetworkCanvasEngine';

const Canvas = (props) => {
  const { draw, nce } = props;
  const canvasRef = useCanvas(draw, nce);

  // TODO: force canvas to depend on parent grid size
  return (
    <Container>
      <Row>
        <Col md={4}>
          <canvas width='400' height='400' ref={canvasRef} />
        </Col>
      </Row>
    </Container>
  );
};

Canvas.propTypes = {
  draw: PropTypes.func.isRequired,
};

export default Canvas;
