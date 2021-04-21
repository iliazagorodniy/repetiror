import React, {Component} from 'react';
import TeacherCard from "./TeacherCard";

class TeachersList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.currentTeachers.length === 0) {
			return null
		} else {
			return (
				<div className="teachersContainer">
					{this.props.currentTeachers.map((item) => {
						return (
							<TeacherCard teacherData={item}/>
						)
					})}
				</div>
			);
		}
	}
}

export default TeachersList;