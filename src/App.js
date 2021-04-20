import './App.css';
import apiPublicMethods from "./HttpMethods/ApiPublicMethods";

import React, {Component} from 'react';
import {Button, TextField} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import Autocomplete from "@material-ui/lab/Autocomplete";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#00978C",
		},
	}
});

class App extends Component {
	constructor() {
		super();
		this.state = {
			subject: null,
			area: null,
			district: null,

			subjects: [],
			areas: [],

			currentDistricts: [],
			currentTeacherIds: [],
			currentTeachers: [],

			validationMessage: "",
		}
	}

	componentDidMount() {
		apiPublicMethods.getSubjects()
			.then((data) => {
				this.setState({
					subjects: data
				})
			})
		apiPublicMethods.getAreas()
			.then((data) => {
				this.setState({
					areas: data
				})
			})
	}

	handleSubjectChange = (event, newValue) => {
		this.setState({
			subject: newValue
		}, () => console.log(this.state))
	}

	handleAreaChange = (event, newValue) => {
		if (newValue !== null) {
			apiPublicMethods.getDistricts(newValue.id)
				.then((data) => {
					this.setState({
						currentDistricts: data
					})
					console.log(`DISTRICTS ARR FOR AREA: ${newValue.name}`, data)
				})
		} else {
			this.setState({currentDistricts: []})
		}
		this.setState({
			area: newValue
		}, () => console.log(this.state))
	}

	handleDistrictChange = (event, newValue) => {
		this.setState({
			district: newValue
		}, () => console.log(this.state))
	}

	handleApplyFilter = () => {
		let { subject, area, district } = this.state
		if ((subject === null) && (area === null) && (district === null)) {
			this.setState({
				validationMessage: "Укажите хотя бы один параметр для поиска учителей",
				currentTeacherIds: [],
				currentTeachers: [],
			})
		} else {
			apiPublicMethods.getTeacherIds(
				area === null ? "" : String(area.id),
				district === null ? "" : String(district.id),
				subject === null ? "" : String(subject.id)
			)
				.then((data) => {
					console.log(data)
					let dataGroupedByTenIds = []
					while (data.length) dataGroupedByTenIds.push(data.splice(0, 10))
					this.setState({
						currentTeacherIds: dataGroupedByTenIds
					})
				})
				.then(() => apiPublicMethods.getTeachersShort(this.state.currentTeacherIds[0]))
				.then((response) => {
					this.setState({
						validationMessage: "",
						currentTeachers: response
					}, () => console.log(this.state))
				})
		}
	}

	render() {
		return (
			<ThemeProvider theme={theme}>
				<div className="container">
					<Autocomplete
						size={"small"}
						onChange={this.handleSubjectChange}
						options={this.state.subjects}
						getOptionLabel={ (option) => option.name }
						style={{ width: 240 }}
						renderInput={(params) => <TextField {...params} label="Предмет" variant="outlined" color={"primary"} className={"text-field"}/>}
					/>
					<Autocomplete
						size={"small"}
						onChange={this.handleAreaChange}
						options={this.state.areas}
						getOptionLabel={ (option) => option.name }
						style={{ width: 240 }}
						renderInput={(params) => <TextField {...params} label="Город и область" variant="outlined" color={"primary"} className={"text-field"}/>}
					/>
					<Autocomplete
						size={"small"}
						onChange={this.handleDistrictChange}
						options={this.state.currentDistricts}
						getOptionLabel={ (option) => option.name }
						style={{ width: 240 }}
						renderInput={(params) => <TextField {...params} label="Район" variant="outlined" color={"primary"} className={"text-field"}/>}
						noOptionsText={"Выберите город(область)"}
					/>
					<Button size={"small"} variant={"outlined"} className={"button"} onClick={this.handleApplyFilter}>Применить фильтр</Button>
				</div>
				<h2 style={ this.state.validationMessage === "" ? {display: "none"} : {display: "block"}}>{this.state.validationMessage}</h2>
				{this.state.currentTeachers.length === 0 ? "Нет преподавателей" : this.state.currentTeachers.map((item) => <div key={item.id}>{item.firstName} {item.patrName} {item.minPricePerHour}</div>)}
			</ThemeProvider>
		);
	}
}

export default App;