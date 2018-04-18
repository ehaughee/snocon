import React, { Component } from 'react';
import './ForecastList.css';

// Semantic UI Components
import { Item, Segment } from 'semantic-ui-react'

// Components
import Forecast from './Forecast';

class ForecastList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO: Extract this
      locations: [
        {
          name: 'Crystal Mountain',
          point: {
            lat: '46.9388',
            lon: '-121.4731',
          }
        },
        {
          name: 'Stevens Pass',
          point: {
            lat: '47.7456',
            lon: '-121.0892',
          }
        },
        {
          name: 'Mt Baker',
          point: {
            lat: '48.858',
            lon: '-121.6697',
          }
        }
      ]
    };
  }

  createLocation(props) {
    return (
      <Segment key={props.name} className="location-segment">
        <Item.Group>
          <Forecast name={props.name} {...props} />
        </Item.Group>
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
