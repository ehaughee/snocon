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

  createLocation = (location) => {
    return (
      <Segment key={location.name}>
        <Forecast
          name={location.name}
          onFocus={this.props.onFocus}
          {...location}
        />
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
