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

				// this.populiService.getAbsences().subscribe(response => {
				// 	console.log(response);
				// })

			} else {
				this.selectedTabIndex = 0;
				this.router.navigate(['history']);
			}

			this.userFullName = this.populiService.getUserFullName();
		});

		this.populiService.getCurrentTerm().subscribe(response => {
			//console.log(response);
			this.term = response;
			this.populiService.getMyCourses(this.term.termid).subscribe(response => {
				// console.log(response);
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
		this.getCourseInstanceMeetings(course.instanceid);
		this.location.go('history/' + course.instanceid);
	}

	getCourseInstanceMeetings(instanceId): void {
		if (instanceId) {
			this.populiService.getCourseInstanceMeetings(instanceId).subscribe(response => {
				console.log(response);
				this.meetings = response.meeting;
			});
		}
	}

	showExcuseModal(meeting): void {
		let dialogRef = this.dialog.open(ExcuseDialog, {
			height: '400px',
			width: '600px',
		});

		dialogRef.afterClosed().subscribe(reason => {
			if(reason) {
				console.log(reason);
				console.log(meeting);
				meeting.saving = true; 

				console.log(this.instanceId);
				console.log(meeting.start);
				var meetingDate = meeting.start;
				var meetingPeriod = meeting.start;

				setTimeout(()=>{
					delete meeting.saving;
					meeting.saved = true;
				})

				// this.populiService.submitExcuse(this.instanceId, meeting.meetingid, meetingDate, meetingPeriod, reason).subscribe(response => {
				// 	delete meeting.saving;
				// 	meeting.saved = true;
				// });
			}
			
		});
	}

	logout(): void {
		this.populiService.logout();
	}

}


@Component({
	selector: 'excuse-dialog',
	templateUrl: 'excuse-dialog.html',
})
export class ExcuseDialog {
	constructor(public dialogRef: MdDialogRef<ExcuseDialog>) { }
}