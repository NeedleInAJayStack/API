import React from "react";

import getUnixTime from 'date-fns/getUnixTime';
import parseISO from 'date-fns/parseISO';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import Plot from 'react-plotly.js';

export default class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		
		this.token = props.token;
		this.state = {
			isFetching: false,
			points: [],
			point: "",
			startDate: Date.now(),
			endDate: Date.now(),
			his: []
		};
	}

	componentDidMount() {
		this.fetchPoints();
		this.timer = setInterval(() => this.fetchPoints(), 5000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
		this.timer = null;
	}

  handlePointSelect(event) {
    event.preventDefault();
		this.setState({...this.state, point: event.target.value});
	}

	async fetchPoints() {
		try {
			let response = await fetch("http://localhost:8080/recs/", {
			method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + this.token
				}
			})
			let points = await response.json();
			this.setState({...this.state, points: points});
		} catch (e) {
			console.log(e);
		}
	}
	
  async fetchHis(event) {
    event.preventDefault();
		this.setState({...this.state, isFetching: true});
		let startDateSecs = getUnixTime(this.state.startDate);
		let endDateSecs = getUnixTime(this.state.endDate);
		
		try {
			let response = await fetch("http://localhost:8080/his/" + this.state.point + "?start=" + startDateSecs + "&end=" + endDateSecs, {
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + this.token
				}
			});
			let json = await response.json();
			let his = json.map(row => {
				let ts = parseISO(row.ts)
				let value = row.value

				return {ts: ts, value: value}
			});
			console.log(his);
			this.setState({...this.state, isFetching: false, his: his});
		} catch (e) {
			this.setState({...this.state, isFetching: false});
			console.log(e);
		}
	}

	render() {
		return (
			<Box sx={{flexGrow: 1, width:"100%", display: 'flex', flexDirection: 'column', alignItems: "center"}}>
				<Stack direction="row" spacing={2} sx={{ display: "flex", marginTop: 5 }}>
					<Box sx={{ minWidth: 120 }}>
						<FormControl fullWidth>
							<InputLabel id="point-select-label">Point</InputLabel>
							<Select
								labelId="point-select-label"
								id="point-select"
								value={this.state.point}
								label="Point"
								onChange={(event) => { this.handlePointSelect(event) }}
							>
							{this.state.points.map( point => <MenuItem key={point.id} value={point.id}>{point.dis}</MenuItem> )}
							</Select>
						</FormControl>
					</Box>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="Start date"
							value={this.state.startDate}
							onChange={(newDate) => {
								this.setState({...this.state, startDate: newDate});
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
						<DatePicker
							label="End date"
							value={this.state.endDate}
							onChange={(newDate) => {
								this.setState({...this.state, endDate: newDate});
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
					<Button variant="contained" onClick={(event) => { this.fetchHis(event) }} >Get Data</Button>
				</Stack>
				<Box sx={{flexGrow: 1, width: '100%'}}>
					<Plot
						style={{width: "100%", height: "100%"}}
						useResizeHandler={true}
						data={[{
							type: "scatter",
							mode: "lines",
							x: this.state.his.map( hisRow => hisRow.ts ),
							y: this.state.his.map( hisRow => hisRow.value ),
						}]}
					/>
				</Box>
			</Box>
		);
	}
}