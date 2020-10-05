import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  Jumbotron,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <Navbar dark expand='md' fixed='top'>
        <div className='container'>
          <NavbarToggler onClick={() => setIsNavOpen(!isNavOpen)} />
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
      <Jumbotron className='jumbotron'>
        <div className='container'>
          <div className='row row-header'>
            <div className='col-12 col-sm-6'>
              <h1>visible dakness.</h1>
              <p align='justify'>
                This single page application was just made to explore and
                practice the front-end development using React and Bootstrap.
                Also, I wanted to explore how React manages refs to the html
                document. I am very interested (but a noob) in neural nerwork
                visualization and new to web development. So this was a perfect
                opportunity to learn new things. The code to create and train
                the neural networks use the very useful, yet old, ConvNetJS
                library. Kharpaty also wrote some{' '}
                <a href='https://cs.stanford.edu/people/karpathy/convnetjs/'>
                  fantastic demos.
                </a>{' '}
                . What you see bellow is a semi-copy of the{' '}
                <a href='https://cs.stanford.edu/people/karpathy/convnetjs/demo/classify2d.html'>
                  "Classify 2d" demo
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </Jumbotron>
    </>
  );
};

export default Header;
