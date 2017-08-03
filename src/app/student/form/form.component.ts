import { Component, OnInit } from '@angular/core';
import { PopuliService } from '../../populi.service';

import * as moment from 'moment';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

	login;
    model;

	constructor(private populiService: PopuliService) { }

	ngOnInit(): void {
		console.log("student init");
		this.model = {
			form: {
				type: "absent"
			},
			minDate: moment().days(-7).toDate(),
			maxDate: moment().toDate(),
			submitBtnText: "Submit",
			loginBtnText: "Login"
		};
		this.login = {
			username: "",
			password: ""
		};
	}

	studentLogin(): void {
		this.model.loginBtnText = "Logging in...";
		this.model.loggingIn = true;

		this.populiService.loginUser(this.login.username, this.login.password).subscribe(response => {
			if (response.error) {
				this.model.loginBtnText = "Login";
				this.model.loggingIn = false;
				this.model.error = response.error;
			} else {
				console.log(response);
				this.model.studentId = response.personId;
			}

		})
	}

	dateChanged(): void {
		if (this.model.form.date && this.model.dateError) {
			this.model.dateError = false;
		}
	}

	submitForm(): void {
		if (!this.model.form.date) {
			this.model.dateError = true;
			return;
		}
		this.model.submitting = true;
		this.model.submitBtnText = "Submitting...";
	}

}
