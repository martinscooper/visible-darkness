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

// TODO: make canvas responsive and square
// TODO: add select activation options
// TODO: add learning rate bar
// TODO: add different datasets

const Loss = (props) => {
  return <CardFooter>Loss: {props.loss}</CardFooter>;
};

const Canvas = (props) => {
  const { nce } = props;
  const [nbLayers, setNbLayers] = useState(3);
  const [loss, setLoss] = useState(0.0);
  const canvasRefs = useRef([]);
  const ppalCanvas = useRef(null);
  const layerTypes = nce.getLayerTypes();

  // alert(
  //   `component\nnbLayers: ${nbLayers} \n canvasRefs: ${canvasRefs.current.length}`,
  // );

  const addLayer = () => {
    if (nce.getNbLayers() - 1 > nbLayers) {
      setNbLayers((prev) => prev + 1);
    }
  };

  const removeLayer = () => {
    if (nbLayers > 0) {
      setNbLayers((previous) => previous - 1);
    } else if (nbLayers === 0) {
      setNbLayers(0);
    }
  };

  useEffect(() => {
    // alert(
    //   `useEffect 1\nnbLayers: ${nbLayers} \n canvasRefs: ${canvasRefs.current.length}`,
    // );
    nce.prepareToDraw(ppalCanvas, canvasRefs);
  }, []);

  useEffect(() => {
    // alert(
    //   `useEffec2 1\nnbLayers: ${nbLayers} \n canvasRefs: ${canvasRefs.current.length}`,
    // );
    nce.updateRefs();

    let animationFrameId;
    const render = () => {
      nce.update();
      nce.draw();
      setLoss(nce.getLoss());
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
    // alert(
    //   `if\nnbLayers: ${nbLayers} \n canvasRefs: ${canvasRefs.current.length}`,
    // );
  } else {
    // alert(
    //   `else\nnbLayers: ${nbLayers} \n canvasRefs: ${canvasRefs.current.length}`,
    // );
  }

  const canvasComps = new Array(nbLayers).fill().map((i, j) => {
    return (
      <Col sm={6} md={4} className='mt-3' key={j}>
        <Card className='text-center'>
          <CardTitle className='mb-0'>
            {layerTypes[j]} layer ({j + 1})
          </CardTitle>
          <CardBody>
            <Col>
              <Button
                outline
                color='info'
                className='mb-1'
                onClick={() => nce.cycle(j)}
                size='sm'
              >
                Cycle neurons
              </Button>
            </Col>
            <canvas width='200' height='200' ref={canvasRefs.current[j]} />
          </CardBody>
        </Card>
      </Col>
    );
  });
  // TODO: force canvas to depend on parent grid size
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
                <Loss loss={loss} />
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

export default Canvas;
