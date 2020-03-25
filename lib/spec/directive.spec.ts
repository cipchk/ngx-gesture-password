import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GesturePasswordModule } from '../src/ngx-gesture-password.module';

const html = ``;

describe('Component: ngx-gesture-password', () => {
  let fixture: ComponentFixture<any>;
  let context: TestNGComponent;
  let element: any;
  let clean: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestNGComponent],
      imports: [GesturePasswordModule],
    });
    TestBed.overrideComponent(TestNGComponent, { set: { template: html } });
    fixture = TestBed.createComponent(TestNGComponent);
    context = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('#c1');
    clean = fixture.nativeElement.querySelector('#c2');
    fixture.detectChanges();
  });

  it('fixture should not be null', () => {
    expect(fixture).not.toBeNull();
  });
});

@Component({
  selector: 'ngx-gesture-password-test',
  template: '',
})
class TestNGComponent {}
