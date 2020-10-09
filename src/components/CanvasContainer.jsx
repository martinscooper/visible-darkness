import React, { useRef, useEffect, createRef, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Button,
  ButtonGroup,
} from 'reactstrap';
import LayerVisualization from './LayerVisualization';
import PropTypes from 'prop-types';
import NetworkCanvasEngine from '../drawing/NetworkCanvasEngine';
import useNetworkCanvasEngine from '../hooks/useNetworkCanvasEngine';
// TODO: make canvas responsive and square
// TODO: add select activation options
// TODO: add learning rate bar
// TODO: add different datasets
// todo: add addLayer button

const Loss = (props) => {
  const [loss, setLoss] = useState(0.0);
  useEffect(() => {
    setInterval(() => {
      setLoss(props.nce.getLoss());
    }, 16);
  }, []);
  return <CardFooter>Loss: {loss}</CardFooter>;
};

Loss.propTypes = {
  nce: PropTypes.instanceOf(NetworkCanvasEngine),
};

const CanvasContainer = () => {
  const nce = useNetworkCanvasEngine().current;
  const nbLayers = (nce.getNbLayers() - 1) / 2;
  const canvasRefs = useRef([]);
  const ppalCanvas = useRef(null);
  const layerTypes = nce.getLayerTypes();
  // const addLayer = () => {
  //   if (nce.getNbLayers() > nbLayers) {
  //     setNbLayers((prev) => prev + 1);
  //   }
  // };

  // const removeLayer = () => {
  //   if (nbLayers > 0) {
  //     setNbLayers((previous) => previous - 1);
  //   }
  // };

  useEffect(() => {
    nce.prepareToDraw(ppalCanvas, canvasRefs);
  }, []);

  useEffect(() => {
    nce.updateRefs();

    let animationFrameId;
    let frameCount = 0;
    const render = () => {
      frameCount += 1;
      nce.update();
      nce.draw(frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [nbLayers]);

  if (nbLayers !== canvasRefs.current.length) {
    // add or remove refs
    canvasRefs.current = Array(nbLayers * 2)
      .fill()
      .map((_, i) => {
        return canvasRefs.current[i] || createRef();
      });
  }

  const canvasComps = new Array(nbLayers).fill().map((_, j) => {
    return (
      <LayerVisualization
        className='canvas'
        layerType={layerTypes[2 * j + 1]}
        layerIx={2 * j}
        nce={nce}
        denseCanvasRef={canvasRefs.current[2 * j]}
        actCanvasRef={canvasRefs.current[2 * j + 1]}
      />
    );
  });
  return (
    <Container>
      <Row className='row-content'>
        <Col>
          <Card className='text-center'>
            <CardTitle>
              <h2>Network input</h2>
            </CardTitle>
            <CardBody>
              <canvas width='200' height='200' ref={ppalCanvas} />
            </CardBody>
            <Loss nce={nce} />
          </Card>
        </Col>
      </Row>
      {canvasComps}
    </Container>
  );
};

export default CanvasContainer;
