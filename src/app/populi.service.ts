import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PopuliService {

	private serverUrl = "http://localhost:8888/pbc/absence/ag2-server/";
	private toke = null;
	private personId = null;

	constructor(private http: Http) { }

	loginUser(username, password): Observable<any> {

		var postData = "function=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		return this.http.post(this.serverUrl, postData, { headers: headers })
			.map(res => res.json())
			.catch(this.handleError);
		//                    .subscribe(
		//                      data => this.saveJwt(data.id_token),
		//                      err => this.logError(err),
		//                      () => console.log('Authentication Complete')
		//                    );
	}

	private saveJwt(jwt) {
		if (jwt) {
			localStorage.setItem('id_token', jwt)
		}
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