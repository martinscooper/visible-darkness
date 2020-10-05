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
const CanvasVis = (props) => {
  const { layerType, layerIx, nce, canvasRef } = props;
  const handleClick = () => {
    nce.cycle(layerIx);
  };

  const [dropdownOpen, setdropdownOpen] = useState(false);

  const toggle = () => {
    setdropdownOpen(!!!dropdownOpen);
  };

  return (
    <Card>
      <CardTitle className='mb-0'>
        <Container>
          <Row>
            <Col>
              <CardText>
                {layerType} layer ({layerIx + 1})
              </CardText>
            </Col>
            <Col>
              {layerIx % 2 === 1 ? (
                <div className='dropdownbutton'>
                  <Dropdown isOpen={dropdownOpen} toggle={toggle} size='sm'>
                    <DropdownToggle caret />
                    <DropdownMenu>
                      <DropdownItem header>Select Activation</DropdownItem>
                      <DropdownItem>Tanh</DropdownItem>
                      <DropdownItem>Sigmoid</DropdownItem>
                      <DropdownItem>ReLu</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              ) : null}
            </Col>
          </Row>
        </Container>
      </CardTitle>
      <CardBody className='text-center'>
        <canvas onClick={handleClick} className='square' ref={canvasRef} />
      </CardBody>
    </Card>
  );
};

export default CanvasVis;
