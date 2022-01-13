import React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

export default class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			points: [],
			point: "",
			date: Date.now()
		};
	}

	componentDidMount() {
		this.fetchPoints();
	}

	async fetchPoints() {
		try {
			let response = await fetch("http://localhost:8080/recs/", {
			method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + this.props.token
				}
			})
			let points = await response.json();
			this.setState({...this.state, points: points});
		} catch (e) {
			console.log(e);
		}
	}
	
  async writeHis() {
		// TODO: Align ts to start of day.
		// TODO: Add in value float validation
		let body = {
			ts: this.state.date.toISOString(),
			value: parseFloat(this.state.value)
		};
		try {
			await fetch("http://localhost:8080/his/" + this.state.point.id, {
				method: 'POST',
				headers: {
					'Authorization': 'Bearer ' + this.props.token
				},
				body: JSON.stringify(body)
			});
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		return (
			<Box sx={{flexGrow: 1, width:"100%", display: 'flex', flexDirection: 'column', alignItems: "center"}}>
				<Stack direction="row" spacing={2} sx={{ display: "flex", marginTop: 5}}>
					<Box sx={{ minWidth: 120 }}>
						<FormControl fullWidth>
							<InputLabel id="point-select-label">Point</InputLabel>
							<Select
								labelId="point-select-label"
								id="point-select"
								value={this.state.point}
								label="Point"
								onChange={(event) => {
									this.setState({...this.state, point: event.target.value});
								}}
							>
							{this.state.points.map( point => <MenuItem key={point.id} value={point}>{point.dis}</MenuItem> )}
							</Select>
						</FormControl>
					</Box>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="Date"
							value={this.state.date}
							onChange={(date) => {
								this.setState({...this.state, date: date});
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
					<TextField
						label="Value"
						variant="outlined"
						onChange={(event) => {
							this.setState({...this.state, value: event.target.value});
						}}
					/>
					<Button variant="contained" onClick={(event) => { this.writeHis(event) }} >Save</Button>
				</Stack>
			</Box>
		);
	}
}