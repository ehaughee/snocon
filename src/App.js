import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

// Semantic UI
import { Container } from 'semantic-ui-react'

// Components
import Forecasts from './scenes/forecasts';
import Map from './scenes/map/components/Map.js'
// import FutureTemperatureGraph from './graphs/FutureTemperatureGraph';

class App extends Component {
  render() {
    return (
      <Container>
        <Map/>
        <Forecasts />
      </Container>
    );
  }
}

export default App;
