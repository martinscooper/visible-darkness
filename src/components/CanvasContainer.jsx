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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import LayerVisualization from './LayerVisualization';
import PropTypes from 'prop-types';
import NetworkCanvasEngine from '../drawing/NetworkCanvasEngine';
import useNetworkCanvasEngine from '../hooks/useNetworkCanvasEngine';
import { LayerModal } from './LayerModal';
// TODO: add learning rate bar
// TODO: add different datasets
// todo: add image for selecting activations functions

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
  const nbLayers = nce.getNbLayers() / 2;
  const canvasRefs = useRef([]);
  const ppalCanvas = useRef(null);
  const layerTypes = nce.getLayerTypes();
  const nbNeuronsPerLayer = nce.getNbNeurons();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleSubmit = (nbNeurons, activation) => {
    nce.addLayer(nbNeurons, activation);
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
        // layerType={layerTypes[2 * j + 1]}
        // nbNeurons={nbNeuronsPerLayer[2 * j]}
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
        <Col xs={{ size: 6, offset: 3 }}>
          <Card className='text-center'>
            <CardTitle>
              <h2>Network input</h2>
            </CardTitle>
            <CardBody>
              <div className='square'>
                <canvas
                  className='content '
                  width='300'
                  height='300'
                  ref={ppalCanvas}
                />
              </div>
            </CardBody>
            <Loss nce={nce} />
          </Card>
        </Col>
      </Row>
      {canvasComps}
      <Row className='mt-5'>
        <Col xs={12} className='text-center'>
          <Button
            onClick={toggleModal}
            color='dark'
            style={{ 'border-radius': '50%' }}
          >
            <FontAwesomeIcon icon={faPlus} size='2x'></FontAwesomeIcon>
          </Button>
          <LayerModal
            modalFunction='Add'
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            handleSubmit={handleSubmit}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CanvasContainer;
