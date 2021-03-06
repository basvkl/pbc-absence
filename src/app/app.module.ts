import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdInputModule, MdTableModule, MdProgressBarModule, MdToolbarModule, MdTabsModule, MdIconModule, MdListModule, MdGridListModule, MdDialogModule, MdProgressSpinnerModule, MdTooltipModule, MdSnackBarModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';

import { NgModule, ErrorHandler } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './student/login/login.component';
import { HistoryComponent, ExcuseDialog } from './student/history/history.component';
import { PopuliService } from './populi.service';
import { enableProdMode } from '@angular/core';

import { CustomErrorHandler } from './custom-error-handler';

import 'intl';
import 'intl/locale-data/jsonp/en';

enableProdMode();

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
		MdProgressSpinnerModule,
		MdTooltipModule,
		MdSnackBarModule
	],
	entryComponents: [ExcuseDialog],
	exports: [RouterModule],
	providers: [PopuliService, { provide: ErrorHandler, useClass: CustomErrorHandler }],
	bootstrap: [AppComponent]
})
export class AppModule { }
