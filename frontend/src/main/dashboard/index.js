import React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useAuth } from "../auth";

export default function Dashboard() {
	let auth = useAuth();

	const [state, setState] = React.useState({
		data: "",
	});
	

  function handleSubmit(event) {
    event.preventDefault();
		
		fetch('http://localhost:8080/recs', {
				method: 'GET',
				headers: {
					// TODO: The auth token is not be stored statefully...
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YXBvciIsInVzZXJuYW1lIjoidGVzdCIsImV4cCI6MTY0MTc1ODY3OS41NzM2NjYxfQ.-dLtPU3jr1qidOC0K-_OJyMc7RClSPjRLek5T02GRwE'//'Bearer ' + auth.token
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