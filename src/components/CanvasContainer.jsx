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
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
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
  return <CardFooter className='p-0'>Loss: {loss}</CardFooter>;
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

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === nbLayers - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? nbLayers - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
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
  const layerSlides = new Array(nbLayers).fill().map((_, j) => {
    return (
      <CarouselItem>
        <LayerVisualization
          className='canvas'
          layerIx={2 * j}
          nce={nce}
          denseCanvasRef={canvasRefs.current[2 * j]}
          actCanvasRef={canvasRefs.current[2 * j + 1]}
        />
      </CarouselItem>
    );
  });

  return (
    <Container>
      <Row className='row-content'>
        <Col xs={{ size: 6, offset: 3 }}>
          <Card className='text-center'>
            <CardTitle className='mb-0 '>
              <h3>Network input</h3>
            </CardTitle>
            <CardBody className='pt-0 '>
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
      <Carousel activeIndex={activeIndex} next={next} previous={previous}>
        {/* <CarouselIndicators
          items={items}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        /> */}
        {layerSlides}
        <CarouselControl
          direction='prev'
          directionText='Previous'
          onClickHandler={previous}
        />
        <CarouselControl
          direction='next'
          directionText='Next'
          onClickHandler={next}
        />
      </Carousel>
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
