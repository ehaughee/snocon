import React, { Component } from 'react';
import './Forecast.css';

// Semantic UI Components
import { Item, Dimmer, Loader, Header, Accordion, Icon, Label } from 'semantic-ui-react'

// Graph Components
import FutureTemperatureGraph from '../../../graphs/FutureTemperatureGraph';
import FutureSnowLevelGraph from '../../../graphs/FutureSnowLevelGraph';
import FutureSnowFallGraph from '../../../graphs/FutureSnowFallGraph';

const convert = require('convert-units');
const moment = require('moment');
const config = require('../../../config/config.json');

class Forecast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndices: new Set(),
      loading: true,
      gridpoint: {
        snowLevels: [],
        snowfallAmounts: [],
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
    // TODO: extract this URL
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
    // TODO: Extract this URL
    const gridpointUrl =
      `https://api.weather.gov/gridpoints/${gridPoint.cwa}/${gridPoint.x},${gridPoint.y}`;

    fetch(gridpointUrl).then((response) => {
      return response.json();
    }).then((data) => {
      const updated = moment(data.properties.updateTime);
      const elevation = convert(data.properties.elevation.value).from('m').to('ft').toFixed(0);
      this.setState({
        gridpoint: {
          snowLevels: data.properties.snowLevel.values,
          snowfallAmounts: data.properties.snowfallAmount.values,
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
          <Item.Header as='h3'>
            {props.name}
            <Label>
              <Icon name='thermometer half' />
              {`${props.temperature} ${props.temperatureUnit}`}
              {props.temperatureTrend ? ` and ${props.temperatureTrend}` : ''}
            </Label>
          </Item.Header>
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
      return 'No data...';
    }
  }

  renderFutureSnowLevelGraph() {
    if (this.state.gridpoint.snowLevels.length > 0) {
      return (
        <div style={{height: '250px'}}>
          <FutureSnowLevelGraph
            snowLevels={this.state.gridpoint.snowLevels}
            elevation={this.state.gridpoint.elevation}
          />
        </div>
      );
    } else {
      return 'No data...';
    }
  }

  renderFutureSnowFallGraph() {
    if (this.state.gridpoint.snowfallAmounts.length > 0) {
      return (
        <div style={{height: '250px'}}>
          <FutureSnowFallGraph
            snowfallAmounts={this.state.gridpoint.snowfallAmounts}
          />
        </div>
      );
    } else {
      return 'No data...';
    }
  }

  renderGraphs() {
    return (
      <Accordion>
        <Accordion.Title active={this.state.activeIndices.has(0)} index={0} onClick={this.handleAccClick}>
          <Icon name='dropdown' />
          Future Temperature Graph
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndices.has(0)}>
          {this.renderFutureTempGraph()}
        </Accordion.Content>

        <Accordion.Title active={this.state.activeIndices.has(1)} index={1} onClick={this.handleAccClick}>
          <Icon name='dropdown' />
          Future Snow Level Graph
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndices.has(1)}>
          {this.renderFutureSnowLevelGraph()}
        </Accordion.Content>

        <Accordion.Title active={this.state.activeIndices.has(2)} index={2} onClick={this.handleAccClick}>
          <Icon name='dropdown' />
          Future Snow Fall Graph
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndices.has(2)}>
          {this.renderFutureSnowFallGraph()}
        </Accordion.Content>
      </Accordion>
    );
  }

  handleAccClick = (_e, titleProps) => {
    const { index } = titleProps;
    let activeIndices = new Set(this.state.activeIndices);

    if (activeIndices.has(index)) {
      activeIndices.delete(index);
    } else {
      activeIndices.add(index);
    }

    this.setState({ activeIndices: activeIndices });
  };

  handleLocateClick = (_e, labelProps) => {
    const location = config.locations.find(loc => loc.id === labelProps.locationId);
    const { lat, lon } = location.point;
    this.props.onFocus({
      lat,
      lng: lon,
      zoom: location.focus.zoom
    });
  };

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
          <Label title="Last updated">
            <Icon name='time' />
            {this.state.gridpoint.updated ? this.state.gridpoint.updated.format('MMM Do hh:mm a') : ''}
          </Label>
          <Label
            as="a"
            color='blue'
            onClick={this.handleLocateClick}
            locationId={this.props.id}
          >
            <Icon name="location arrow" />
            Locate on map
          </Label>
        </Header>

        <div>
          <strong>Elevation:</strong> {this.state.gridpoint.elevation} ft
        </div>

        {this.renderGraphs()}

        {/* TODO: Extract this to its own component */}
        <Item.Group className="forecast-entries">
          {this.state.forecasts.map(this.createEntry)}
        </Item.Group>
      </React.Fragment>
    );
  }
}

export default Forecast;
