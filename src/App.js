import React from 'react';
import './App.css';
import Main from './components/MainComponent';
import { Component } from 'react';
import { configureStore } from './redux/Store';
import { BrowserRouter } from 'react-router-dom';
const store = configureStore();

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Main />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
