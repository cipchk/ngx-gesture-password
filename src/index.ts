import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GesturePasswordComponent } from './components/component';

export { ERR } from './components/interfaces/err';
export { Result } from './components/interfaces/result';
export { Options } from './components/interfaces/options';
export { GesturePasswordComponent } from './components/component';

@NgModule({
  imports: [ CommonModule ],
  providers: [  ],
  declarations: [ GesturePasswordComponent ],
  exports: [ GesturePasswordComponent ]
})
export class GesturePasswordModule {
}
