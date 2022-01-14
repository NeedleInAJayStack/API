import React from "react";

import formatISO from "date-fns/formatISO";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

export default class Input extends React.Component {

	constructor(props) {
		super(props);

		// props:
		// {
		//   token: string,
		//   point: {id: string, dis: string}
		//   onSave: () => Void
		// }
		
		this.state = {
			date: Date.now(),
			value: 0,
		};
	}
	
  async writeHis() {
		// TODO: Align ts to start of day.
		// TODO: Add in value float validation
		let body = {
			pointId: this.props.point.id,
			ts: formatISO(this.state.date), // We use date-fns implementation here to avoid milliseconds (Swift hates them and me)
			value: parseFloat(this.state.value)
		};
		try {
			await fetch("http://localhost:8080/his/" + this.props.point.id, {
				method: 'POST',
				headers: {
					'Authorization': 'Bearer ' + this.props.token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		return (
			<Stack direction="row" align-items="center" spacing={2} sx={{ display: "flex", marginBottom: 5}}>
				<p>Add Data:</p>
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
				<Button
					variant="contained"
					onClick={(event) => {
						this.writeHis(event);
						this.props.onSave(); 
					}}
				>
					Save
				</Button>
			</Stack>
		);
	}
}