/**
 * 提供返回正确数据的方式
 * @param data data
 */
export async function sendSuccess(data = "ok") {
    return {
        code: 1,
        data,
    };
}

/**
 * 提供返回默认错误和自定义code的形式
 * @param msg msg
 */
export async function sendError(msg: string, code = 0) {
    return {
        code,
        msg,
    };
}
