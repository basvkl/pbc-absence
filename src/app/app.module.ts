import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FormComponent } from './student/form/form.component';
import { HistoryComponent } from './student/history/history.component';
import { PopuliService } from './populi.service';


// Route Configuration
export const routes: Routes = [
  { path: '', component: FormComponent },
  //{ path: 'admin', component: AdminComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    HistoryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [PopuliService],
  bootstrap: [AppComponent]
})
export class AppModule { }
