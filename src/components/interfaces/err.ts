export enum ERR {
    SUCCESS = 0,
    NO_TASK = 1,
    /**
     * 用户取消
     */
    USER_CANCELED,
    /**
     * 不足最少节点
     */
    NOT_ENOUGH_POINTS,
    /**
     * 密码不匹配
     */
    PASSWORD_MISMATCH
}
