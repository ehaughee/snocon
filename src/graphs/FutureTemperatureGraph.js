import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

let convert = require('convert-units');
let moment = require('moment');

class FutureTemperatureGraph extends Component {
  constructor(props) {
    super(props);

    const dates = this.props.temperatures.map(({validTime, value}) => {
      return moment(validTime.match(/(.*?)\//)[1]).format('HH:mm DD MMM');
    });

    const temps = this.props.temperatures.map(({validTime, value}) => {
      return convert(value).from('C').to('F').toFixed(0);
    });

    this.state = {
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Temp (F)',
            fill: false,
            data: temps,
          },
        ],
      },
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 32,
            borderColor: 'red',
            borderWidth: 4,
            label: {
              enabled: true,
              content: 'Freezing',
            },
          },
        ],
      },
    };
  }

  render() {
     return (
      <Line data={this.state.data} options={this.options} />
    );
  }
}

export default FutureTemperatureGraph;
