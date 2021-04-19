import HttpAdapter, {serialize} from "./HttpAdapter";

class ApiPublicMethods {

	constructor( initState, adapter ) {
		this.state = initState;
		this.adapter = adapter
		console.log("Public API METHODS constructor")
	}

	// не принимает get-параметры, не принимает данные
	getSubjects() {
		return this.adapter.get("/subjects")
			.then(response => response.json())
			.then(data => data)
	}

	// не принимает get-параметры, не принимает данные
	getAreas() {
		return this.adapter.get("/areas")
			.then(response => response.json())
			.then((data) => data)
	}

	// принимает get-параметр areaId, не принимает данные
	getDistricts( areaId= "1" ) {
		return this.adapter.get(`/districts?${ serialize( { areaId: areaId } ) }`)
			.then(response => response.json())
			.then((data) => data)
	}

	// принимает get-параметры areaId, districtId, subjectId, не принимает данные
	// нужен минимум один параметр
	getTeacherIds( areaId= "1", districtId= "", subjectId= "" ) {
		return this.adapter.get(`/search/teacherIds?${ serialize( { areaId, districtId, subjectId } ) }`)
			.then(response => response.json)
			.then((data) => {
				return data
			})
	}

	// https://api.repetit.ru/public/teachers/short?Ids[0]=77475&Ids[1]=258
	// принимает get-параметр массив ID учителей, не принимает данные
	getTeachersShort( teachersIdsArr ) {
		let teachersIdsObj = {}
		teachersIdsArr.forEach((item, index) => {
			teachersIdsArr[`Ids[${index}]`] = item
		})
		console.log(teachersIdsObj)
		return this.adapter.get(`teachers/short?${ serialize(teachersIdsObj) }`)
			.then(response => response.json)
			.then((data) => {
				return data
			})
	}


}

const apiPublicMethods = new ApiPublicMethods( {}, new HttpAdapter())
export default apiPublicMethods