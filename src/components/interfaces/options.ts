export interface Options {
    /**
     * 圆点的数量： n x n
     * 
     * @type {number}
     * @default 3
     */
    num?: number;

    /**
     * 当前选中的圆的颜色
     * 
     * @type {string}
     * @default #e06555
     */
    focusColor?: string;

    /**
     * 未选中的圆的颜色
     * 
     * @type {string}
     * @default #d6dae5
     */
    fgColor?: string;

    /**
     * canvas背景颜色
     * 
     * @type {string}
     * @default #fff
     */
    bgColor?: string;

    /**
     * 圆点的内半径
     * 
     * @type {number}
     * @default 20
     */
    innerRadius?: number;

    /**
     * 圆点的外半径，focus 的时候显示
     * 
     * @type {number}
     * @default 50
     */
    outerRadius?: number;

    /**
     * 判定touch事件的圆半径
     * 
     * @type {number}
     * @default 70
     */
    touchRadius?: number;

    /**
     * 自动渲染
     * 
     * @type {boolean}
     * @default true
     */
    render?: boolean; 

    /**
     * 最小允许的点数
     * 
     * @type {number}
     * @default 4
     */
    min?: number;

    /**
     * 密码编码，数量必须是 num*num
     * 
     * @type {string[]}
     * @default [ '1', '2', '3', '4', '5', '6', '7', '8', '9']
     */
    passwords: string[];
}
