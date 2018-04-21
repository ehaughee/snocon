import React, { Component } from 'react';
import './Forecast.css';

// Semantic UI Components
import { Item, Dimmer, Loader, Header } from 'semantic-ui-react'

// Graph Components
import FutureTemperatureGraph from '../../../graphs/FutureTemperatureGraph';
import FutureSnowLevelGraph from '../../../graphs/FutureSnowLevelGraph';

let convert = require('convert-units');
let moment = require('moment');

class Forecast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      gridpoint: {
        snowLevels: [],
        temperatures: [],
        updated: '',
        elevation: '',
      },
      forecasts: [],
    }
  }

  componentDidMount() {
    this.getPointData(this.props.point);
  }

  getPointData(point) {
    const pointUrl = `https://api.weather.gov/points/${point.lat},${point.lon}`;
    fetch(pointUrl).then((response) => {
      return response.json();
    }).then((data) => {
      const gridPoint = {
        cwa: data.properties.cwa,
        x: data.properties.gridX,
        y: data.properties.gridY,
      };

      this.getForecast(gridPoint);
      this.getGridData(gridPoint);
    });
  }

  getForecast(gridPoint) {
    // TODO: extract this url
    const forecastUrl =
      `https://api.weather.gov/gridpoints/${gridPoint.cwa}/${gridPoint.x},${gridPoint.y}/forecast`;

    fetch(forecastUrl).then((response) => {
      return response.json();
    }).then((data) => {
      this.setState({
        loading: false,
        forecasts: data.properties.periods,
      });
    });
  }

  getGridData(gridPoint) {
    const gridpointUrl =
      `https://api.weather.gov/gridpoints/${gridPoint.cwa}/${gridPoint.x},${gridPoint.y}`;

    fetch(gridpointUrl).then((response) => {
      return response.json();
    }).then((data) => {
      // TODO: Process closer to rendering
      const updated = moment(data.properties.updateTime).format('MMM Do hh:mm a');
      const elevation = `${convert(data.properties.elevation.value).from('m').to('ft').toFixed(0)} ft`;
      this.setState({
        gridpoint: {
          snowLevels: data.properties.snowLevel.values,
          temperatures: data.properties.temperature.values,
          updated: updated,
          elevation: elevation,
        },
      })
    });
  }

  createEntry(props) {
    return (
      <Item key={props.number}>
        <Item.Image size='tiny' src={props.icon} />
        <Item.Content>
          <Item.Header as='h3'>{props.name}</Item.Header>
          <Item.Meta>{props.shortForecast}</Item.Meta>
          <Item.Description>
            {props.detailedForecast}
          </Item.Description>
        </Item.Content>
      </Item>
    );
  }

  renderFutureTempGraph() {
    if (this.state.gridpoint.temperatures.length > 0) {
      return (
        <div style={{height: '250px'}}>
          <FutureTemperatureGraph temperatures={this.state.gridpoint.temperatures} />
        </div>
      );
    } else {
      return '';
    }
  }

  renderFutureSnowLevelGraph() {
    if (this.state.gridpoint.snowLevels.length > 0) {
      return (
        <div style={{height: '250px'}}>
          <FutureSnowLevelGraph snowLevels={this.state.gridpoint.snowLevels} />
        </div>
      );
    } else {
      return '';
    }
  }

  render() {
    return (
      <React.Fragment>
        <Dimmer active={this.state.loading ? true : false}>
          <Loader>
            Loading...
          </Loader>
        </Dimmer>
        <Header className="location-header" dividing size="huge">
          {this.props.name}
        </Header>
        {this.renderFutureTempGraph()}
        {this.renderFutureSnowLevelGraph()}
        <div>Last Updated: {this.state.gridpoint.updated}</div>
        <div>Elevation: {this.state.gridpoint.elevation}</div>
        {/* TODO: Extract this to its own component */}
        <Item.Group className="forecast-entries">
          {this.state.forecasts.map(this.createEntry)}
        </Item.Group>
      </React.Fragment>
    );
  }
}

export default Forecast;
