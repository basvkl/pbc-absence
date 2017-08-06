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
	selectedCourse;

	constructor(private populiService: PopuliService, private activatedRoute: ActivatedRoute, private router: Router, private location: Location, public dialog: MdDialog) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			let instanceId = params['instanceId'];
			this.selectedTabIndex = 1;
			this.getCourseInstanceMeetings(instanceId);
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
		this.router.navigate(['history/' + course.instanceid]);
	}

	getCourseInstanceMeetings(instanceId): void {
		if (instanceId) {
			this.populiService.getCourseInstanceMeetings(instanceId).subscribe(response => {
				console.log(response);
				this.meetings = response.meeting;
				for (var i = 0; i < this.meetings.length; i++) {
					if (this.meetings[i].meetingid) {
						//get attendance status
					}
				}
			});
		}
	}

	showExcuseModal(): void {
		console.log("Always excuses");
		let dialogRef = this.dialog.open(ExcuseDialog, {
			height: '400px',
			width: '600px',
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`); // Pizza!
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