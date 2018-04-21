import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

let convert = require('convert-units');
let moment = require('moment');

class FutureSnowFallGraph extends Component {
  constructor(props) {
    super(props);

    const dates = this.props.snowfallAmounts.map(({validTime, value}) => {
      return moment(validTime.match(/(.*?)\//)[1]).format('HH:mm dd MMM DD');
    });

    const levels = this.props.snowfallAmounts.map(({validTime, value}) => {
      return convert(value).from('mm').to('in').toFixed(0);
    });

    const lightBlueColor = 'rgb(66, 134, 244)';

    this.state = {
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Snow Fall (in)',
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
    };
  }

  render() {
     return (
      <Line data={this.state.data} options={this.options} />
    );
  }
}

export default FutureSnowFallGraph;
