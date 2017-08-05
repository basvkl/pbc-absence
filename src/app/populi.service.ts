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
		//TODO: https://stackoverflow.com/questions/37164758/angular-2-convenient-way-to-store-in-session
		sessionStorage.setItem('token', body.token);
		sessionStorage.setItem('personId', body.personId);
		
		return body;
	}

	getStudentClasses(studentId): Array<any> {
		return [];
	}

	getList(): void {
		console.log("getting list")
	}

	private handleError(error: Response | any) {
		// In a real world app, we might use a remote logging infrastructure
		//        let errMsg: string;
		//        if (error instanceof Response) {
		//            const body = error.json() || '';
		//            const err = body.error || JSON.stringify(body);
		//            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		//        } else {
		//            errMsg = error.message ? error.message : error.toString();
		//        }

		//        console.error(errMsg);
		console.error(error);
		return Observable.throw(error);
	}

}