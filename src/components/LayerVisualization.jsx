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
    <Row className='my-2 row-content borderColor '>
      <Col xm={12} md={6} className='borderColor'>
        <div className='square  '>
          <canvas
            className='content'
            onClick={handleClick}
            ref={denseCanvasRef}
            width='200'
            height='200'
          />
        </div>
      </Col>
      <Col xm={12} md={6} className='borderColor'>
        <div className='square'>
          <canvas
            className='content'
            onClick={handleClick}
            ref={actCanvasRef}
            width='200'
            height='200'
          />
        </div>
      </Col>
    </Row>
  );
};

export default LayerVisualization;
