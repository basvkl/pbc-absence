import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdInputModule, MdTableModule, MdProgressBarModule, MdToolbarModule, MdTabsModule, MdIconModule, MdListModule, MdGridListModule, MdDialogModule, MdProgressSpinnerModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './student/login/login.component';
import { HistoryComponent, ExcuseDialog } from './student/history/history.component';
import { PopuliService } from './populi.service';


// Route Configuration
export const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'history', component: HistoryComponent, canActivate: [PopuliService] },
	{ path: 'history/:instanceId', component: HistoryComponent, canActivate: [PopuliService] }
];

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HistoryComponent,
		ExcuseDialog
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		RouterModule.forRoot(routes),
		//MaterialDesign
		MdButtonModule,
		MdCardModule,
		MdInputModule,
		MdTableModule,
		CdkTableModule,
		MdProgressBarModule,
		MdToolbarModule,
		MdTabsModule,
		MdIconModule,
		MdListModule,
		MdGridListModule,
		MdDialogModule,
		MdProgressSpinnerModule
	],
	entryComponents: [ExcuseDialog],
	exports: [RouterModule],
	providers: [PopuliService],
	bootstrap: [AppComponent]
})
export class AppModule { }
