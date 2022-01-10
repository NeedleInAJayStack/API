import React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Dashboard(props) {
	let token = props.token;

	const [state, setState] = React.useState({
		data: "",
	});
	

  function handleSubmit(event) {
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
					setState({data: resultString});
				})
			} else {
				alert("User or password not recognized")
			}
		});
	}

	return (
		<Box>
			<Button variant="contained" onClick={handleSubmit} >Get Data</Button>
			<p>{state.data}</p>
		</Box>
	);
}