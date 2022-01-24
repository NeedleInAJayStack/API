import React from "react";

import getUnixTime from 'date-fns/getUnixTime';
import format from "date-fns/format";
import parseISO from 'date-fns/parseISO';

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

    this.state = {
      his: [],
    }
  }

  componentDidUpdate(prevProps) {
    // Only fetch history if something has changed
    if (this.props !== prevProps) {
      this.fetchHis();
    }
  }

  async fetchHis() {
    if (this.props.point == "") {
      return;
    }

    let startDateSecs = getUnixTime(this.props.startDate);
    let endDateSecs = getUnixTime(this.props.endDate);
    
    try {
      let response = await fetch("http://localhost:8080/his/" + this.props.point.id + "?start=" + startDateSecs + "&end=" + endDateSecs, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.props.token
        }
      });
      let json = await response.json();
      let his = json.map(row => {
        let ts = parseISO(row.ts)
        let value = row.value

        return {x: ts, y: value}
      });
      this.setState({...this.state, his: his});
    } catch (e) {
      this.setState({...this.state});
      console.log(e);
    }
  }

  render() {
    if (this.state.his.length == 0) {
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
                type: 'timeseries',
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
              data: this.state.his,
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