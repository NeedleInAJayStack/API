import React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';

// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DatePicker from '@mui/lab/DatePicker';

export default function Dashboard(props) {
	let token = props.token;
	
	const [state, setState] = React.useState({
		point: null,
		startDate: null,
		data: null
	});
	
  function handleGetData(event) {
    event.preventDefault();
		
		fetch('http://localhost:8080/recs', {
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + token
				}
		}).then(response => {
			if (response.ok) {
				response.json().then(result => {
					console.log(result);
					let firstResult = result[0];
					let resultString = "id: " + firstResult.id + ", dis: " + firstResult.dis;
					setState({...state, data: resultString});
				})
			} else {
				alert("User or password not recognized")
			}
		});
	}

  function handlePointSelect(event) {
    event.preventDefault();
		setState({...state, point: event.target.value});
	}

	return (
		<Stack spacing={2}>
			{/* <Button variant="contained" onClick={handleGetData} >Get Data</Button> */}
			<Box sx={{ minWidth: 120 }}>
				<FormControl fullWidth>
					<InputLabel id="point-select-label">Point</InputLabel>
					<Select
						labelId="point-select-label"
						id="point-select"
						value={state.point}
						label="Point"
						onChange={handlePointSelect}
					>
						<MenuItem value={"74BD0182-1346-4813-96AC-757833C2E22E"}>Test</MenuItem>
						<MenuItem value={"74BD0185-1346-4813-96AC-757833C2E22E"}>FAKE</MenuItem>
					</Select>
				</FormControl>
			</Box>
			{/* <LocalizationProvider dateAdapter={AdapterDateFns}>
				<DatePicker
					label="Start date"
					value={state.startDate}
					onChange={(newDate) => {
						setState({...state, startDate: newDate});
					}}
					renderInput={(params) => <TextField {...params} />}
				/>
			</LocalizationProvider> */}
		</Stack>
	);
}