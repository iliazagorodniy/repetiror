import React, {Component} from 'react';
import Chip from '@material-ui/core/Chip';
import {Typography} from "@material-ui/core";

class TeacherCard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {id, firstName, patrName, minPricePerHour, teachingSubjects, photoPathSquare} = this.props.teacherData
		return (
			<div key={id} className={"teacherCard"}>
				<img src={photoPathSquare}/>
				<div className="teacherInfo">
					<span> {firstName} {patrName} </span>
					<div className="subjects">
						{teachingSubjects.map((item) =>  <Chip className={"subject"} label={item.subject.name} variant={"outlined"} size={"small"}/>)}
					</div>
					<Typography color={"primary"} style={{fontSize: "20px", lineHeight: "20px"}}>от {minPricePerHour}₽</Typography>
				</div>
			</div>
		);
	}
}

export default TeacherCard;