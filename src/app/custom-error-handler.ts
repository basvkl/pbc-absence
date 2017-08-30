import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Http, Response, Headers } from '@angular/http';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class CustomErrorHandler extends ErrorHandler {
    private serverUrl = "http://attendance.portlandbiblecollege.org/server/";

    constructor(private http: Http) {
        // The true paramter tells Angular to rethrow exceptions, so operations like 'bootstrap' will result in an error
        // when an error happens. If we do not rethrow, bootstrap will always succeed.
        super(true);
    }


    handleError(error) {
        console.error(error);

        StackTrace.fromError(error).then(stackframes => {
            const stackString = stackframes
                .splice(0, 20)
                .map(function (sf) {
                    return sf.toString();
                }).join('\n');

            let message = encodeURIComponent(error) + "\r\n\r\n" + encodeURIComponent(stackString);
            let postData = "function=error&message=" + message;
            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded')

            const req = this.http.post(this.serverUrl, postData, { headers: headers });
            req.subscribe();
        });
    }
}
