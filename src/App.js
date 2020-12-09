import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

// Semantic UI
import { Container, Grid } from 'semantic-ui-react'

// Components
import Forecasts from './scenes/forecasts';
import Map from './scenes/map/components/Map.js'

const config = require('./config/config.json');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: {
        lng: -121,
        lat: 47.5,
        zoom: 8
      }
    };
  }

  onFocus = ({ lat, lng, zoom }) => {
    this.setState({ focus: { lat, lng, zoom } });
  };

  render() {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Map
                locations={config.locations}
                focus={this.state.focus}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Forecasts
                onFocus={this.onFocus}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default App;
