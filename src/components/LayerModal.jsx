import React, { useState } from 'react';

import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';

export const LayerModal = (props) => {
  const { modalFunction, isModalOpen, toggleModal, handleSubmit } = props;
  const [nbNeurons, setNbNeurons] = useState(4);
  const [activation, setActivation] = useState('tanh');

  const onSubmit = (e) => {
    handleSubmit(nbNeurons, activation);
    toggleModal();
    e.preventDefault();
  };
  return (
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>{modalFunction} layer</ModalHeader>
      <ModalBody>
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label for='nbNeurons'>Number of neurons</Label>
            <Input
              type='number'
              id='nbNeurons'
              name='nbNeurons'
              placeholder={6}
              value={nbNeurons}
              onChange={(e) => setNbNeurons(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for='activation'>Activation functions</Label>
            <Input
              type='select'
              id='activation'
              name='activation'
              onChange={(e) => setActivation(e.target.value)}
              value={activation}
            >
              <option value='tanh'>Tanh</option>
              <option value='sigmoid'>Sigmoid</option>
              <option value='relu'>Relu</option>
              <option value='linear'>Linear</option>
            </Input>
          </FormGroup>
          <Button type='submit' value='submit' color='primary'>
            {modalFunction}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};
