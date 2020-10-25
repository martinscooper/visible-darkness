import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Container,
  Col,
  Row,
  CardHeader,
  CardSubtitle,
  ButtonGroup,
  Button,
} from 'reactstrap';

import { LayerModal } from './LayerModal';

const LayerVisualization = (props) => {
  const { layerIx, nce, denseCanvasRef, actCanvasRef } = props;
  const layerType = nce.getLayerTypes()[layerIx + 1];
  const nbNeurons = nce.getNbNeurons()[layerIx];
  const layerIxForDisplaying = layerIx / 2 + 1;
  const [displayingNeurons, setDisplayingNeurons] = useState({ d0: 0, d1: 1 });
  const cycle = () => {
    nce.cycle(layerIx, setDisplayingNeurons);
    nce.cycle(layerIx + 1, setDisplayingNeurons);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const removeLayer = () => {
    nce.removeLayer(layerIx);
  };

  const modify = () => {
    toggleModal();
  };

  const handleSubmit = (nbNeurons, activation) => {
    nce.modifyLayer(layerIxForDisplaying, nbNeurons, activation);
  };

  // const [dropdownOpen, setdropdownOpen] = useState(false);

  // const toggle = () => {
  //   setdropdownOpen(!!!dropdownOpen);
  // };

  return (
    <div>
      <Card className='mb-3 '>
        <CardHeader className='p-0 text-center'>
          <h4 className=''>Layer {layerIxForDisplaying}</h4>
          <p className='font-italic font-weight-lighter mb-0'>
            displaying neurons {displayingNeurons.d0} and {displayingNeurons.d1}
          </p>
        </CardHeader>
        <CardBody>
          <Row className='m-0 row-content'>
            <Col
              xm={12}
              md={{ size: 5, offset: 1 }}
              className='d-flex justify-content-center mb-2'
            >
              <h6>
                Nb. neurons:{' '}
                <span className='font-weight-normal'>{nbNeurons}</span>
              </h6>
            </Col>
            <Col xm={12} md={5} className='d-flex justify-content-center mb-2'>
              <h6>
                Activation:{' '}
                <span className='font-italic font-weight-normal text-capitalize'>
                  {layerType}
                </span>
              </h6>
            </Col>
            <Col
              xm={12}
              md={{ size: 5, offset: 1 }}
              className='d-flex justify-content-center mb-3'
            >
              <div className='square'>
                <canvas
                  className='content p-3'
                  ref={denseCanvasRef}
                  width='300'
                  height='300'
                />
              </div>
            </Col>
            <Col xm={12} md={5} className='d-flex justify-content-center mb-3'>
              <div className='square'>
                <canvas
                  className='content '
                  ref={actCanvasRef}
                  width='300'
                  height='300'
                />
              </div>
            </Col>
            <Col xm={12} className='d-flex justify-content-center'>
              <ButtonGroup className='buttons' size='sm'>
                <Button color='danger' onClick={removeLayer}>
                  Remove layer
                </Button>
                <Button color='success' onClick={cycle}>
                  Cycle
                </Button>
                <Button color='primary' onClick={modify}>
                  Modify...
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <LayerModal
        modalFunction='Modify'
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default LayerVisualization;
