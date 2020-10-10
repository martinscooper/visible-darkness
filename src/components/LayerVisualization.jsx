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
} from 'reactstrap';

const LayerVisualization = (props) => {
  const { layerType, layerIx, nce, denseCanvasRef, actCanvasRef } = props;

  const handleClick = () => {
    nce.cycle(layerIx);
    nce.cycle(layerIx + 1);
  };

  // const [dropdownOpen, setdropdownOpen] = useState(false);

  // const toggle = () => {
  //   setdropdownOpen(!!!dropdownOpen);
  // };

  return (
    <Card className='mb-3'>
      <CardHeader tag='h4' className='text-center'>
        Layer {layerIx}
      </CardHeader>
      <CardBody>
        <Row className='m-0'>
          <Col xm={12} md={5} className='d-flex justify-content-center mb-2'>
            <h5>Nb. neurons: {}</h5>
          </Col>
          <Col xm={12} md={5} className='d-flex justify-content-center mb-2'>
            <h5>Activation: {layerType}</h5>
          </Col>
          <Col xm={12} md={5} className='d-flex justify-content-center'>
            <div className='square'>
              <canvas
                className='content '
                onClick={handleClick}
                ref={denseCanvasRef}
                width='400'
                height='400'
              />
            </div>
          </Col>
          <Col xm={12} md={5} className='d-flex justify-content-center'>
            <div className='square'>
              <canvas
                className='content '
                onClick={handleClick}
                ref={actCanvasRef}
                width='400'
                height='400'
              />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default LayerVisualization;
