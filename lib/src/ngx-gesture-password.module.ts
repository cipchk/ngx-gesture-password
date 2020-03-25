import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GesturePasswordComponent } from './component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ GesturePasswordComponent ],
  exports: [ GesturePasswordComponent ]
})
export class GesturePasswordModule {
}
