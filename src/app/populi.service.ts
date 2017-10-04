import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import * as _ from 'lodash';


@Injectable()
export class PopuliService implements CanActivate {

	//private serverUrl = "http://localhost:8888/pbc/absence/ag2-server/";
	private serverUrl = "http://attendance.portlandbiblecollege.org/server/";
	private token = null;
	private personId = null;
	private person = null;

	private cachedMeetings = {};

	constructor(private http: Http, private router: Router) {  
		if(sessionStorage.token && sessionStorage.personId && sessionStorage.person){
			this.token = JSON.parse(sessionStorage.token);
			this.personId = JSON.parse(sessionStorage.personId);
			this.person = JSON.parse(sessionStorage.person);
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
			.flatMap(res => {
				if (res.status < 200 || res.status >= 300) {
					throw new Error('Bad response status ' + res.status);
				}
				let body = res.json();
				if(body.error) {
					return Observable.throw(body.error);
				}
				this.token = body.token;
				this.personId = body.personId;
				sessionStorage.setItem('token', JSON.stringify(body.token));
				sessionStorage.setItem('personId', JSON.stringify(body.personId));
				return this.getPerson(body.personId);
			})
			.catch(this.handleError);
	}

	getPerson(personId: number) {
		var postData = "function=getPerson&token=" + this.token + "&personId=" + this.personId;
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => {
				if (res.status < 200 || res.status >= 300) {
					throw new Error('Bad response status ' + res.status);
				}	
				let body = res.json();		
				this.person = body;
				sessionStorage.setItem('person', JSON.stringify(this.person));
				return body; 
			})
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

	getCourseInstance(instanceId): Observable<any> {
		var postData = "function=getCourseInstance&token=" + this.token + "&instanceId=" + instanceId;
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

	getCourseInstanceStudentAttendance(instanceId): Observable<any> {
		var postData = "function=getCourseInstanceStudentAttendance&token=" + this.token + "&instanceId=" + instanceId + "&personId=" + this.personId;
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => this.handleResponse(res))
			.catch(this.handleError);
	}

	submitExcuse(instanceId, meetingId, meetingDate, meetingPeriod, reason, className): Observable<any>  { 
		var params = {
			personId: this.personId,
			meetingId: meetingId,
			reason: reason,
			firstName: this.person.first,
			lastName: this.person.last,
			className: className + " [" + instanceId + "]",
			period: meetingPeriod,
			date: meetingDate,
			absenceType: "Absent",
			email: _.find(this.person.email, {is_primary: "1"}) ? _.find(this.person.email, {is_primary: "1"})['address'] : "",
			phone: _.find(this.person.phone, {is_primary: "1"}) ? _.find(this.person.phone, {is_primary: "1"})['number'] : "",
			instanceId: instanceId
		}

		console.log(params); 

		var postData = "function=submitExcuse&token=" + this.token;
		_.forEach(params, function(value, key) {
			postData += "&" + key + "=" + encodeURIComponent(value);
		});

		//console.log(postData);
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => this.handleResponse(res))
			.catch(this.handleError);
	}

	getPersonSubmissions(): Observable<any>  { 
		var postData = "function=getPersonSubmissions&personId=" + this.personId;
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
		if (!res['_body']) {
			return;
		}
		let body = res.json();		
		return body;
	}

	private handleError(error: Response | any) {
		return Observable.throw(error);
	}

}