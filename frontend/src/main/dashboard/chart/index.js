import React from "react";
import format from "date-fns/format";
import Typography from '@mui/material/Typography';

import {
    Chart as ChartJS,
    LinearScale,
    TimeSeriesScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
  } from 'chart.js';
import {Scatter} from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(LinearScale, TimeSeriesScale, PointElement, LineElement, Tooltip, Legend);

export default class Chart extends React.Component {
  constructor(props) {
    super(props);

    // props:
    // {
    //   point: {dis: String, unit: String}
    //   his: [{x: Date, y: Float}]
    // }
  }

  render() {
    if (this.props.his.length == 0) {
      return (
        <Typography align="center" >No data</Typography>
      );
    } else {
      const label = this.props.point.dis
      const unit = this.props.point.unit;
      return (
        <Scatter 
          options={{
            scales: {
              x: {
                type: 'time',
              },
              y: {
                ticks: {
                  callback: (value) => {
                    return formatValueAndUnit(value, unit);
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = "";
                    if (context.parsed.x !== null) {
                      const date = context.parsed.x
                      label += format(date, "MMM d, Y")
                    }
                    label += ": "
                    if (context.parsed.y !== null) {
                      const value = context.parsed.y;
                      label += formatValueAndUnit(value, unit);
                    }
                    return label;
                  }
                },
                xAlign: "center",
                yAlign: "top" 
              }
            },
            showLine: true,
            backgroundColor: "rgba(25,118,210,1)",
            borderColor: "rgba(25,118,210,1)",
            maintainAspectRatio: false
          }}
          data={{
            datasets: [{
              label: label,
              data: this.props.his,
            }]
          }}
        />
      );
    }
  }
}

function formatValueAndUnit(value, unit) {
  let valueStr = String(value);
  if (unit == null) {
    return valueStr;
  } else if (unit == "$") {
    return unit + valueStr;
  } else {
    return valueStr + " " + unit;
  }
}