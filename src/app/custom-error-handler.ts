import { ErrorHandler } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

export class CustomErrorHandler extends ErrorHandler{
    private serverUrl = "http://attendance.portlandbiblecollege.org/server/";

    constructor(private http: Http) {
        // The true paramter tells Angular to rethrow exceptions, so operations like 'bootstrap' will result in an error
        // when an error happens. If we do not rethrow, bootstrap will always succeed.
        super(true);
    }


    handleError(error) {
        console.error(error);
        
        var postData = "function=error&message=" + error;
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.http.post(this.serverUrl, postData, { headers: headers })
        .map(res => {
           console.log(res);
        });
    }
}
