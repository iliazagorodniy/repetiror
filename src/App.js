import './App.css';
import apiPublicMethods from "./HttpMethods/ApiPublicMethods";

import React, {Component} from 'react';
import {Button, TextField} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LinearProgress from '@material-ui/core/LinearProgress';

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
			indexToLoadNextTeachersIdsArr: undefined,
			currentTeachers: [],

			validationMessage: "Выберите фильтры и нажмите кнопку ПРИМЕНИТЬ",
			isDataLoading: false,
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
			this.setState({
				isDataLoading: true
			})
			apiPublicMethods.getTeacherIds(
				area === null ? "" : String(area.id),
				district === null ? "" : String(district.id),
				subject === null ? "" : String(subject.id)
			)
				.then((data) => {
					if (data.length === 0) {
						this.setState({
							validationMessage: "По данным параметрам не найдено учителей",
							isDataLoading: false,
							currentTeacherIds: [],
							currentTeachers: [],
						})
					} else {
						console.log(data)
						let dataGroupedByTenIds = []
						while (data.length) dataGroupedByTenIds.push(data.splice(0, 10))
						this.setState({
							currentTeacherIds: dataGroupedByTenIds,
							indexToLoadNextTeachersIdsArr: 1
						})
						apiPublicMethods.getTeachersShort(this.state.currentTeacherIds[0])
							.then((response) => {
								console.log(response)
								this.setState({
									validationMessage: "",
									isDataLoading: false,
									currentTeachers: response,
								}, () => console.log(this.state))
							})
					}
				})
		}
	}

	handleLoadMore = () => {
		this.setState({
			isDataLoading: true
		})
		apiPublicMethods.getTeachersShort(this.state.currentTeacherIds[this.state.indexToLoadNextTeachersIdsArr])
			.then((response) => {
				console.log(response)
				this.setState((prevState) => {
					return {
						indexToLoadNextTeachersIdsArr: prevState.indexToLoadNextTeachersIdsArr + 1,
						currentTeachers: [...prevState.currentTeachers, ...response],
						isDataLoading: false
					}
				}, () => console.log(this.state))
			})
	}

	render() {
		return (
			<ThemeProvider theme={theme}>
				<div className="container">
					<div className="filters">
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
						<Button size={"small"} variant={"outlined"} style={{width: 192}} className={"button"} onClick={this.handleApplyFilter}>Применить фильтр</Button>
					</div>
					<LinearProgress variant={"query"} style={ this.state.isDataLoading ? {display: "block"} : {display: "none"}}/>
					<div style={ this.state.validationMessage === "" ? {display: "none"} : {display: "block"}}>{this.state.validationMessage}</div>
					<div className="teachersContainer">
						{this.state.currentTeachers.length === 0
							? ""
							: this.state.currentTeachers.map((item) => {
								return (
									<div key={item.id}>
										{item.firstName} {item.patrName} {item.minPricePerHour}
									</div>
								)
							})
						}
					</div>
					<Button
						variant={"outlined"}
						color={"primary"}
						disabled={
							this.state.indexToLoadNextTeachersIdsArr === undefined ||
							this.state.currentTeacherIds[this.state.indexToLoadNextTeachersIdsArr] === undefined ||
							this.state.isDataLoading
						}
						onClick={this.handleLoadMore}
						className={"loadMore"}
					>
						Загрузить еще
					</Button>
				</div>
			</ThemeProvider>
		);
	}
}

export default App;