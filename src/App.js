import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

// Semantic UI
import { Container } from 'semantic-ui-react'

// Components
import Forecasts from './scenes/forecasts';

class App extends Component {
  render() {
    return (
      <Container>
        <Forecasts />
      </Container>
    );
  }
}

export default App;
