import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NotifyService } from 'ngx-notify';

import { ERR } from 'ngx-gesture-password';

declare const document: any;

@Component({
  selector: 'demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoComponent {
  pwd = '1236';
  type = 'check';
  options: any;
  switchState = true;

  constructor(private _ns: NotifyService) {}

  onChangeOptions() {
    if (this.options) {
      this.options = null;
      document.getElementById('DemoPage').className = '';
    } else {
      this.options = {
        bgColor: '#292b38',
        focusColor: '#5aa5fe',
        fgColor: '#878aa1',
        num: 4,
        passwords: Array(16)
          .fill(0)
          .map((i, index) => String.fromCharCode(index + 65)),
      };
      document.getElementById('DemoPage').className = 'black';
    }
  }

  onError(data: any) {
    console.log('error', data);
  }

  onChecked(data: any) {
    console.log('onChecked', data);
    switch (data.err) {
      case ERR.NOT_ENOUGH_POINTS:
        this._ns.info('至少4个节点以上');
        break;
      case ERR.PASSWORD_MISMATCH:
        this._ns.error('PASSWORD MISMATCH');
        break;
      default:
        this._ns.success('SUCCESS');
        break;
    }
  }

  onBeforeRepeat(data: any) {
    console.log('onBeforeRepeat', data);
    switch (data.err) {
      case ERR.NOT_ENOUGH_POINTS:
        this._ns.info('至少4个节点以上');
        break;
      default:
        this._ns.info('请再次绘制相同图案');
        break;
    }
  }

  onAfterRepeat(data: any) {
    console.log('onAfterRepeat', data);
    switch (data.err) {
      case ERR.NOT_ENOUGH_POINTS:
        this._ns.info('至少4个节点以上');
        break;
      case ERR.PASSWORD_MISMATCH:
        this._ns.error('两次密码不匹配');
        break;
      default:
        this._ns.success('新密码已经生效');
        break;
    }
  }
}
