import React from "react";

import formatISO from "date-fns/formatISO";
import startOfToday from 'date-fns/startOfToday';
import subDays from 'date-fns/subDays';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

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
      date: subDays(startOfToday(), 1),
      value: null,
    };
  }
  
  async writeHis() {
    let body = {
      pointId: this.props.point.id,
      ts: formatISO(this.state.date), // We use date-fns implementation here to avoid milliseconds (Swift hates them and me)
      value: this.state.value
    };
    try {
      await fetch("/his/" + this.props.point.id, {
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
          type="number"
          required
          onChange={(event) => {
            const value = Number(event.target.value);
            if (value == Number.NaN) {
              console.log("Not a number. Modify props")
            } else {
              this.setState({...this.state, value: value});
            }
          }}
        />
        <Button
          variant="contained"
          onClick={(event) => {
            this.writeHis();
            this.props.onSave(); 
          }}
        >
          Save
        </Button>
      </Stack>
    );
  }
}