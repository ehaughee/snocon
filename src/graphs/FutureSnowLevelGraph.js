import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

let convert = require('convert-units');
let moment = require('moment');
let annotation = require('chartjs-plugin-annotation');

class FutureSnowLevelGraph extends Component {
  constructor(props) {
    super(props);

    const dates = this.props.snowLevels.map(({validTime, value}) => {
      return moment(validTime.match(/(.*?)\//)[1]).format('HH:mm dd MMM DD');
    });

    const levels = this.props.snowLevels.map(({validTime, value}) => {
      return convert(value).from('m').to('ft').toFixed(0);
    });

    const lightBlueColor = 'rgb(66, 134, 244)';

    this.state = {
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Snow Level (ft)',
            fill: false,
            backgroundColor: lightBlueColor,
            borderWidth: 2,
            borderColor: 'black',
            pointBorderColor: lightBlueColor,
            data: levels,
          },
        ],
      },
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: [annotation],
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.props.elevation,
            borderColor: 'red',
            borderWidth: 1,
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

export default FutureSnowLevelGraph;
