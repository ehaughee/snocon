import React, { Component } from 'react';
import './ForecastList.css';

// Semantic UI Components
import { Segment } from 'semantic-ui-react';

// Components
import Forecast from './Forecast';

const config = require('../../../config/config.json');

class ForecastList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: config.locations
    };
  }

  createLocation(props) {
    return (
      <Segment key={props.name}>
        <Forecast name={props.name} {...props} />
      </Segment>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.state.locations.map(this.createLocation)}
      </React.Fragment>
    );
  }
}

export default ForecastList;
