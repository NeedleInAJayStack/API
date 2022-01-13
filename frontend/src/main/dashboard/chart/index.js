import React from "react";

import Box from '@mui/material/Box';
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
	}

	render() {
		if (this.props.data.length == 0) {
			return (
				<Box sx={{flexGrow: 1, padding: 5, width: "95%", height: "95%"}}>
					<Typography align="center" >No data</Typography>
				</Box>
			);
		} else {
			return (
				<Box sx={{flexGrow: 1, padding: 5, width: "95%"}}>
					<Scatter 
						options={{
							scales: {
								x: {
									type: 'timeseries',
								}
							},
							showLine: true,
							backgroundColor: "rgba(25,118,210,1)",
							borderColor: "rgba(25,118,210,1)",
							maintainAspectRatio: false
						}}
						data={{
							datasets: [{
								label: this.props.pointName,
								data: this.props.data,
							}]
						}}
					/>
				</Box>
			);
		}
	}
}