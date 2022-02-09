import React from "react";

import startOfToday from 'date-fns/startOfToday';
import subYears from 'date-fns/subYears';

import getUnixTime from 'date-fns/getUnixTime';
import parseISO from 'date-fns/parseISO';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import Chart from './chart';
import Input from './input';

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      isFetching: false,
      points: [],
      point: "",
      startDate: subYears(startOfToday(), 3),
      endDate: startOfToday(),
      his: []
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
  
  async fetchHis(point, startDate, endDate) {
    if (point == "") {
      return;
    }

    let startDateSecs = getUnixTime(startDate);
    let endDateSecs = getUnixTime(endDate);
    
    try {
      let response = await fetch("http://localhost:8080/his/" + point.id + "?start=" + startDateSecs + "&end=" + endDateSecs, {
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
      return his;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  onPointChange(event) {
    let point = event.target.value;
    this.fetchHis(point, this.state.startDate, this.state.endDate).then(his => {
      this.setState({...this.state, point: point, his: his});
    });
  }

  onStartDateChange(newDate) {
    this.fetchHis(this.state.point, newDate, this.state.endDate).then(his => {
      this.setState({...this.state, startDate: newDate, his: his});
    });
  }

  onEndDateChange(newDate) {
    this.fetchHis(this.state.point, this.state.startDate, newDate).then(his => {
      this.setState({...this.state, endDate: newDate, his: his});
    });
  }

  onDataAdded() {
    this.fetchHis(this.state.point, this.state.startDate, this.state.endDate).then(his => {
      this.setState({...this.state, his: his});
    });
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
                onChange={ (event) => {
                  this.onPointChange(event);
                }}
              >
              {this.state.points.map( point => <MenuItem key={point.id} value={point}>{point.dis}</MenuItem> )}
              </Select>
            </FormControl>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start date"
              value={this.state.startDate}
              onChange={ (newDate) => {
                this.onStartDateChange(newDate);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End date"
              value={this.state.endDate}
              onChange={ (newDate) => {
                this.onEndDateChange(newDate);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Stack>
        <Box sx={{flexGrow: 1, padding: 5, width: "95%"}}>
          <Chart
            id="chart"
            point={this.state.point}
            his={this.state.his}
          />
        </Box>
        <Input
          token={this.props.token}
          point={this.state.point}
          onSave={ () => {
            this.onDataAdded();
          }}
        />
      </Box>
    );
  }
}