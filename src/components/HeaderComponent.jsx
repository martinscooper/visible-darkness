import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  Jumbotron,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <Navbar dark expand='md'>
        <div className='container'>
          <NavbarToggler onClick={() => setIsNavOpen(!!!isNavOpen)} />
          <NavbarBrand className='mr-auto' href='/'>
            <img
              src={'images/logo.jpeg'}
              heigh='30'
              width='41'
              alt='Ristorante Con Fusion'
            />
          </NavbarBrand>
          <Collapse isOpen={isNavOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink className='nav-link' to='/home'>
                  <span className='fa fa-home fa-lg'> Home </span>
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </div>
      </Navbar>
      <Jumbotron>
        <div className='container'>
          <div className='row row-header'>
            <div className='col-12 col-sm-6'>
              <h1>visible dakness.</h1>
              <p align='justify'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus quis nisl urna. Maecenas gravida condimentum ipsum. Ut
                nec molestie elit. Aenean lacinia vel nibh sit amet malesuada.
                Fusce lobortis lectus metus, eu gravida purus mattis non.
                Phasellus convallis porttitor ipsum viverra rhoncus. Nunc
                egestas congue felis at finibus. In gravida, erat ut efficitur
                pulvinar, ipsum erat tristique libero, eu placerat arcu magna a
                sem. Vestibulum commodo enim mauris, in imperdiet lorem
                consectetur ut. Fusce ultrices semper metus sollicitudin
                eleifend. Phasellus mi quam, ornare ut vestibulum consectetur,
                luctus quis tortor. Nullam ac justo massa. In sed ultricies
                orci.
              </p>
            </div>
          </div>
        </div>
      </Jumbotron>
    </>
  );
};

export default Header;
