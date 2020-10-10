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
  const { isModalOpen, toggleModal } = props;

  const handleSubmit = (e) => {
    alert('handle login');
    toggleModal();
    e.preventDefault();
  };

  return (
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Modify layer</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for='nbNeurons'>Number of neurons</Label>
            <Input
              type='number'
              id='nbNeurons'
              name='nbNeurons'
              placeholder={6}
            />
          </FormGroup>
          <FormGroup>
            <Label for='activation'>Activation functions</Label>
            <Input type='select' id='activation' name='activation'>
              <option>Tanh</option>
              <option>Sigmoid</option>
              <option>Relu</option>
              <option>Linear</option>
            </Input>
          </FormGroup>
          <Button type='submit' value='submit' color='primary'>
            Modify
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};
