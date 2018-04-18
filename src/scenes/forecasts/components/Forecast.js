import React, { Component } from 'react';
import './Forecast.css';

// Semantic UI Components
import { Item, Dimmer, Loader, Header } from 'semantic-ui-react'

class Forecast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      forecasts: [],
    }
  }

  componentDidMount() {
    this.getForecast(this.props.point);
  }

  getForecast(point) {
    // TODO: extract this url
    const apiUrl = `https://api.weather.gov/points/${point.lat},${point.lon}/forecast`;
    fetch(apiUrl).then(function(response) {
      return response.json();
    }).then((data) => {
      this.setState({
        loading: false,
        forecasts: data.properties.periods,
      });
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

  render() {
    return (
      <React.Fragment>
        <Dimmer active={this.state.loading ? true : false}>
          <Loader>
            Loading...
          </Loader>
        </Dimmer>
        <Header dividing size="huge">
          {this.props.name}
        </Header>
        {this.state.forecasts.map(this.createEntry)}
      </React.Fragment>
    );
  }
}

export default Forecast;
