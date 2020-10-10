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
  const {
    layerType,
    nbNeurons,
    layerIx,
    nce,
    denseCanvasRef,
    actCanvasRef,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const layerIxForDisplaying = layerIx / 2 + 1;
  const cycle = () => {
    nce.cycle(layerIx);
    nce.cycle(layerIx + 1);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const removeLayer = () => {
    alert('remove layer');
  };

  const modify = () => {
    toggleModal();
  };

  // const [dropdownOpen, setdropdownOpen] = useState(false);

  // const toggle = () => {
  //   setdropdownOpen(!!!dropdownOpen);
  // };

  return (
    <div>
      <Card className='mb-3'>
        <CardHeader tag='h4' className='text-center'>
          Layer {layerIxForDisplaying}
        </CardHeader>
        <CardBody>
          <Row className='m-0'>
            <Col xm={12} md={5} className='d-flex justify-content-center mb-2'>
              <h6>Nb. neurons: {nbNeurons}</h6>
            </Col>
            <Col xm={12} md={5} className='d-flex justify-content-center mb-2'>
              <h6>Activation: {layerType}</h6>
            </Col>
            <Col xm={12} md={5} className='d-flex justify-content-center mb-3'>
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
            <Col xm={12} md={2} className='d-flex justify-content-center'>
              <ButtonGroup vertical className='buttons' size='sm'>
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
        isModalOpen={isModalOpen}
        setIsOpenModal={setIsModalOpen}
        toggleModal={toggleModal}
      />
    </div>
  );
};

export default LayerVisualization;
