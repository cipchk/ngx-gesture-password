import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { GesturePasswordModule } from 'ngx-gesture-password';

import { AppComponent } from './app.component';
import { DemoComponent } from './components/demo.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    GesturePasswordModule,
  ],
  declarations: [AppComponent, DemoComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppDemoModule { }
