import './App.css';
import apiPublicMethods from "./HttpMethods/ApiPublicMethods";

import React, {Component} from 'react';
import {TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

class App extends Component {
	constructor() {
		super();
		this.state = {
			subject: {},
			area: {},
			district: {},

			subjects: [],
			areas: [],

			currentDistricts: [],
			currentTeacherIds: [],
			currentTeachers: [],
		}
	}

	componentDidMount() {
		apiPublicMethods.getSubjects()
			.then((data) => {
				this.setState({
					subjects: data
				}, () => console.log(this.state))
				console.log("SUBJECTS ARR", data)
			})
		apiPublicMethods.getAreas()
			.then((data) => {
				this.setState({
					areas: data
				}, () => console.log(this.state))
				console.log("AREAS ARR", data)
			})
	}

	handleSubjectChange = (event, newValue) => {
		this.setState({
			subject: newValue
		}, () => console.log(this.state))
	}

	handleAreaChange = (event, newValue) => {
		apiPublicMethods.getDistricts(newValue.id)
			.then((data) => {
				this.setState({
					currentDistricts: data
				}, () => console.log(this.state))
				console.log(`DISTRICTS ARR FOR AREA: ${newValue.name}`, data)
			})
		this.setState({
			area: newValue
		}, () => console.log(this.state))
	}

	render() {
		return (
			<div className="container">
				<Autocomplete
					onChange={this.handleSubjectChange}
					options={this.state.subjects}
					getOptionLabel={ (option) => option.name }
					style={{ width: 240 }}
					renderInput={(params) => <TextField {...params} label="Предмет" variant="outlined" />}
				/>
				<Autocomplete
					onChange={this.handleAreaChange}
					options={this.state.areas}
					getOptionLabel={ (option) => option.name }
					style={{ width: 240 }}
					renderInput={(params) => <TextField {...params} label="Город и область" variant="outlined" />}
				/>
				<Autocomplete
					noOptionsText={"Выберите город(область)"}
					options={this.state.currentDistricts}
					getOptionLabel={ (option) => option.name }
					style={{ width: 240 }}
					renderInput={(params) => <TextField {...params} label="Район" variant="outlined" />}
				/>
			</div>
		);
	}
}

export default App;