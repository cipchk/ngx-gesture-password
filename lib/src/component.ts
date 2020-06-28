import {
  Component,
  ElementRef,
  ViewEncapsulation,
  Input,
  Renderer2,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { RecorderCanvas } from './recorder.canvas';
import { Options } from './interfaces/options';
import { ERR } from './interfaces/err';
import { Result } from './interfaces/result';

@Component({
  selector: 'gesture-password',
  template: ``,
  styles: [
    `
      gesture-password {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 100px;
        overflow: hidden;
        display: block;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GesturePasswordComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class GesturePasswordComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  private password: string;
  protected rc: RecorderCanvas;

  @Input() options: Options;
  @Input() type: 'check' | 'recorder' = 'check';
  // tslint:disable-next-line: no-output-native
  @Output() readonly error = new EventEmitter();
  @Output() readonly checked = new EventEmitter();
  @Output() readonly beforeRepeat = new EventEmitter();
  @Output() readonly afterRepeat = new EventEmitter();

  protected onChange: any = Function.prototype;
  protected onTouched: any = Function.prototype;

  async check(): Promise<any> {
    this.rc.clearPath();
    const res = await this.rc.record();

    if (res.err && res.err === ERR.USER_CANCELED) {
      this.error.emit(res);
      return Promise.resolve(res);
    }

    if (!res.err && this.password !== res.result) {
      res.err = ERR.PASSWORD_MISMATCH;
    }

    this.checked.emit(res);
    this.check();
    return Promise.resolve(res);
  }

  async recorder(): Promise<Result> {
    // 第一次
    this.rc.clearPath();
    const first = await this.rc.record();
    if (first.err && first.err === ERR.USER_CANCELED) {
      return Promise.resolve(first);
    }

    if (first.err) {
      this.recorder();
      this.beforeRepeat.emit(first);
      return Promise.resolve(first);
    }

    this.beforeRepeat.emit(first);

    // 第二次
    this.rc.clearPath();
    const second = await this.rc.record();
    if (second.err && second.err === ERR.USER_CANCELED) {
      return Promise.resolve(second);
    }

    if (!second.err && first.result !== second.result) {
      second.err = ERR.PASSWORD_MISMATCH;
    }

    if (!second.err) {
      this.password = second.result;
      this.onChange(second.result);
      this.onTouched(second.result);
    }

    this.recorder();
    this.afterRepeat.emit(second);
    return Promise.resolve(second);
  }

  render(): this {
    const opt: Options = {
      num: 3,
      focusColor: '#e06555',
      fgColor: '#d6dae5',
      bgColor: '#fff',
      innerRadius: 20,
      outerRadius: 50,
      touchRadius: 70,
      // customStyle: false,
      render: true,
      min: 4,
      passwords: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      ...this.options,
    };
    if (opt.passwords.length !== opt.num * opt.num) {
      throw new Error(`密码编码必须是 ${opt.num * opt.num} 数量`);
    }

    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      opt.bgColor,
    );
    this.rc = new RecorderCanvas(this.el.nativeElement, opt);
    if (this.type === 'check') {
      this.check();
    } else {
      this.recorder();
    }
    return this;
  }

  destroy(): this {
    if (this.rc) {
      this.rc.destroy();
      this.rc = null;
    }
    return this;
  }

  ngOnInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options && !changes.options.firstChange) {
      this.options = changes.options.currentValue;
      this.destroy().render();
    }
    if (changes.type && !changes.type.firstChange) {
      this.destroy().render();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  writeValue(value: string): void {
    this.password = value;
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}
}
