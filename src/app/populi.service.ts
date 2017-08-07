import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import * as _ from 'lodash';


@Injectable()
export class PopuliService implements CanActivate {

	private serverUrl = "http://localhost:8888/pbc/absence/ag2-server/";
	private token = null;
	private personId = null;
	private person = null;

	private cachedMeetings = {};

	constructor(private http: Http, private router: Router) {  
		if(sessionStorage.token && sessionStorage.personId && sessionStorage.person){
			this.token = JSON.parse(sessionStorage.token);
			this.personId = JSON.parse(sessionStorage.personId);
			this.person = JSON.parse(sessionStorage.person);
			console.log(this.person);
		}
	}

	canActivate() {
		if (this.token && this.personId) {
			return true;
		}
		else {
			this.router.navigate(['']);
		}
		return ;
	}

	logout() {
		this.token = null;
		this.personId = null;
		this.person = null;
		sessionStorage.clear();
		this.router.navigate(['']);
	}

	getUserFullName(): string {
		if(this.person) {
			return this.person.first + " " + this.person.last;
		}
		return "";
	}

	loginUser(username, password): Observable<any> {
		var postData = "function=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => this.handleLoginResponse(res))
			.catch(this.handleError);
	}

	private handleLoginResponse(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Bad response status ' + res.status);
		}
		let body = res.json();
		this.token = body.token;
		this.personId = body.personId;
		sessionStorage.setItem('token', JSON.stringify(body.token));
		sessionStorage.setItem('personId', JSON.stringify(body.personId));

		this.getPerson(body.personId).subscribe(response => {
			this.person = response;
			sessionStorage.setItem('person', JSON.stringify(response));
		})

		return body;
	}

	getPerson(personId: number) {
		var postData = "function=getPerson&token=" + this.token + "&personId=" + this.personId;
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => this.handleResponse(res))
			.catch(this.handleError);
	}

	getCurrentTerm(): Observable<any>  {
		var postData = "function=getCurrentAcademicTerm&token=" + this.token;
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => this.handleResponse(res))
			.catch(this.handleError);
	}

	getMyCourses(termId): Observable<any>  {
		var postData = "function=getStudentCourses&token=" + this.token + "&personId=" + this.personId + "&termId=" + termId;
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => this.handleResponse(res))
			.catch(this.handleError);
	}

	getCourseInstanceMeetings(instanceId): Observable<any>  { 
		var postData = "function=getCourseInstanceMeetings&token=" + this.token + "&instanceId=" + instanceId;
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => this.handleResponse(res))
			.catch(this.handleError);
	}

	submitExcuse(instanceId, meetingId, meetingDate, meetingPeriod, reason): Observable<any>  { 
		var params = {
			instanceId: instanceId,
			meetingId: meetingId,
			personId: this.personId,
			firstName: this.person.first,
			lastName: this.person.last,
			period: meetingPeriod,
			date: meetingDate,
			reason: reason,
			email: _.find(this.person.email, {is_primary: "1"})['address'] || "",
			phone: _.find(this.person.phone, {is_primary: "1"})['number'] || ""
 
		}

		console.log(params); 

		var postData = "function=submitExcuse&token=" + this.token;
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => this.handleResponse(res))
			.catch(this.handleError);
	}

	getAbsences(): Observable<any>  { 
		var postData = "function=getAbsences";
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => this.handleResponse(res))
			.catch(this.handleError);
	}

	private handleResponse(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Bad response status ' + res.status);
		}	
		let body = res.json();		
		return body;
	}

	private handleError(error: Response | any) {
		return Observable.throw(error);
	}

}