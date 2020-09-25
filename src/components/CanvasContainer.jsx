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
import CanvasVis from './CanvasVis';
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
  const [nbLayers, setNbLayers] = useState(nce.getNbLayers());
  const canvasRefs = useRef([]);
  const ppalCanvas = useRef(null);
  const layerTypes = nce.getLayerTypes();

  const addLayer = () => {
    if (nce.getNbLayers() > nbLayers) {
      setNbLayers((prev) => prev + 1);
    }
  };

  const removeLayer = () => {
    if (nbLayers > 0) {
      setNbLayers((previous) => previous - 1);
    }
  };

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
    canvasRefs.current = Array(nbLayers)
      .fill()
      .map((_, i) => {
        return canvasRefs.current[i] || createRef();
      });
  }

  const canvasComps = new Array(nbLayers).fill().map((i, j) => {
    return (
      <Col xm={12} md={6} className='mt-3' key={j}>
        <CanvasVis
          className='canvas'
          layerType={layerTypes[j]}
          layerIx={j}
          nce={nce}
          canvasRef={canvasRefs.current[j]}
        />
      </Col>
    );
  });
  return (
    <Container>
      <Row>
        <Col md={10}>
          <Row>
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
          <Row>{nbLayers > 0 ? canvasComps : null}</Row>
        </Col>
        <Col md={2}>
          <Row>
            <Col>
              <ButtonGroup vertical>
                <Button className='m-1' color='primary' onClick={addLayer}>
                  Add layer
                </Button>
                <Button className='m-1' color='primary' onClick={removeLayer}>
                  Remove layer
                </Button>
                <Button
                  className='m-1'
                  color='primary'
                  onClick={() => nce.cycleAll()}
                >
                  Cycle all
                </Button>
                <Button
                  className='m-1'
                  color='danger'
                  onClick={() => nce.reload()}
                >
                  Reload
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default CanvasContainer;
