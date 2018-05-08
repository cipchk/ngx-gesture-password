import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GesturePasswordComponent } from './components/component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ GesturePasswordComponent ],
  exports: [ GesturePasswordComponent ]
})
export class GesturePasswordModule {
}
