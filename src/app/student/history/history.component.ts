import { Component, OnInit } from '@angular/core';
import { PopuliService } from '../../populi.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

	term;
	courses;
	meetings;
	selectedTabIndex = 0;
	instanceId;
	selectedCourse;
	userFullName;
	status;
	cutoffDate;

	constructor(private populiService: PopuliService, private activatedRoute: ActivatedRoute, private router: Router, private location: Location, public dialog: MdDialog) {
		this.status = {
			"PENDING": {icon: "schedule", toolTip: "Pending approval"},
			"APPROVED": {icon: "check_circle", toolTip: "Approved"},
			"RESUBMIT": {icon: "refresh", toolTip: "Please Resubmit"}, //Should never happen
			"DENIED": {icon: "cancel", toolTip: "Request Denied"},
		};
		this.cutoffDate = moment().hour(0).minute(0).second(0).millisecond(0).subtract(14, 'days');
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.instanceId = params['instanceId'];
			if(this.instanceId) {
				this.selectedTabIndex = 1;
				this.getCourseInstanceMeetings(this.instanceId);
				this.populiService.getCourseInstance(this.instanceId).subscribe(response => {
					this.selectedCourse = response;
				});
			} else {
				this.selectedTabIndex = 0;
				this.router.navigate(['history']);
			}

			this.userFullName = this.populiService.getUserFullName();
		});

		this.populiService.getCurrentTerm().subscribe(response => {
			this.term = response;
			this.populiService.getMyCourses(this.term.termid).subscribe(response => {
				if(response.my_course && response.my_course instanceof Array) {
					response.my_course = response.my_course.sort(function (a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
					this.courses = response;
				} else if(response.my_course) {
					this.courses = {my_course: [response.my_course]};
				} else {
					this.courses = {};
				}
			});
		});
	}

	goBack(): void {
		this.selectedTabIndex = 0;
		this.location.go('/history');
	}

	selectedIndexChange(val: number) {
		this.selectedTabIndex = val;
	}

	selectCourse(course): void {
		this.selectedTabIndex = 1;
		this.meetings = false;
		this.selectedCourse = course;
		let that = this;
		this.instanceId = course.instanceid;
		this.getCourseInstanceMeetings(course.instanceid);
		this.location.go('history/' + course.instanceid);
	}

	getCourseInstanceMeetings(instanceId): void {
		if (instanceId) {
			this.populiService.getCourseInstanceMeetings(instanceId).subscribe(response => {
				let meetings = response.meeting;
				this.populiService.getCourseInstanceStudentAttendance(instanceId).subscribe(response =>{
					let attendance = response.attendee;
					if(!(attendance instanceof Array)) {
						attendance = [response.attendee];
					}
					meetings.map(meeting =>{
						var attendedMeeting:any =  _.find(attendance, {meetingid: meeting.meetingid});
						if(attendedMeeting) {
							if(moment(meeting.start).isBefore(this.cutoffDate)){
								meeting.passedCutoff = true;
							}
							meeting.attendance = attendedMeeting.status;
						}
					});
				});

				this.populiService.getPersonSubmissions().subscribe(response => {
					meetings.map(meeting => {
						for (var i= 0; i < response.length; i++) {
							if (response[i].meetingId === meeting.meetingid) {
								meeting.status = response[i].status != null ? response[i].status : "PENDING";
							}
						}
					});
					this.meetings = meetings;
				});
			});

		}
	}

	showExcuseModal(meeting): void {
		let dialogRef = this.dialog.open(ExcuseDialog);
		dialogRef.componentInstance.meeting = meeting;
		dialogRef.afterClosed().subscribe(reason => {
			if(reason) {
				meeting.saving = true;
				var tmpDate = new Date(meeting.start);
				var meetingDate = tmpDate.getFullYear() + "/" + (tmpDate.getMonth() + 1) + "/" + tmpDate.getDate();
				var meetingPeriod = this.getPeriodFromTime(meeting.start);

				if(!meeting.meetingid){
					delete meeting.saving;
					meeting.saved = false;
					return window.alert("Attendance has not been set");
				}

				this.populiService.submitExcuse(this.instanceId, meeting.meetingid, meetingDate, meetingPeriod, reason, this.selectedCourse.name).subscribe(response => {
					delete meeting.saving;
					meeting.saved = true;
				}, error => {
					//console.log(error);
				});
			}
		});
	}

	logout(): void {
		this.populiService.logout();
	}

	getPeriodFromTime(datetime:string):number {
		let date = new Date(datetime);
		switch(date.getHours()) {
			case 7:
				return 1;
			case 8:
				return 2;
			case 9:
				return 3;
			case 10:
				return 4;
			case 11:
				return 5;
			default:
				return 0;
		}
	}

}


@Component({
	selector: 'excuse-dialog',
	templateUrl: 'excuse-dialog.html',
})
export class ExcuseDialog {
	public excuse;
	public meeting;

	constructor(public dialogRef: MdDialogRef<ExcuseDialog>) { }
}
