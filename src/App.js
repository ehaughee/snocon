import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

// Semantic UI
import { Container, Grid } from 'semantic-ui-react'

// Components
import Forecasts from './scenes/forecasts';
import Map from './scenes/map/components/Map.js'
// import FutureTemperatureGraph from './graphs/FutureTemperatureGraph';

const config = require('./config/config.json');

class App extends Component {
  render() {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Map locations={config.locations}/>
            </Grid.Column>
            <Grid.Column width={8}>
              <Forecasts />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default App;
