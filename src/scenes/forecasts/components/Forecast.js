import React, { Component } from 'react';
import './Forecast.css';

// Semantic UI Components
import { Item, Dimmer, Loader, Header, Accordion, Icon, Label } from 'semantic-ui-react'

// Graph Components
import FutureTemperatureGraph from '../../../graphs/FutureTemperatureGraph';
import FutureSnowLevelGraph from '../../../graphs/FutureSnowLevelGraph';

let convert = require('convert-units');
let moment = require('moment');

class Forecast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: -1,
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
      return 'No data loaded yet';
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

  handleAccClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
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
          <Label>
            <Icon name='time' /> {this.state.gridpoint.updated}
          </Label>
        </Header>

        <div>
          <strong>Elevation:</strong> {this.state.gridpoint.elevation}
        </div>

        <Accordion>
          <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleAccClick}>
            <Icon name='dropdown' />
            Future Temperature Graph
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 0}>
            {this.renderFutureTempGraph()}
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 1} index={1} onClick={this.handleAccClick}>
            <Icon name='dropdown' />
            Future Snow Level Graph
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 1}>
            {this.renderFutureSnowLevelGraph()}
          </Accordion.Content>
        </Accordion>

        {/* TODO: Extract this to its own component */}
        <Item.Group className="forecast-entries">
          {this.state.forecasts.map(this.createEntry)}
        </Item.Group>
      </React.Fragment>
    );
  }
}

export default Forecast;
