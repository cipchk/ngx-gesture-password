export interface Options {
  /**
   * 圆点的数量： n x n，默认：`3`
   */
  num?: number;

  /**
   * 当前选中的圆的颜色，默认：`#e06555`
   */
  focusColor?: string;

  /**
   * 未选中的圆的颜色，默认：`#d6dae5`
   */
  fgColor?: string;

  /**
   * canvas背景颜色，默认：`#fff`
   */
  bgColor?: string;

  /**
   * 圆点的内半径，默认：`20`
   */
  innerRadius?: number;

  /**
   * 圆点的外半径，focus 的时候显示，默认：`50`
   */
  outerRadius?: number;

  /**
   * 判定touch事件的圆半径，默认：`70`
   */
  touchRadius?: number;

  /**
   * 自动渲染，默认：`true`
   */
  render?: boolean;

  /**
   * 最小允许的点数，默认：`4`
   */
  min?: number;

  /**
   * 密码编码，数量必须是 num*num，默认：`[ '1', '2', '3', '4', '5', '6', '7', '8', '9']`
   */
  passwords: string[];
}
