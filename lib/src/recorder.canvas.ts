import { Result } from './interfaces/result';
import { Options } from './interfaces/options';
import { ERR } from './interfaces/err';

declare const document: any;

export class RecorderCanvas {
  /**
   * 画圆Canvas
   */
  private circleCanvas: any;
  /**
   * 画线Canvas
   */
  private lineCanvas: any;
  /**
   * 线移动Canvas
   */
  private moveCanvas: any;
  /**
   * 圆坐标集
   */
  private circles: any[];

  private recordingTask: any;

  constructor(private container: any, protected options: Options) {
    if (options.render) {
      this.render();
    }
  }

  render() {
    if (this.circleCanvas) return false;

    const { width, height } = this.container.getBoundingClientRect();

    // 画圆的 canvas，也是最外层监听事件的 canvas
    const circleCanvas = document.createElement('canvas');
    // 2 倍大小，为了支持 retina 屏
    circleCanvas.width = circleCanvas.height = 2 * Math.min(width, height);
    Object.assign(circleCanvas.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(0.5)',
    });
    // 画固定线条的 canvas
    const lineCanvas = circleCanvas.cloneNode(true);

    // 画不固定线条的 canvas
    const moveCanvas = circleCanvas.cloneNode(true);

    this.container.appendChild(lineCanvas);
    this.container.appendChild(moveCanvas);
    this.container.appendChild(circleCanvas);

    this.lineCanvas = lineCanvas;
    this.moveCanvas = moveCanvas;
    this.circleCanvas = circleCanvas;
    this.container.addEventListener(
      'touchmove',
      (evt: any) => evt.preventDefault(),
      { passive: false },
    );
    this.clearPath();
    return true;
  }

  destroy() {
    this.container.removeChild(this.lineCanvas);
    this.container.removeChild(this.moveCanvas);
    this.container.removeChild(this.circleCanvas);
  }

  async cancel() {
    if (this.recordingTask) {
      return this.recordingTask.cancel();
    }
    return Promise.resolve(<Result>{ err: ERR.NO_TASK });
  }

  async record(): Promise<Result> {
    if (this.recordingTask) return this.recordingTask.promise;

    const { circleCanvas, lineCanvas, moveCanvas, options } = this,
      circleCtx = circleCanvas.getContext('2d'),
      lineCtx = lineCanvas.getContext('2d'),
      moveCtx = moveCanvas.getContext('2d');

    circleCanvas.addEventListener('touchstart', () => {
      this.clearPath();
    });

    const records: any[] = [];

    const handler = (evt: any) => {
      const { clientX, clientY } = evt.changedTouches[0],
        {
          bgColor,
          focusColor,
          innerRadius,
          outerRadius,
          touchRadius,
        } = options,
        touchPoint = this.getCanvasPoint(moveCanvas, clientX, clientY);

      for (let i = 0; i < this.circles.length; i++) {
        const point = this.circles[i],
          x0 = point.x,
          y0 = point.y;

        if (this.distance(point, touchPoint) < touchRadius) {
          this.drawSolidCircle(circleCtx, bgColor, x0, y0, outerRadius);
          this.drawSolidCircle(circleCtx, focusColor, x0, y0, innerRadius);
          this.drawHollowCircle(circleCtx, focusColor, x0, y0, outerRadius);

          if (records.length) {
            const p2 = records[records.length - 1],
              x1 = p2.x,
              y1 = p2.y;

            this.drawLine(lineCtx, focusColor, x0, y0, x1, y1);
          }

          const circle = this.circles.splice(i, 1);
          records.push(circle[0]);
          break;
        }
      }

      if (records.length) {
        const point = records[records.length - 1],
          x0 = point.x,
          y0 = point.y,
          x1 = touchPoint.x,
          y1 = touchPoint.y;

        moveCtx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);
        this.drawLine(moveCtx, focusColor, x0, y0, x1, y1);
      }
    };

    circleCanvas.addEventListener('touchstart', handler);
    circleCanvas.addEventListener('touchmove', handler);

    const recordingTask: any = {};
    const promise = new Promise<Result>((resolve: any, reject: any) => {
      const done = (evt: any) => {
        moveCtx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);
        if (!records.length) return;

        circleCanvas.removeEventListener('touchstart', handler);
        circleCanvas.removeEventListener('touchmove', handler);
        document.removeEventListener('touchend', done);

        let err = null;

        if (records.length < this.options.min) {
          err = ERR.NOT_ENOUGH_POINTS;
        }

        const res = <Result>{
          err,
          result: records
            .map(
              o =>
                this.options.passwords[o.pos[0] * this.options.num + o.pos[1]],
            )
            .join(''),
          records,
        };

        resolve(res);
        this.recordingTask = null;
      };

      recordingTask.cancel = (res: Result = {}) => {
        // tslint:disable-next-line:no-shadowed-variable
        const promise = this.recordingTask.promise;

        res.err = res.err || ERR.USER_CANCELED;
        circleCanvas.removeEventListener('touchstart', handler);
        circleCanvas.removeEventListener('touchmove', handler);
        document.removeEventListener('touchend', done);
        resolve(res);
        this.recordingTask = null;

        return promise;
      };

      document.addEventListener('touchend', done);
    });

    recordingTask.promise = promise;

    this.recordingTask = recordingTask;

    return promise;
  }

  clearPath() {
    if (!this.circleCanvas) this.render();
    const { circleCanvas, lineCanvas, moveCanvas } = this,
      circleCtx = circleCanvas.getContext('2d'),
      lineCtx = lineCanvas.getContext('2d'),
      moveCtx = moveCanvas.getContext('2d'),
      width = circleCanvas.width,
      { num, fgColor, innerRadius } = this.options;

    circleCtx.clearRect(0, 0, width, width);
    lineCtx.clearRect(0, 0, width, width);
    moveCtx.clearRect(0, 0, width, width);

    const range = Math.round(width / (num + 1));

    const circles = [];

    // drawCircleCenters
    for (let i = 1; i <= num; i++) {
      for (let j = 1; j <= num; j++) {
        const y = range * i,
          x = range * j;
        this.drawSolidCircle(circleCtx, fgColor, x, y, innerRadius);
        circles.push({ x: x, y: y, pos: [i - 1, j - 1] });
      }
    }

    this.circles = circles;
  }

  /**
   * 获取屏幕在Canvas画布坐标
   */
  private getCanvasPoint(canvas: any, x: number, y: number) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: 2 * (x - rect.left), // canvas 显示大小缩放为实际大小的 50%。为了让图形在 Retina 屏上清晰
      y: 2 * (y - rect.top),
    };
  }

  private distance(p1: any, p2: any) {
    const x = p2.x - p1.x,
      y = p2.y - p1.y;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * 画实心圆
   */
  private drawSolidCircle(ctx: any, color: any, x: any, y: any, r: any) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * 画空心圆
   */
  private drawHollowCircle(ctx: any, color: any, x: any, y: any, r: any) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * 画线段
   */
  private drawLine(ctx: any, color: any, x1: any, y1: any, x2: any, y2: any) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }
}
