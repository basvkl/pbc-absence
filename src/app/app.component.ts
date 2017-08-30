import { Component } from '@angular/core';
import { CustomErrorHandler } from './custom-error-handler';
import { MdSnackBar } from '@angular/material';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';
}