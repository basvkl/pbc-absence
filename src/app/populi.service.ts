import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';


@Injectable()
export class PopuliService implements CanActivate {

	private serverUrl = "http://localhost:8888/pbc/absence/ag2-server/";
	private token = null;
	private personId = null;

	constructor(private http: Http, private router: Router) {  
		if(sessionStorage.token && sessionStorage.personId){
			this.token = sessionStorage.token;
			this.personId = sessionStorage.personId;
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
		sessionStorage.clear();
		this.router.navigate(['']);
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
		sessionStorage.setItem('token', body.token);
		sessionStorage.setItem('personId', body.personId);
		return body;
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

	private handleResponse(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Bad response status ' + res.status);
		}	
		let body = res.json();		
		return body;
	}

	private handleError(error: Response | any) {
		console.error(error);
		return Observable.throw(error);
	}

}