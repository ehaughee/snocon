import React, { Component } from 'react';

// Components
import ForecastList from './components/ForecastList';

class Forecasts extends Component {
  render() {
    return (
      <ForecastList
        onFocus={this.props.onFocus}
      />
    );
  }
}

export default Forecasts;
