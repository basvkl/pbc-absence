import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { PopuliService } from '../../populi.service';

import * as moment from 'moment';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	login;
	model;

	constructor(private populiService: PopuliService, private router: Router) { }

	ngOnInit(): void {
		this.model = {
			submitBtnText: "Submit",
			loginBtnText: "Login",
			loggingIn: false
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
			if (response && response.error) {
				this.model.loginBtnText = "Login";
				this.model.loggingIn = false;
				this.model.error = response.error;
			} else {
				this.model.studentId = response.personId;
				this.router.navigate(['history']);
			}
		}, err => {
			this.model.loginBtnText = "Login";
			this.model.loggingIn = false;
			this.model.error = "Could not connect to server. Please try again in a minute.";
		})
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
