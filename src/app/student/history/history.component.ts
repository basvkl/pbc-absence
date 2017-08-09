import { Component, OnInit } from '@angular/core';
import { PopuliService } from '../../populi.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Location } from '@angular/common';

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

	constructor(private populiService: PopuliService, private activatedRoute: ActivatedRoute, private router: Router, private location: Location, public dialog: MdDialog) { }

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
				response.my_course = response.my_course.sort(function (a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
				this.courses = response;
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
				// console.log(response);
				this.meetings = response.meeting;
			});
			//also get submissions
			console.log("Getting student submissions");
			this.populiService.getPersonSubmissions().subscribe(response => {
				console.log(response);
				//Required: meetingId, instanceId otherwise can't match to record
			});

		}
	}

	showExcuseModal(meeting): void {
		let dialogRef = this.dialog.open(ExcuseDialog);
		dialogRef.afterClosed().subscribe(reason => {
			if(reason) {
				console.log(reason);
				console.log(meeting);
				meeting.saving = true; 

				console.log(this.instanceId);
				console.log(meeting.start);
				var tmpDate = new Date(meeting.start);
				var meetingDate = tmpDate.getFullYear() + "/" + tmpDate.getMonth() + "/" + tmpDate.getDate();
				var meetingPeriod = this.getPeriodFromTime(meeting.start);

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
	constructor(public dialogRef: MdDialogRef<ExcuseDialog>) { }
}