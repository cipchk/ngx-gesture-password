import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
    <h4 class="mt-3">ngx-gesture-password</h4>
    <p class="mb-3">A smart gesture password locker for angular (mobile browser)</p>
    <demo></demo>
  `,
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
